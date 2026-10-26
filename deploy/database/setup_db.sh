#!/bin/bash
# ==============================================================================
# Script tự động cấu hình MySQL Database trên Ubuntu Server
# Môn học Linux - Đề tài số 18
# ==============================================================================

set -e

if [ "$EUID" -ne 0 ]; then
  echo "[-] Vui lòng chạy script này với quyền root: sudo ./setup_db.sh"
  exit 1
fi

DB_NAME="webchat_db"
DB_USER="chatuser"
DB_PASS="ChatUser@123"

echo "=========================================================="
echo "    BẮT ĐẦU CẤU HÌNH MYSQL DATABASE TRÊN UBUNTU SERVER    "
echo "=========================================================="

# 1. Kiểm tra và tự động cài đặt MySQL nếu máy chưa có
if ! command -v mysql &>/dev/null; then
    echo " -> Chưa tìm thấy lệnh 'mysql', đang tự động cài đặt MySQL Server..."
    apt-get update -y
    apt-get install -y mysql-server mysql-client
fi

# 2. Đảm bảo dịch vụ MySQL / MariaDB đang chạy
echo " -> Đang kiểm tra trạng thái dịch vụ MySQL..."
if systemctl is-active --quiet mysql; then
    echo " -> Dịch vụ MySQL: Đang chạy"
elif systemctl is-active --quiet mariadb; then
    echo " -> Dịch vụ MariaDB: Đang chạy"
else
    echo " -> Dịch vụ MySQL chưa bật, đang khởi động dịch vụ..."
    systemctl enable mysql 2>/dev/null || true
    systemctl start mysql 2>/dev/null || systemctl start mariadb 2>/dev/null || true
    sleep 3
fi

# 3. Khởi tạo Database và User trong MySQL
echo " -> Đang tạo CSDL [${DB_NAME}] với bảng mã utf8mb4..."
mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo " -> Đang tạo người dùng [${DB_USER}] và phân quyền..."
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

echo "=========================================================="
echo "    [THÀNH CÔNG] ĐÃ CẤU HÌNH MYSQL XONG!                 "
echo "    - Database: ${DB_NAME} (utf8mb4)"
echo "    - User:     ${DB_USER}"
echo "    - Password: ${DB_PASS}"
echo "    - Port:     3306 (Localhost)"
echo "=========================================================="
