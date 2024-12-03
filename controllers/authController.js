import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);
      //check if email exists:
      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (findUser) {
        return res.status(400).json({
          errors: {
            email: "Email already registered, login instead.",
          },
        });
      }
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);
      const user = await prisma.users.create({
        data: payload,
      });

      return res.json({
        status: 200,
        message: "User created successfully",
        user,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // array created by SimpleErrorReporter
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong on the server side.",
        });
      }
    }
  }

  static async login(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(loginSchema);
      const payload = await validator.validate(body);
      //find user with email
      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });
      // Check if user exists
      if (!findUser) {
        return res.status(404).json({
          message: "User not found with this email",
        });
      }
      // Verify the password
      if (!bcrypt.compareSync(payload.password, findUser.password)) {
        return res.status(400).json({
          errors: {
            message: "Password incorrect",
          },
        });
      }
      // If login is successful,issue a jwt token to the user
      const token = jwt.sign(
        { userId: findUser.id, userEmail: findUser.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "365d",
        }
      );
      const {password,...userWithoutPassword}= findUser
      return res.json({
        message: "Logged In",
        user: userWithoutPassword,
        token:`Bearer ${token}`,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // array created by SimpleErrorReporter
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong on the server side.",
        });
      }
    }
  }
}
export default AuthController;
