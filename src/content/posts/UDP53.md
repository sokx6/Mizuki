---
published: 2025-11-12
title: UDP53
description: 通过UDP53能绕过很多内网的门户验证
sourceLink: "https://www.locxl.site/posts/udp53/"
licenseName: "CC BY-SA 4.0"
tags: [网络,UDP,DNS,门户验证]
category: 网络
author: Locxl
---


## 前言
**本方法仅用于学习和研究目的，不得用于任何非法或违反法律法规的行为。使用该方法可能导致网络服务不稳定、安全风险或违反相关服务条款。**

**本人不对因使用本方法导致的任何损失、数据泄露、系统故障或法律后果承担责任。请确保在合法授权范围内使用，并遵守当地法律法规。**

## UDP53 是什么

UDP 53 是 DNS 解析所用端口，一般无需登录也会放行。
根据<a href="/posts/门户验证原理">门户验证的原理</a>，当连接到一个需要登录的 WIFI 时，需要先访问一个网站才能重定向到登录认证界面，这时如果拦截UDP53端口的话，用户无法进行DNS解析，也就无法HTTP劫持，就只能让用户手动输入登录网站的 IP 才能进行认证或者使用其他方法认证，而这明显是不够方便的，所以一般哪怕在不认证的情况下 UDP53 端口也会放行。

## 可趁之机

那么，加入我们有一个服务器的 UDP53 端口是开放的，那么我们向这个服务器发送请求，接收响应的时候，哪怕我们登录的是有门户验证的 wifi，它也不会拦截我们的请求，那么，我们就能将这台服务器作为中转，通过访问这这台服务器的 UDP53 端口，再由服务器将数据转发到公网，从而达到在不进行登录验证的情况下访问互联网。

## 实际操作

这里，我采用的是 wireguard，它是一种轻量的现代化 VPN 工具。

### wireguard 的原理

1. **非对称加密**：服务器和客户端都各有自己的一份公钥和私钥，当服务器向客户端发送数据的时候，服务器会通过公钥加密数据，而客户端会通过私钥解密数据，从而防止数据泄露。
2. **内核运行**：在系统内核中创建虚拟网卡，速度快
3. **无状态设计**：每个数据包独立，断网后自动重连
4. **轻量加密**：使用现代加密算法，性能好开销小
5. **路由控制**：通过路由表决定哪些流量走 VPN

### 具体配置
这里服务器以 Linux OpenCloudOS 9.4 为例演示，客户端是 windows11 系统。
#### 服务端
1. 首先确保防火墙开放了 UDP53 端口，如果是云服务器，还要去对应的控制台的安全组或防火墙开放 UDP53 端口。
2. 安装 wireguard：
   ```bash
   dnf install  wireguard-tools
   ```
3. 开启端口转发：

   ```bash
   sudo vim /etc/systcl.conf

   # 取消掉注释或者添加下面一行
   net.ipv4.ip_forward=1

   # 保存文件并应用更改
   sudo sysctl -p

   # 此时这里应该输出:net.ipv4.ip_forward=1
   ```

4. 生成公钥和私钥

   ```bash
   # 生成一个 256 位的私钥，并将其写入文件 private.key
   wg genkey > private.key
   # 使用私钥生成对应的公钥并保存为public.key
   wg pubkey < private.key > public.key
   ```

5. 查看服务器外网接口：

   ```bash
   # 输入如下指令
   ip route

   # 你应该能看到default via <网关地址> dev <接口> proto <协议>  src <源ip地址> metric <路由优先级>
   # proto、src和metric是可选的
   ```

6. 这里以网口为 eth0 为例，编辑 wireguard 配置文件

   ```ini
   [Interface]
   # 这里填入之前生成的私钥
   PrivateKey = <your_server_private_key>

   # 监听的端口,填53
   ListenPort = 53

   # 这里填入服务器在虚拟局域网中的ip地址，格式是IP/子网掩码，以下是示例
   Address = 192.168.1.1/24

   # 启动时的命令，eth0换成对应网口
   PostUp   = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

   # 关闭时的命令，eth0换成对应网口
   PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

   # 可选，最大传输单元
   MTU = 1500

   [Peer]
   # 这里填入之后生成的客户端公钥
   PublicKey = <your_client_public_key>

   # 允许客户端使用的IP段，建议使用/32的固定IP,这表示32位都是网络地址，没有主机位，有助于精准匹配单个设备
   AllowedIPs = 192.168.1.11/32
   ```

7. 编辑完之后，我们启动wg

   ```bash
   sudo systemctl start wireguard@wg0
   ```

8. 管理wg
   - 停止接口

     ```bash
     sudo systemctl stop wireguard@wg0
     ```
   - 重启接口

     ```bash
     sudo systemctl restart wireguard@wg0
     ```
   - 查看状态

     ```bash
     sudo systemctl status wireguard@wg0
     ```
   - 设置开机自启

     ```bash
     sudo systemctl enable wireguard@wg0
     ```
   - 禁用开机自启

     ```bash
     sudo systemctl disable wireguard@wg0
     ```
   - 验证 WireGuard 接口是否正常运行

     ```bash
     ip a show wg0
     ```
   - 查看日志：

     ```bash
     journalctl -u wireguard@wg0
     ```
   - 使用 `wg` 命令检查连接状态

     ```bash
     sudo wg
     ```

#### 客户端
   客户端的配置要简单的多
1. 从[官网](https://zh-wireguard.com/install/)下载windows installer后安装
2. 点击新建隧道-新建空隧道
3. 自己随便去一个名字
4. 填写配置
   ```ini
   [Interface]
   #这里应该会自动生成PrivateKey
   PrivateKey = <your_client_private_key>
   
   # 这里填写之前在服务器[Peer]中的AllowedIPs
   Address = 192.168.1.11/32
   
   [Peer]
   # 填写服务器的公钥 
   PublicKey = <your_server_public_key>
   
   # 这里填写允许转发的IP，0.0.0.0/0, ::/0代表所有ipv4和ipv6网址
   AllowedIPs = 0.0.0.0/0, ::/0
   
   # 这里填写你的服务器公网IP:端口(53)
   EndPoint = your_server_ip:port
   
   # 可选，保持连接
   PersistentKeepalive = 25
   ```
最后记得把客户端的公钥填到服务器对应的\[Peer]中

#### 启动
然后服务端启动，客户端连接，这样你就能将自己的流量转发到服务器端UDP53端口了，从而能够绕过登录验证。

## 防绕过的方法
1. 在内网设置 DNS 服务器
2. 阻止所有外部访问内网 DNS 的 UDP 53 端口
3. 通过 DHCP 服务器将用户设备的 DNS 设置为该内网 DNS
4. 使用门户验证强制用户登录后才能访问网络

还有其他方法...

## 后记
唉，这个东西我搞了差不多4个小时，中间失败了很多次，最后发现是我外网接口设置错了，也是服了，中间多次红温，差点把键盘砸了 ~~（好吧，其实一点不敢砸）~~，但这个过程中也是学到了很多，也感谢AI教了我许多，但事实上也就是AI使我耽误了这么长时间，如果没有AI，也许我会花更少的时间，但也会学到更少的知识，有利有弊把

最后还是要声明：
**本方法仅用于学习和研究目的，不得用于任何非法或违反法律法规的行为。使用该方法可能导致网络服务不稳定、安全风险或违反相关服务条款。**

**本人不对因使用本方法导致的任何损失、数据泄露、系统故障或法律后果承担责任。请确保在合法授权范围内使用，并遵守当地法律法规。**