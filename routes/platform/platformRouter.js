const express = require('express');
const path = require('path');

const platformRouter = express.Router()
platformRouter.get("/*", function(req, res){
    if (req.isAuthenticated()) {
        res.sendFile(path.resolve(__dirname, "../..", "client/build/platform.html"));
    }
    else {
        res.redirect("/login");
    }
});

module.exports = platformRouter;
