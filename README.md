# BuilderBot
A program to build teams for Pokemon Showdown in the gen8anythinggoes & gen7anythinggoes formats

Use config.cutoff to change the building style by changing it between 0 and 10.  Lower cutoffs result in more offensive teams that are less likely to have effective meta checks, while higher cutoffs generally result in bulkier teams. 
Add additional sets to the appropriate file in src/sets/. 
In order to run the teambuilder, open Terminal / cmd, cd into the builderbot file, and run "node builder".

- Note: dev branch may be unreliable / produce really bad teams.
- If you're using this on repl.it, run "npm install" in the console to the right to set it up, followed by "node builder" to build teams.

## Flags ##

"node builder" can be run with each of the following flags, which are added after the command, each of which override anything in config.json.

an example of flag usage is "node builder -t gen7anythinggoes -c 7 -r 14 -a chansey,groudon-primal"

- -c controls the cutoff variable.
- -t controls the tier built for.
- -m controls the mode (offense / balance) built for.
- -b controls the breakerThreshold value.
- -r controls the recurseThreshold value.
- -n controls the number of teams built (max 2000).
- -a controls the avoided mons; formatting is a comma-separated-list.
- -d runs the builder on the default settings (i.e galar balance cutoff 5 bT 35 rT 15 etc) and overrides any other settings.
- -raw makes the builder output the team as text rather than as a pokepaste link.
- -nsc deactivates species clause, allowing duplication of Pokemon, excluding those that are illegal in-game.

## Config Info ##

- "teamNumber" controls the number of teams built.  Whenever multiple teams are built, they'll be exported in a bulk format.
- "cutoff" controls the threshold at which the builder will allow a given pokemon onto a team, resulting in potentially less reliable builds at lower levels, but overly similar builds at higher levels.  Cutoff 10 is likely to result in glitchy or inconsistent building.
- "teamLength" controls the number of Pokémon in a team, on the off chance that you want more / fewer than 6
- "tier" controls the tier being built for.  Current options are gen8anythinggoes, gen7anythinggoes.
- "mode" controls what type of teams the builder will create.  Current options are balance and offense.
- "breakerThreshold" is the minimum value for the breaker stat below which the builder will rebuild a team.  Higher values lead to more offensive teams, potentially to the detriment of the other stats.  Low values will not necessaily lead to correspondingly reduced offensive presence.  This feature is balance-only.
- "recurseThreshold" is the minimum value for a given stat below which the builder will rebuild a team.  If this value is set too high, an error will likely appear.  Higher values will lead to better teams, but only up to a point, beyond which teams may appear overly similar.  Optimal values for this field are integers between 10 and 20.  This feature does nothing if teamNumber is greater than 1, owing to stack size limitations.  This feature applies only to balance.
- "monsToAvoid" allows the user to decide if there are certain Pokémon that they do not want on their team.  Commonly used options are Chansey or Diancie.  Formatting within the [] is "mon","mon","mon", etc.  This field is not case-sensitive.
- "startMon" allows the user to provide a set around which to build a team.  The set should be formatted as below for galar dex AG.  For gen7, the formatting can be found in the gen7 sets file.  "__check" information is optional, but should be incuded for best results.

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
    "xernCheck":,
    "zygCheck":,
    "calyCheck":,
    "rocks":,
    "defog":
}

All fields between "breaker" and "calyCheck" should be integers between 0 and 10.  "rock" and "defog" should be booleans.  An optional "cleric": true field can be added after "defog", in the event of cleric use.  This format can be used for both the "startMon" field in config.js.  Gen7 set files use a slightly different format, which can be found in either gen7sets.json or gen7leads.json

#### File-Structure Info ####

All builder and set files are located within "src".  You shouldn't touch the .gitignore, package.json, or package-lock.json unless you really know what you're doing.  Honestly, you probably shouldn't touch any of it outside of the set files or config file because most of it is a sketchy house of cards that'll collapse quickly.

#### TODO ####

- Add gen9 support