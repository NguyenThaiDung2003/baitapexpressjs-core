# Hệ Thống Blog Nhiều Vai Trò (Role-Based Access Control Blog API)

Hệ thống API quản lý Bài viết (**Post**) và Bình luận (**Comment**) xây dựng bằng Node.js, ExpressJS theo kiến trúc MVC, hỗ trợ phân quyền xác thực 2 tầng, upload file ảnh đính kèm và xử lý xóa dây chuyền (Cascade Delete).

---

## 1. Bảng Liệt Kê Chi Tiết Endpoints

| Method | Endpoint | Description | Middleware Áp Dụng | Role Yêu Cầu |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/posts` | Lấy danh sách tất cả bài viết | Không có | Public |
| **POST** | `/api/posts` | Tạo bài viết mới (kèm upload ảnh `thumbnail`) | `upload.single('thumbnail')` | Public |
| **GET** | `/api/posts/:id` | Xem chi tiết bài viết và danh sách bình luận liên quan | Không có | Public |
| **DELETE** | `/api/posts/:id` | Xóa bài viết và tự động xóa toàn bộ comment liên quan (ON DELETE CASCADE) | `authenticate` $\rightarrow$ `authorize('admin')` | **Admin** |
| **POST** | `/api/comments` | Thêm bình luận mới vào bài viết | `authenticate` | **User** hoặc **Admin** |

---

## 2. Kịch Bản Test (Test Cases)

Dưới đây là 5 kịch bản test chính minh chứng cơ chế phân quyền 2 tầng (`authenticate`, `authorize`) và quan hệ ràng buộc giữa Post – Comment hoạt động chính xác.

### Kịch Bản 1: Tạo Bình Luận Khi Chưa Đăng Nhập (Xác thực thất bại)
* **Request:** `POST /api/comments`
* **Headers:** Không gửi header `Authorization`.
* **Body:**
  ```json
  {
    "postId": 1,
    "content": "Bài viết rất hay!"
  }
Status Code Mong Đợi: 401 Unauthorized

Response Mong Đợi:

JSON
{
  "success": false,
  "message": "Chưa đăng nhập"
}
Kịch Bản 2: User Thường Thực Hiện Xóa Bài Viết (Phân quyền thất bại)
Request: DELETE /api/posts/1

Headers: Authorization: user

Body: Không có.

Status Code Mong Đợi: 403 Forbidden

Response Mong Đợi:

JSON
{
  "success": false,
  "message": "Không đủ quyền truy cập"
}
Kịch Bản 3: Tạo Bình Luận Cho Post Không Tồn Tại (Kiểm tra quan hệ 1 - Nhiều)
Request: POST /api/comments

Headers: Authorization: user

Body:

JSON
{
  "postId": 9999,
  "content": "Bình luận vào bài viết không tồn tại"
}
Status Code Mong Đợi: 404 Not Found

Response Mong Đợi:

JSON
{
  "success": false,
  "message": "Bài viết không tồn tại"
}
Kịch Bản 4: Admin Thực Hiện Xóa Bài Viết & Kiểm Tra Cascade Delete Comment
Bước 1 (Xóa Bài Viết):

Request: DELETE /api/posts/1

Headers: Authorization: admin

Status Code Mong Đợi: 200 OK

Response Mong Đợi:

JSON
{
  "success": true,
  "message": "Xóa bài viết và toàn bộ bình luận liên quan thành công"
}
Bước 2 (Kiểm tra Cascade Delete):

Request: GET /api/posts/1

Status Code Mong Đợi: 404 Not Found (Xác nhận Post và toàn bộ Comment của Post ID 1 đã bị xóa khỏi hệ thống).

Kịch Bản 5: Tạo Bài Viết Mới Kèm Upload Thumbnail Thành Công
Request: POST /api/posts

Headers: Content-Type: multipart/form-data

Body (form-data):

title: "Hướng dẫn lập trình ExpressJS"

content: "Nội dung bài viết hướng dẫn..."

thumbnail: File ảnh (.png hoặc .jpg, size < 2MB)

Status Code Mong Đợi: 201 Created

Response Mong Đợi:

JSON
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Hướng dẫn lập trình ExpressJS",
    "content": "Nội dung bài viết hướng dẫn...",
    "thumbnailUrl": "/uploads/thumbnail-1724000000000.png"
  }
}