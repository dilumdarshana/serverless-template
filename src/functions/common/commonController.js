const controller = require('#src/controller');
const {
    status: statusService,
} = require('./commonService');

/**
 * Controller function to process application healthcheck.
 * @param req - Http request
 * @param res - Http response
 */
const healthChecker = (req, res) => controller(req, res, {
    validator: null,
    service: statusService,
});

module.exports = {
    healthChecker,
};
