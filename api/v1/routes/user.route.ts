import { Router } from "express";
const router: Router = Router();
import * as controller from "../controller/user.controller";
import * as validate from "../validates/user.validate";
import { requireAuth } from "../../../middlewares/auth.middleware";

router.post("/register", validate.register, controller.register);
router.post("/login", validate.login, controller.login);
router.get("/detail", requireAuth,  controller.detail);
export const userRoutes : Router = router;