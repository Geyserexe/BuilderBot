#!/usr/bin/env node

const config = require("./config.js");
const { uploadToPokepaste } = require('./src/uploadtopokepaste.js');

let team = "";

team = require(`./src/builders/${config.tier}/${config.mode}builder.js`);

async function exportTeam() {
    if(team.includes("error")){
        console.log(team);
    } else {
        console.log(await uploadToPokepaste(team));
    }
}

exports.buildTeam = function(){ exportTeam();};
