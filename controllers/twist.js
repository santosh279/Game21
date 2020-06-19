const async = require("async");
const debug = require("debug")("game21:twist")

const { fetch_live_game_details, update_live_game_details } = require("../DBO/live_game");
const { fetch_game_details, update_game_details } = require("../DBO/game");
const Blackjack = require("../Utils/blackjack");
const { playerTotal, checkPlayerStatus, removePlayer } = require("../Utils/game_helpers");
const { update_player_details, fetch_player_details } = require("../DBO/players");

/**
 * @api {GET} /game/twist/game_id/player_id Request to draw cards to specific player from current deck
 * @apiName Twist
 * @apiGroup Game21
 * 
 * @apiParam {String} game_id   Game/Round Unique ID. 
 * @apiParam {String} player_id  Player unique name. 
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 Ok
 *    {  
 *        "player": [],
 *        "message" : ""
 *    } 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "message": ""
 *     }
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "message": ""
 *     }
 *     HTTP/1.1 400 Bad request
 *     {
 *       "message": ""
 *     }
 */


exports.twist = function (req, res) {
  const { game_id, player_id } = req.params;
  debug("Twist for player:" + " " + player_id);

  async.waterfall([
    function (callback) {
      checkForGameStatus(game_id, callback);
    }, function (game_result, callback) {
      checkForPlayerStatus(game_result, player_id, callback);
    }, function (player_details, callback) {
      pushPlayerObject(player_details, callback)
    }, function (update_player, callback) {
      update_player_info(update_player, player_id, callback)
    }
  ], function (error, result) {
    if (error) {
      if (error.success) {
        const { statusCode: status, message } = error
        res.status(status).json({
          message,
          player: []
        })
      } else {
        debug("ERROR WITH LIVE GAME: " + " " + JSON.stringify(error))
        res.send(500).json({
          message: "Internal Server Error"
        })
      }
    } else {
      res.status(200).send({
        player: result.player
      })
    }
  })
}


/**
 * Function to check the player status 
 *  if available then get record of the specific player 
 */
function checkForPlayerStatus(game, player_id, callback) {
  const { _id } = game
  fetch_live_game_details(_id, (error, result) => {
    if (error) {
      callback(error, null)
    } else {
      if (result === null) {
        callback({
          statusCode: 400,
          success: true,
          message: "No Player Available"
        })
      } else {
        for (let p = 0; p <= result.game_details.length; p++) {
          const item = result.game_details[p];
          if (item.player_name === player_id) {
            if (item.player_status === "active") {
              callback(null, {
                game,
                player_object: item
              })
              break;
            } else if (item.player_status === "bust") {
              callback({
                statusCode: 200,
                success: true,
                message: "Your score is above 21, busted!!!",

              });
              break;
            } else if (item.player_status === "blackjack") {
              callback({
                statusCode: 200,
                success: true,
                message: "Blackjack, you won!!!"
              })
              break;
            } else if (item.player_status === "stand") {
              callback({
                statusCode: 400,
                success: true,
                message: "You are at stand !!!",
              })
              break;
            } else if (item.player_status === "win") {
              callback({
                statusCode: 400,
                success: true,
                message: "You have won!!",
              })
              break;
            } else if (item.player_status === "loss") {
              callback({
                statusCode: 400,
                success: true,
                message: "You loss!!",
              })
              break;
            }
          } 
        }
      }
    }
  })
}

/**
 * Function to check the game status
 *  if available then get the game records
 */
function checkForGameStatus(game_id, callback) {
  fetch_game_details(game_id, function (error, result) {
    if (error) {
      callback(error, null)
    } else {
      if (result === null) {
        callback({
          statusCode: 400,
          success: true,
          message: "No Game Available"
        })
      } else {
        if (result.game_status === "active") {
          callback(null, result);
        } else {
          callback({
            statusCode: 400,
            success: true,
            message: "Game is Completed"
          })
        }
      }
    }
  })
}


/**
 * Function to push the card to player deck of cards
 */
function pushPlayerObject(object, callback) {
  const { _id } = object.game
  const obj_result = preparePlayerObject(object);
  let gameObject = object.game;
  gameObject["deck_of_cards"] = obj_result.remaining_cards;
  gameObject["current_player"] =
    (obj_result.player_object.player_status === "bust"
      || obj_result.player_object.player_status === "blackjack") ?
      "" : gameObject.current_player
  gameObject["remaining_players"] =
    (obj_result.player_object.player_status === "bust"
      || obj_result.player_object.player_status === "blackjack") ?
      removePlayer(gameObject.remaining_players,
        obj_result.player_object.player_name)
      : gameObject.remaining_players

  update_game_details(_id, gameObject, function (error, result) {
    if (error) {
      callback(error, null)
    } else {
      let { player_object } = obj_result;
      fetch_live_game_details(_id, (error, result) => {
        if (error) {
          callback(error, null)
        } else {
          const index = result.game_details.findIndex(item =>
            item.player_name === player_object.player_name)
          result.game_details[index] = player_object;
          if (index > -1) {
            update_live_game_details(
              result._id,
              result,
              function (error, live_res) {
                if (error) {
                  callback(error, null)
                } else {
                  callback(null, { game: live_res })
                }
              })
          } else {
            callback({ success: true, message: "No Player Found", statusCode: 404 })
          }
        }
      })
    }
  })
}


/**
 * Function to prepare the player object with the deck of cards
 */
function preparePlayerObject(player_details) {
  const { player_object } = player_details;
  const { deck_of_cards: deck } = player_details.game

  /**set the cards */
  let org_stack = new Blackjack.DeckStack(deck);

  /**set the player object */
  /**pop a card from the original deck*/
  let card = org_stack.stack.getCards(1);
  debug("Twist Card for:" + `${player_object.player_name}` + " " + JSON.stringify(card))

  if (card.length) {
    player_object.cardsOnHand = [...player_object.cardsOnHand, ...card];
    player_object.score = playerTotal(player_object.cardsOnHand);
    player_object.player_status = checkPlayerStatus(player_object.score);
  }
  return { remaining_cards: org_stack.stack.cards_remaining(), player_object }
}

/**
 * Function to update the player information for each twist
 */

function update_player_info(player, player_id, callback) {
  const { game_details } = player.game
  for (let p = 0; p < game_details.length; p++) {
    if (game_details[p].player_name === player_id) {
      fetch_player_details(player_id,
        function (error, result) {
          if (error) {
            callback(error, null)
          } else {
            let player_object = result;
            player_object.total_wins =
              game_details[p].player_status === "blackjack" ?
                player_object.total_wins + 1 : player_object.total_wins;
            player_object.total_loses =
              game_details[p].player_status === "bust" ?
                player_object.total_loses + 1 : player_object.total_loses;
            update_player_details(player_object, (error, result) => {
              if (error) {
                callback(error, null)
              } else {
                callback(null, { player: game_details[p] })
              }
            })
          }
        })
    }
  }
}