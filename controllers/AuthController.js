import vine, { errors } from "@vinejs/vine";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";
import prisma from "../DB/db.Config.js";
import jwt from "jsonwebtoken";

export const authController = async (req, res) => {
  try {
    const body = req.body;
    const validator = vine.compile(registerSchema);
    const paylode = await validator.validate(body);

    // chcek emial is unique

    const findUser = await prisma.users.findUnique({
      where: {
        email: paylode.email,
      },
    });

    if (findUser) {
      return res.status(400).json({
        message: "user already exist",
      });
    }

    // encrypt the pass with using bcrypt
    const salt = bcrypt.genSaltSync(10);
    paylode.password = bcrypt.hashSync(paylode.password, salt);

    const user = await prisma.users.create({
      data: paylode,
    });

    return res.status(200).json({
      message: "user created successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      console.log(error.messages);
      return res.status(400).json({
        error: error.messages,
        message: "something went wrong plese try again later",
      });
    }
  }
};

export const login = async (req, res) => {
  try {
    const body = req.body;
    const validator = vine.compile(loginSchema);
    const paylode = await validator.validate(body);

    // find user and check  emial id alredy exist krti ha ya nhi

    const findUser = await prisma.users.findUnique({
      where: {
        email: paylode.email,
      },
    });

    if (findUser) {
      if (!bcrypt.compareSync(paylode.password, findUser.password)) {
        return res.status(400).json({
          errors: {
            email: "invalid credentials",
          },
        });
      }
      //issued token
      const paylodeData = {
        id: findUser.id,
        email: findUser.email,
        profile: findUser.profile,
        name: findUser.name,
      };

      const token = jwt.sign(paylodeData,process.env.JWT_SECRET,{
        expiresIn:"365d",
      });

      return res.status(200).json({
        message: "logeed in",
        access_token :`Bearer ${token}`,
      });
    }

    return res.status(200).json({
      errors: {
        email: "no email found",
      },
    });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      console.log(error.messages);
      return res.status(400).json({
        error: error.messages,
        message: "something went wrong plese try again later",
      });
    }
  }
};
