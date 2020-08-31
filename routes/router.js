const homeRouter = require('./home/homeRouter');
const apiRouter = require('./api/apiRouter');
const platformRouter = require('./platform/platformRouter');

module.exports = {
    home: homeRouter, 
    api: apiRouter, 
    platform: platformRouter
};