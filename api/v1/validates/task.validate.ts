import { Request, Response, NextFunction } from "express";

const validate: any = {};

// Hàm kiểm tra dữ liệu đầu vào khi tạo mới task
validate.create = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "Vui lòng nhập tiêu đề!" });
  }
  if (!req.body.status) {
    return res.status(400).json({ message: "Vui lòng nhập trạng thái công việc!" });
  }
  if (!req.body.content) {
    return res.status(400).json({ message: "Vui lòng nhập nội dung!" });
  }
  next();
};

// Hàm kiểm tra dữ liệu đầu vào khi chỉnh sửa task
validate.edit = (req: Request, res: Response, next: NextFunction) => {
  const { title, status, content } = req.body;

  if (title !== undefined && title.trim().length < 5) {
    return res.status(400).json({ message: "Tiêu đề phải có ít nhất 5 ký tự!" });
  }

  if (status !== undefined && status.trim() === "") {
    return res.status(400).json({ message: "Trạng thái không được để trống!" });
  }

  if (content !== undefined && content.trim().length < 5) {
    return res.status(400).json({ message: "Nội dung phải có ít nhất 5 ký tự!" });
  }

  next();
}

export default validate;
