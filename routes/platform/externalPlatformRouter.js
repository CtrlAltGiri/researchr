const externalPlatformRouter = require('express').Router();
const path = require('path');

externalPlatformRouter.get("/*", function(req, res){
    res.sendFile(path.resolve(__dirname, "../..", "client/build/platform.html"));
});


module.exports = externalPlatformRouter;