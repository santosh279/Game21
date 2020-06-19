const debug = require("debug")("game21:validation")
const { ErrorHandler } = require("../Utils/error")

exports.validatePlayersCount = (req, res, next) => {
  const { player_count } = req.query;
  if (parseInt(player_count) < 3) {
    next()
  } else {
    let error;
    if (parseInt(player_count) >= 3) {
      error = new ErrorHandler(422, "doesnt_support");
    } else {
      error = new ErrorHandler(422, 'invalid_player_count');
    }
    throw error
  }
}