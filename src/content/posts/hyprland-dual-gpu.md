---
published: 2026-07-12
title: Hyprland 双显卡混合输出配置
description: Intel + NVIDIA 双显卡外接显示器黑屏的排查和解决过程
sourceLink: "https://blog.locxl.site/posts/hyprland-dual-gpu/"
licenseName: "CC BY-SA 4.0"
tags: [Hyprland, Linux, NVIDIA, 双显卡]
category: 记录
author: locxl
---

# 前言

我的笔记本是 ASUS TX Gaming，Intel Arc iGPU + NVIDIA RTX 5070 Laptop，Arch + Hyprland。内屏（eDP-1）接在 Intel 核显上，外接屏（HDMI-A-3）接在 NVIDIA 独显上，之前一直只用内屏没管这个，最近接上外接显示器才发现——外接屏有背光但是黑屏，啥也不显示。

然后就开始了漫长的排查，中间绕了不少弯路，最后在AI的帮助下发现问题是 NVIDIA 闭源驱动的锅。

---

# 背景

两个 GPU 的情况：

| GPU                    | /dev/dri | 连接的屏幕         |
| ---------------------- | -------- | ------------------ |
| Intel Arc iGPU         | card1    | eDP-1（内屏）      |
| NVIDIA RTX 5070 Laptop | card0    | HDMI-A-3（外接屏） |

HDMI 口物理上直连 NVIDIA，所以想让外接屏亮起来，Hyprland（准确说是 Aquamarine）必须同时管两个 GPU。

---

# 排查过程

## 尝试 1：`hl.env()` 设置 `AQ_DRM_DEVICES`

一开始想的很简单，加个环境变量让 Aquamarine 知道有两个 GPU：

```lua
-- hyprland.lua
hl.env("AQ_DRM_DEVICES", "/dev/dri/card1:/dev/dri/card0")
```

结果：外接屏还是黑屏。看日志发现压根没读到这个变量。

查了一下才知道，Aquamarine 在 Hyprland 进程启动的**头几毫秒**就完成了 DRM 设备枚举，这时候读的是进程原始的 `environ`。而 `hl.env()` 是在 Lua 配置解析阶段才执行的，Aquamarine 早跑完了，根本看不到。

所以 `hl.env()` 对 `AQ_*` 这类 Aquamarine 关键变量是无效的，得在 Hyprland 启动**之前**就把变量注入进去。

## 尝试 2：Desktop entry 注入 + Intel 做主 GPU

`hl.env()` 不行，于是我改成 desktop entry，用 `env` 命令在启动前注入：

```desktop
# /usr/share/wayland-sessions/hyprland.desktop
Exec=env AQ_DRM_DEVICES=/dev/dri/card1:/dev/dri/card0 /usr/bin/start-hyprland
```

让 Intel 做主 GPU 渲染，NVIDIA 做副 GPU 输出外接屏。

结果：外接屏还是黑屏。日志里出现了关键错误：

```
ERR: [EGL] eglInitialize failed: DRI2: failed to create screen
ERR: drm: initMgpu: no renderer
ERR: drm: Failed to initialize renderer backend for blitting
```

大概流程是这样的：Intel 渲染画面 → 通过 DMA-BUF 把 framebuffer 传给 NVIDIA → NVIDIA 输出到 HDMI-A-3。这个"传"的过程叫 blit，需要在 NVIDIA（辅 GPU）上创建一个 EGL 上下文来接收数据。

问题就出在这里：NVIDIA 的 EGL GBM 后端在非主 DRM 设备上调用 `eglInitialize` 时，DRI2 路径找不到 screen（这是 X11 时代的抽象概念，Wayland 下没有），直接失败了。虽然内核模块是 `nvidia-open-dkms`（开源的），但用户态的 EGL/GBM/Vulkan 库还是闭源的，这个辅 GPU 限制就写死在闭源库里。

Aquamarine 降级到了 dumb allocator（CPU 软件拷贝），但格式对不上，外接屏有背光但没内容。

## 尝试 3：加 `AQ_MGPU_NO_EXPLICIT=1`

后面我又试了禁用跨 GPU 显式同步：

```desktop
Exec=env AQ_DRM_DEVICES=/dev/dri/card1:/dev/dri/card0 AQ_MGPU_NO_EXPLICIT=1 /usr/bin/start-hyprland
```

结果：外接屏终于有画面了，但是……整个屏幕会有紫色闪烁

原因还是 dumb allocator 降级路径的问题：Intel 渲染的 framebuffer 格式是 BGRX8888，但 NVIDIA 那边当成了 XRGB8888 来解读，R 和 B 通道互换了，画面就偏紫了。

## 成功方案：NVIDIA 做主 GPU

既然 NVIDIA 当辅 GPU 不行，那就只能让 NVIDIA 做主 GPU了（本来搞双显卡就是想要省电的，但好像也省不了多少）：

```desktop
# /usr/share/wayland-sessions/hyprland.desktop
Exec=env AQ_DRM_DEVICES=/dev/dri/card0:/dev/dri/card1 /usr/bin/start-hyprland
```

这时候的数据流变成了：

```
NVIDIA 渲染 → 直接输出 → HDMI-A-3（外接屏，不需要 blit）
NVIDIA 渲染 → DMA-BUF blit → Intel → eDP-1（内屏）
```

blit 方向从 Intel→NVIDIA 变成了 NVIDIA→Intel。Intel 的 Mesa EGL 在辅 GPU 角色下能正常初始化，blit 成功。

就这样，两个屏幕都正常了。

---

# 最终配置

`/usr/share/wayland-sessions/hyprland.desktop`：

```desktop
[Desktop Entry]
Name=Hyprland
Exec=env AQ_DRM_DEVICES=/dev/dri/card0:/dev/dri/card1 /usr/bin/start-hyprland
```

`~/.config/hypr/hyprland.lua` 里删掉这些没用的行：

```lua
-- 这些对 Aquamarine 无效，删掉
hl.env("AQ_DRM_DEVICES", "...")
hl.env("__EGL_VENDOR_LIBRARY_FILENAMES", "...")
hl.env("AQ_FORCE_LINEAR_BLIT", "0")
```

正常的 monitor 配置不变：

```lua
hl.monitor({ output = "HDMI-A-3", mode = "preferred", position = "0x0", scale = "1" })
hl.monitor({ output = "eDP-1",   mode = "highrr",    position = "1920x0", scale = "1.33" })
```

---

# 总结

1. **`hl.env()` 对 `AQ_*` 变量没用**。Aquamarine 初始化比 Lua 配置解析早，必须通过 desktop entry 或 wrapper 脚本在启动前注入。
2. **跨 GPU blit 有方向性**。NVIDIA 的 EGL GBM 后端不支持辅 GPU，Intel Mesa EGL 支持。谁做主 GPU 决定了 blit 的方向，方向决定了能不能亮。
3. **调试看日志**。日志在 `/run/user/1000/hypr/<instance>/hyprland.log`，里面有 Aquamarine 完整的初始化过程，比瞎猜强多了。
4. **`nvidia-open-dkms` 不等于全开源**。开源的是内核模块，用户态的 EGL/GBM/Vulkan 还是闭源的，辅 GPU 限制依然在。

---

# 后记

现在桌面渲染走的是 NVIDIA dGPU，功耗比纯 Intel 核显高不少。我还搞了个 Intel-only 的 desktop entry，不接外接屏的时候用纯核显省电。要是哪天 NVIDIA 驱动修好了非主 GPU 的 EGL GBM 初始化问题，就可以切回 `card1:card0` 了——但我感觉很难就是了。
