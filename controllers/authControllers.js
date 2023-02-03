import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import { allValuesError } from "../utils/allValuesError.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  allValuesError([name, email, password]);

  const userAlreadyExist = await User.findOne({ email });
  if (userAlreadyExist) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
    },
    token,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  allValuesError([email, password]);
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};
const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;

  allValuesError([email, name, lastName, location]);

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user,
    token,
    location: user.location,
  });
};

const getCurrentUser = async (req, res) => {
  res.send("getcurrentUser");
};

const logout = async (req, res) => {
  res.json({ logout: "logout" });
};

export { register, login, updateUser, getCurrentUser, logout };
