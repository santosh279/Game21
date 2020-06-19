const config = require("config");
const async = require("async");


/**Folders */
const { createPlayers, shuffle, popCards,
  playerTotal,
  checkPlayerStatus } = require("../Utils/game_helpers");
const Blackjack = require("../Utils/blackjack");
const { fetch_player_details, save_players_details,
  update_player_details } = require("../DBO/players");
const { save_game_details, fetch_game_details, update_game_details } = require("../DBO/game");
const { save_live_game_details } = require("../DBO/live_game");


const debug = require("debug")("game21:new_game")

/**
 * @api {POST} /game/new_game Request to start New Game which sends the game id, players details
 * @apiName NewGame
 * @apiGroup Game21
 * @apiParam {String} player_count=1  
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 201 Created
 *    {  
 *        "message": "Game is been initiated",
 *        "game_id": "5eea239de9f3d6628a05e45b",
 *        "players": []
 *     } 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "message": ""
 *     }
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "message": ""
 *     }
 */

let game;

exports.new_game = (req, res) => {
  const { player_count } = req.query;
  parseInt(player_count);

  const players = createPlayers(player_count);
  debug("Players Length" + ": " + players.length)

  /**set deck of cards */
  const DECK_OF_CARDS = config.get("DECK_OF_CARDS")
  game = new Blackjack.Game({ deckCount: DECK_OF_CARDS });

  /*shuffled cards */
  let shuffledCards = shuffle(game.deck.deckList);

  async.waterfall([
    function (callback) {
      updatePlayerDetails(players, callback)
    },
    function (game, callback) {
      let game_object = {
        game_status: "active",
        players: players,
        deck_of_cards: shuffledCards,
        current_player: "",
        game_completed_by: players
      }
      save_game_details(game_object, (error, result) => {
        if (result) {
          callback(null, result)
        } else {
          callback(error, null)
        }
      })
    }, function (result, callback) {
      set_cards_for_players(result, callback);
    }, function (update_cards, callback) {
      update_current_live_game(update_cards, callback)
    }
  ], function (error, final) {
    if (error) {
      debug("error with :" + " " + error)
      res.status(500).send({
        message: "Internal server error"
      })
    } else {
      res.status(201).json({
        message: "Game is been initiated",
        game_id: final.result._id,
        players: final.players
      })
    }
  })
}

/**
 * check for the players in the players schema 
 * if avaiable update player details
 * else create a new player details
 */
function updatePlayerDetails(playersList, callback) {
  if (playersList.length) {
    for (let p = 0; p <= playersList.length; p++) {
      let player = playersList[p]
      if (p !== playersList.length) {
        fetch_player_details(player, (error, result) => {
          if (error) {
            callback(error, null)
          } else {
            if (result === null) {
              let player_object = {
                total_games: 1,
                name: player
              }
              save_players_details(player_object, (error, result) => {
                if (error) {
                  callback(error, null)
                }
              })
            } else if (result) {
              let player_object = {
                total_games: result.total_games + 1,
                name: result.name
              }
              update_player_details(player_object, (err, result) => {
                if (error) {
                  callback(error, null)
                }
              })
            }
          }
        })
      } else {
        callback(null, true)
      }
    }
  }
}



/**
 * Function to set the cards to the Number of players available 
 * and for dealer.
 */
function set_cards_for_players(result, callback) {
  let { players,
    deck_of_cards: deck,
    _id: game_uid } = result;

  /**setting the deck globally */
  let org_stack = new Blackjack.DeckStack(deck);

  /**push dealer as a player into the player stack */
  players.push("dealer")

  /**create game detail object for the new initial game */
  let game_details = []
  for (let i = 0; i < players.length; i++) {
    let player_object = {};
    player_object["player_name"] = players[i];
    player_object["cardsOnHand"] = org_stack.stack.getCards();
    player_object["score"] = playerTotal(player_object["cardsOnHand"]);
    player_object["player_status"] = checkPlayerStatus(player_object["score"]);
    game_details.push(player_object)
  }

  let data = {
    game_uid,
    game_details
  }

  save_live_game_details(data, (error, result) => {
    if (error) {
      callback(error, null)
    } else {
      result["remaining_cards"] = org_stack.stack.cards_remaining();
      callback(null, result)
    }
  })
}

/**
 * Update the current live game details
 */
function update_current_live_game(game, callback) {
  const { game_uid, remaining_cards, game_details } = game
  fetch_game_details(game_uid, (error, result) => {
    if (error) {
      callback(error, null)
    } else {
      let remaining_players = []
      game_details.forEach(item => {
        if (item.player_status !== "bust"
          || item.player_status !== "blackjack") {
          remaining_players.push(item.player_name)
        }
      })
      debug("Players still playing: " + " " + remaining_players.length);

      let game_object = {
        game_status: "active",
        players: remaining_players,
        deck_of_cards: remaining_cards,
        current_player: "",
        remaining_players: remaining_players,
        update_at: Date.now()
      }
      update_game_details(game_uid, game_object, (error, result) => {
        if (result) {
          callback(null, { players: game_details, result })
        } else {
          callback(error, null)
        }
      })
    }
  })
}