let config = require("../config.json");

const defaultconfig = {
    teamNumber: 1,
    cutoff: 7,
    teamLength: 6,
    tier: "gen8nationaldexag",
    mode: "balance",
    coreMode: false,
    breakerThreshold: 15,
    recurseThreshold: 10,
    monsToAvoid: [
        ""
    ],
    startMon: {

    }
};

for (let i = 0; i < process.argv.length; i += 2) {
    let value = process.argv[i + 1];
    let flag = process.argv[i];
    switch (flag) {
        case "help":
            throw ("usage: node builder [--c | --n | --t | --r | --b | --m | --cm | --d | --raw | --a]");
        case "--c":
            if (parseInt(value > 10)) {
                throw ("cutoff too high");
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
            config.monsToAvoid = [];
            for (const mon of value.split(",")) {
                config.monsToAvoid.push(mon);
            }
            break;
        case "--n":
            config.teamNumber = parseInt(value);
            break;
        case "--cm":
            config.coreMode = true;
            i--;
            break;
        case "--d":
            config = defaultconfig;
            i = process.argv.length;
            break;
        case "--raw":
            config.raw = true;
    }
}

for (let [key, value] of Object.entries(config)) {
    if (typeof value == "string") {
        config[key] = value.toLowerCase();
    }
}

module.exports = (config);