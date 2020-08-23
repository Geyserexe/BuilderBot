#!/usr/bin/env node

let config = null;
let help = false;
try {
    config = require("./src/config.js");
} catch (err) {
    console.log(err);
    help = true;
}
if (!help) {
    const upload = require('./src/uploadtopokepaste.js');

    let team = "";

    console.log("building...");

    team = require(`./src/builders/${config.tier}/${config.mode}builder.js`);

    async function exportTeam() {
        if (team.includes("error")) {
            console.log(team);
        } else {
            console.log("exporting...");
            console.log(await upload.uploadToPokepaste(team));
        }
    }

    exportTeam();
}