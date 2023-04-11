import { User } from "@prisma/client";
import { type Request, type Response, type NextFunction, query } from "express";

import {
  getAllUsersService,
  updateUserProfileService,
  getUserbyId,
} from "../services/user.service";

/*
Author: Merlyne Iradukunda
Date: April 4, 2023
*/

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    console.log(req)
    console.log(id)
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body)
    console.log({ data: req.body });
    const profile = await updateUserProfileService(
      { id },
      { firstName, lastName, email, password }
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
