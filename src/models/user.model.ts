import { object, string, type TypeOf, z } from "zod";

enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  TRAVEL_ADMINISTRATOR = "TRAVEL_ADMINISTRATOR",
  TRAVEL_TEAM_MEMBER = "TRAVEL_TEAM_MEMBER",
  MANAGER = "MANAGER",
  REQUESTER = "REQUESTER",
  USER = "USER",
}

export const registerUserSchema = object({
  body: object({
    firstName: string({
      required_error: "First name is required",
    }),
    lastName: string({
      required_error: "last name is required",
    }),
    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
    password: string({
      required_error: "Password is required",
    })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string({
      required_error: "Please confirm your password",
    }),
    role: z.optional(z.nativeEnum(Role)),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
    password: string({
      required_error: "Password is required",
    }).min(8, "Invalid email or password"),
  }),
});

// export the inferred TS types of schemas with the typeOf<>
export type RegisterUserInput = Omit<
  TypeOf<typeof registerUserSchema>["body"],
  "passwordConfirm"
>;

export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];
