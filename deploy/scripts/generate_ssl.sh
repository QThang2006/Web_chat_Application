#!/bin/bash
# ==============================================================================
# Script sinh chứng chỉ SSL tự ký (Self-signed Certificate) với OpenSSL
# Môn học Linux - Đề tài số 18
# ==============================================================================

set -e

CERT_DIR="/etc/ssl/certs"
KEY_DIR="/etc/ssl/private"
CERT_FILE="${CERT_DIR}/webchat-selfsigned.crt"
KEY_FILE="${KEY_DIR}/webchat-selfsigned.key"

if [ "$EUID" -ne 0 ]; then
  echo "Vui lòng chạy với quyền sudo: sudo ./generate_ssl.sh"
  exit 1
fi

mkdir -p "$CERT_DIR"
mkdir -p "$KEY_DIR"
chmod 700 "$KEY_DIR"

echo "==> Đang sinh khóa riêng và chứng chỉ SSL thời hạn 365 ngày..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$KEY_FILE" \
  -out "$CERT_FILE" \
  -subj "/C=VN/ST=HaNoi/L=HaNoi/O=LinuxCourse/OU=Group4/CN=ubuntu-webchat.local" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

chmod 600 "$KEY_FILE"
chmod 644 "$CERT_FILE"

echo "==> [THÀNH CÔNG] Đã tạo chứng chỉ SSL tại:"
echo "    - Certificate: $CERT_FILE"
echo "    - Private Key: $KEY_FILE"
