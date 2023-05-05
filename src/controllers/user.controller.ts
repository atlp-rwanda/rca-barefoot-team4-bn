import { type Request, type Response, type NextFunction } from "express";
import { type ChangeRoleInput } from "../models/user.model";
import { changeUserRole, getAllUsersService, updateUserProfileService, getUserbyId, findUniqueUser } from "../services/user.service";
import bcrypt from "bcryptjs";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const changeRoleHandler = async (
  req: Request<any, ChangeRoleInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const newRole = req.body.newRole;
    const result = await changeUserRole(req.params.userId, newRole);
    res.status(201).json({
      status: "Success",
      user: result,
    });
  } catch (err: any) {
    res.status(400).json({
      status: "fail",
      message: req.t('action_failed'),
    });
    next(err);
  }
};


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
    const user = await findUniqueUser({id:res.locals.user.id});
    
    res
      .status(200)
      .json({ message: "Users retrieved successfully", user });
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
