const { fetch_game_details, update_game_details } = require("../DBO/game");

const debug = require("debug")("game21:save");

/**
 * @api {PUT} /game/game_id/save Request to save the state after each rounds
 * @apiName Save
 * @apiGroup Game21
 * 
 * @apiParam {String} game_id   Game/Round Unique ID. 
 * 
 * @apiParamExample {json} Request-Input:
 *     {
 *       "game_status": "done", //game_status provided from the dealer API
 *       "game_end_status" : [] //game_end_status provided from the dealer API
 *     }
 * 
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

exports.save = (req, res) => {
  const { game_id } = req.params;
  const { game_status, game_end_status } = req.body

  debug("Save game for:" + "game " + JSON.stringify(game_id));

  fetch_game_details(game_id, function (error, result) {
    if (error) {
      res.status(500).json({
        message: "Error with the game collection",
        error: error
      })
    } else {
      if (result !== null) {
        result.game_end_status = game_end_status
        result.game_status = game_status
        result.remaining_players = []
        result.current_player = ""
        update_game_details(result._id, result,
          function (error, result) {
            if (error) {
              res.status(400).json({
                message: "Error while saving game record.",
                error: error
              })
            } else {
              res.status(200).json({
                message: "Updated Successfully",
                result
              })
            }
          })
      } else {
        res.status(400).json({
          message: "No Game Found"
        })
      }
    }
  })
}
