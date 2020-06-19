let router = require("express").Router();

/**Controllers */
const { new_game,
  twist,
  stand,
  save,
  dealer,
  player_history } = require("./controllers");


/**Validations */
const { validatePlayersCount,
  validatePlayerID, validateDealerParams: validateGameId, validateSavebody } = require("./middlewares");


/**
 * Initiate game and players initial cards
 */
router.post("/new_game", validatePlayersCount, new_game)

/**
 * Twist API request(draw cards to specific player from current deck)
 */
router.get("/twist/:game_id/:player_id", validateGameId, validatePlayerID, twist);

/**
 * Stand API request(draw cards to Dealer from current deck)
 */
router.get("/stand/:game_id/:player_id", validateGameId, validatePlayerID, stand);

/**
 * Stand API request(draw cards to Dealer from current deck)
 */
router.get("/:game_id/dealer", validateGameId, dealer);

/**
 * Player history API request(get the history for a given player)
 */
router.get("/:player_id", validatePlayerID, player_history);

/**
 * Request endpoint to save the state after each rounds
 */
router.put("/:game_id/save", validateGameId, validateSavebody, save)

module.exports = router;