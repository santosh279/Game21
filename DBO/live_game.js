const LIVE_GAME_MODEL = require("../models/live_game");
const error = require("../Utils/error");

const save_live_game_details = (data, callback) => {
  let save_live = new LIVE_GAME_MODEL(data);
  save_live.save(function (error, result) {
    if (error) {
      callback(error, null)
    } else {
      callback(null, result)
    }
  })
}

const fetch_live_game_details = async (data, cb) => {
  await LIVE_GAME_MODEL.findOne({ game_uid: data }, (error, result) => {
    if (error) {
      cb(error, null)
    } else {
      cb(null, result)
    }
  })
}

const update_live_game_details = async (id, data, cb) => {
  delete data._id;
  await LIVE_GAME_MODEL.findByIdAndUpdate({ _id: id },
    { $set: data },
    { new: true },
    function (error, result) {
      if (error) {
        cb(error, null)
      } else {
        cb(null, result)
      }
    })
}

module.exports = {
  save_live_game_details,
  fetch_live_game_details,
  update_live_game_details
}