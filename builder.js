#!/usr/bin/env node

let config = null;
const upload = require('./src/uploadtopokepaste.js');
let help = false;
try {
    config = require("./src/config.js");
}
catch (e) {
    console.log(e);
    help = true;
}

if (!help) {

    let team = "";

    console.log("building...");

    team = require(`./src/builders/${config.tier}/${config.mode}builder.js`);

    async function exportTeam() {
        if (team.includes("error")) {
            console.log(team);
        } else {
            if (!config.raw) {
                console.log("exporting...");
                console.log(await upload.uploadToPokepaste(team));
            } else {
                console.log(team);
            }
        }
    }

    exportTeam();
}