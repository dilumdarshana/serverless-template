const { clean, validate } = require('#utils/validationHelper');
const {
  createTodo: createTodoSchema,
} = require('./todoSchema');

const createTag = async ({ body } = {}) => {
  const attributes = clean(body);

  return validate(attributes, createTodoSchema);
};

module.exports = {
  createTag,
};
