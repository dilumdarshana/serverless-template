const controller = require('#src/controller');
const { createTodo: createTodoService } = require('./todoService');
const { createTag: createTagValidator } = require('./todoValidation');

const createTodo = (req, res) => controller(req, res, {
  validator: createTagValidator,
  service: createTodoService,
});

module.exports = {
  createTodo,
};
