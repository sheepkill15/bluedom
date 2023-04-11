# Bluedom backend documentation
## Prerequisites
- A MongoDB datastore
- .NET 6 with the ASP.NET Core Web SDK

## Setup
Create a MongoDB store and 5 collections inside it, that are responsible for storing the Users, Players, Quests, Badges and Unlockables.
<br />
In the `appsettings.json` file, configure the MongoDB store using the 'BluedomStoreDatabase' section. Here's an example:
```json
"BluedomStoreDatabase": {
  "ConnectionString": "mongodb://localhost:27017",
  "DatabaseName": "BluedomStore",
  "PlayersCollectionName": "Players",
  "BadgesCollectionName": "Badges",
  "QuestsCollectionName": "Quests",
  "UnlockablesCollectionName": "Unlockables",
  "UsersCollectionName": "Users"
}
```
All collections should be separate collections dedicated to those models. These settings are parsed and imported automatically.
<br />
You may want to configure a CORS policy in the `Program.cs`, which is the main entry point of the app. By default, in development mode, all origins with all headers are allowed.

## Launch
The solution is found in the `bluedom-be` folder in the root. From here you can launch the project directly in development mode with
```PowerShell
dotnet run --project bluedom-be 
```
To run a production build, use
```PowerShell
dotnet run --project bluedom-be --configuration Release
```
At this point, the API is available at the location specified in the `launchSettings.json` file.
<br />
If running in development mode, Swagger is available as well at `/swagger/index.html` of the application url.

## API
All urls are relative to the application url. Opening the swagger page should provide a good overlook and trial of the API, but below are listed all endpoints in detail.
### User management
- `GET /api/User/{id}`
  - returns the User with the specified id, if it exists
  - User is returned as an object with fields 'username' and 'playerId', both strings
- `GET /api/User/login`
  - 'username' and 'password' should be passed as query parameters
  - returns User object if username and password match
  - returns 404 if there is no user with specified username
  - returns 400 if the password does not match
- `POST /api/User` (register user)
  - the body should be an object with fields 'username' and 'password', both strings
  - optionally, a display name can be passed as a query parameter
  - this display name is shown on the leaderboards and quest details
  - the default display name is the username
  - if there is no other user with that username, returns the created User object
  - along with the User object, a new Player object gets created and the user's playerId set as its id
  - otherwise returns 400

### Player management
- `GET /api/Player`
  - returns a list of all the players
  - if there are no players, returns an empty list
- `GET /api/Player/{id}`
  - returns the Player with the specified id, if it exists
- `GET /api/Player/leaderboard`
  - returns a list with the top 10 players
  - if there are less than 10 players, returns all players
  - players are ordered by amount of tokens
- `GET /api/Player/position/{id}`
  - returns the position of the player with the specified id
  - return 404 if that player doesn't exist
  - position means the number of players with more or equal amount of tokens

### Quest management
- `GET /api/Quest`
  - returns a list of all the available quests
  - if there are no quests, returns an empty list
- `POST /api/Quest`
  - body of request should be an object with the fields 'name', 'text', 'issuerId', 'reward' and 'requiredTime'
  - the reward is subtracted from the issuer's tokens
  - returns the created Quest, if the issuer has enough tokens to provide the reward
  - returns 400 otherwise
- `GET /api/Quest/{id}`
  - returns the Quest object with the specified id
  - returns 404 if there is no Quest with that id
- `POST /api/Quest/completed/{questId}`
  - playerId should be passed as query parameter
  - marks the completion of the Quest with id {questId} by the player with id {playerId}
  - if a quest is completed, that quest is deleted, and the player gets the reward, and any badges they may have unlocked
  - the issuer of the quest gets twice the reward
  - returns 404 if the quest or player by that id is not found

### Shop management
- `GET /api/Unlockable`
  - returns a list of all the items available
  - if there are no items, returns an empty list
- `GET /api/Unlockable/{id}`
  - returns the Unlockable object with the specified id, if it exists
  - returns 404 otherwise
- `POST /api/Unlockable/{id}`
  - playerId should be passed as query parameter
  - marks the purchase of the Unlockable with id {id} by the Player with id {playerId}
  - returns the Unlockable object if the purchase was successful
  - returns 404 if the Unlockable or Player was not found 
  - returns 400 if the player doesn't have enough tokens

### Badge management
- `GET /api/Badge/{id}`
  - return the Badge object with the specified id, if it exists
  - returns 404 otherwise

## Models
### User
The User object is defined as:
```ts
User: {
  id: string
  username:	string
  password:	string
  playerId:	string
}
```
- `id` is the user's primary key
- `username` is the user's username, which is unique
- `password` is the user's hashed password
- `playerId` is the associated Player object's id, can be seen as a foreign key

### Player
The Player object is defined as:
```ts
Player: {
  id:	string
  name:	string
  quests:	number
  tokens:	number
  badges:	[string]
  purchases:	[string]
}
```
- `id` is the player's primary key
- `name` is the player's display name
- `quests` is the number of quests the player has completed
- `tokens` is the number of tokens the player currently has
- `badges` is a list of the badges' ids (as strings) the player has unlocked
- `purchases` is a list of all the purchased items' ids (as strings)

### Quest
The Quest object is defined as:
```ts
Quest: {
  id:	string
  name:	string
  text:	string
  issuerId:	string
  reward: number
  requiredTime: number
}
```
- `id` is the quest's primary key
- `name` is the name of the quest
- `text` is the text a player has to type in when attempting the quest
- `issuerId` is the issuer player's id (as string)
- `reward` is the number of tokens the quest gives when completed
- `requiredTime` is the maximum number of seconds the player has to type the `text` in

### Unlockable
The Unlockable object is defined as:
```ts
Unlockable: {
  id: string
  type: Enum {Background, Font, Effect}
  name: string
  description:  string
  data: string
  cost: number
}
```
- `id` is the Unlockable's primary id
- `type` is the Unlockable's type: `Background`, which refers to the background color/image during the minigame; `Font`, which refers to the minigame's texts' fonts; `Effect`, which is applied to the minigame's placeholder text
- `name` is the Unlockable's name that appears in the shop and settings
- `description` is the Unlockable's description that appears in the shop
- `data` is the associated styling data as a stringified JSON object 
- `cost` is the amount of tokens the Unlockable costs