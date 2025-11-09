#!/bin/bash

echo "🔧 修复 WSL Docker 权限问题..."

# 停止所有相关容器
echo "停止现有容器..."
docker-compose down 2>/dev/null || true

# 清理 Docker 缓存
echo "清理 Docker 缓存..."
docker builder prune -a -f
docker system prune -f

# 设置正确的文件权限（仅在 Linux 文件系统中有效）
echo "修复文件权限..."
find . -type f -name "*.js" -exec chmod 644 {} \; 2>/dev/null || true
find . -type f -name "*.json" -exec chmod 644 {} \; 2>/dev/null || true
find . -type d -exec chmod 755 {} \; 2>/dev/null || true

echo "使用 WSL 优化配置启动..."
docker-compose -f docker-compose.wsl.yml up --build

echo "✅ 完成！项目已启动在 WSL 优化环境中"