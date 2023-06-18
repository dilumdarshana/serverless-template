const api = require('lambda-api')({ version: 'v1.0', base: '/v1' });
const routes = require('./routes');
const cors = require('./middlewares/cors');

api.use(cors);
routes.load(api);

module.exports.run = async (event, context) => {
  try {
    return api.run(event, context);
  } catch (err) {
    throw new Error('Unknown error occurred, handler.js');
  }
};
