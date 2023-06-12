

module.exports.load = (api) => {
    // for preflight
    api.options('/*', (req, res) => {
      res.cors().send({});
    });

};
