import { Request, Response} from "express";
import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";
// [GET] /api/v1/tasks
export const index = async (req: Request, res : Response) => {
  try {
    //Find
    interface Find{
      deleted: boolean,
      status?: string,
      title?: string | { $regex: string, $options: string };
    }

    const find: Find = {
      deleted: false
    }
    if(req.query.status) {
      find.status = req.query.status.toString();
    }
    //End Find

    //Sort
    const sort: { [key: string]: any } = {};

    if(req.query.sortKey && req.query.sortValue){
      const sortKey = req.query.sortKey.toString();
        sort[sortKey]= req.query.sortValue;
    }
    //End sort
    //Pagination
    let initPagination = {
      currentPage: 1,
      limitItems: 2,
      skip: 0,
      totalPage: 0
    }
    const countTasks = await Task.countDocuments(find);
    let objectPagination = paginationHelper(
      initPagination,
      req.query,
      countTasks 
    )
    //End Pagination

    //Search 
    let objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
      find.title = { $regex: objectSearch.keyword, $options: 'i' };
      }
    //End Search

    const tasks = await Task.find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);


   
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


//[PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req:Request, res: Response) => {
  try{
    const id: string = req.params.id;
    const status: string = req.body.status;

    await Task.updateOne({
      _id: id, 
    }, {
      status: status
    });
    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!"
    });
  }
  catch (error){
    res.json({
      code: 404,
      message: "Không tồn tại!"
    });
  }
  
}