import Joi from "joi";

// use Joi to validate user input
export function validateUserInput(body: object): Joi.ValidationResult<any> {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    passwordConfirm: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(
      "SUPER_ADMIN",
      "TRAVEL_ADMINISTRATOR",
      "TRAVEL_TEAM_MEMBER",
      "MANAGER",
      "REQUESTER",
      "USER"
    ),
    photo: Joi.string().allow(null),
  });
  return schema.validate(body);
}
