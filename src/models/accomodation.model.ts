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
    accomodationFacility: string({
      required_error: "The accomdation facility is required",
    }),
    centerImage: string({
      required_error: "The accomdation facility image is required",
    }),
    numberOfRooms: number({
      required_error: "Number of rooms is required",
    }),
    rooms: z.array(z.object({})),
  }),
});

export const roomSchema = object({
  body: object({
    roomName: string({
      required_error: "Room name is required",
    }),
    roomType: z.optional(z.nativeEnum(RoomType)),
    accomodationId: string({
      required_error: "Accomodation id is required",
    }),
  }),
});

export type accomodationInput = TypeOf<typeof accomodationSchema>["body"];
export type roomInput = TypeOf<typeof roomSchema>["body"];
