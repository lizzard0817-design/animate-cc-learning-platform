#!/usr/bin/env bash
# Railway/Render 部署脚本
# 自动安装依赖并启动服务

set -e

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Starting server..."
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
