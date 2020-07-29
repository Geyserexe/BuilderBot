// {
//     "set": {
//         "name":"",
//         "item":"",
//         "ability":"",
//         "evs":"",
//         "nature":"",
//         "moves":["", "", "", ""]
//     },
//     "breaker":,
//     "ogreCheck":,
//     "donCheck":,
//     "ygodCheck":,
//     "xernCheck":,
//     "rayCheck":,
//     "zygCheck":,
//     "zacCheck":,
//     "mega":,
//     "z":,
//     "rocks":,
//     "defog":
// },


const config = require("./config.json");

let teamString = "";

teamString = require(`./builders/${config.builder.toLowerCase()}builder.js`);

function makeRequest(){
    return new Promise(resolve => {
        const https = require('https');

        const options = {
            hostname: 'pokepast.es',
            port: 433,
            path: '/create',
            method: 'POST',
            body: teamString,
            id: 'pasteData',
            target: '_blank'
        };


        const req = https.request(options, (res) => {
            // console.log('statusCode:', res.statusCode);
            // console.log('headers:', res.headers);
            res.on('data', (d) => {
                resolve(res);
            });
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
}

console.log(teamString);
