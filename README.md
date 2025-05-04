# Hệ Thống Đặt Phòng Học Tập HCMUT

Hệ thống quản lý và đặt phòng học tập trực tuyến cho sinh viên Đại học Bách Khoa TP.HCM.

## Tính Năng

### Cho Sinh Viên
- Đăng ký tài khoản
- Đăng nhập vào hệ thống
- Xem danh sách phòng học
- Đặt phòng học theo thời gian
- Xem lịch sử đặt phòng
- Đánh giá phòng học
- Nhận thông báo về trạng thái đặt phòng

### Cho Quản Trị Viên
- Đăng ký tài khoản quản trị viên (yêu cầu mã xác thực)
- Đăng nhập vào hệ thống
- Quản lý thông tin người dùng
- Quản lý danh sách phòng học
- Xem thống kê sử dụng phòng
- Quản lý đơn đặt phòng
- Gửi thông báo đến người dùng

## Công Nghệ Sử Dụng

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt Password Hashing

### Frontend
- React.js
- Material-UI
- React Router
- Axios
- Redux (nếu cần)

## Cài Đặt và Chạy

### Yêu Cầu Hệ Thống
- Node.js (v14 trở lên)
- MongoDB
- npm hoặc yarn

### Cài Đặt Backend
```bash
cd backend
node server.js
```

### Cài Đặt Frontend
```bash
cd frontend
npm install
```

### Cấu Hình Môi Trường
1. Tạo file `.env` trong thư mục backend:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hcmut_study_space
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

2. Tạo file `.env` trong thư mục frontend:
```
REACT_APP_API_URL=http://localhost:5000
```

### Chạy Ứng Dụng
1. Khởi động MongoDB
2. Chạy backend:
```bash
cd backend
npm start
```
3. Chạy frontend:
```bash
cd frontend
npm start
```

## Giấy Phép
