#!/usr/bin/env node

const config = require("./config.json");
const upload = require('./uploadtopokepaste.js');

let team = "";


if (config.mode.toLowerCase() != "offense") {
    team = require(`./src/${config.gen}${config.mode.toLowerCase()}builder.js`);
} else {
    team = require(`./src/offensebuilder.js`);
}

async function exportTeam() {
    console.log("exporting");
    const result = await upload.uploadToPokepaste(team);
    console.log(result);
}

exportTeam();
