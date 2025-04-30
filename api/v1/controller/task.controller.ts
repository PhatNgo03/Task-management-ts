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


//[PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try{
    const ids: string = req.body.ids;
    const key: string = req.body.key;
    const value: string = req.body.value;

    enum KEY {
      STATUS = "status",
      DELETE = "delete"
    }
    switch (key) {
      case KEY.STATUS: 
        await Task.updateMany({
          _id: {$in : ids}
        }, {
          status: value
        });
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công!"
        });
        break;
      case KEY.DELETE: 
        await Task.updateMany({
          _id: {$in : ids}
        }, {
          deleted: true,
          deletedAt: new Date()
        });
        res.json({
          code: 200,
          message: "Xóa thành công!"
        });
        break;
      default:
        res.json({
          code: 404,
          message: "Không tồn tại!"
        });
        break;
    }

  }
  catch (error){
    res.json({
      code: 404,
      message: "Không tồn tại!"
    });
  }
}

//[POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
  try{
    const task = new Task(req.body);
    const data = await task.save();

    res.json({
      code: 200,
      message: "Tạo thành công!",
      data: data
    })
  }
  catch (error){
    res.json({
      code: 400,
      message: "LỖI"
    });
  }
}

//[PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
  try{
    const id = req.params.id;
    
    await Task.updateOne({ _id: id}, req.body);

    res.json({
      code: 200,
      message: "Cập nhật thành công!",
    })
  }
  catch (error){
    res.json({
      code: 400,
      message: "LỖI"
    });
  }
}

//[DELETE] /api/v1/tasks/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try{
    const id = req.params.id;
    
    await Task.updateOne({ _id: id},
      {
        deleted: true,
        deletedAt: new Date()
      });

    res.json({
      code: 200,
      message: "Xóa thành công!",
    })
  }
  catch (error){
    res.json({
      code: 400,
      message: "LỖI"
    });
  }
}