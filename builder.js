#!/usr/bin/env node


const config = require("./config.json");

let team = "";


if (config.mode.toLowerCase() != "offense") {
    team = require(`./src/builders/${config.gen}${config.mode.toLowerCase()}builder.js`);
} else {
    team = require(`./src/builders/offensebuilder.js`);
}

console.log(team);
