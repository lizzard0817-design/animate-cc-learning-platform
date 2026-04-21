#!/bin/bash
# 一键上传脚本：将后端代码上传到腾讯云服务器
# 使用方式: bash upload.sh [服务器用户名] [服务器IP]

set -e

USER=${1:-lizzard}
HOST=${2:-118.89.76.204}

echo "========================================="
echo "  上传后端代码到腾讯云服务器"
echo "  目标: $USER@$HOST"
echo "========================================="

# 1. 创建远程目录
echo "[1/3] 创建远程目录..."
ssh $USER@$HOST "mkdir -p /opt/animate-cc-api"

# 2. 上传后端代码
echo "[2/3] 上传后端代码..."
scp -r server/* $USER@$HOST:/opt/animate-cc-api/

# 3. 上传 systemd 服务文件
echo "[3/3] 配置 systemd 服务..."
ssh $USER@$HOST "sudo cp /opt/animate-cc-api/animate-cc-api.service /etc/systemd/system/ && sudo systemctl daemon-reload"

echo ""
echo "========================================="
echo "  上传完成！"
echo "========================================="
echo ""
echo "SSH 登录服务器执行部署："
echo "  ssh $USER@$HOST"
echo "  cd /opt/animate-cc-api"
echo "  bash deploy.sh"
echo ""
echo "启动服务："
echo "  sudo systemctl enable animate-cc-api"
echo "  sudo systemctl start animate-cc-api"
echo ""
echo "配置 Nginx（如需要）："
echo "  sudo cp /opt/animate-cc-api/nginx.conf /etc/nginx/sites-available/animate-cc-api"
echo "  sudo ln -s /etc/nginx/sites-available/animate-cc-api /etc/nginx/sites-enabled/"
echo "  sudo nginx -t && sudo systemctl reload nginx"
