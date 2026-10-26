#!/bin/bash
# ==============================================================================
# Script phục hồi dữ liệu MySQL từ bản sao lưu nén (.sql.gz)
# Môn học Linux - Đề tài số 18
# ==============================================================================

if [ -z "$1" ]; then
    echo "Cách dùng: sudo ./restore_db.sh <đường_dẫn_file_backup.sql.gz>"
    echo "Ví dụ:    sudo ./restore_db.sh /var/backups/webchat/webchat_mysql_20261019_020000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"
DB_NAME="webchat_db"
DB_USER="chatuser"
DB_PASS="ChatUser@123"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "[-] File không tồn tại: $BACKUP_FILE"
    exit 1
fi

echo "==> Đang phục hồi cơ sở dữ liệu MySQL [${DB_NAME}] từ file: ${BACKUP_FILE}..."
gunzip -c "$BACKUP_FILE" | mysql -u "${DB_USER}" -p"${DB_PASS}" "${DB_NAME}"
RESTORE_STATUS=${PIPESTATUS[1]}

if [ $RESTORE_STATUS -eq 0 ]; then
    echo "==> [THÀNH CÔNG] Dữ liệu MySQL đã được phục hồi hoàn tất!"
else
    echo "[-] Có lỗi xảy ra trong quá trình phục hồi MySQL (Exit code: $RESTORE_STATUS)."
    exit 1
fi
