#!/bin/bash
# ===========================================
#  Animate CC 后端一键部署脚本
#  在腾讯云服务器上执行: bash deploy.sh
# ===========================================

set -e

APP_DIR="/opt/animate-cc-api"
APP_PORT=8000

echo "========================================="
echo "  Animate CC 后端一键部署"
echo "========================================="

# 1. 检查/安装依赖
echo "[1/7] 安装系统依赖..."
sudo apt-get update -y
sudo apt-get install -y python3 python3-pip python3-venv git nginx

# 2. 克隆代码（如果不存在）
echo "[2/7] 获取代码..."
if [ -d "$APP_DIR/.git" ]; then
    echo "  代码已存在，拉取最新版本..."
    cd $APP_DIR && git pull origin main
else
    echo "  克隆代码仓库..."
    sudo mkdir -p $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
    git clone https://github.com/lizzard0817-design/animate-cc-learning-platform.git $APP_DIR
fi

cd $APP_DIR/server

# 3. 创建虚拟环境
echo "[3/7] 创建 Python 虚拟环境..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate

# 4. 安装 Python 依赖
echo "[4/7] 安装 Python 依赖..."
pip install --upgrade pip
pip install -r requirements.txt

# 5. 初始化数据库
echo "[5/7] 初始化数据库..."
python3 -c "
import asyncio
from database import init_db
asyncio.run(init_db())
print('数据库初始化完成')
"

# 6. 配置 systemd 服务
echo "[6/7] 配置 systemd 服务..."
sudo cp $APP_DIR/server/animate-cc-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable animate-cc-api

# 7. 配置 Nginx
echo "[7/7] 配置 Nginx 反向代理..."
sudo cp $APP_DIR/server/nginx.conf /etc/nginx/sites-available/animate-cc-api
sudo rm -f /etc/nginx/sites-enabled/animate-cc-api
sudo ln -s /etc/nginx/sites-available/animate-cc-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 启动服务
echo ""
echo "启动后端服务..."
sudo systemctl restart animate-cc-api

# 等待服务启动
sleep 3

# 验证
echo ""
echo "========================================="
if curl -s http://127.0.0.1:$APP_PORT/ | grep -q "message"; then
    echo "  ✅ 后端服务启动成功！"
else
    echo "  ⚠️  服务可能未完全启动，请检查日志："
    echo "  sudo journalctl -u animate-cc-api -n 20"
fi
echo "========================================="
echo ""
echo "API 地址: http://$(curl -s ifconfig.me):$APP_PORT"
echo "API 文档: http://$(curl -s ifconfig.me):$APP_PORT/docs"
echo ""
echo "常用命令："
echo "  查看状态: sudo systemctl status animate-cc-api"
echo "  查看日志: sudo journalctl -u animate-cc-api -f"
echo "  重启服务: sudo systemctl restart animate-cc-api"
echo "  停止服务: sudo systemctl stop animate-cc-api"
