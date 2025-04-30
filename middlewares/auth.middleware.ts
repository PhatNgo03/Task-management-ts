import { Request, Response, NextFunction } from "express";
import User from "../api/v1/models/user.model";

export const requireAuth = async (req: Request, res: Response, next : NextFunction) : Promise<void> => {
 if(req.headers.authorization){
  const token: string = req.headers.authorization.split(" ")[1];
  
  const user = await User.findOne({
    tokenUser: token,
    deleted : false
  }).select("-password -tokenUser");

  if(!user){
    res.json({
      code : 400, 
      message: "Token không hợp lệ!"
    });
    return;
  }

  (req as any).user = user; 
  next();

} else{
  res.json({
    code:400,
    message: "Vui lòng gửi kèm token!"
  })
}
}