## ZxwyWebSite/LX-Script
### 简介
+ LX-Music 源脚本 (洛雪音乐自定义源脚本)
+ 搭配 LX-Source 项目使用

### 使用
+ 拼接源脚本并在中间加入以下配置：
   ```js
   globalThis.ls={api:{addr:'http://127.0.0.1:1011/',pass:''}};
   ```

### 开发
1. 安装依赖 `pnpm install`
2. 构建脚本 `pnpm dev`

### 其它
+ 基于 lyswhut/lx-music-source 编写
+ 感谢以下项目提供参考：[FreeListen](https://github.com/lyswhut/lx-music-source)

### 更新
+ 见 `update.md`
