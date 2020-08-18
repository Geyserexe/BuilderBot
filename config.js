let config = {
    teamNumber: 1,

    // integer between 0 - 10
    cutoff: 7,

    teamLength: 6,

    tier: "gen8nationaldexag",

    mode: "balance",

    coreMode: false,

    // integer between 0 - 10
    breakerWeight: 10,

    breakerOverride: true,

    // integer between 0 - 30
    breakerThreshold: 15,

    // integer between 0 - 20
    recurseThreshold: 10,

    monsToAvoid: [
        ""
    ],

    startMon: {

    }
}


for (let [key, value] of Object.entries(config)) {
    if (typeof value == "string") {
        config[key] = value.toLowerCase();
    }
}

module.exports = (config);