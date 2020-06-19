const debug = require("debug")("game21:twistparamsvalidation");
const { ErrorHandler } = require("../Utils/error")

exports.validateParams = (req, res, next) => {
  const { game_id, player_id: name } = req.params;
  if (game_id && name) {
    next()
  } else {
    let error;
    if (game_id && !name) {
      error = new ErrorHandler(422, "required_player_id");
      throw error
    } else if (!game_id && name) {
      error = new ErrorHandler(422, "required_game_id");
      throw error
    }
    error = new ErrorHandler(422, "unsupported_format");
    throw error
  }
}