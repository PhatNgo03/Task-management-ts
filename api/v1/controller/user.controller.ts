import { Request, Response} from "express";
import md5 from "md5";
import User from "../models/user.model";
import { generateRandomString } from "../../../helpers/generate";

//  [POST] /api/v1/users/register
export const register = async(req: Request, res: Response) : Promise<void> => {
  try{
    req.body.password =  md5(req.body.password);
    req.body.tokenUser = generateRandomString(30);
    const existEmail = await User.findOne({
      email : req.body.email,
      deleted: {$ne : true } //account chua bi xoa
    });
  
    if (existEmail) {
      res.status(400).json({ code: 400, message: "Tài khoản đã tồn tại" });
      return;
    }
    else {
      const user = new User({
        fullName : req.body.fullName,
        email: req.body.email,
        password : req.body.password,
        tokenUser: req.body.tokenUser
      });

      await user.save();

      const token = user.tokenUser;
      res.cookie("token", token);

      res.json({
        code: 200,
        message: "Tạo tài khoản thành công!",
        token:  token
      });
    }
  }
  catch(error) {
    res.json({
      code: 400,
      message: "Lỗi đăng kí tài khoản"
    });
  }
}

//  [POST] /api/v1/users/login
export const login = async(req: Request, res: Response) : Promise<void> => {
  try{
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      email : email,
      deleted : {$ne: true}
    });

    if(!user){
      res.json({
        code: 400,
        message: "Email không tồn tại!"
      });
      return;
    }

    if(md5(password) != user.password){
      res.json({
        code : 400, 
        mesage: "Sai mật khẩu!"
      });
    }

    const tokenUser = user.tokenUser;
    res.cookie("token", tokenUser);

    res.json({
      code : 200,
      message: "Đăng nhập thành công!"
    })
  }
  catch(error){
    res.json({
      code: 400,
      message:"Lỗi đăng nhập tài khoản!"
    })
  }
}

// [GET] /api/v1/users/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
  const id: string = req.params.id;
  const user = await User.findOne({
    _id: id,
    deleted: false,
  }).select("-password -tokenUser");

  res.json({
    code: 200,
    message: "Lấy ra thông tin user thành công!",
    infoUser: user
  })
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!"
    });
  }


 
}