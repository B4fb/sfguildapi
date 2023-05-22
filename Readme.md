# SFGuildApi
Because Shakes & Fidget dont provide an Api, I decided to create one by myself. This Api is written in Python and uses the Flask framework. The Api is currently in development and is not yet ready for use. The Api is currently only available in German.

## Requirements
- nodejs (https://nodejs.org/en/) version 16
- npm (https://www.npmjs.com/) version 7

## Installation
To install the project you have to clone the repository and install the dependencies.
```bash
git clone git@github.com:B4fb/sfguildapi.git SFGuildApi
cd SFGuildApi
npm install
```

## Usage
To start the project you have to run the following command.
```bash
npm run script -- -username <username> -password <password>
```
The username and password are the credentials of your Shakes & Fidget account.
The password is not stored anywhere and is only used to log in to the game.
The password has to be hashed with the sha1 algorithm and then encoded with base64. An salt is used but currently unknown. So if you want to try it on your own you need to get the hashed password from the game by viewing the request on the shakes & fidget login under: "play.sfgame.net". Search for a request to "https://sso.playa-games.com/json/login" and look at the request form-data.

AFAIK: This only works for the new centralized login system.

## License
[MIT](https://choosealicense.com/licenses/mit/)
