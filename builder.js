#!/usr/bin/env node

let config = null;
try {
    config = require("./src/config.js");
}
catch (e) {
    console.log(e);
    process.exit();
}

const { uploadToPokepaste } = require('./src/uploadtopokepaste.js');

let team = "";

console.log("building...");

team = require(`./src/builders/${config.tier}/${config.mode}builder.js`);

if (team.includes("error")) {
    console.log(team);
    process.exit();
}

async function exportTeam() {
    if (!config.raw) {
        console.log("exporting...");
        console.log(await uploadToPokepaste(team));
    } else {
        console.log(team);
    }
}

exportTeam();
