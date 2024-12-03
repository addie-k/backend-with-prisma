import { Router } from "express";
import authMiddleware from "../middleware/Authenticate.js"
import AuthController from "../controllers/authController.js";
import ProfileController from "../controllers/profileController.js";
import NewsController from "../controllers/newsController.js";

const router = Router()
router.post('/auth/register',AuthController.register)
router.post('/auth/login',AuthController.login)

//profile routes:
router.get('/profile',authMiddleware,ProfileController.index) //private route
router.put('/profile/:id',authMiddleware,ProfileController.update)

//news routes:
router.get('/news',authMiddleware,NewsController.index)
router.post('/news',authMiddleware,NewsController.store)
router.get('/news/:id',authMiddleware,NewsController.show)
router.put('/news/:id',authMiddleware,NewsController.update)
router.delete('/news/:id',authMiddleware,NewsController.destroy)



export default router