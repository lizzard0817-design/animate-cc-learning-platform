#!/bin/bash
# 腾讯云服务器部署脚本
# 使用方式: 在服务器上执行 bash deploy.sh

set -e

echo "========================================="
echo "  Animate CC 后端部署脚本"
echo "========================================="

# 1. 更新系统
echo "[1/6] 更新系统包..."
sudo apt-get update -y

# 2. 安装 Python 3.10
echo "[2/6] 安装 Python 3..."
sudo apt-get install -y python3 python3-pip python3-venv

# 3. 创建项目目录
echo "[3/6] 创建项目目录..."
sudo mkdir -p /opt/animate-cc-api
sudo chown -R $USER:$USER /opt/animate-cc-api

# 4. 创建虚拟环境
echo "[4/6] 创建 Python 虚拟环境..."
cd /opt/animate-cc-api
python3 -m venv venv
source venv/bin/activate

# 5. 安装依赖
echo "[5/6] 安装 Python 依赖..."
pip install --upgrade pip
pip install -r requirements.txt

# 6. 初始化数据库
echo "[6/6] 初始化数据库..."
python -c "
import asyncio
from database import init_db
asyncio.run(init_db())
echo '数据库初始化完成'
"

echo ""
echo "========================================="
echo "  部署脚本执行完成！"
echo "========================================="
echo ""
echo "启动服务："
echo "  cd /opt/animate-cc-api"
echo "  source venv/bin/activate"
echo "  nohup uvicorn main:app --host 0.0.0.0 --port 8000 &"
echo ""
echo "或者使用 systemd 服务："
echo "  sudo cp animate-cc-api.service /etc/systemd/system/"
echo "  sudo systemctl enable animate-cc-api"
echo "  sudo systemctl start animate-cc-api"
