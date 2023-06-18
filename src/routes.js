const healthChecker = require('#functions/common/commonController');

module.exports.load = (api) => {
  // for preflight
  api.options('/*', (req, res) => {
    res.cors().send({});
  });

  api.post('/common/status', healthChecker, null);
};
