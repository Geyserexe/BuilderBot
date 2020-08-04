#!/usr/bin/env node


const config = require("./config.json");

let teamString = "";

if(config.mode.toLowerCase() != "offense"){
    teamString = require(`./src/${config.gen}${config.mode.toLowerCase()}builder.js`);
} else {
    teamString = require(`./src/offensebuilder.js`);
}

function makeRequest(){
    return new Promise(resolve => {
        const http = require('http');
        const stream = require('stream');
        const options = {
            authority: 'pokepast.es',
            hostname: 'pokepast.es',
            port: 80,
            path: '/create',
            method: 'POST', 
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            body: {name: "BuilderBotExport",teamString, author: "Geysers' BuilderBot", notes: `cutoff:${config.cutoff}\nbuilder:${config.builder}\ntier:${config.tier}\nhttps://github.com/Geyserexe/BuilderBot`},
        };


        const req = http.request(options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

            resolve(res);
        });

        req.on('error', (e) => {
            console.error(e);
        });
        req.end();
        req.on('end', (res) => {
            resolve(res);
        });
    });
}

async function exportTeam(){
    console.log("exporting");
    const result = await makeRequest();
    console.log(result);
    console.log(Object.entries(result));
    console.log(Object.keys(result));
    console.log(result.headers.status);
    console.log("test");
}

exportTeam();
