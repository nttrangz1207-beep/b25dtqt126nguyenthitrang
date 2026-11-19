#!/usr/bin/env bash

# Startup script for NEXUS AI Agent
cd "$(dirname "$0")"

PORT=3000

# Detect Node runtime
NODE_CMD=""

if command -v node >/dev/null 2>&1; then
  NODE_CMD="node"
elif [ -f "/Applications/Antigravity IDE.app/Contents/MacOS/Electron" ]; then
  NODE_CMD='ELECTRON_RUN_AS_NODE=1 "/Applications/Antigravity IDE.app/Contents/MacOS/Electron"'
fi

if [ -z "$NODE_CMD" ]; then
  echo "❌ Không tìm thấy môi trường Node.js. Vui lòng cài đặt Node.js hoặc kiểm tra Antigravity IDE."
  exit 1
fi

echo "================================================================="
echo "🌟 KHỞI CHẠY NEXUS AI AGENT - PHÂN TÍCH & DỰ BÁO KINH DOANH"
echo "================================================================="
echo "📂 Thư mục dự án: $(pwd)"
echo "⚙️ Môi trường: Node.js (Tích hợp Antigravity)"
echo "🌐 Đang khởi tạo máy chủ tại http://localhost:$PORT ..."

# Open browser if macOS
if command -v open >/dev/null 2>&1; then
  (sleep 1 && open "http://localhost:$PORT") &
fi

# Run server
eval $NODE_CMD server.js
