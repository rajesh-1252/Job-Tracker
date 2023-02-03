import express from "express";
import rateLimiter from "express-rate-limit";

const router = express.Router();
import {
  register,
  login,
  updateUser,
  getCurrentUser,
  logout,
} from "../controllers/authControllers.js";
import authenticateUser from "../middleware/auth.js";
import testUser from "../middleware/testUser.js";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this Ip, Please try again",
});

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);
router.route("/logout", logout);

router.route("/updateUser").patch(authenticateUser, testUser, updateUser);
router.route("/getCurrentUser").get(getCurrentUser);
export default router;
