#!/usr/bin/env node

const config = require("./config.js");
const upload = require('./src/uploadtopokepaste.js');

let team = "";

console.log("building...");

team = require(`./src/builders/${config.tier}/${config.mode}builder.js`);

async function exportTeam() {
    if(team.includes("error")){
        console.log(team);
    } else {
        console.log("exporting..."); 
        console.log(await upload.uploadToPokepaste(team));
    }
}

exportTeam();
