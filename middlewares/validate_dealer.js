const { fetch_game_details } = require("../DBO/game");
const { ErrorHandler } = require("../Utils/error")

exports.validateDealerParams = function (req, res, next) {
  const { game_id } = req.params;
  if (game_id) {
    fetch_game_details(game_id, function (error, result) {
      if (error) {
        res.status(500).json({
          message: "Error with the GAME collection",
          error
        })
      } else {
        if (result === null) {
          res.status(404).json({
            message: "No Game Found"
          })
        } else {
          next()
        }
      }
    })
  } else {
    res.status(422).json({
      message: "Unsupported Format"
    })
  }

}