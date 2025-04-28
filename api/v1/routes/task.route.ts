import { Router } from "express";
const router: Router = Router();
import * as controller from "../controller/task.controller";
import validate from "../validates/task.validate";

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.post("/create", validate.create, controller.create);

router.patch("/edit/:id",validate.edit, controller.edit);

router.delete("/delete/:id", controller.deleteItem);
export const taskRoutes: Router = router;
