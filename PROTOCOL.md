# Server Protocol

What has been determined of the server-client relationship so far is provided below. All information is derived from [final.js](/docs/final.js), [gameControl.js](/docs/gameControl.js) and [shop.js](/docs/shop.js). The types of some values have yet to be determined, so they remain with generic names like `givenLoginID`. Everything listed here will be more thoroughly inspected in time.

## .on(

Listens for a named message from the server. Some code is run every time the message is received, which is optionally passed some JSON data.

### final.js

#### `login`

Initiates the client to start the game and begin listening for game updates from the server.

```ts
{
	"user": {
		"auth": authInfo,
		"name": string,
		"id": givenLoginID // unused?
	},
	"levelMap": {
		// TBD; presumably same structure as contents of lvl1.json
	}
}
```

#### `update`

Updates the client’s game state so that it conforms to the main state of the game.

```ts
{
	"players": {
		"user": {
			"name": nameID,
			"session": sessionID,
			"score": number,
			"attack": number,
			"maxhealth": number
		},
		"character": {
			"coords": {
				"xabs": number,
				"yabs": number
			},
			"skin": "unicorn"|"knightBurn",
			"health": number,
			"swordColor": "white"|"green"|"blue"|"red",
			"speed": {
				"x": number
			},
			"isAttacking": boolean,
			"direction": 1|-1
		}
  }[]
}
```

#### `wallet`

Informs the client that they or another user has found a purse.

```ts
{
	"walletUser": string, // whose purse it was
	"user": string, // who took the purse
	"scoreGrabbed": number // number of coins
}
```

#### `death`

Informs the client of the deaths of one or more users.

```ts
{
	"by": "user"|"spike", // Cause of death
	"killedUser": string, // The user who died
	"user": string // If by user, who killed them
}[]
```

#### `disconnect`

Informs the client that they have been disconnected from the server, though currently the client only logs this message and does not react to it.

**No Data**

#### `reconnected`

Informs the client that they have been reconnected to the server, though currently the client only logs this message and does not react to it.

**No Data**

#### `login_required`

Informs the client that it must end the game and await another `login`.

**No Data**

### gameControl.js

#### `leaderboard`

Updates the values displayed in the client’s leaderboard.

```ts
{
	// All of these string values are HTML code blocks directly loaded into the client's leaderboard menu
	// The Wayback Machine could perhaps be of use in determining how exactly the strings were structured
	"gold1": string, // Users with the most gold today
	"gold7": string, // Users with the most gold this week
	"kills1": string, // Users with the most kills today
	"kills7": string, // Users with the most kills this week
	"time1": string, // Users with the longest time alive today
	"time7": string // Users with the longest time alive this week
}
```

#### `connect`

Informs the client they have successfully connected to the server for the purpose of statistics (so the client knows when exactly they are connected).

**No Data**

### Unused

#### `new player`

**Unknown Data** (may be able to determine by referencing an older revision of final.js from the Wayback Machine)

#### `new enemy player`

**Unknown Data** (may be able to determine by referencing an older revision of final.js from the Wayback Machine)

#### `move player`

#### `remove player`

#### `message`

Same functionality and **data** as `update`.

## .emit(

Sends a named message to the server, optionally with some JSON data.

### final.js

#### `move`

Updates the server on the current position, direction and velocity of the client's character.

```ts
{
	"auth": authInfo,
	"coords": {
		"x": number, // x in tiles
		"y": number, // y in tiles
		"xabs": number, // absolute x
		"yabs": number // absolute y
	}
	"direction": number,
	"speed": {
		"x": number
	}
}
```

#### `login`

Asks the server to log in the user.

```ts
nameID // string
```

#### `stats`

Provides the server with statistics. There are two distinct types of data it is known to provide.

```ts
{
	"id": givenLoginID,
	"connecttime": number // Number of milliseconds between querying the server and establishing a connection
}
```

```ts
{
	"minfps": number,
	"avgfps": number,
	"maxfps": number,
	"id": givenLoginID,
	"auth": authInfo
}
```

#### `attack`

Informs the server that the user is using their sword.

```ts
{
	"type": "sword",
	"auth": authInfo
}
```

#### `hit`

Informs the server that the user has been damaged by a spike.

```ts
{
	"damage": "spike",
	"auth": authInfo
}
```

#### `changeSkin`

Informs the server that the user has changed their skin.

```ts
{
	"auth": authInfo,
	"name": string, // the name of the skin to change to
	"id": givenLoginID
}
```

#### `upgradeBuy`

Informs the server that the user has either upgraded their sword or obtained another heart.

```ts
{
	"auth": authInfo,
	"type": "attack"|"health"
}
```

### gameControl.js

#### `leaderboard`

Possibly asks the server to begin sending updates to the client for the leaderboard via `leaderboard`, though its purpose is not immediately obvious from the code.

```ts
{}
```

### shop.js

#### `skinStats`

Sends statistics on the skins unlocked by the user to the server.

```ts
{
	"id": IDCookie,
	"skins": string[] // List of skins available to the user
}
```

### Unused

#### `move player`

Presumably tells the server where the client's character has moved to.

```ts
{
	"x": number,
	"y": number,
	"direction": 1|-1,
	"angle": number
}
```

#### `new player`

Presumably creates a new player character. May have been attached to the client's IP address.

```ts
{
	"x": number,
	"y": number,
	"direction": 1|-1,
	"angle": number
}
```

#### `reconnect`

Presumably asks the server for the client to be reconnected after it is disconnected. It doesn't seem to do this anymore.

```ts
{
	"auth": authInfo
}
```

#### `reset-smcLWjio3t`

Asks the server to reset the game, presumably for development purposes.

**No Data**

#### `continue`

Likely meant to continue the game after the player dies. Was replaced with emitting `login`.

```ts
{
	"auth": authInfo
}
```

#### `new_player`

Presumably creates a new player character. May have been attached to the client's IP address.

```ts
{
	"x": number,
	"y": number,
	"angle": number
}
```
