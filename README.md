# ĐỀ TÀI SỐ 18: WEB CHAT - WEBSERVER CONFIGURATION IN UBUNTU
### Kiến trúc Full-Stack Chuẩn: React (fe) + NestJS (be) + MySQL + Nginx (deploy)
**Môn học:** Hệ điều hành Linux / Quản trị hệ thống Linux  
**Quy mô nhóm:** 04 thành viên  

---

## I. TỔNG QUAN KIẾN TRÚC 3 THƯ MỤC CHUẨN QUỐC TẾ

Hệ thống được tổ chức phân tách độc lập theo mô hình chuyên nghiệp:
* **`fe/` (Frontend):** Ứng dụng Client viết bằng **React (Vite + TypeScript)**, được biên dịch trước (*pre-build*) thành file tĩnh HTML/CSS/JS (`fe/dist/`) để **Nginx phục vụ trực tiếp**.
* **`be/` (Backend):** Ứng dụng Server viết bằng **NestJS (TypeScript)**, kết nối **MySQL** qua TypeORM, biên dịch sang `be/dist/main.js` và được quản lý tiến trình tự phục hồi bởi **Systemd** (`webchat.service`).
* **`deploy/` (DevOps & Quản trị Linux):** Chứa toàn bộ cấu hình hạ tầng của hệ điều hành Ubuntu: Virtual Host Nginx, Systemd Unit, Tường lửa UFW, scripts cài đặt Database MySQL và kịch bản sao lưu tự động **`mysqldump`** cho Crontab.

```
[ Client Browser ] 
        │ (HTTP / HTTPS / WSS: Port 80 & 443)
        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        UBUNTU LINUX SERVER                             │
│                                                                        │
│  [ Tường lửa UFW ] ──> Mở: 22 (SSH), 80 (HTTP), 443 (HTTPS)            │
│                        CHẶN: Port 3000 (NestJS) & Port 3306 (MySQL)    │
│                                                                        │
│  [ Nginx Web Server ] (Port 80 & 443 SSL)                              │
│     ├── Path: /          ──> Phục vụ React SPA (fe/dist)               │
│     ├── Path: /api/      ──> Proxy -> NestJS REST API (localhost:3000)│
│     └── Path: /socket.io ──> Proxy -> NestJS WebSocket Gateway         │
│                                                   │                    │
│  [ NestJS Service ] (webchat.service qua Systemd) ▼                    │
│     └── TypeORM: Kết nối tới MySQL Database (localhost:3306)           │
│                                                   │                    │
│  [ MySQL Database Service ] (mysql.service)       ▼                    │
│     ├── Database: webchat_db (Charset: utf8mb4)                        │
│     └── Bảng:     users, rooms, room_members, messages                 │
│                                                                        │
│  [ Crontab Lập lịch ] (02:00 AM hàng ngày):                            │
│     └── deploy/scripts/backup.sh: Chạy mysqldump nén thành .sql.gz     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## II. CẤU TRÚC THƯ MỤC CHI TIẾT

```text
/home/thang/project_linux/
│
├── 📂 fe/                          # FRONTEND: React Client (Vite + TypeScript)
│   ├── 📂 src/
│   │   ├── App.tsx                 # Giao diện chat thời gian thực, quản lý phòng
│   │   ├── index.css               # Giao diện chuẩn Ubuntu Dark Theme
│   │   └── main.tsx
│   ├── 📂 dist/                    # Bản build file tĩnh sẵn sàng cho Nginx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── 📂 be/                          # BACKEND: NestJS Server + TypeORM + MySQL
│   ├── 📂 src/
│   │   ├── 📂 entities/            # 4 Thực thể CSDL chuẩn hóa (3NF)
│   │   │   ├── user.entity.ts      # Bảng 'users' (quản lý tài khoản, status online, IP)
│   │   │   ├── room.entity.ts      # Bảng 'rooms' (kênh chat công khai, kín)
│   │   │   ├── room-member.entity.ts # Bảng 'room_members' (quan hệ n-n, phân quyền)
│   │   │   └── message.entity.ts   # Bảng 'messages' (nội dung, người gửi, IP client)
│   │   ├── 📂 chat/
│   │   │   ├── chat.gateway.ts     # WebSocket Gateway (@WebSocketGateway)
│   │   │   ├── chat.service.ts     # Truy vấn TypeORM Repository & ghi log IP
│   │   │   └── chat.module.ts
│   │   ├── app.controller.ts       # REST API /api/health
│   │   ├── app.module.ts           # TypeOrmModule.forRoot kết nối MySQL:3306
│   │   └── main.ts
│   ├── 📂 dist/                    # Bản build JavaScript chạy trên Systemd
│   ├── package.json                # mysql2, @nestjs/typeorm, typeorm, socket.io
│   └── tsconfig.json
│
├── 📂 deploy/                      # INFRASTRUCTURE & DEVOPS TRÊN UBUNTU
│   ├── 📂 nginx/
│   │   └── webchat.conf            # Virtual Host: SPA try_files + WebSocket proxy + SSL
│   ├── 📂 systemd/
│   │   └── webchat.service         # Quản lý NestJS chạy nền dưới user 'chatuser'
│   ├── 📂 database/
│   │   ├── setup_db.sh             # Khởi tạo CSDL webchat_db & user 'chatuser' trong MySQL
│   │   └── restore_db.sh           # Phục hồi CSDL MySQL từ bản sao lưu .sql.gz
│   └── 📂 scripts/
│       ├── deploy.sh               # Master Script triển khai toàn bộ hệ thống
│       ├── backup.sh               # Script chạy mysqldump + nén tar.gz cho Crontab
│       └── generate_ssl.sh         # Sinh chứng chỉ SSL tự ký bằng OpenSSL
│
└── 📄 README.md                    # Tài liệu tổng quan
```

---

## III. PHÂN CÔNG CÔNG VIỆC CHO NHÓM 4 NGƯỜI

| Thành viên & Vai trò | Phụ trách chính | Trọng tâm cần nắm vững để vấn đáp |
| :--- | :--- | :--- |
| **Thành viên 1**<br>*(Web Server & Network)* | - Cấu hình Nginx Virtual Host trong `deploy/nginx/webchat.conf`.<br>- Cấu hình SSL/TLS (HTTPS, WSS) và Rate Limiting.<br>- Cấu hình `try_files` chống lỗi 404 cho React SPA. | *Cơ chế Nginx xử lý SPA khác ứng dụng truyền thống ra sao? Ý nghĩa 2 header `Upgrade` và `Connection`?* |
| **Thành viên 2**<br>*(Backend & Database Modeling)* | - Toàn quyền mã nguồn trong `be/src/`.<br>- Thiết kế 4 thực thể TypeORM (`User`, `Room`, `RoomMember`, `Message`).<br>- Xây dựng WebSocket Gateway và đồng bộ trạng thái Online/Offline vào MySQL. | *Vòng đời kết nối WebSocket trong NestJS? Cách TypeORM ánh xạ các quan hệ vào bảng MySQL?* |
| **Thành viên 3**<br>*(Frontend Developer)* | - Toàn quyền mã nguồn trong `fe/src/`.<br>- Xây dựng giao diện React kết nối `socket.io-client`.<br>- Tối ưu hóa build Vite (`npm run build`) tạo file tĩnh nhỏ gọn đưa vào `fe/dist/`. | *Tại sao khi deploy production lại đưa React về file tĩnh mà không chạy `npm run dev` trên server?* |
| **Thành viên 4**<br>*(Database Admin & DevOps)* | - Quản trị MySQL Server và Systemd service (`webchat.service`).<br>- Viết các Shell Script trong `deploy/database/` và `deploy/scripts/`.<br>- Cấu hình **Crontab** tự động sao lưu CSDL bằng lệnh **`mysqldump`**. | *Lệnh kiểm tra log dịch vụ (`journalctl`)? Nguyên tắc Least Privilege? Cú pháp lệnh `mysqldump`?* |

---

## IV. HƯỚNG DẪN TRIỂN KHAI TRÊN UBUNTU SERVER

### Cách 1: Triển khai tự động bằng 1 dòng lệnh (Khuyên dùng)
```bash
cd /home/thang/project_linux/deploy/scripts
sudo ./deploy.sh
```

---

### Cách 2: Các bước triển khai thủ công

#### Bước 1: Khởi tạo Database MySQL
```bash
sudo /home/thang/project_linux/deploy/database/setup_db.sh
```

#### Bước 2: Tạo User hệ thống & Phân quyền bảo mật
```bash
sudo useradd -r -s /bin/false -d /var/www/webchat chatuser
sudo mkdir -p /var/www/webchat/fe /var/www/webchat/be
```

#### Bước 3: Build và đưa Frontend React vào thư mục Web
```bash
cd /home/thang/project_linux/fe
npm install && npm run build
sudo cp -r dist/ /var/www/webchat/fe/
```

#### Bước 4: Build và đưa Backend NestJS vào thư mục chạy
```bash
cd /home/thang/project_linux/be
npm install && npm run build
sudo cp -r dist package.json /var/www/webchat/be/
cd /var/www/webchat/be
sudo npm install --omit=dev
sudo chown -R chatuser:chatuser /var/www/webchat
sudo chmod -R 755 /var/www/webchat
```

#### Bước 5: Cấu hình Systemd Service cho NestJS
```bash
sudo cp /home/thang/project_linux/deploy/systemd/webchat.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable webchat.service
sudo systemctl start webchat.service
```

#### Bước 6: Cấu hình SSL và Web Server Nginx
```bash
sudo /home/thang/project_linux/deploy/scripts/generate_ssl.sh
sudo cp /home/thang/project_linux/deploy/nginx/webchat.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/webchat.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

#### Bước 7: Thiết lập Tường lửa UFW & Đặt lịch Crontab
```bash
sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp
sudo ufw enable
```
Thêm vào `sudo crontab -e`:
```cron
0 2 * * * /home/thang/project_linux/deploy/scripts/backup.sh >/dev/null 2>&1
```

---

## V. KỊCH BẢN DEMO KIỂM THỬ TRƯỚC GIẢNG VIÊN

1. **Kiểm tra trạng thái các dịch vụ:**
   ```bash
   sudo systemctl status nginx
   sudo systemctl status mysql
   sudo systemctl status webchat
   ```
2. **Kiểm tra dữ liệu trực tiếp trong MySQL:**
   ```bash
   mysql -u chatuser -p'ChatUser@123' -D webchat_db -e "SELECT user, room, text, ipAddress, createdAt FROM messages ORDER BY createdAt DESC LIMIT 3;"
   ```
3. **Thử nghiệm Systemd tự phục hồi khi bị crash:**
   ```bash
   sudo kill -9 $(pgrep -f "node dist/main.js")
   sleep 5
   sudo systemctl status webchat
   ```
4. **Kiểm tra sao lưu tự động với `mysqldump`:**
   ```bash
   sudo /home/thang/project_linux/deploy/scripts/backup.sh
   ls -lh /var/backups/webchat/
   ```
