const { new_game } = require("./new_game");
const { twist } = require("./twist");
const { stand } = require("./stand");
const { player_history } = require("./player_history");
const { dealer } = require("./dealer");
const { save } = require("./save")

module.exports = {
  new_game,
  twist,
  stand,
  dealer,
  player_history,
  save
}