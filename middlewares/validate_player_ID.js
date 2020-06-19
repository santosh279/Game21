const { fetch_game_details } = require("../DBO/game");


exports.validatePlayerID = function (req, res, next) {
  const { game_id, player_id } = req.params
  if (game_id && player_id) {
    fetch_game_details(game_id, function (error, result) {
      if (error) {
        res.status(500).json({
          message: "Error with the GAME collection",
          error
        })
      } else {
        if (result !== null && result.players.includes(player_id)) {
          next()
        } else {
          res.status(401).json({
            message: "UnAuthorized"
          })
        }
      }
    })
  } else if (!game_id && player_id) {
    next();
  } else {
    res.status(422).json({
      message: "Required player ID"
    })
  }
}