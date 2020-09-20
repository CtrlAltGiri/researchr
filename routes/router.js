const homeRouter = require('./home/homeRouter');
const apiRouter = require('./api/apiRouter');
const platformRouter = require('./platform/platformRouter');
const studentPlatformRouter = require('./platform/studentPlatformRouter');
const professorPlatformRouter = require('./platform/professorPlatformRouter');
const externalPlatformRouter = require('./platform/externalPlatformRouter');

module.exports = {
    home: homeRouter, 
    api: apiRouter, 
    platform: platformRouter,
    student: studentPlatformRouter,
    professor: professorPlatformRouter,
    external: externalPlatformRouter
};
