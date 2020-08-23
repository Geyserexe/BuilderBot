let config = require("../config.json");

for (let i = 0; i < process.argv.length; i+=2) {
    let value = process.argv[i + 1];
    let flag = process.argv[i];
    switch (flag) {
        case "help":
            throw("usage: node builder [--c | --n | --t | --r | --b | --m]");
        case "--c":
            if(parseInt(value > 10)){
                throw("cutoff too high");
            }
            config.cutoff = parseInt(value);
            break;
        case "--t":
            config.tier = value;
            break;
        case "--r":
            config.recurseThreshold = parseInt(value);
            break;
        case "--b":
            config.breakerThreshold = parseInt(value);
            break;
        case "--m":
            config.mode = value;
            break;
        case "--a":
            for(let mon of value.split(",")){
                config.monsToAvoid.push(mon);
            }
            break;
        case "--n":
            config.teamNumber = parseInt(value)
    }
}

for (let [key, value] of Object.entries(config)) {
    if (typeof value == "string") {
        config[key] = value.toLowerCase();
    }
}

module.exports = (config);