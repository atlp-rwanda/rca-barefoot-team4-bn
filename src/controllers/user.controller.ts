import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import {
  getAllUsersService,
  updateUserProfileService,
  getUserbyId,
} from "../services/user.service";

/*
Author: Merlyne Iradukunda
Date: April 4, 2023
*/

export const getAllUsers = async (res: Response): Promise<void> => {
  try {
    const users = await getAllUsersService();
    res
      .status(200)
      .json({ message: "Users retrieved successfully", payload: users });
  } catch (error: any) {
    res.status(500).send({
      status: "fail",
      error,
    });
  }
};

export const getUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getUserbyId({ id: req.params.id });
    res
      .status(200)
      .json({ message: "Users retrieved successfully", payload: users });
  } catch (error: any) {
    res.status(500).send({
      status: "fail",
      error,
    });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const profile = await updateUserProfileService(
      { id },
      { firstName, lastName, email, password: hashedPassword }
    );
    res.status(200).json({
      message: "User Updated",
      payload: profile,
    });
  } catch (error: any) {
    res.status(500).send({
      status: "fail",
      error,
    });
  }
};
