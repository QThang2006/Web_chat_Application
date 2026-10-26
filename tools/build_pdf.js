const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const FONT_REGULAR = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf';
const FONT_BOLD = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf';
const FONT_MONO = '/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf';

const OUTPUT_PDF = '/home/thang/project_linux/deploy/Bao_Cao_Tien_Do_De_Tai_18_Linux.pdf';

const doc = new PDFDocument({
  size: 'A4',
  layout: 'landscape',
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  autoFirstPage: false,
});

doc.pipe(fs.createWriteStream(OUTPUT_PDF));

// Helper: Vẽ thanh Header trên mỗi trang
function drawHeader(slideNum, totalSlides = 10, title = 'BÁO CÁO TIẾN ĐỘ ĐỒ ÁN HỆ ĐIỀU HÀNH LINUX') {
  doc.fontSize(8).font(FONT_BOLD).fillColor('#2563EB')
    .text(title, 40, 24);
  doc.fontSize(8).font(FONT_REGULAR).fillColor('#71717A')
    .text(`Đề tài số 18: Web chat - Webserver configuration in Ubuntu  |  Trang ${slideNum} / ${totalSlides}`, 40, 24, { align: 'right' });
  doc.rect(40, 36, 762, 1).fillColor('#E4E4E7').fill();
}

// Helper: Vẽ Footer
function drawFooter(slideNum, totalSlides = 10) {
  doc.rect(40, 560, 762, 1).fillColor('#E4E4E7').fill();
  doc.fontSize(8).font(FONT_REGULAR).fillColor('#A1A1AA')
    .text('Trường Đại học Công nghệ  •  Khoa Công nghệ Thông tin  •  Năm học 2026-2027', 40, 568);
  doc.fontSize(8).font(FONT_BOLD).fillColor('#2563EB')
    .text(`Slide ${slideNum} / ${totalSlides}`, 40, 568, { align: 'right' });
}

// Helper: Hộp Card
function drawCard(x, y, w, h, bgColor = '#F8F9FA', strokeColor = '#E4E4E7') {
  doc.roundedRect(x, y, w, h, 8).fillColor(bgColor).fill();
  doc.roundedRect(x, y, w, h, 8).strokeColor(strokeColor).lineWidth(1).stroke();
}

// ==========================================
// SLIDE 1: TRANG TIÊU ĐỀ
// ==========================================
doc.addPage();
drawHeader(1, 10);

drawCard(40, 60, 762, 480, '#FFFFFF', '#E4E4E7');

doc.roundedRect(60, 80, 280, 26, 13).fillColor('#EFF6FF').fill();
doc.fontSize(9).font(FONT_BOLD).fillColor('#1D4ED8')
  .text('UBUNTU SERVER  •  ĐỀ TÀI SỐ 18', 75, 88);

doc.fontSize(28).font(FONT_BOLD).fillColor('#09090B')
  .text('Web chat - Webserver configuration in Ubuntu', 60, 130, { width: 720 });

doc.fontSize(12).font(FONT_REGULAR).fillColor('#71717A')
  .text('Thiết kế, xây dựng và quản trị hệ thống Máy chủ Web Server phân tán trên Ubuntu, tích hợp ứng dụng truyền thông thời gian thực và quản trị an ninh mạng.', 60, 195, { width: 700 });

doc.rect(60, 260, 722, 1).fillColor('#E4E4E7').fill();

// 4 Cột thành viên
const colW = 168;
const memberData = [
  { role: 'Thành viên 1 (Trưởng nhóm)', desc: 'Web Server Nginx, SSL, Mạng & Tường lửa UFW' },
  { role: 'Thành viên 2', desc: 'NestJS Backend, WebSocket Gateway, CSDL MySQL' },
  { role: 'Thành viên 3', desc: 'React Frontend, UI/UX Minimalist, Components' },
  { role: 'Thành viên 4', desc: 'DevOps, Systemd Service, Bash Script & Crontab' },
];

memberData.forEach((m, idx) => {
  const x = 60 + idx * (colW + 16);
  drawCard(x, 280, colW, 120, '#F8F9FA');
  doc.fontSize(9).font(FONT_BOLD).fillColor('#2563EB').text(m.role, x + 10, 295, { width: colW - 20 });
  doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#52525B').text(m.desc, x + 10, 325, { width: colW - 20 });
});

drawCard(60, 420, 722, 45, '#F0FDF4', '#BBF7D0');
doc.fontSize(9).font(FONT_BOLD).fillColor('#166534')
  .text('TRẠNG THÁI TIẾN ĐỘ: HOÀN THÀNH 100% CÁC HẠNG MỤC KỸ THUẬT', 75, 436);
doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#15803D')
  .text('Hệ thống đã triển khai thực tế trên mạng LAN (IP: 192.168.1.138)', 440, 436);

drawFooter(1, 10);

// ==========================================
// SLIDE 2: MỤC TIÊU CỐT LÕI MÔN LINUX
// ==========================================
doc.addPage();
drawHeader(2, 10);

doc.fontSize(10).font(FONT_BOLD).fillColor('#2563EB').text('01. TỔNG QUAN & BẢN CHẤT HỌC PHẦN', 40, 50);
doc.fontSize(18).font(FONT_BOLD).fillColor('#09090B').text('Mục tiêu Cốt lõi của Môn học Linux', 40, 68);

const pillars = [
  {
    title: '1. Quản trị Dịch vụ (Daemons)',
    content: 'Hiểu cách hệ điều hành Linux quản lý tiến trình nền tảng qua Systemd (PID 1). Đóng gói dịch vụ webchat.service có khả năng tự phục hồi sự cố sau 5 giây (Restart=always).'
  },
  {
    title: '2. An ninh Mạng & Phân quyền',
    content: 'Tuân thủ nguyên tắc đặc quyền tối thiểu (Least Privilege). Tạo system user riêng (chatuser, /bin/false). Thiết lập tường lửa UFW cô lập cổng 3000 và 3306 bên trong.'
  },
  {
    title: '3. Tự động hóa & Khôi phục (Disaster Recovery)',
    content: 'Người quản trị không làm thủ công: Tự động hóa 100% với deploy.sh, lập lịch Crontab gọi mysqldump xuất file .sql.gz định kỳ lúc 02:00 sáng và script restore_db.sh.'
  },
];

pillars.forEach((p, idx) => {
  const x = 40 + idx * 260;
  drawCard(x, 105, 242, 380, '#FFFFFF', '#E4E4E7');
  doc.roundedRect(x + 16, 120, 32, 32, 8).fillColor('#EFF6FF').fill();
  doc.fontSize(14).font(FONT_BOLD).fillColor('#2563EB').text(`${idx + 1}`, x + 26, 128);
  doc.fontSize(11).font(FONT_BOLD).fillColor('#09090B').text(p.title, x + 16, 168, { width: 210 });
  doc.fontSize(9.5).font(FONT_REGULAR).fillColor('#52525B').text(p.content, x + 16, 205, { width: 210, lineGap: 4 });
});

drawCard(40, 500, 762, 45, '#EFF6FF', '#BFDBFE');
doc.fontSize(9).font(FONT_BOLD).fillColor('#1D4ED8')
  .text('Tiêu chí Giảng viên đánh giá: Ứng dụng Web là công cụ kiểm nghiệm, trọng tâm nằm ở năng lực vận hành máy chủ Linux bên dưới.', 55, 516);

drawFooter(2, 10);

// ==========================================
// SLIDE 3: KIẾN TRÚC HỆ THỐNG ĐA TẦNG
// ==========================================
doc.addPage();
drawHeader(3, 10);

doc.fontSize(10).font(FONT_BOLD).fillColor('#2563EB').text('02. THIẾT KẾ HẠ TẦNG', 40, 50);
doc.fontSize(18).font(FONT_BOLD).fillColor('#09090B').text('Kiến trúc Hệ thống Đa tầng (Multi-tier Architecture)', 40, 68);

drawCard(40, 100, 762, 435, '#FAFAFA', '#E4E4E7');

// Tầng Client
drawCard(60, 115, 722, 45, '#FFFFFF');
doc.fontSize(10).font(FONT_BOLD).fillColor('#09090B').text('CLIENT LAYER (Trình duyệt Web / Điện thoại Di động qua WiFi)', 80, 125);
doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#71717A').text('Giao thức: HTTP (Port 80) & HTTPS / WSS (Port 443)  •  Địa chỉ máy chủ LAN: 192.168.1.138', 80, 142);

// Tầng Linux Server (Khung to)
drawCard(60, 175, 722, 345, '#FFFFFF', '#CBD5E1');
doc.fontSize(9).font(FONT_BOLD).fillColor('#0F172A').text('UBUNTU SERVER 22.04 LTS (HẠ TẦNG MÁY CHỦ BẢO MẬT)', 75, 188);

// 4 Blocks
const archBlocks = [
  { name: '1. TƯỜNG LỬA UFW', sub: 'Mở: 22, 80, 443\nChặn: 3000, 3306\nBảo vệ cổng nội bộ', color: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
  { name: '2. NGINX GATEWAY', sub: 'Reverse Proxy\nSSL Termination\nWebSocket Proxy\ntry_files SPA', color: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
  { name: '3. NESTJS BACKEND', sub: 'Systemd Daemon\nPort 3000 (Loopback)\nUser: chatuser\nSelf-healing (5s)', color: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
  { name: '4. MYSQL DATABASE', sub: 'Port 3306 (Loopback)\nDB: webchat_db\n4 Bảng chuẩn 3NF\nCharset: utf8mb4', color: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
];

archBlocks.forEach((b, idx) => {
  const x = 75 + idx * (162 + 12);
  drawCard(x, 215, 162, 130, b.color, b.border);
  doc.fontSize(9).font(FONT_BOLD).fillColor(b.text).text(b.name, x + 8, 228);
  doc.fontSize(8).font(FONT_REGULAR).fillColor('#374151').text(b.sub, x + 8, 252, { lineGap: 3 });
});

// Automation box
drawCard(75, 365, 692, 70, '#F8FAFC', '#E2E8F0');
doc.fontSize(9).font(FONT_BOLD).fillColor('#0F172A').text('HỆ THỐNG TỰ ĐỘNG HÓA & KHÔI PHỤC (CRONTAB AUTOMATION):', 90, 378);
doc.fontSize(8.5).font(FONT_MONO).fillColor('#475569')
  .text('0 2 * * * /home/thang/project_linux/deploy/scripts/backup.sh >/dev/null 2>&1', 90, 396);
doc.fontSize(8).font(FONT_REGULAR).fillColor('#64748B')
  .text('Xuất file sao lưu CSDL .sql.gz bằng mysqldump và file cấu hình .tar.gz, tự dọn dẹp file cũ quá 7 ngày.', 90, 414);

drawCard(75, 450, 692, 55, '#F8F9FA');
doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#334155')
  .text('Phân luồng Nginx: File tĩnh React (fe/dist) phục vụ trực tiếp qua cổng 80/443; Request /api/ và /socket.io/ chuyển tiếp ngầm tới NestJS localhost:3000.', 90, 465, { width: 660 });

drawFooter(3, 10);

// ==========================================
// SLIDE 4: TỔ CHỨC CẤU TRÚC 3 THƯ MỤC
// ==========================================
doc.addPage();
drawHeader(4, 10);

doc.fontSize(10).font(FONT_BOLD).fillColor('#2563EB').text('03. TỔ CHỨC DỰ ÁN', 40, 50);
doc.fontSize(18).font(FONT_BOLD).fillColor('#09090B').text('Cấu trúc 3 Thư mục Chuẩn Quốc tế (fe - be - deploy)', 40, 68);

const folders = [
  {
    folder: 'fe/ (Frontend SPA)',
    role: 'Phụ trách: Thành viên 3',
    tech: 'React 18 • Vite • Tailwind CSS • Lucide Icons',
    items: [
      'src/components/chat/: MessageList, ChatInput, Header',
      'src/components/sidebar/: RoomList, UserProfile, OnlineUsers',
      'src/types/chat.types.ts: Kiểu dữ liệu TypeScript',
      'dist/: Bản build file tĩnh HTML/CSS/JS phục vụ trực tiếp'
    ]
  },
  {
    folder: 'be/ (Backend Server)',
    role: 'Phụ trách: Thành viên 2',
    tech: 'NestJS 10 • TypeORM • MySQL2 Driver • Socket.io',
    items: [
      'src/entities/: 4 thực thể (users, rooms, members, messages)',
      'src/chat/: ChatGateway (@WebSocketGateway), ChatService',
      'src/app.controller.ts: REST API /api/health',
      'dist/main.js: File thực thi production chạy qua Systemd'
    ]
  },
  {
    folder: 'deploy/ (Linux Infrastructure)',
    role: 'Phụ trách: Thành viên 1 & 4',
    tech: 'Nginx • Systemd • MySQL Service • UFW • Shell Scripts',
    items: [
      'nginx/webchat.conf: Cấu hình Virtual Host & WebSocket',
      'systemd/webchat.service: Quản lý tiến trình chạy ngầm',
      'database/: setup_db.sh, restore_db.sh',
      'scripts/: Master deploy.sh, backup.sh cho Crontab'
    ]
  },
];

folders.forEach((f, idx) => {
  const x = 40 + idx * 260;
  drawCard(x, 105, 242, 385, '#FFFFFF', idx === 2 ? '#2563EB' : '#E4E4E7');
  if (idx === 2) {
    doc.roundedRect(x, 105, 242, 28, 8).fillColor('#2563EB').fill();
    doc.fontSize(10).font(FONT_BOLD).fillColor('#FFFFFF').text(f.folder, x + 12, 114);
  } else {
    doc.fontSize(10).font(FONT_BOLD).fillColor('#09090B').text(f.folder, x + 12, 118);
  }
  
  doc.fontSize(8.5).font(FONT_BOLD).fillColor('#2563EB').text(f.role, x + 12, 145);
  doc.fontSize(8).font(FONT_REGULAR).fillColor('#71717A').text(f.tech, x + 12, 162);
  doc.rect(x + 12, 180, 218, 1).fillColor('#F4F4F5').fill();
  
  let itemY = 195;
  f.items.forEach((item) => {
    doc.fontSize(8).font(FONT_MONO).fillColor('#3F3F46').text(`• ${item}`, x + 12, itemY, { width: 218, lineGap: 3 });
    itemY += 34;
  });
});

drawCard(40, 505, 762, 40, '#F8FAFC', '#E2E8F0');
doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#475569')
  .text('Mô hình này giúp phân định ranh giới rõ ràng: Lập trình viên chỉ làm việc trong fe/ và be/, trong khi nhóm SysAdmin/DevOps quản lý độc lập toàn bộ trong deploy/.', 55, 518);

drawFooter(4, 10);

// ==========================================
// SLIDE 5: TIẾN ĐỘ THÀNH VIÊN (RACI MATRIX)
// ==========================================
doc.addPage();
drawHeader(5, 10);

doc.fontSize(10).font(FONT_BOLD).fillColor('#2563EB').text('04. PHÂN CÔNG & TIẾN ĐỘ', 40, 50);
doc.fontSize(18).font(FONT_BOLD).fillColor('#09090B').text('Báo cáo Tiến độ 4 Thành viên (RACI Matrix)', 40, 68);

drawCard(40, 105, 762, 380, '#FFFFFF', '#E4E4E7');

// Bảng RACI
const raciRows = [
  {
    member: 'Thành viên 1 (Trưởng nhóm)\n& Thành viên 4',
    role: 'Linux Admin & DevOps\n(Đồng phụ trách)',
    tasks: '• Cấu hình Nginx Virtual Host, Reverse Proxy, SSL Termination, SPA fallback\n• Đóng gói NestJS thành Systemd Service, phân quyền chatuser, Least Privilege\n• Cấu hình tường lửa UFW cô lập port 3000 & 3306, quản trị MySQL Service\n• Viết Master script deploy.sh, kịch bản backup.sh và restore_db.sh',
    progress: '100% Hoàn thành'
  },
  {
    member: 'Thành viên 2',
    role: 'Backend Developer',
    tasks: '• Xây dựng WebSocket Gateway (@WebSocketGateway) với NestJS Socket.io\n• Thiết kế 4 thực thể CSDL (User, Room, RoomMember, Message) qua TypeORM\n• Xử lý lưu vết IP máy khách và đồng bộ trạng thái Online/Offline vào MySQL',
    progress: '100% Hoàn thành'
  },
  {
    member: 'Thành viên 3',
    role: 'Frontend Developer',
    tasks: '• Thiết kế giao diện React tối giản, thanh lịch, tinh chỉnh màu sắc êm dịu\n• Chia nhỏ cấu trúc thành 7 Component chuyên biệt (Sidebar, MessageBubble...)\n• Khắc phục triệt để lỗi Stale Closure bằng React Ref khi chuyển phòng chat',
    progress: '100% Hoàn thành'
  },
];

let rowY = 120;
raciRows.forEach((r, idx) => {
  drawCard(55, rowY, 732, idx === 0 ? 125 : 85, idx === 0 ? '#F0FDF4' : '#FFFFFF', idx === 0 ? '#BBF7D0' : '#E4E4E7');
  
  doc.fontSize(9.5).font(FONT_BOLD).fillColor('#09090B').text(r.member, 70, rowY + 14, { width: 140 });
  doc.fontSize(8.5).font(FONT_BOLD).fillColor('#2563EB').text(r.role, 70, rowY + 50, { width: 140 });
  doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#3F3F46').text(r.tasks, 230, rowY + 12, { width: 420, lineGap: 3 });
  
  doc.roundedRect(660, rowY + 14, 110, 22, 11).fillColor('#DCFCE7').fill();
  doc.fontSize(8.5).font(FONT_BOLD).fillColor('#166534').text(r.progress, 660, rowY + 20, { width: 110, align: 'center' });
  
  rowY += idx === 0 ? 135 : 95;
});

drawCard(40, 500, 762, 45, '#EFF6FF', '#BFDBFE');
doc.fontSize(9).font(FONT_BOLD).fillColor('#1D4ED8')
  .text('Đánh giá chung: Mọi thành viên đều hoàn thành đúng thời hạn. Hệ thống đã test thực tế và sẵn sàng cho buổi bảo vệ cuối kỳ.', 55, 516);

drawFooter(5, 10);

// ==========================================
// SLIDE 6: KỸ THUẬT NGINX & SYSTEMD
// ==========================================
doc.addPage();
drawHeader(6, 10);

doc.fontSize(10).font(FONT_BOLD).fillColor('#2563EB').text('05. KỸ THUẬT TRỌNG TÂM', 40, 50);
doc.fontSize(18).font(FONT_BOLD).fillColor('#09090B').text('Giải pháp Kỹ thuật Nginx Reverse Proxy & Systemd', 40, 68);

// Cột trái: Nginx
drawCard(40, 105, 370, 385, '#FFFFFF', '#E4E4E7');
doc.fontSize(11).font(FONT_BOLD).fillColor('#047857').text('1. NGINX REVERSE PROXY (ĐỀ TÀI SỐ 18)', 55, 120);

doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#52525B')
  .text('Xử lý bắt tay giao thức WebSocket qua cổng tiêu chuẩn 80/443:', 55, 140);

drawCard(55, 160, 340, 95, '#18181B');
doc.fontSize(8).font(FONT_MONO).fillColor('#E4E4E7')
  .text('# Chuyển tiếp kết nối thời gian thực WebSocket\nproxy_pass http://127.0.0.1:3000/socket.io/;\nproxy_http_version 1.1;\nproxy_set_header Upgrade $http_upgrade;\nproxy_set_header Connection $connection_upgrade;', 65, 172, { lineGap: 3 });

doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#52525B')
  .text('Chống lỗi 404 cho Single Page Application khi người dùng F5 tải lại trang:', 55, 270);

drawCard(55, 290, 340, 55, '#18181B');
doc.fontSize(8).font(FONT_MONO).fillColor('#E4E4E7')
  .text('location / {\n    try_files $uri $uri/ /index.html;\n}', 65, 302, { lineGap: 3 });

doc.fontSize(8).font(FONT_REGULAR).fillColor('#71717A')
  .text('• Tích hợp Gzip nén file tĩnh, Cache Control 30 ngày cho assets.\n• Cấu hình SSL/TLS (HTTPS) với chứng chỉ tự ký OpenSSL.', 55, 360, { lineGap: 3 });

// Cột phải: Systemd
drawCard(430, 105, 372, 385, '#FFFFFF', '#E4E4E7');
doc.fontSize(11).font(FONT_BOLD).fillColor('#1D4ED8').text('2. QUẢN LÝ TIẾN TRÌNH VỚI SYSTEMD', 445, 120);

doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#52525B')
  .text('Đóng gói NestJS thành dịch vụ hệ thống (/etc/systemd/system/webchat.service):', 445, 140);

drawCard(445, 160, 342, 120, '#18181B');
doc.fontSize(8).font(FONT_MONO).fillColor('#E4E4E7')
  .text('[Service]\nUser=chatuser\nGroup=chatuser\nWorkingDirectory=/var/www/webchat/be\nExecStart=/usr/bin/node dist/main.js\nRestart=always\nRestartSec=5', 455, 172, { lineGap: 3 });

doc.fontSize(8.5).font(FONT_BOLD).fillColor('#09090B').text('Đặc tính kỹ thuật đạt chuẩn Linux:', 445, 295);
doc.fontSize(8).font(FONT_REGULAR).fillColor('#52525B')
  .text('• Least Privilege: Không chạy quyền root. User "chatuser" có shell /bin/false.\n• Self-Healing: Khi tiến trình bị crash hoặc kill -9, tự bật lại sau 5 giây.\n• Boot On Start: Tự động khởi động cùng Ubuntu (WantedBy=multi-user.target).\n• Nhật ký tập trung: Xem log theo thời gian thực qua journalctl -u webchat -f.', 445, 315, { lineGap: 4 });

drawCard(40, 505, 762, 40, '#F8FAFC', '#E2E8F0');
doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#334155')
  .text('Kết luận: Ứng dụng chạy độc lập hoàn toàn với phiên SSH, chịu lỗi cao và an toàn tuyệt đối trước nguy cơ chiếm quyền root.', 55, 518);

drawFooter(6, 10);

// ==========================================
// SLIDE 7: CSDL MYSQL & SAO LƯU CRONTAB
// ==========================================
doc.addPage();
drawHeader(7, 10);

doc.fontSize(10).font(FONT_BOLD).fillColor('#2563EB').text('06. CƠ SỞ DỮ LIỆU & TỰ ĐỘNG HÓA', 40, 50);
doc.fontSize(18).font(FONT_BOLD).fillColor('#09090B').text('Cơ sở Dữ liệu MySQL Chuẩn 3NF & Sao lưu Crontab', 40, 68);

// CSDL MySQL
drawCard(40, 105, 370, 385, '#FFFFFF', '#E4E4E7');
doc.fontSize(11).font(FONT_BOLD).fillColor('#B45309').text('1. CSDL MYSQL CHUẨN 3NF (webchat_db)', 55, 120);

const tables = [
  { name: 'users', desc: 'id (UUID), username, status (ONLINE/OFFLINE), lastIp, lastSeen' },
  { name: 'rooms', desc: 'id (UUID), name, type (PUBLIC/PRIVATE), description' },
  { name: 'room_members', desc: 'id, roomId (FK), userId (FK), role (OWNER/MEMBER)' },
  { name: 'messages', desc: 'id (UUID), room, user, text, ipAddress (Lưu IP client), createdAt' },
];

let tblY = 145;
tables.forEach((t) => {
  drawCard(55, tblY, 340, 48, '#F8FAFC');
  doc.fontSize(8.5).font(FONT_BOLD).fillColor('#09090B').text(`Bảng ${t.name}:`, 65, tblY + 8);
  doc.fontSize(7.5).font(FONT_MONO).fillColor('#4B5563').text(t.desc, 65, tblY + 24, { width: 320 });
  tblY += 56;
});

doc.fontSize(8).font(FONT_REGULAR).fillColor('#71717A')
  .text('• Bảng mã utf8mb4 hỗ trợ lưu trữ tiếng Việt đầy đủ và icon emoji.\n• Đánh chỉ mục Index trên (room, createdAt) để tối ưu truy vấn.', 55, 375, { lineGap: 3 });

// Crontab Backup
drawCard(430, 105, 372, 385, '#FFFFFF', '#E4E4E7');
doc.fontSize(11).font(FONT_BOLD).fillColor('#047857').text('2. CHIẾN LƯỢC SAO LƯU CRONTAB (DISASTER RECOVERY)', 445, 120);

doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#52525B')
  .text('Lập lịch tự động định kỳ 02:00 sáng hàng ngày trong crontab của root:', 445, 140);

drawCard(445, 160, 342, 65, '#18181B');
doc.fontSize(8).font(FONT_MONO).fillColor('#E4E4E7')
  .text('# Lịch sao lưu tự động hàng ngày\n0 2 * * * /home/thang/project_linux/deploy/scripts/backup.sh', 455, 175, { lineGap: 4 });

doc.fontSize(8.5).font(FONT_BOLD).fillColor('#09090B').text('Quy trình xử lý của backup.sh:', 445, 240);
doc.fontSize(8).font(FONT_REGULAR).fillColor('#3F3F46')
  .text('1. Dùng mysqldump xuất CSDL nén vào /var/backups/webchat/webchat_mysql_*.sql.gz.\n2. Nén các file cấu hình hệ thống (Nginx, Systemd) vào file webchat_files_*.tar.gz.\n3. Quét và tự động xóa các file backup cũ hơn 7 ngày (find ... -mtime +7 -delete).\n4. Script restore_db.sh phục hồi CSDL tức thì từ file nén .sql.gz khi gặp sự cố.', 445, 260, { width: 330, lineGap: 4 });

drawCard(40, 505, 762, 40, '#F0FDF4', '#BBF7D0');
doc.fontSize(8.5).font(FONT_BOLD).fillColor('#166534')
  .text('Minh chứng: File backup thực tế đã được sinh tự động trong thư mục /var/backups/webchat/ và sẵn sàng phục hồi.', 55, 518);

drawFooter(7, 10);

// ==========================================
// SLIDE 8: KẾT QUẢ THỰC NGHIỆM TRÊN MẠNG LAN
// ==========================================
doc.addPage();
drawHeader(8, 10);

doc.fontSize(10).font(FONT_BOLD).fillColor('#2563EB').text('07. KẾT QUẢ THỰC NGHIỆM', 40, 50);
doc.fontSize(18).font(FONT_BOLD).fillColor('#09090B').text('Kiểm thử Trực tiếp trên Mạng LAN Máy chủ Ubuntu', 40, 68);

// 3 Metric Cards
const metrics = [
  { label: 'TRẠNG THÁI CỔNG DỊCH VỤ', val: '4 / 4 Cổng LISTEN', sub: 'Port 80 (HTTP), 443 (HTTPS), 3000 (NestJS) và 3306 (MySQL) đều đang hoạt động.' },
  { label: 'ĐỊA CHỈ IP MÁY CHỦ LAN', val: '192.168.1.138', sub: 'Laptop và điện thoại khác trong mạng WiFi truy cập và chat thời gian thực mượt mà.' },
  { label: 'DỮ LIỆU THỰC TẾ TRONG MYSQL', val: 'Verified OK', sub: 'Đã lưu vết các tin nhắn thật, kèm theo IP máy khách 192.168.1.138 và timestamp.' },
];

metrics.forEach((m, idx) => {
  const x = 40 + idx * 260;
  drawCard(x, 105, 242, 110, '#FFFFFF', '#E4E4E7');
  doc.fontSize(8).font(FONT_BOLD).fillColor('#71717A').text(m.label, x + 14, 118);
  doc.fontSize(16).font(FONT_BOLD).fillColor('#2563EB').text(m.val, x + 14, 138);
  doc.fontSize(7.5).font(FONT_REGULAR).fillColor('#52525B').text(m.sub, x + 14, 172, { width: 214, lineGap: 2 });
});

// Bảng kiểm chứng CLI
drawCard(40, 230, 762, 260, '#FFFFFF', '#E4E4E7');
doc.fontSize(9.5).font(FONT_BOLD).fillColor('#09090B').text('MINH CHỨNG KẾT QUẢ KIỂM THỬ TRÊN TERMINAL LINUX:', 55, 245);

drawCard(55, 265, 732, 140, '#18181B');
doc.fontSize(8).font(FONT_MONO).fillColor('#4ADE80')
  .text('$ sudo ss -tuln | grep -E ":(80|443|3000|3306)"\ntcp   LISTEN 0      151     127.0.0.1:3306      0.0.0.0:*   (MySQL)\ntcp   LISTEN 0      511       0.0.0.0:80        0.0.0.0:*   (Nginx HTTP)\ntcp   LISTEN 0      511       0.0.0.0:443       0.0.0.0:*   (Nginx HTTPS)\ntcp   LISTEN 0      511     127.0.0.1:3000      0.0.0.0:*   (NestJS Backend)\n\n$ mysql -u chatuser -p -D webchat_db -e "SELECT user, room, text, ipAddress FROM messages LIMIT 2;"\n| SinhVien_857 | NestJS-Backend | r  | 192.168.1.138 | 2026-10-19 21:25:24 |\n| SinhVien_856 | NestJS-Backend | ty | 192.168.1.138 | 2026-10-19 21:26:10 |', 68, 278, { lineGap: 3 });

doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#52525B')
  .text('• Kiểm thử từ Client: Mở trình duyệt gõ http://192.168.1.138/ -> Web Chat tải tức thì, chuyển 4 phòng mượt mà.\n• Kiểm thử An ninh: Thử kết nối thẳng vào cổng 3000 hoặc 3306 từ máy ngoài -> Bị UFW chặn đứng theo đúng thiết kế.', 55, 420, { lineGap: 3 });

drawCard(40, 505, 762, 40, '#EFF6FF', '#BFDBFE');
doc.fontSize(8.5).font(FONT_BOLD).fillColor('#1D4ED8')
  .text('Đường dẫn truy cập trực tiếp: http://192.168.1.138/  (hoặc http://localhost/ trên máy trạm)', 55, 518);

drawFooter(8, 10);

// ==========================================
// SLIDE 9: KỊCH BẢN TRÌNH DIỄN VẤN ĐÁP
// ==========================================
doc.addPage();
drawHeader(9, 10);

doc.fontSize(10).font(FONT_BOLD).fillColor('#2563EB').text('08. KỊCH BẢN BẢO VỆ', 40, 50);
doc.fontSize(18).font(FONT_BOLD).fillColor('#09090B').text('Kịch bản Trình diễn & Trả lời Vấn đáp trước Giảng viên', 40, 68);

const demoSteps = [
  {
    step: 'BƯỚC 1: DEMO LIVE CHAT',
    person: 'Thành viên 3 (Frontend)',
    action: 'Mở 2 trình duyệt (Laptop + Điện thoại).\nChat qua lại tức thời qua WebSocket.\nBấm chuyển 4 phòng, nạp đúng lịch sử từ MySQL.'
  },
  {
    step: 'BƯỚC 2: KILL TEST SYSTEMD',
    person: 'Thành viên 4 (DevOps Admin)',
    action: 'Mở terminal gõ: sudo kill -9 <PID>.\nWeb nháy mất kết nối.\nSau 5 giây, Systemd tự hồi sinh dịch vụ với PID mới.'
  },
  {
    step: 'BƯỚC 3: KIỂM TRA MYSQL & LOG',
    person: 'Thành viên 2 (Backend / CSDL)',
    action: 'Gõ lệnh psql/mysql trên terminal.\nThầy cô thấy tin nhắn vừa gửi và IP máy khách.\nSoi log Nginx thời gian thực bằng lệnh tail -f.'
  },
  {
    step: 'BƯỚC 4: DEMO BACKUP & UFW',
    person: 'Thành viên 1 (Trưởng nhóm)',
    action: 'Chạy sudo ufw status verbose chứng minh cô lập cổng.\nChạy script backup.sh sinh file .sql.gz.\nThử nghiệm lệnh restore_db.sh phục hồi CSDL.'
  },
];

demoSteps.forEach((s, idx) => {
  const x = 40 + idx * 195;
  drawCard(x, 105, 180, 385, '#FFFFFF', '#E4E4E7');
  doc.fontSize(9).font(FONT_BOLD).fillColor('#2563EB').text(s.step, x + 12, 120);
  doc.fontSize(8.5).font(FONT_BOLD).fillColor('#09090B').text(s.person, x + 12, 140);
  doc.rect(x + 12, 160, 156, 1).fillColor('#F4F4F5').fill();
  doc.fontSize(8).font(FONT_REGULAR).fillColor('#52525B').text(s.action, x + 12, 175, { width: 156, lineGap: 4 });
});

drawCard(40, 505, 762, 40, '#F8FAFC', '#E2E8F0');
doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#334155')
  .text('Kịch bản 4 bước được thiết kế để từng thành viên đều có phần việc trình diễn trực tiếp, chứng minh sự am hiểu sâu sắc về Linux.', 55, 518);

drawFooter(9, 10);

// ==========================================
// SLIDE 10: TỔNG KẾT & Q&A
// ==========================================
doc.addPage();
drawHeader(10, 10);

drawCard(40, 60, 762, 480, '#FFFFFF', '#E4E4E7');

doc.roundedRect(60, 80, 260, 24, 12).fillColor('#F0FDF4').fill();
doc.fontSize(9).font(FONT_BOLD).fillColor('#166534')
  .text('TIẾN ĐỘ ĐỒ ÁN: HOÀN THÀNH 100%', 75, 87);

doc.fontSize(28).font(FONT_BOLD).fillColor('#09090B')
  .text('Cảm ơn Thầy/Cô và các bạn đã chú ý lắng nghe!', 60, 140, { width: 720 });

doc.fontSize(11).font(FONT_REGULAR).fillColor('#71717A')
  .text('Nhóm 4 thành viên xin trân trọng lắng nghe các nhận xét, đánh giá và giải đáp các câu hỏi phản biện từ Giảng viên hướng dẫn.', 60, 185, { width: 700 });

doc.rect(60, 230, 722, 1).fillColor('#E4E4E7').fill();

// Tóm tắt kết quả đồ án
drawCard(60, 250, 722, 180, '#F8FAFC');
doc.fontSize(10).font(FONT_BOLD).fillColor('#09090B').text('TỔNG HỢP KẾT QUẢ ĐẠT ĐƯỢC CỦA ĐỒ ÁN SỐ 18:', 80, 268);

const summaryBullets = [
  'Đã xây dựng hoàn chỉnh Web Server Nginx với Reverse Proxy, SSL Termination và WebSocket WSS.',
  'Đã đóng gói ứng dụng NestJS thành dịch vụ Systemd tự động phục hồi sự cố (Self-Healing sau 5 giây).',
  'Đã thiết lập Cơ sở dữ liệu MySQL chuẩn 3NF lưu trữ bền vững và ghi nhận địa chỉ IP client.',
  'Đã cấu hình an ninh mạng với tường lửa UFW, chỉ mở cổng công khai 22, 80, 443 và cô lập cổng nhạy cảm.',
  'Đã tự động hóa toàn bộ việc cài đặt (deploy.sh) và lập lịch sao lưu định kỳ với Crontab (mysqldump).',
];

let sumY = 295;
summaryBullets.forEach((b) => {
  doc.circle(85, sumY + 5, 3.5).fillColor('#10B981').fill();
  doc.fontSize(8.5).font(FONT_REGULAR).fillColor('#3F3F46').text(b, 96, sumY, { width: 660 });
  sumY += 24;
});

drawCard(60, 450, 722, 45, '#EFF6FF', '#BFDBFE');
doc.fontSize(9).font(FONT_BOLD).fillColor('#1D4ED8')
  .text('SẴN SÀNG CHO PHIÊN HỎI ĐÁP & VẤN ĐÁP PHẢN BIỆN (Q&A SESSION)', 75, 466);

drawFooter(10, 10);

doc.end();
console.log('PDF generated successfully at:', OUTPUT_PDF);
