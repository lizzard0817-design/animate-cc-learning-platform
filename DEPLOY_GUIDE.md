# Animate CC 学习平台 - 全栈云端部署指南

## 🚀 快速部署（3 步完成）

### 第 1 步：推送代码到 GitHub

```bash
cd "/Volumes/Rog Strix/Animate CC"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 第 2 步：部署后端到 Railway（免费）

**方式 A：一键部署（推荐）**

1. 点击按钮一键部署到 Railway：

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR_USERNAME/YOUR_REPO)

2. 授权 GitHub 账号
3. 选择你的仓库
4. Railway 会自动检测并部署

**方式 B：手动部署**

1. 打开 [Railway](https://railway.app/new)
2. 选择 "Deploy from GitHub repo"
3. 选择你的仓库
4. 设置环境变量：
   - `PORT`: 8000
   - `DATABASE_URL`: 留空（使用默认 SQLite）或添加 PostgreSQL URL
5. 点击 "Deploy"

部署成功后，复制你的后端 URL（类似 `https://animate-cc-api.up.railway.app`）

### 第 3 步：配置前端并重新部署

1. 打开 [Vercel 项目设置](https://vercel.com/dashboard)
2. 进入 "Settings" > "Environment Variables"
3. 添加环境变量：
   - `VITE_API_URL`: 填入 Railway 后端 URL
4. 点击 "Redeploy" 重新部署前端

## ✅ 完成验证

- **前端**: https://animate-cc-learning-platform.vercel.app
- **后端**: https://YOUR-RAILWAY-APP.railway.app/docs
- **API 文档**: https://YOUR-RAILWAY-APP.railway.app/docs

## 📋 环境变量说明

### 前端 (.env.local)
```env
VITE_API_URL=http://localhost:8000  # 本地开发
VITE_API_URL=https://YOUR-RAILWAY-APP.railway.app  # 生产环境
```

### 后端 (Railway 环境变量)
```env
DATABASE_URL=sqlite+aiosqlite:///./animate_cc.db  # 默认 SQLite
PORT=8000  # Railway 会自动分配
```

## 🔄 自动部署

已配置 GitHub Actions，推送到 `main` 分支后会自动：
1. 构建并部署前端到 Vercel
2. 部署后端到 Railway

### 需要配置的 Secrets

在 GitHub 仓库设置中添加以下 Secrets：

| Secret 名称 | 说明 | 获取方式 |
|------------|------|---------|
| `VERCEL_TOKEN` | Vercel API Token | Vercel Account Settings > Tokens |
| `VERCEL_ORG_ID` | Vercel 组织 ID | Vercel CLI: `vercel whoami` |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID | Vercel 项目设置页面 |
| `RAILWAY_TOKEN` | Railway API Token | Railway Account Settings |
| `RAILWAY_SERVICE_ID` | Railway 服务 ID | Railway 项目 URL 中获取 |
| `VITE_API_URL` | 后端 API 地址 | Railway 部署后的 URL |

## 🛠️ 本地开发

### 前端
```bash
npm install
npm run dev  # http://localhost:5173
```

### 后端
```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000  # http://localhost:8000/docs
```

## 📦 项目结构

```
├── src/                    # React 前端
│   ├── components/         # UI 组件
│   ├── hooks/              # React Hooks
│   ├── pages/              # 页面组件
│   ├── lib/
│   │   └── api.ts          # API 客户端
│   └── data/               # 数据配置
├── server/                 # FastAPI 后端
│   ├── routers/            # API 路由
│   ├── services/           # 业务逻辑
│   ├── main.py             # 入口文件
│   └── requirements.txt    # Python 依赖
├── .github/workflows/      # GitHub Actions
├── vercel.json             # Vercel 配置
├── railway.json            # Railway 配置
└── render.yaml             # Render 配置
```

## 🎯 功能特性

- ✅ AI 批改智能体（3 个预设评分标准模板）
- ✅ 游戏化学习系统（5 等级，25 道题目）
- ✅ S/A/B/C/D 等级评定
- ✅ 全栈云端部署，全球可访问
- ✅ 自动部署，推送到 main 即发布

## 💰 成本说明

- **Vercel**: 免费套餐（个人项目完全够用）
- **Railway**: 免费 $5 额度/月（足够后端 API 使用）
- **GitHub**: 免费仓库 + Actions（每月 2000 分钟免费构建）

**总计：$0/月**（免费套餐内）
