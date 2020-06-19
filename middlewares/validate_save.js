const debug = require("debug")("game21:save");
const Joi = require('joi');

exports.validateSavebody = function (req, res, next) {
  const data = req.body;
  let object = Joi.object().keys({
    player: Joi.string().required(),
    status: Joi.string().required(),
    score: Joi.number().required()
  })
  const schema = Joi.object().keys({
    game_status: Joi.string().valid("done").required(),
    game_end_status: Joi.array().items(object).required()
  })

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      debug("Error with save validation" + " " + JSON.stringify(err))
      res.status(422).json({
        message: "Validation Error.",
        error: err
      })
    } else {
      next()
    }
  })
}