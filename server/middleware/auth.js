import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const testUser = userId === "63d75358773f9459d02f2934";
    req.user = { userId, testUser };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
};

export default auth;
