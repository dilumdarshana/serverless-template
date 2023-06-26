const { healthChecker } = require('#functions/common/commonController');
const { createTodo } = require('#functions/todo/todoController');

module.exports.load = (api) => {
  // for preflight
  api.options('/*', (req, res) => {
    res.cors().send({});
  });

  // common route
  api.post('/common/status', healthChecker);

  // todo routes
  api.post('/todo', createTodo);
};
