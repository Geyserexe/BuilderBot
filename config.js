let config = null

try {
    config = require("../../builderconfig");
} catch(e){
    throw("Error: Builderconfig may be missing or misplaced.  Please confirm that it is in the main directory of your project.")
}


for (let [key, value] of Object.entries(config)) {
    if (typeof value == "string") {
        config[key] = value.toLowerCase();
    }
}

module.exports = (config);