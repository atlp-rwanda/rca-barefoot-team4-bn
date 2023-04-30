import { object, number, string, type TypeOf, z } from "zod";

enum RoomType {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  DELUXE = "DELUXE",
  PRESIDENTIAL = "PRESIDENTIAL",
  STUDIO = "STUDIO",
}

export const accomodationSchema = object({
  body: object({
    destinationName: string({
      required_error: "The destination name is required",
    }),
    address: string({
      required_error: "The address is required",
    }),
    contact: string({
      required_error: "The contact is required",
    }),
    description: string({
      required_error: "The description is required",
    }),
    websiteUrl: string(),
    centerImage: string({
      required_error: "The accomdation facility image is required",
    }),
    rooms: z.array(z.object({})),
  }),
});

export const roomSchema = object({
  body: object({
    roomName: string({
      required_error: "Room name is required",
    }),
    roomAmount: string({ required_error: "Please, provide the amount." }),
    numberOfRooms: number(),
    // roomType: z.optional(z.nativeEnum(RoomType)),
    accomodationId: string({
      required_error: "Accomodation id is required",
    }),
  }),
});

export type accomodationInput = TypeOf<typeof accomodationSchema>["body"];
export type roomInput = TypeOf<typeof roomSchema>["body"];
