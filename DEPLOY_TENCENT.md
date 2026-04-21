# Animate CC 学习平台 - 腾讯云一键部署指南

## 🌐 部署架构

```
用户浏览器
    │
    ├─→ Vercel (前端) ── 全球CDN
    │   https://animate-cc-learning-platform.vercel.app
    │
    └─→ 腾讯云服务器 (后端 API) ── 国内高速
        http://118.89.76.204:8000
```

## 🚀 一键部署（3 分钟完成）

### 前提：SSH 登录服务器

```bash
ssh lizzard@118.89.76.204
# 或
ssh root@118.89.76.204
```

### 方式 A：一键脚本部署（推荐）

```bash
# 下载并执行一键部署脚本
curl -sL https://raw.githubusercontent.com/lizzard0817-design/animate-cc-learning-platform/main/server/deploy.sh | bash
```

或者手动克隆后执行：

```bash
git clone https://github.com/lizzard0817-design/animate-cc-learning-platform.git /opt/animate-cc-api
cd /opt/animate-cc-api/server
bash deploy.sh
```

### 方式 B：Docker 部署

```bash
git clone https://github.com/lizzard0817-design/animate-cc-learning-platform.git /opt/animate-cc-api
cd /opt/animate-cc-api/server

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## ✅ 验证部署

### 检查后端 API

```bash
curl http://118.89.76.204:8000/
# 应返回: {"message":"Animate CC 学习平台 API","docs":"/docs"}
```

### 检查 API 文档

浏览器访问: http://118.89.76.204:8000/docs

### 检查前端

浏览器访问: https://animate-cc-learning-platform.vercel.app

## 📋 服务管理命令

### systemd 方式（方式 A）

```bash
# 查看状态
sudo systemctl status animate-cc-api

# 查看实时日志
sudo journalctl -u animate-cc-api -f

# 重启服务
sudo systemctl restart animate-cc-api

# 停止服务
sudo systemctl stop animate-cc-api

# 更新代码后重新部署
cd /opt/animate-cc-api && git pull origin main
cd server && source venv/bin/activate && pip install -r requirements.txt
sudo systemctl restart animate-cc-api
```

### Docker 方式（方式 B）

```bash
# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f api

# 重启服务
docker-compose restart api

# 更新代码后重新部署
cd /opt/animate-cc-api && git pull origin main
docker-compose up -d --build
```

## 🔧 防火墙配置

确保腾讯云安全组开放以下端口：

| 端口 | 用途 |
|------|------|
| 22 | SSH |
| 80 | HTTP (Nginx) |
| 8000 | API 直连 |

### 腾讯云安全组配置步骤

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 云服务器 → 安全组
3. 添加入站规则：
   - TCP:80 允许 0.0.0.0/0
   - TCP:8000 允许 0.0.0.0/0

## 🌐 前端配置

前端已部署到 Vercel，环境变量已配置：

| 变量 | 值 |
|------|-----|
| VITE_API_URL | http://118.89.76.204:8000 |

如需修改，在 [Vercel 项目设置](https://vercel.com/dashboard) → Settings → Environment Variables 中更新。

## 📁 服务器文件结构

```
/opt/animate-cc-api/
├── server/
│   ├── main.py              # FastAPI 入口
│   ├── database.py           # 数据库配置
│   ├── models.py             # 数据模型
│   ├── schemas.py            # Pydantic 模型
│   ├── requirements.txt      # Python 依赖
│   ├── Dockerfile            # Docker 镜像
│   ├── docker-compose.yml    # Docker 编排
│   ├── deploy.sh             # 一键部署脚本
│   ├── nginx.conf            # Nginx 配置
│   ├── animate-cc-api.service # systemd 服务
│   ├── .env.template         # 环境变量模板
│   ├── routers/              # API 路由
│   ├── services/             # 业务逻辑
│   └── seed.py               # 数据库种子
├── src/                      # React 前端源码
└── ...
```

## 💰 成本

| 服务 | 费用 |
|------|------|
| 腾讯云服务器 | 已有（小龙虾服务器） |
| Vercel 前端 | 免费 |
| **总计** | **¥0/月** |

## ❓ 常见问题

### Q: 服务启动失败？

```bash
# 查看错误日志
sudo journalctl -u animate-cc-api -n 50

# 检查端口占用
sudo lsof -i :8000

# 手动测试启动
cd /opt/animate-cc-api/server
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Q: 数据库文件在哪？

SQLite 数据库位于: `/opt/animate-cc-api/server/animate_cc.db`

### Q: 如何更换域名？

1. 在腾讯云购买/绑定域名
2. 修改 `nginx.conf` 中的 `server_name`
3. 配置 DNS A 记录指向 118.89.76.204
4. 在 Vercel 中更新 `VITE_API_URL` 为新域名
