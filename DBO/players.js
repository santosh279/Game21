const PLAYERS_MODEL = require("../models/player");

const save_players_details = async (data, cb) => {
  let playerData = new PLAYERS_MODEL(data)
  await playerData.save(function (error, result) {
    if (error) {
      cb(error, null)
    } else {
      cb(null, result)
    }
  })

}

const fetch_player_details = async (data, cb) => {
  await PLAYERS_MODEL.findOne({ name: data }, { __v: 0 },
    function (error, result) {
      if (error) {
        cb(error, null)
      } else {
        cb(null, result)
      }
    })
}

const update_player_details = async (data, cb) => {
  await PLAYERS_MODEL
    .findOneAndUpdate({ name: data.name },
      { $set: { total_games: data.total_games } },
      function (error, result) {
        if (error) {
          cb(error, null)
        } else {
          cb(null, result)
        }
      })
}

const update_player_objects = async (id, data, cb) => {
  await PLAYERS_MODEL.findByIdAndUpdate({ _id: id },
    { $set: data },
    function (error, result) {
      if (error) {
        cb(error, null)
      } else {
        cb(null, result)
      }
    })
}


module.exports = {
  save_players_details,
  fetch_player_details,
  update_player_details,
  update_player_objects
}