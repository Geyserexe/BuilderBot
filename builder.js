#!/usr/bin/env node

const config = require("./config.js");
const upload = require('./src/uploadtopokepaste.js');

let team = "";

console.log("building...");

team = require(`./src/builders/${config.tier.toLowerCase()}/${config.mode.toLowerCase()}builder.js`);

async function exportTeam() {
    if(team.includes("error")){
        console.log(team);
    } else {
        console.log("exporting...");
        const result = await upload.uploadToPokepaste(team);
        console.log(result);
    }
}

exportTeam();
