const { fetch_game_details, update_game_details } = require("../DBO/game");
const { fetch_live_game_details } = require("../DBO/live_game");
const { update_live_game_details } = require("../DBO/live_game")
const { playerTotal, checkDealerStatus } = require("../Utils/game_helpers");
const Blackjack = require("../Utils/blackjack");

const async = require("async");
const { fetch_player_details, update_player_objects } = require("../DBO/players");

const debug = require("debug")("game21:dealer")


/**
 * @api {GET} /game/game_id/dealer Request to draw cards to Dealer from current deck
 * @apiName Dealer Twist
 * @apiGroup Game21
 * @apiParam {String} game_id  Game/Round Unique ID.
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 Ok
 *    {  
 *      "message" : ""  
 *      "result": {}
 *    } 
 *
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

exports.dealer = function (req, res) {
  debug("dealer twist");
  const { game_id } = req.params;

  fetch_game_details(game_id, function (error, result) {
    if (error) {
      res.status(error).json({
        message: "Error with the game collection"
      })
    } else {
      if (result.remaining_players.length === 1
        && result.remaining_players.indexOf("dealer") > -1) {
        async.waterfall([
          function (callback) {
            twist_dealer_cards(result, callback);
          }
        ], function (error, result) {
          if (error) {
            if (error.success) {
              const { statusCode: status, message } = error
              res.status(status).json({
                message,
                result: {}
              })
            } else {
              debug("ERROR WITH STAND: " + " " + JSON.stringify(error))
              res.send(500).json({
                message: "Internal Server Error"
              })
            }
          } else {
            res.status(200).json({
              result,
              message: "Success"
            })
          }
        })
      } else if (result.remaining_players.length > 1) {
        res.status(400).json({
          message: "Players yet to play, Dealer twist at last!!"
        })
      }
    }
  })
}

/**
 * Function to twist the dealer cards
 */

function twist_dealer_cards(object, callback) {
  let {
    deck_of_cards: deck,
    _id: game_uid } = object

  /**setting the deck globally */
  let org_stack = new Blackjack.DeckStack(deck);

  fetch_live_game_details(game_uid, function (error, live_result) {
    if (error) {
      callback(error, null)
    } else {
      const index = live_result.game_details.findIndex(item =>
        item.player_name === "dealer");
      const winner = live_result.game_details.filter(item => item.player_status === "win");
      if (winner.length === 0) {
        if (live_result.game_details[index].score > 21) {
          live_result.game_details.map(item => {
            if (item.player_name !== "dealer") {
              item.player_status = "win"
            }
          })
          live_result.game_details[index].player_status = "loss"
          update_live_game_details(live_result._id, live_result,
            function (error, result) {
              if (error) {
                callback(error, null)
              } else {
                update_game_and_player_details(result, callback)
              }
            })
        } else if (live_result.game_details[index].score <= 17) {
          let card = org_stack.stack.getCards(1);
          live_result.game_details[index].cardsOnHand =
            [...card, ...live_result.game_details[index].cardsOnHand]
          live_result.game_details[index].score =
            playerTotal(live_result.game_details[index].cardsOnHand);
          live_result.game_details[index].status =
            checkDealerStatus(live_result.game_details[index].score);
          update_live_game_details(live_result._id,
            live_result, (error, result) => {
              if (error) {
                callback(error, null)
              } else {
                result["remaining_cards"] = org_stack.stack.cards_remaining();
                update_game_details_next_twist(live_result.game_details, result, callback)
              }
            })
        } else if (live_result.game_details[index].score === 21) {
          updateTieOrWinDealer(live_result, callback)
        } else {
          const dealer_score = live_result.game_details[index].score
          checkForNearest21(live_result, dealer_score, callback)
        }
      } else {
        const winnerList = []
        winner.map(item => {
          let winnerObj = {}
          winnerObj["player"] = item.player_name
          winnerObj["score"] = item.score
          winnerObj["status"] = item.player_status
          winnerList.push(winnerObj)
        })
        let forSave = {
          game_status: "done",
          game_end_status: winnerList
        }
        callback(null, forSave)
      }
    }
  })
}

/**
 * Function to update game and player information
 */
function update_game_and_player_details(object, callback) {
  const { game_uid } = object;
  fetch_player_details(game_uid, function (error, player_result) {
    if (error) {
      callback(error, null)
    } else {
      if (player_result !== null) {
        object.game_details.forEach(i => {
          if (i.player_status === "win") {
            player_result.total_wins = player_result.total_wins + 1
            update_player_objects(player_result._id, player_result,
              function (error, result) {
                if (error) {
                  callback(error, null)
                }
              })
          } else if (i.player_status === "loss") {
            player_result.total_loses = player_result.total_loses + 1
            update_player_objects(player_result._id, player_result,
              function (error, result) {
                if (error) {
                  callback(error, null)
                }
              })
          }
        })
      }
      const winnerList = []
      object.game_details.map(item => {
        let winnerObj = {}
        winnerObj["player"] = item.player_name
        winnerObj["score"] = item.score
        winnerObj["status"] = item.player_status
        winnerList.push(winnerObj)
      })
      let forSave = {
        game_status: "done",
        game_end_status: winnerList
      }
      callback(null, forSave)
    }
  })
}

/**
 * Function to update the game details for next twist for dealer
 */

function update_game_details_next_twist(player, object, callback) {
  const { game_uid, remaining_cards } = object;
  fetch_game_details(game_uid, function (error, result) {
    if (error) {
      callback(error, null)
    } else {
      result.deck_of_cards = remaining_cards
      result.current_player = "dealer"
      result.remaining_players = ["dealer"]
      result.update_at = Date.now()

      update_game_details(result._id, result, function (error, game_res) {
        if (error) {
          callback(error, null)
        } else {
          callback(null, player)
        }
      })
    }
  })
}

/**
 * Function to check for the nearest 21 and update the game and live game
 */
function checkForNearest21(object, dealer_score, callback) {
  const { game_details } = object;
  let player = []
  game_details.map(item => {
    if (item.score >= dealer_score && item.score <= 21) {
      player.push(item)
    }
  })
  if (player.length === 0) {
    updateCall(object, "dealer", false, callback)
  } else if (player.length) {
    let max = Math.max.apply(Math, player.map(i => i.score))
    for (let p = 0; p <= player.length; p++) {
      const element = player[p];
      if (p !== player.length) {
        updateCall(object, element, max, true, callback)
      } else {
        const winnerList = []
        object.game_details.map(item => {
          let winnerObj = {}
          winnerObj["player"] = item.player_name
          winnerObj["score"] = item.score
          winnerObj["status"] = item.player_status
          winnerList.push(winnerObj)
        })
        let forSave = {
          game_status: "done",
          game_end_status: winnerList
        }
        callback(null, forSave)
      }
    }
  }
}

/**
 * Function to custom update live game and player.
 */
function updateCall(object, player, max, value, callback) {
  object.game_details.map((item) => {
    if (item.score === max) {
      item.player_status = "win"
    } else {
      item.player_status = "loss"
    }
  })
  update_live_game_details(object._id, object,
    function (error, result) {
      if (error) {
        callback(error, null)
      } else {
        fetch_player_details(player.player_name,
          function (error, player_result) {
            if (error) {
              callback(error, null)
            } else {
              if (player_result !== null) {
                const new_item = result.game_details
                  .filter(item => item.player_name === player.player_name);
                new_item.forEach(i => {
                  if (i.player_status === "win") {
                    player_result.total_wins = player_result.total_wins + 1
                    update_player_objects(player_result._id, player_result,
                      function (error, result) {
                        if (error) {
                          callback(error, null)
                        }
                      })
                  } else if (i.player_status === "loss") {
                    player_result.total_loses = player_result.total_loses + 1
                    update_player_objects(player_result._id, player_result,
                      function (error, result) {
                        if (error) {
                          callback(error, null)
                        }
                      })
                  }
                })
              }
            }
          })
      }
    })
}

/**
 * Function to update if there is a tie on either of the ends
 */

function updateTieOrWinDealer(object, callback) {
  const { game_details } = object;
  let playersWith21 = []
  game_details.map(item => {
    if (item.score === 21) {
      playersWith21.push(item)
    }
  })
  let max = Math.max.apply(Math, playersWith21.map(i => i.score))
  for (let p = 0; p <= playersWith21.length; p++) {
    const element = playersWith21[p];
    if (p !== playersWith21.length) {
      updateCall(object, element, max, true, callback)
    } else {
      const winnerList = []
      object.game_details.map(item => {
        let winnerObj = {}
        winnerObj["player"] = item.player_name
        winnerObj["score"] = item.score
        winnerObj["status"] = item.player_status
        winnerList.push(winnerObj)
      })
      let forSave = {
        game_status: "done",
        game_end_status: winnerList
      }
      callback(null, forSave)
    }
  }
}

