import { type Request, type Response, type NextFunction } from "express";
import {
  makeAccomodation,
  // createRoom,
} from "../services/accomodation.service";

export const createAccomodationHandler = async (
  req: Request<unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      destinationName,
      address,
      contact,
      description,
      websiteUrl,
      centerImage,
      numberOfRooms,
      rooms,
    } = req.body;

    const accomodation = await makeAccomodation({
      destinationName,
      address,
      contact,
      description,
      websiteUrl,
      centerImage,
      rooms: {
        createMany: {
          data: [...rooms],
        },
      },
    });

    res.status(200).json({
      status: "success",
      accomodation,
    });
  } catch (error: any) {
    next(error);
  }
};
