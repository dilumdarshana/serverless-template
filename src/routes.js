const healthChecker = require('#functions/common/commonController');

module.exports.load = (api) => {
  // for preflight
  api.options('/*', (req, res) => {
    res.cors().send({});
  });

  // common route
  api.post('/common/status', healthChecker, null);

  // todo routes
};
