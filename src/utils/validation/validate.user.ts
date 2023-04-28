import Joi from "joi";

// use Joi to validate user input
export function validateUserInput(body: object): Joi.ValidationResult<any> {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    passwordConfirm: Joi.ref("password"),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(
      "SUPER_ADMIN",
      "TRAVEL_ADMIN",
      "TRAVEL_TEAM_MEMBER",
      "MANAGER",
      "REQUESTER",
      "USER"
    ),
    photo: Joi.string().allow(null),
  });
  return schema.validate(body);
}

export function validateResetPasswordInput(
  input: object
): Joi.ValidationResult<any> {
  const schema = Joi.object({
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.ref("password"),
    token: Joi.string().required(),
  });

  return schema.validate(input);
}
