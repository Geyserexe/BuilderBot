const configTemplates = require("../config.json");

let mode = null;
let tier = null;
let configEdits = {};

for (let i = 0; i < process.argv.length; i += 2) {
    let value = process.argv[i + 1];
    let flag = process.argv[i];
    switch (flag) {
        case 'help':
            throw ('usage: node builder [-c (arg #)| -n (arg #)| -t (arg tier)| -r (arg #)| -b (arg #)| -m (arg mode)| -cm | -d | -raw | -a]');
        case '-c':
            if (parseInt(value) >= 10) {
                throw ('cutoff too high (lower it below 10)');
            }
            configEdits.cutoff = parseInt(value);
            break;
        case '-t':
            if(!(value.toLowerCase() == "gen8anythinggoes" || value.toLowerCase() == "gen7anythinggoes")){
                throw("invalid tier");
            }
            tier = value.toLowerCase();
            break;
        case '-r':
            configEdits.recurseThreshold = parseInt(value);
            break;
        case '-b':
            configEdits.breakerThreshold = parseInt(value);
            break;
        case '-m':
            if(!(value.toLowerCase() == "balance" || value.toLowerCase() == "offense")){
                throw("invalid mode");
            }
            mode = value.toLowerCase();
            break;
        case '-a':
            configEdits.monsToAvoid=[];
            for (let mon of value.split(',')) {
                configEdits.monsToAvoid.push(mon.toLowerCase());
            }
            break;
        case '-n':
            if(value > 2000){
                throw("team number too large");
            }
            configEdits.teamNumber = parseInt(value);
            break;
        case '-d':
            configEdits = defaultconfig;
            i = process.argv.length;
            break;
        case '-raw':
            configEdits.raw = true;
            i--;
            break;
        case '-nsc':
            configEdits.speciesClause = false;
            i--;
            break;
    }
}
let config = null;

if (!tier) { tier = "gen8anythinggoes"; }
if (!mode) { mode = "balance" }
config = configTemplates[tier][mode];
for (let [key, value] of Object.entries(configEdits)) {
    for (let [key1, value1] of Object.entries(config)) {
        if (key == key1 && value != value1) {
            config[key] = value;
        }
    }
}

for (let [key, value] of Object.entries(config)) {
    if (typeof value == "string") {
        config[key] = value.toLowerCase();
    }
}

module.exports = (config);