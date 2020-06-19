const { fetch_live_game_details, update_live_game_details } = require("../DBO/live_game");

const async = require("async");
const { update_game_details, fetch_game_details } = require("../DBO/game");
const { removePlayer } = require("../Utils/game_helpers");
const debug = require("debug")("game21:stand");

/**
 * @api {GET} /game/stand/game_id/player_id Request to stand the player after the twist
 * @apiName Stand
 * @apiGroup Game21
 * 
 * @apiParam {String} game_id   Game/Round Unique ID. 
 * @apiParam {String} player_id  Player unique name. 
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 Ok
 *    {  
 *      "message" : ""  
 *      "player": {}
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

exports.stand = (req, res) => {
  const { game_id, player_id } = req.params;

  debug("Stand for:" + " " + JSON.stringify(player_id));
  if (player_id !== "dealer") {
    fetch_live_game_details(game_id, function (error, result) {
      if (error) {
        debug("Error here:" + JSON.stringify(error))
        res.status(400).json({
          message: "Error with the Live game collection.",
          error: error
        })
      } else {
        if (result !== null) {
          async.waterfall([
            function (callback) {
              update_live_game(result, player_id, callback)
            }, function (livegame, callback) {
              update_game_object(livegame, player_id, callback)
            }
          ],
            function (error, result) {
              if (error) {
                if (error.success) {
                  const { statusCode: status, message } = error
                  res.status(status).json({
                    message,
                    player: {}
                  })
                } else {
                  debug("ERROR WITH STAND: " + " " + JSON.stringify(error))
                  res.send(500).json({
                    message: "Internal Server Error"
                  })
                }
              } else {
                res.status(200).json({
                  player: result,
                  message: "Success"
                })
              }
            })
        } else {
          res.status(404).json({
            message: "No Game Found"
          })
        }
      }
    })
  } else {
    res.status(401).json({
      message: "Unauthorized"
    })
  }
}

/**
 * Function to update the live game player status
 */
function update_live_game(object, player_id, callback) {
  const index = object.game_details.findIndex(item =>
    item.player_name === player_id);
  if (index > -1) {
    object.game_details[index].player_status =
      object.game_details[index].player_status === "bust" ?
        object.game_details[index].player_status : "stand";
    update_live_game_details(object._id, object, function (error, result) {
      if (error) {
        callback(error, null)
      } else {
        callback(null, result)
      }
    })
  } else {
    callback({ success: true, statusCode: 404, message: "No Player Found" })
  }
}

/**
 * Function to update the game details remaining player
 */
function update_game_object(object, player_id, callback) {
  const { game_uid, game_details } = object;
  fetch_game_details(game_uid, function (error, result) {
    if (error) {
      callback(error, null)
    } else {
      const index = result.remaining_players.indexOf(player_id);
      if (index > -1) {
        result.remaining_players = removePlayer(result.remaining_players, player_id);
        result.current_player = "";
        update_game_details(result._id, result, function (error, game_res) {
          if (error) {
            callback(error, null)
          } else {
            const player = game_details.filter(item => item.player_name === player_id)
            callback(null, player[0])
          }
        })
      } else {
        let hasCalled = false;
        game_details.forEach(element => {
          if (!hasCalled) {
            if (element.player_status === "bust") {
              hasCalled = true;
              callback({
                statusCode: 200,
                success: true,
                message: "Your score is above 21, busted!!"
              });
            } else if (element.player_status === "stand") {
              hasCalled = true;
              callback({
                statusCode: 200,
                success: true,
                message: "You are at stand!!"
              });
            } else if (element.player_status === "blackjack") {
              hasCalled = true;
              callback({
                statusCode: 200,
                success: true,
                message: "Blackjack, you won!!"
              })
            } else if (element.player_status === "win") {
              hasCalled = true;
              callback({
                statusCode: 200,
                success: true,
                message: "You won!!"
              })
            } else if (element.player_status === "loss") {
              hasCalled = true;
              callback({
                statusCode: 200,
                success: true,
                message: "You loss!!"
              })
            }
          }
        });
      }
    }
  })
} 
