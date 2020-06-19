const { fetch_player_details } = require("../DBO/players");

const debug = require("debug")("game21:player_history");

/**
 * @api {GET} /game/player_id Request to get the history for a given player
 * @apiName Player History
 * @apiGroup Game21
 * 
 * @apiParam {String} player_id  Player unique name. 
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 Ok
 *    {  
 *        "player": {}
 *    } 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "message": ""
 *     }
 *     HTTP/1.1 404 No Record Found
 *     {
 *       "message": ""
 *     }
 *     HTTP/1.1 400 Bad request
 *     {
 *       "message": "",
 *       "error" : {}
 *     }
 */

exports.player_history = function (req, res) {
  const { player_id } = req.params;
  debug("player history: " + JSON.stringify(player_id));

  fetch_player_details(player_id, function (error, result) {
    if (error) {
      res.send(400).json({
        message: "Error with player collection",
        error: error
      })
    } else {
      if (result === null) {
        res.status(404).json({
          message: "No Records Found"
        })
      } else {
        res.status(200).json({
          player: result
        })
      }
    }
  })
}