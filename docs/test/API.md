Note: all “id”s are UUIDs. All “id”s are completely unique.
All return values assume that the operation is successful. If failure occurs, a Response 404 is returned.

Uses Oauth2 for authentication.

GET /info
Information about the game itself (not any particular instance)
Returns: Response 200, MIME type application/json, an object {
  name: string, the name of the game,
  description: string, a description of the game,
  options: an options object, used to construct an action object in POST /game/new/,
}

GET /option/{option-id}
Gets an option by option-id (used to traverse an options tree)
Returns: Response 200, MIME type application/json, an option object (see description below)

GET /games
Game summaries for all games on the server
Returns: Response 200, MIME type application/json, an array [ {
  gameId: game-id,
  title: string,
} ]

GET /games/by-user/
All games on the server currently joined by that player
Note: This is a convenience function. 
Returns: Same as GET /games

POST /game/new/
Request a new game
Expects: MIME type application/json, an object {
  title: string, used by other users to identify the game,
  action: an action object, created from the option object given by GET /info,
}
Returns: Response 200, MIME type application/json, an object { gameId }

POST /game/{game-id}/join
Request to join a game
Expects: Nothing
Returns: Response 200, empty body

POST /game/{game-id}/unjoin
Request to unjoin a game
Expects: Nothing
Returns: Response 200, empty body

GET /game/{game-id}/info
Information about the game instance (available to all users)
Returns: Response 200, MIME type application/json, an object {
  title: string,
  players: [ {
    username: string,
    hasOptions: boolean,
  } ],
}

Note: The server holds the game in its current state until all players have no options (either by choice of the server or by the player submitting an action), at which point it moves the game to the next state. If the game has just been created, but requires input from each player before initializing, each player has options for which they must submit an action.

GET /game/{game-id}/options
All options currently available to that player (top level/root option)
Returns if options available: Response 200, MIME type application/json, an option object (see description below)
Returns if no options available: Response 404

POST /game/{game-id}/action/
Perform selected action
Expects: MIME type application/json, an action object (see description below)
Returns: Response 200 w/ empty body if successful

GET /game/{game-id}/maps
Map summaries of all maps visible to that player
Returns: Response 200, MIME type application/json, an array [ {
  mapId: map-id,
} ]

GET /game/{game-id}/map/{map-id}/info
General info about that map (currently available to that player)
Returns: Response 200, MIME type application/json, an object {
  type: css-style string,
}
type string
- type: “hex”/”square”/"freeform"
- size: "fixed" min-x min-y max-x max-y

GET /game/{game-id}/map/{map-id}/terrain/{row}/{col}
Info about the terrain of that hex (as currently seen by that player)
Note: terrain does not have state. If the terrain changes, the terrain-id must change.
Returns: Response 200, MIME type application/json, an object {
  terrainId: terrain-id,
}

GET /game/{game-id}/units
Unit summaries of all game units currently seen (not just owned/controlled)
Returns:  Response 200, MIME type application/json, an array [ {
  unitId: unit-id,
} ]

GET /game/{game-id}/units/by-player/{username}
Unit summaries of all game units currently seen (not just owned), that are owned by the given player
NOTE: This is a convenience function. The information from /game/{game-id}/{token}/unit/{unit-id}/info takes precedence.
Returns:  Same as GET /game/{game-id}/{token}/units

GET /game/{game-id}/unit/{unit-id}/info
Info about that unit known to that player
Returns: Response 200, MIME type application/json, an object {
  mapId: map-id/null,
  row: number,
  col: number,
  heading: “A”/”B”/”C”/”D”/”E”/”F”
}

GET /game/{game-id}/unit/{unit-id}/img
Image of that unit as it appears on the map
Returns: Response 200, MIME type image, Image data

GET /game/{game-id}/unit/{unit-id}/img-detail
Image of a detail of that unit, with space for parts
Returns: Response 200, MIME type image, Image data

Note: Units are composed of parts. Each part is in a particular state. The combination of a part and its state is a part-state. Some part-states may be “generic” and used for multiple parts.

GET /game/{game-id}/unit/{unit-id}/parts
Info about each part of that unit: the current state, its position on the unit detail (top-left corner), and an optional text marker (centered by default).
Returns: Response 200, MIME type application/json, an array [ {
  state: part-state-id,
  x: number,
  y: number,
  marker: string,
} ]

GET /terrain/{terrain-id}/info
General info about that terrain
Returns: Response 200, MIME type application/json, an object {
  description: string
}

GET /terrain/{terrain-id}/img
Image of that terrain as it appears on the map
Returns: Response 200, MIME type image, Image data

GET /part-state/{part-state-id}/info
General info about that part-state
Returns: Response 200, MIME type application/json, Image data

GET /part-state/{part-state-id}/img
Image to be drawn on unit image detail
Returns: Response 200, MIME type image, Image data

An “action” is a very generic concept; it represents any action that a player can take in a game. Possible actions are provided by the server as options. The user selects from the options to create an action, which is sent back to the server. Action options are described by option objects. Option objects are described below:
option {
  type: “select”/“range”/“text” (req)
  optionId: unique id (req)
  description: string, defaults to “” (opt) = text displayed to player
}
Some additional fields are defined, based on the type. Type “select” tells the player to select n-out-of-m options, where n can be range of values. Type “range” tells the player to select a numeric value between two values, to some level of precision. Type “text” tells the player to provide a text string.
option [type=”select”] {
  minOptions: number, defaults to 0 (opt) = minimum value of n in n-out-of m
  maxOptions: number (req) = maximum value of n in n-out-of m (set to 1 for mutually exclusive options)
  options: [ option-id ], defaults to [] (opt)
}
option [type=”range”] {
  minValue: number, defaults to 0 (opt) = the minimum value
  maxValue: number (req) = the maximum value
  interval: number, defaults to 1 (opt) = the granularity of the selection
  valueName: string, the name assigned the value selected, defaults to “” (opt) = name of selected value, as referenced in operations and validations
}
option [type=”text”] {
}
“Select” options can points to multiple other options, forming a tree. A “select” option with no options is a leaf of the tree. “Range” options and “text” options are also leafs of the tree. GET /game/{game-id}/{token}/moves returns the root of the tree.
Each node of the tree has an option-id. These option-ids are used in the move object to indicate a particular option is selected by the player. These move objects form the same tree structure that the option-ids come from. For “range” and “text” options, values must also be included.

action {
  optionId: unique id (req)
}

action-select {
  options: [ action ] (req)
}
action-range {
  value: number (req)
}
action-text {
  value: string (req)
}
