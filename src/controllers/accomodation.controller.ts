import { type Request, type Response, type NextFunction } from "express";
import { makeAccomodation } from "../services/accomodation.service";
import cloudinary from "../utils/cloudinary";
import { getMessage } from "../utils/errors";
import { getStatusCode } from "../utils/errors";

export const createAccomodationHandler = async (
  req: Request<unknown, unknown>,
  res: Response,
  next:NextFunction
)=> {
  try {
    // console.log(req.body);
        
    const {
      destinationName,
      address,
      contact,
      description,
      websiteUrl,
      centerImage,
      rooms,
    } = req.body;

    if(!rooms?.length){
      // next(new Error('Add the rooms on this accomodation.'))
      return res.status(400).send({
        success: false,
        message: 'Add the rooms on this accomodation.'
      })
    }

    const theResult = await cloudinary.uploader.upload(centerImage[0], {
      public_id: `bn-image-store/${req.body.destinationName}`,
    });

    if(theResult.url){
      
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
      return res.status(200).json({
        status: "success",
        accomodation,
      });
    }

    
  } catch (err: unknown) {
    return res.status(getStatusCode(err)).send({
      success: false,
      message: getMessage(err)
    })
  }
};
