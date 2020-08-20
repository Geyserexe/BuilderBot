#!/usr/bin/env node

const config = require("./config.js");

exports.buildTeam = function () {
    let team = require(`./src/builders/${config.tier}/${config.mode}builder.js`);
    return team;
};
