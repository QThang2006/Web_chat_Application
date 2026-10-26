#!/bin/bash
# ==============================================================================
# Master Deployment Script: Full-Stack NestJS + React + MySQL trên Ubuntu Server
# Môn học Linux - Đề tài số 18: Web chat - Webserver configuration in Ubuntu
# ==============================================================================

set -e

if [ "$EUID" -ne 0 ]; then
  echo "[-] Vui lòng chạy script này với quyền root: sudo ./deploy.sh"
  exit 1
fi

DEPLOY_DIR=$(dirname "$(readlink -f "$0")")
ROOT_DIR=$(dirname "$DEPLOY_DIR")
FE_SRC="${ROOT_DIR}/../fe"
BE_SRC="${ROOT_DIR}/../be"

# Đường dẫn cài đặt trên Linux
TARGET_DIR="/var/www/webchat"
TARGET_FE="${TARGET_DIR}/fe"
TARGET_BE="${TARGET_DIR}/be"

echo "=========================================================="
echo "    BẮT ĐẦU TRIỂN KHAI HỆ THỐNG WEB CHAT TRÊN UBUNTU     "
echo "=========================================================="

# 1. Cài đặt các gói hệ thống cần thiết
echo "[1/8] Cập nhật apt và cài đặt Nginx, Node.js, UFW, OpenSSL..."
apt-get update -y
apt-get install -y nginx nodejs npm ufw openssl curl mysql-server mysql-client

# 2. Cấu hình Cơ sở dữ liệu MySQL
echo "[2/8] Cấu hình Cơ sở dữ liệu MySQL có sẵn..."
bash "${ROOT_DIR}/database/setup_db.sh"

# 3. Tạo User hệ thống (Least Privilege)
echo "[3/8] Khởi tạo system user 'chatuser'..."
if ! id "chatuser" &>/dev/null; then
    useradd -r -s /bin/false -d "$TARGET_DIR" chatuser
    echo "    -> Đã tạo user: chatuser"
else
    echo "    -> User 'chatuser' đã sẵn sàng."
fi

# 4. Biên dịch React Frontend (Vite Build)
echo "[4/8] Đang build React Frontend thành file tĩnh (SPA)..."
cd "$FE_SRC"
rm -rf "${FE_SRC}/dist_old"
npm install
npm run build

mkdir -p "${TARGET_FE}/dist"
cp -r "${FE_SRC}/dist/"* "${TARGET_FE}/dist/"

# 5. Biên dịch và triển khai NestJS Backend
echo "[5/8] Đang build NestJS Backend sang JavaScript production..."
cd "$BE_SRC"
npm install
npm run build

mkdir -p "$TARGET_BE"
cp -r "${BE_SRC}/dist" "$TARGET_BE/"
cp "${BE_SRC}/package.json" "$TARGET_BE/"

cd "$TARGET_BE"
npm install --omit=dev

mkdir -p "${TARGET_BE}/data"
if [ ! -f "${TARGET_BE}/data/messages.json" ]; then
    echo "[]" > "${TARGET_BE}/data/messages.json"
fi

# Phân quyền cho chatuser
chown -R chatuser:chatuser "$TARGET_DIR"
chmod -R 755 "$TARGET_DIR"

# 6. Cài đặt và kích hoạt Systemd Service cho NestJS
echo "[6/8] Cấu hình và kích hoạt Systemd Service (webchat.service)..."
cp "${ROOT_DIR}/systemd/webchat.service" /etc/systemd/system/webchat.service
systemctl daemon-reload
systemctl enable webchat.service
systemctl restart webchat.service

# 7. Sinh chứng chỉ SSL tự ký & Cấu hình Nginx
echo "[7/8] Thiết lập SSL và cấu hình Nginx Web Server..."
bash "${ROOT_DIR}/scripts/generate_ssl.sh"

cp "${ROOT_DIR}/nginx/webchat.conf" /etc/nginx/sites-available/webchat.conf
ln -sf /etc/nginx/sites-available/webchat.conf /etc/nginx/sites-enabled/webchat.conf
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

# 8. Thiết lập Tường lửa UFW & Đặt lịch Crontab
echo "[8/8] Cấu hình tường lửa UFW và Crontab Backup..."
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP Web'
ufw allow 443/tcp comment 'HTTPS & WSS'
# Port 3000 (NestJS) và 3306 (MySQL) bị cô lập an toàn
ufw --force enable

chmod +x "${ROOT_DIR}/scripts/backup.sh"
chmod +x "${ROOT_DIR}/database/restore_db.sh"
CRON_JOB="0 2 * * * ${ROOT_DIR}/scripts/backup.sh >/dev/null 2>&1"
(crontab -l 2>/dev/null | grep -Fv "${ROOT_DIR}/scripts/backup.sh" ; echo "$CRON_JOB") | crontab -

echo "=========================================================="
echo "    [HOÀN TẤT] TRIỂN KHAI THÀNH CÔNG ĐỀ TÀI SỐ 18!       "
echo "=========================================================="
echo "Trạng thái dịch vụ:"
systemctl is-active --quiet mysql && echo " - MySQL Database: RUNNING" || echo " - MySQL: OFF"
systemctl is-active --quiet webchat && echo " - NestJS Service (Systemd): RUNNING" || echo " - NestJS Service: FAILED"
systemctl is-active --quiet nginx && echo " - Nginx Webserver: RUNNING" || echo " - Nginx Webserver: FAILED"
echo "Truy cập ứng dụng tại:"
echo " -> HTTP:  http://<IP_UBUNTU_CUA_BAN>/"
echo " -> HTTPS: https://<IP_UBUNTU_CUA_BAN>/"
echo "=========================================================="
