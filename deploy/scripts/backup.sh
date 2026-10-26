#!/bin/bash
# ==============================================================================
# Script tự động sao lưu dữ liệu và cấu hình Web Chat (Chạy thủ công hoặc qua Crontab)
# Bao gồm: Sao lưu MySQL Database (mysqldump) & File cấu hình hệ thống
# Môn học Linux - Đề tài số 18
# ==============================================================================

BACKUP_DIR="/var/backups/webchat"
LOG_FILE="/var/log/webchat_backup.log"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ARCHIVE_NAME="webchat_files_${TIMESTAMP}.tar.gz"
DB_DUMP_NAME="webchat_mysql_${TIMESTAMP}.sql.gz"

DB_USER="chatuser"
DB_PASS="ChatUser@123"
DB_NAME="webchat_db"

echo "--------------------------------------------------------" >> "$LOG_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Bắt đầu quá trình sao lưu tự động..." >> "$LOG_FILE"

mkdir -p "$BACKUP_DIR"

# 1. SAO LƯU MYSQL DATABASE BẰNG LỆNH mysqldump
if command -v mysqldump &>/dev/null; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Đang xuất bản sao lưu MySQL (${DB_NAME})..." >> "$LOG_FILE"
    mysqldump -u "${DB_USER}" -p"${DB_PASS}" --single-transaction --quick "${DB_NAME}" 2>> "$LOG_FILE" | gzip > "${BACKUP_DIR}/${DB_DUMP_NAME}"
    DUMP_STATUS=${PIPESTATUS[0]}

    if [ $DUMP_STATUS -eq 0 ] && [ -s "${BACKUP_DIR}/${DB_DUMP_NAME}" ]; then
        DB_SIZE=$(du -h "${BACKUP_DIR}/${DB_DUMP_NAME}" | cut -f1)
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sao lưu MySQL thành công: ${DB_DUMP_NAME} (${DB_SIZE})" >> "$LOG_FILE"
    else
        rm -f "${BACKUP_DIR}/${DB_DUMP_NAME}"
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Lỗi: mysqldump thất bại (Exit code: $DUMP_STATUS), đã xóa file dump hỏng." >> "$LOG_FILE"
    fi
fi

# 2. SAO LƯU FILE CẤU HÌNH & DỮ LIỆU ĐỊNH DẠNG .tar.gz
TARGETS=()
if [ -d "/var/www/webchat/be/data" ]; then
    TARGETS+=("/var/www/webchat/be/data")
fi
if [ -f "/etc/nginx/sites-available/webchat.conf" ]; then
    TARGETS+=("/etc/nginx/sites-available/webchat.conf")
fi
if [ -f "/etc/systemd/system/webchat.service" ]; then
    TARGETS+=("/etc/systemd/system/webchat.service")
fi

if [ ${#TARGETS[@]} -gt 0 ]; then
    tar -czf "${BACKUP_DIR}/${ARCHIVE_NAME}" "${TARGETS[@]}" 2>> "$LOG_FILE"
    if [ $? -eq 0 ]; then
        FILE_SIZE=$(du -h "${BACKUP_DIR}/${ARCHIVE_NAME}" | cut -f1)
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sao lưu Files thành công: ${ARCHIVE_NAME} (${FILE_SIZE})" >> "$LOG_FILE"
    fi
fi

# 3. TỰ ĐỘNG DỌN DẸP CÁC BẢN SAO LƯU CŨ QUÁ 7 NGÀY
find "$BACKUP_DIR" -name "webchat_*.tar.gz" -type f -mtime +7 -delete
find "$BACKUP_DIR" -name "webchat_*.sql.gz" -type f -mtime +7 -delete

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Hoàn tất sao lưu toàn bộ hệ thống." >> "$LOG_FILE"
