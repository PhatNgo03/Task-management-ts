import { Request, Response} from "express";
import Task from "../models/task.model";

// [GET] /api/v1/tasks
export const index = async (req: Request, res : Response) => {
  try {
    const tasks = await Task.find({
      deleted: false
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách tasks" });
  }
};

// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res : Response) => {
  try {
    const id: string = req.params.id;
    const tasks = await Task.find({
      _id: id,
      deleted: false
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách tasks" });
  }
};
