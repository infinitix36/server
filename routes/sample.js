const express = require("express");
const sampleRoute = express.Router();
const User = require('../models/user.model');

sampleRoute.route("/sample").get(function (req, res) {
    res.json([
        { url: "", method: "", desc: "" },
    ]);
});

module.exports = sampleRoute;