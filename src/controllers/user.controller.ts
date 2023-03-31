import { type Request, type Response, type NextFunction } from "express";
import { makeAdmins } from "../services/user.service";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const makeAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newRole = req.body.newRole;
    const result = await makeAdmins(req.params.userId, newRole);
    res.status(201).json({
      status: "Success",
      user: result,
    });
  } catch (err: any) {
    res.status(400).json({
      status: "fail",
      message: "Action failed.",
    });
    next(err);
  }
};

//       res.status(201).json({
//         status: "Success",
//         possibleValues:
//           "SUPER_ADMIN,TRAVEL_ADMINISTRATOR,TRAVEL_TEAM_MEMBER, MANAGE, REQUESTER,USER",
//       });
