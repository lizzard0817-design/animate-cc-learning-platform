# Animate CC 学习平台 - 部署指南

## 全栈云端部署步骤

### 前置条件
- GitHub 账号
- Railway 账号 (https://railway.app)
- Vercel 账号 (已配置)

### 第一步：推送代码到 GitHub

```bash
cd "/Volumes/Rog Strix/Animate CC"
git init
git add -A
git commit -m "Initial commit: Animate CC learning platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/animate-cc-learning-platform.git
git push -u origin main
```

### 第二步：部署后端到 Railway

1. 打开 https://railway.app/new
2. 选择 "Deploy from GitHub repo"
3. 选择你的仓库
4. Railway 会自动检测 Python 项目
5. 设置环境变量：
   - `PORT`: 8000 (Railway 会自动分配)
   - `DATABASE_URL`: 使用 Railway 提供的 PostgreSQL 或保持 SQLite
6. 点击 "Deploy"

### 第三步：配置前端环境变量

1. 在 Vercel 项目设置中添加环境变量：
   - `VITE_API_URL`: Railway 部署的后端 URL
2. 重新部署前端

### 第四步：验证

- 前端：https://animate-cc-learning-platform.vercel.app
- 后端：https://YOUR-RAILWAY-APP.railway.app/docs

## 本地开发

### 前端
```bash
npm install
npm run dev
```

### 后端
```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
