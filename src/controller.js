/**
 * Base controller
 */
const { defaultReject, defaultResolve } = require('#utils/responseHelper');

/**
 *
 * @param {*} req Http request
 * @param {*} res Http response
 * @param {*} params Additional parameters
 * @returns
 */
const controller = async (req, res, params) => {
  const resolve = params.resolve || defaultResolve;
  const reject = params.reject || defaultReject;

  try {
    const attributes = params.validator ? await params.validator(req) : {};

    if (req.cookies) {
      attributes.cookies = req.cookies;
    }
    if (req.headers) {
      attributes.headers = req.headers;
    }
    if (req.query) {
      attributes.query = req.query;
    }
    if (req.params) {
      attributes.params = req.params;
    }

    // custom attributes which are not sent by the user
    const { requestContext: { authorizer: { lambda: extraData } = {} } } = req;

    const data = await params.service(attributes, extraData);

    return resolve(res, data);
  } catch (err) {
    return reject(err, res, req);
  }
};

module.exports = controller;
