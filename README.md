# Game21
> Game21 is a.k.a Blackjack game.
## Objective of the game
- Each player attempts to beat dealer by getting a count to 21 as possible, without going over 21.
## Card values:
- Face cards are 10 and any other card is taken with it's value provided.
- In  our Application, ACE Management is automatically done depending upon the count the player persist.
## Game
- Number of players in the game is restricted upto 3 and a dealer involved.
- Any player can go first to play but if the alternate player tries to play parallely it will not be allowed.
- Players can either TWIST or STAND. If they twist that means there will be extra card added to their cards on hand. If they wish to stand then the game is concluded and should wait for the dealer turn to finish to find the result.
- If the player count is above 21 at then it's a "Bust" and the game is concluded for the player or if the count is equal to 21 then it's a "Blackjack" for the player.
- If player count is maximum of remaining players and nearest to 21 or equal to 21 then player is the winner for the game or round.
- If player count is lowest of remaining players then the player has lost the game or round.
-  Dealer Hand Evaluation Algorithm Applied when dealing with the dealer's cards. The dealer doesn't have the options to opt either to Twist or Stand, if all the players on deck have completed the game then he dealer has to reveal the cards available with him.
    - If the dealer count is less than 17 then player has chance to add an extra card.
    - If count exceeds 21 then the all the players on the deck are winners. 
    - If count is between 17 to 21 then the player above dealer score is a winner or dealer takes it all.
    - If count is 21 then dealer check with the rest of the players for a tie if any both the player and dealer are provided with win or dealer is winner for the game.

## Features!
-  The player have flexibility to twist or stand.
-  Get history of a specific player.
-  Save the state after each rounds.
-  Dealer cards can be revealed based on Hand Evaluation Algorithm applied.
-  Ace management for the entire deck.
-  Automatic player creation based on the count provided in the new game.
-  Support of validations and authorization of the specific game.

## New Features!!

  - Provide hard hand and soft hand for the players.
  - Provide stake management on the deck.
  - Intergration of players enrollment on to the specific deck for the specific game or Round.

## Installation

Prerequisite:
- Nodejs and Mongo to be installed on your local system.

### Steps:
- Clone Application repository [Game21](https://github.com/santosh279/Game21.git)
- Install the dependencies and devDependencies and start the server.
```sh
$ git clone `paste the game21 repo url`
$ cd Game21
$ npm install
```
For development environments...

```sh
$ export NODE_ENV=development
$ npm start dev
```

For production environments...

```sh
$ export NODE_ENV=production
$ npm start prod
```
#### NOTE: To use debug plugin with the environment
```sh
$ export NODE_ENV=env
$ DEBUG=game21* npm start env
```
### Development
 Great! Game21 is also available on Heroku [GAME21](https://game21jack.herokuapp.com/)
### How to play to GAME21 !!!
- Initiate a new_game endpoint, game gets created with the number of player count provided and a dealer
- If the player want to Twist use the twist end-point and a card is provided to the cardsonhand.
- If the player want to Stand and stop the game can use the stand end-point.
- Dealer has a separate end-point and end-point is enabled only after all the players on the deck have completed playing the game which is all the players are at stand.
- Save end-point to save each of the Round.
- Player history end-point to know history for a given player.

[Note] : Reference below for each end-point is list in API LIST MANAGER SECTION.
## API LIST MANAGER
-  Apidoc reference on live: [GAME21 API DOC](https://game21jack.herokuapp.com/api-doc/)
-  Apidoc reference for local: `{endpoint}/api-doc`

### Todos
 - Write Test Cases
 
License
----
MIT
**Free Software, Hell Yeah!**
