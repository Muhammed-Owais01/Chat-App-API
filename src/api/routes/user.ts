import UserController from "../controllers/user";
import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import checkAuth from "../middleware/check-auth";

const router: Router = Router();

router.get('/:userId', asyncHandler(UserController.get_user_by_id));

router.get('/username/', asyncHandler(UserController.get_user_by_name));

router.get('/', checkAuth, asyncHandler(UserController.get_all_friends));

router.post('/signup', asyncHandler(UserController.user_signup));

router.post('/login', asyncHandler(UserController.user_login));

router.post('/:receiverId', checkAuth, asyncHandler(UserController.add_friend));

router.patch('/:userId', checkAuth, asyncHandler(UserController.update_user));

router.delete('/:userId', checkAuth, asyncHandler(UserController.delete_user));

export default router;