# BuilderBot
A program to build teams for Pokemon Showdown in the gen8nationaldexag & gen7anythinggoes formats

Use config.cutoff to change the building style by changing it between 0 and 10.  Lower cutoffs result in more offensive teams that are less likely to have effective meta checks, while higher cutoffs generally result in bulkier teams. 
Add additional sets to sets.json. 
In order to run the teambuilder, open Terminal / cmd, cd into the builderbot file, and run "node builder".

- Note: dev branch may be unreliable / produce really bad teams

#### Config Info ####

- "teamNumber" controls the number of teams built.  Whenever multiple teams are built, they'll be exported in a bulk format.
- "cutoff" controls the threshold at which the builder will allow a given pokemon onto a team, resulting in potentially less reliable builds at lower levels, but overly similar builds at higher levels
- "teamLength" controls the number of Pokémon in a team, on the off chance that you want more / fewer than 6
- "tier" controls the team tiers when building in bulk.  While it doesn't actually impact the building process, it's good practice to make sure it lines up with the gen setting below.
- "gen" controls which gen the builder builds for.  Current options are gen7 and natdex.
- "mode" controls what type of teams the builder will create.  Current options are balance, offense, and stall.
- "coreMode" controls whether or not the builder uses an experimental, currently natdex-only, building mode where the team starts with a pre-chosen set of 3 Pokémon.
- "breakerWeight" controls the priority given to breakers on a team.  Lower levels result in stallier builds, while higher levels result in more offensive builds.  This feature is experimental and any feedback on it is welcome.  This feature has no effect on building offense.
- "breakerOverride" allows the user to bypass breakerWeight's impact on teambuilding, and opens the full sets file, restricted only by "cutoff", to the builder.  This is on by default to maximize building variety.  This feature has no effect on building offense.
- "recurseThreshold" is the minimum value for a given stat below which the builder will rebuild a team.  If this value is set too high, an error will likely appear.  Higher values will lead to better teams, but only up to a point, beyond which teams may appear overly similar.  Optimal values for this field are integers between 10 and 20.  This feature does nothing if teamNumber is greater than 1, owing to stack size limitations.
- "monsToAvoid" allows the user to decide if there are certain Pokémon that they do not want on their team.  Commonly used options are Chansey or Diancie.  Formatting within the [] is "mon","mon","mon", etc.  This field is not case-sensitive.
- "startMon" allows the user to provide a set around which to build a team.  The set should be formatted as below for natdex.  For gen7, the formatting can be found in the gen7sets file.  "__check" information is optional, but should be incuded for best results.


#### Set Formatting ####

{
    "set": {
        "name":"",
        "item":"",
        "ability":"",
        "evs":"",
        "nature":"",
        "moves":["", "", "", ""]
     },
    "breaker":,
    "ogreCheck":,
    "donCheck":,
    "ygodCheck":,
    "xernCheck":,
    "rayCheck":,
    "zygCheck":,
    "zacCheck":,
    "mega":,
    "z":,
    "rocks":,
    "defog":
}

All fields between "breaker" and "zacCheck" should be integers between 0 and 10.  All fields between "mega" and "defog" should be booleans.  An optional "cleric": true field can be added after "defog", in the event of cleric use.  This format can be used for both the "startMon" field in config.json or for any of the three natdex sets files.  Gen7 set files use a slightly different format, which can be found in either gen7sets.json or gen7leads.json

#### File-Structure Info ####

All builder and set files are located within "src".  You shouldn't touch the .vscode folder, .gitignore, package.json, or package-lock.json unless you really know what you're doing.

#### TODO ####

- Add more sets
- Add gen6 support
