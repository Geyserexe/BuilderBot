#!/usr/bin/env node

const config = require("./config.json");
const upload = require('./uploadtopokepaste.js');

let team = "";

console.log("building...");
if (config.mode.toLowerCase() != "offense") {
    team = require(`./src/builders/${config.gen}${config.mode.toLowerCase()}builder.js`);
} else {
    team = require(`./src/builders/offensebuilder.js`);
}

async function exportTeam() {
    console.log("exporting");
    if(team.includes("error")){
        console.log(team);
    } else {
        const result = await upload.uploadToPokepaste(team);
        console.log(result);
    }
}

exportTeam();
