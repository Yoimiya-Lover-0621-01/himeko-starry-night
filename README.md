# 姬子的星月夜（Himeko's Starry Night）

DeepSeek Harness Web UI 的主题插件：星云壁纸 + 莫奈取色 + 液态玻璃。

## 效果

- 星云画作（已裁掉 UID 水印）铺满整个窗口；UI 面板半透明，壁纸色透上来。
- 莫奈取色：深靛蓝（`rgba(12,14,44)` 系）+ 长春花紫强调色，发送按钮、主按钮、链接、状态色统一。
- 暗色主题锁定，设置里的浅色/暗色选择已隐藏。
- 液态玻璃：输入框、消息气泡、新会话按钮、二级菜单（账号/权限/模型/命令/更多/智能体团队）、
  左侧栏行与当前对话、设置导航与设置弹窗、代码块、右侧栏入口卡片与图标。
- 全屏右侧栏：背景重模糊，输入框与用量条压在模糊层下。
- 设置弹窗保持约 90% 不透明以保证可读性。

## 安装

```bash
dsh plugin add "D:\path\to\dsh-star-wallpaper"
```

或在 Harness 的「插件 → 添加插件」里选择本目录。安装后重启/刷新 Web UI 生效。

## 目录

- `client.js`：构建产物（勿手改）
- `tools/client.template.js`：样式与逻辑源文件
- `tools/build-client.mjs`：构建脚本（把 `assets/nebula.jpg` 内联成 base64）
- `assets/nebula.jpg`：裁切后的星云画作（3051x1295）
- `cordis.patch.yml`：把本插件挂进 bundle
