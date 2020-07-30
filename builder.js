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
        const http = require('http');
        const stream = require('stream');
        const options = {
            hostname: 'pokepast.es',
            port: 80,
            path: '/create',
            method: 'POST', 
            body: {name: "BuilderBotExport",teamString, author: "Geysers' BuilderBot", notes: `cutoff:${config.cutoff}\nbuilder:${config.builder}\ntier:${config.tier}`}
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
    console.log(result.read());
    console.log(Object.keys(result));
    console.log("test");
}

exportTeam();
