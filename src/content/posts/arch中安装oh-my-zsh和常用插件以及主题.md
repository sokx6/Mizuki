---
published: 2025-11-20
title: arch 中安装oh my zsh和常用插件以及主题
description: oh my zsh!
sourceLink: "https://www.locxl.site/posts/arch中安装oh-my-zsh和常用插件以及主题"
licenseName: "CC BY-SA 4.0"
tags:
  - arch
  - linux
  - ohmyzsh
  - 主题
category: linux
author: locxl
---

## 安装 zsh

```bash
# 首先先更新
sudo pacman -Syu

# 使用 pacman 安装 zsh
sudo pacman -S zsh

# 然后切换默认shell为zsh
chsh -s $(which zsh)

# 重启终端或者重新登录
exit
```

## 安装 oh-my-zsh

我这里采用的是手动安装

```shell
# 我选择在家目录下安装

# 首先切换到家目录方便操作
cd ~

# 然后手动clone oh-my-zsh 仓库（前提是安装了git）
git clone https://github.com/ohmyzsh/ohmyzsh.git ~/.oh-my-zsh

# 移动仓库内的oh-my-zsh配置文件
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc

# 加载配置
source ~/.zshrc
```

## 安装插件

1. 首先编辑配置文件
   ```shell
   vim  ~/.zshrc
   ```
2. 然后在`plugins = ()` 中添加插件，最终为
   ```txt
   plugins=(
      git                        # Git 命令补全
      zsh-autosuggestions        # 自动补全
      zsh-syntax-highlighting    # 命令语法高亮
      zsh-completions            # 额外的补全定义
   )
   ```
3. 安装插件

   ```bash
   # 克隆安装zsh-autosuggestions
   git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

   # 克隆安装zsh-syntax-highlighting
   git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

   # clone安装zsh-completions
   git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-completions

   # 重新加载配置
   source ~/.zshrc
   ```

## 安装主题

我这里安装的是`powerlevel10k`主题

```bash
# clone powerlevel10k主题仓库
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

#编辑zsh配置文件
 vim ~/.zshrc

# 将主题设置为powerlevel10k
ZSH_THEME="powerlevel10k/powerlevel10k"

# 重新加载配置
source ~/.zshrc
```

然后你就应该能看到主题配置引导了，如果有乱码的话建议安装字体，例如 [FiraCode Nerd Font](https://github.com/ryanoasis/nerd-fonts/)

这里有一些推荐的[字体](https://www.locxl.site/posts/windows-terminal-美化/#安装字体)

后续如果想重新进配置引导的话可以输入`p10k configure`指令。

当然，如果想要更高程度的自定义的话可以直接编辑配置文件，输入`vim ~/.p10k.zsh`指令即可。
