import { type Request, type Response, type NextFunction } from "express";
import { makeAccomodation } from "../services/accomodation.service";
import cloudinary from "../utils/cloudinary";

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
      rooms,
    } = req.body;

    const theResult = await cloudinary.uploader.upload(centerImage[0], {
      public_id: `bn-image-store/${req.body.destinationName}`,
    });

    const accomodation = await makeAccomodation({
      destinationName,
      address,
      contact,
      description,
      websiteUrl,
      centerImage: theResult.url,
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
