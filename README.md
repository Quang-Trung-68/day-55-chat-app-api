# F8 Chat App - Backend

Backend Server của dự án Chat App, được phát triển bằng Node.js và Express.

## Công nghệ & Kiến trúc
- **Framework:** Express.js
- **Database ORM:** Prisma
- **Real-time:** Hỗ trợ kết nối Pusher Protocol (dùng Soketi lưu trữ server local)
- **Background Jobs:** Tích hợp bộ xử lý hàng đợi (Queue) dùng để gửi email xác thực không làm chậm luồng chính.

## Hướng dẫn cài đặt

1. **Cài đặt Dependencies:**
   ```bash
   npm install
   ```

2. **Cài đặt Biến môi trường:**
   Sao chép file `.env.example` thành `.env` và khai báo cấu hình Database, App URL bảo mật token.
   ```bash
   cp .env.example .env
   ```

3. **Thiết lập Database:**
   Đảm bảo kết nối tới MySQL và đẩy schema:
   ```bash
   npx prisma db push
   # hoặc npx prisma migrate dev
   ```

4. **Khởi động Server:**
   Chạy lệnh sau để khởi động API:
   ```bash
   npm run dev
   # API phục vụ tại http://localhost:3000
   ```


5. **Khởi động Soketi (Cho Real-time):**
   ```bash
   nvm use 18 && soketi start --config=soketi.json
   ```
   Bạn cần có server Soketi chạy tại local để phục vụ nhắn tin thời gian thực. (Port mặc định: 6001). Cấu hình chi tiết có trong `soketi.json`.
