const Joi = require("joi");
const { responseValidator } = require("../helper/response");

const validatorTodoList = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number(),
    title: Joi.string().required(),
    bodyNotes: Joi.string().required(),
  }).required();
  const { error, value } = schema.validate(req?.body);
  responseValidator(req, res, next, error, value);
};
const validatorUser = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number(),
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).required();
  const { error, value } = schema.validate(req?.body);
  responseValidator(req, res, next, error, value);
};

module.exports = {
  validatorTodoList,
  validatorUser,
};
