---
published: 2026-01-15
title: vscode美化
description: vscode开屏图标的自定义和背景的替换
sourceLink: https://locxl.site/posts/vscode美化/
licenseName: CC BY-SA 4.0
tags:
  - 美化
  - vscode
category: 美化
---

## 前言

好看是第一生产力！

## vscode开屏图标自定义

[参考教程](https://www.bilibili.com/video/BV1Yt421w7kS)

### 准备工作

1. 一张你想要的开屏图标图片
   >例如这是我使用的[图标](https://github.com/Aikoyori/ProgrammingVTuberLogos)
   >![图标](VSCode.png)
2. 安装插件[Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css)

### 正式开始

Custom CSS and JS Loader这个插件自然是可以让你自定义css和js，我们要修改开屏图标，自然是要自定义css样式，因此我们需要导入自定义的css文件。

首先，我们需要打开用户设置

你可以按`ctrl + shift + p`打开搜索界面，搜索Open User Settings(Json)来打开用户设置文件，在末尾添加`"vscode_custom_css.imports": [],`,`[]`中就是我们要填入的地址

### 加载css

#### 方法一：外部加载

直接填入`https://gist.github.com/Ynng/3275eb9cb2b5816554877e5518417f44`，最终应该是`"vscode_custom_css.imports": [https://gist.github.com/Ynng/3275eb9cb2b5816554877e5518417f44/custom.css],`
> 要注意的是：这个方法需要能够访问GitHub和Gist的网络环境，而且，在vscode最新的版本中，这个css是已经失效的，需要将作者写的那个css文件的第一行从 `.editor-group-watermark>.letterpress{` 改为 `.editor-group-watermark .letterpress {`
>  然后你还需要自己将css文件转换成外部链接的形式，例如建个GitHub仓库存。

#### 方法二：本地加载

1. 首先新建一个css文件，例如叫`user.css`
2. 将你的图片转化为base64编码，这里有一个示例的[base64编码网站](https://tool.chinaz.com/tools/imgtobase)
3. 在css文件中写入以下内容：
   ```css
   .editor-group-watermark .letterpress {
     background-image: url("你的图片的base64编码") !important;
     opacity: .75;
     aspect-ratio: 3/2 !important;
   }
   ```
4. 然后你需要将文件路径填入` "vscode_custom_css.imports": [],`的`[]`中。
   >应当注意的是：不能直接使用文件路径，应当使用file协议，也就是：应当是`file:///你的css文件路径`的形式

### 启用css并完成

按`ctrl + shift + p`打开搜索界面，输入Enable Custom CSS and JS启用css，然后重启vscode
>  如果是第一次的话应该会显示vscode已损坏，这是正常现象，不再提醒即可

## vscode背景替换

### 方法一：使用Background插件

1. 下载[Background插件](https://marketplace.visualstudio.com/items?itemName=Katsute.code-background)
2. 按下`ctrl + shift + p`搜索`Background: Confguration`
3. 选择你想要修改的部分，例如直接选择windows
4. 选择`Add a File`,导入你想要作为背景的文件
5. 重启vscode

### 方法二：使用Frosted Glass Theme插件

这个插件与上一个插件的不同之处就在于它是一个毛玻璃主题插件，那么，自然地，它的背景是有模糊的。
1. 下载[Frosted Glass Theme](https://marketplace.visualstudio.com/items?itemName=RichardLuo.frosted-glass-theme)插件
2. 在插件设置中选择Enable fake mica，在`Frosted-glass-theme › Fake Mica: Url`下填入你的文件路径
   >或者你也可以直接修改用户设置文件`settings.json`在其中添加如下项：
```json
  "frosted-glass-theme.fakeMica.url":你的背景文件地址,
  "frosted-glass-theme.fakeMica.enabled": true
```
3. 重启vscode

## 注意点

这些修改在vscode版本更新可能失效，届时需重新操作。