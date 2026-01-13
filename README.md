# trapz

trapz.io revival

## Why?

[trapz.io](https://trapz.io/) was an online multiplayer platformer game I used to play a lot with friends. Years later, the game server appears to have been shut down, and trapz.io can no longer played. I once emailed the developers about this via their Contact link, and they simply stated that trapz.io is "long gone," suggesting I play other .io games instead.

I do not know why the developers took it down, but I found this silent end to a game I once enjoyed highly unsatisfying, especially considering the absolute lack of notice. Years since, I have obtained a decent understanding of programming (or at least, how to throw together other people's code) and figured that if enough of the game's files were still available, I could somehow restore it to its former glory.

Using my browser's dev tools, I inspected what game files were still available from the website. Fortunately, most of the code and assets for the client were retrievable; the game's server was apparently the only thing taken down.

Since discovering this (like, yesterday) I am endeavuring to create a fully restored copy of the original site that connects with an emulated server of some sort, for the sake of preservation as well as the continued enjoyment of others.

## Progress so far

- Manually compiled available game files from trapz.io and the [Wayback Machine](https://web.archive.org/web/*/trapz.io*) into this repository.
  - Also attempted to retrieve files similarly named to known ones (e.g. discovered `shop.js` based on `obfShop.js`).

## What comes next

- Reverse engineer how the client communicated with the server (i.e. analyze the code for network requests).
  - It appears to use [Socket.IO](https://socket.io/) v[2.0.4](https://github.com/socketio/socket.io/releases/tag/2.0.4), so I will be looking in `final.js` (the main game script) for `.on(` and `.emit(` calls.
- Create a stub server of some sort that does as little as possible, interface it with the client code, and get the game to load.
  - Locally hosted for now.
- Slowly implement missing features.
  - Slowly as in, "I don't actually have time to do any of this." ;[
- Figure out how in the world to host the recreated server for others.
  - Literally no clue.
- More closely recreate the original server based on gameplay videos, public information, client ode, etc.
  - The server would hacve maintained the game state, so naturally some things would have been solely determined by the server code, which is presently unavailable and will likely remain so. I have not gotten this far in reviving the game, so I do not know the extent to which the server influenced it.

## Disclaimer

I do not hold any rights to the game assets and code, nor did I create them. I consider trapz.io to be abandoned, and if you mind me bringing it back, then you and I will likely have a problem. :>

On a more serious note I will not be profiting off of this game (that would be highly unethical; no ads or anything) or building upon it in any way (unless I somehow become unhealthily obsessed with it). I am just putting it back into a functional state in the interest of the one person out there seeing this who cares about the status of this game, which is probably me looking in a mirror.
