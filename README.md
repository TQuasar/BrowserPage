# BrowserPage - 现代化的浏览器启动页面

## 🚀 项目介绍

BrowserPage 是一个基于 Vue 3 + Vite 构建的现代化浏览器启动页面。它提供了美观的界面和强大的功能，让你可以自定义你的浏览器主页，提升上网效率。

## ✨ 主要功能

### 🔍 智能搜索
- 支持多个搜索引擎（百度、谷歌、必应等）
- 实时搜索建议
- 无痕模式切换
- 搜索结果打开方式设置（新窗口/当前窗口）

### 📚 书签管理
- 快速访问常用网站
- 分组管理收藏夹
- 支持网站图标显示
- 可折叠的分组管理

### ⚙️ 个性化设置
- 主题颜色配置
- 搜索引擎偏好设置
- 界面布局调整
- 数据持久化存储

### 📊 历史记录
- 查看最近的搜索记录
- 快速访问历史网址
- 支持清空历史记录

## 🛠️ 技术栈

- **前端框架**: Vue 3.5.32
- **构建工具**: Vite 8.0.4
- **开发语言**: TypeScript
- **样式**: CSS3
- **代码规范**: TypeScript Strict Mode

## 📦 项目结构

```
BrowserPage/
├── src/
│   ├── assets/          # 静态资源（图片、JSON配置等）
│   ├── components/      # Vue组件
│   │   ├── Page/       # 页面相关组件
│   │   ├── Search/     # 搜索相关组件
│   │   ├── Setting/    # 设置相关组件
│   │   └── components/ # 基础组件
│   ├── utils/          # 工具函数
│   └── main.js         # 应用入口文件
├── public/             # 公共资源
├── index.html          # 主页面
├── package.json        # 项目依赖
├── vite.config.js      # Vite配置
└── tsconfig.json       # TypeScript配置
```

## 🚀 快速开始

### 环境要求
- Node.js >= 14.0.0
- npm 或 yarn 或 pnpm

### 安装依赖
bash
```
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm
pnpm install
```

### 启动开发服务器
```bash
npm run dev
```
应用将在 `http://localhost:5173` 启动。

### 构建生产版本
bash
```
npm run build
```
构建产物将生成在 `dist/` 目录。

### 预览构建结果
```bash
npm run preview
```

## 🔧 项目配置

### Vite 配置
项目使用 Vite 作为构建工具，配置文件位于 `vite.config.js`：
- 配置了 Vue 插件
- 设置了路径别名（@/、@components/、@assets/、@utils/）
- 支持 TypeScript

### TypeScript 配置
项目使用严格的 TypeScript 配置：
- 目标为 ES2022
- 启用严格模式
- 支持 Vue 单文件组件

## 📱 使用说明

### 搜索引擎配置
1. 点击右上角的设置按钮
2. 进入"搜索设置"
3. 选择默认搜索引擎
4. 配置搜索参数

### 书签管理
1. 点击页面上的"添加书签"按钮
2. 输入网站名称和URL
3. 选择分组（可选）
4. 点击保存

### 无痕模式
在搜索框右侧的无痕模式图标上点击，可以开启或关闭无痕模式搜索。

## 🧪 开发指南

### 组件开发
项目采用模块化组件架构：
- `src/components/Page/` - 页面布局组件
- `src/components/Search/` - 搜索相关组件
- `src/components/Setting/` - 设置相关组件

### 状态管理
项目使用 Vue 3 的组合式 API 进行状态管理，配置信息存储在本地。

### 添加新功能
要添加新功能，建议：
1. 在对应的组件目录下创建新的 Vue 组件
2. 在 `src/assets/json/userConfig.json` 中添加配置项
3. 在设置页面中注册新的设置项

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 Vue 3 组合式 API 规范
- 组件使用 PascalCase 命名
- 使用 ES6+ 语法

## 📞 联系

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 在 Gitee / Github 上联系作者

---

**🎉 感谢使用 BrowserPage！**