const Joi = require('joi');

const createTodo = () => Joi.object().keys({
  task: Joi.string().required().label('Task'),
});

module.exports = {
  createTodo,
};
