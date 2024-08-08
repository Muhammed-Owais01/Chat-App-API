import { Router } from "express";
import checkAuth from "../middleware/check-auth";
import MessageController from "../controllers/message";
import asyncHandler from "../utils/asyncHandler";

const router: Router = Router();

router.get('/msg/:messageId', checkAuth, asyncHandler(MessageController.get_message));

router.get('/:receiverId', checkAuth, asyncHandler(MessageController.get_all_messages));

router.patch('/:messageID', checkAuth, asyncHandler(MessageController.update_message));

router.delete('/:messageId', checkAuth, asyncHandler(MessageController.delete_message));

export default router;