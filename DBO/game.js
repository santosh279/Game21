const GAME_MODEL = require("../models/game");

const save_game_details = async (data, cb) => {
  let gameData = new GAME_MODEL(data)
  gameData.save(function (error, result) {
    if (error) {
      cb(error, null)
    } else {
      cb(null, result)
    }
  })
}

const fetch_game_details = async (data, cb) => {
  await GAME_MODEL.findById({ _id: data }, { __v: 0, created_at: 0, updated_at: 0 },
    (error, result) => {
      if (error) {
        cb(error, null)
      } else {
        cb(null, result)
      }
    })
}

const update_game_details = async (game_uid, data, cb) => {
  await GAME_MODEL.findByIdAndUpdate({ _id: game_uid },
    { $set: data },
    { new: true }, function (error, result) {
      if (error) {
        cb(error, null)
      } else {
        cb(null, result)
      }
    })
}

module.exports = {
  save_game_details,
  fetch_game_details,
  update_game_details
}