const createPlayers = (players_count) => {
  let playerList = []
  for (let p = 1; p <= players_count; p++) {
    playerList.push(`p${p}`);
  }
  return playerList
}

const shuffle = (deck) => {
  for (let i = 0; i < 1000; i++) {
    let location1 = Math.floor((Math.random() * deck.length));
    let location2 = Math.floor((Math.random() * deck.length));
    let tmp = deck[location1];

    deck[location1] = deck[location2];
    deck[location2] = tmp;
  }
  return deck;
}

const playerTotal = (deck) => {
  let sum = 0;
  for (let i = 0; i < deck.length; i++) {
    if (isAce(deck[i]) && ["Jack", "King", "Queen"].includes(deck[i].displayValue)) {
      sum = 21;
    } else if (isAce(deck[i]) && sum <= 10) {
      sum = sum + 11;
    } else {
      sum = sum + deck[i].value
    }
  }
  return sum
}

const twistTotal = (score, card) => {
  return (isAce(card) && score <= 10) ? score + 11 : score + card.value
}

const isAce = (card) => {
  if (card.displayValue === "Ace") {
    return true
  }
  return false
}

const checkDealerStatus = (score) => {
  if (score === 21) {
    return "blackjack"
  } else if (score > 21) {
    return "bust"
  } else if (score >= 17 && score < 20) {
    return "stand"
  } else {
    return "active"
  }
}

const checkPlayerStatus = (score) => {
  if (score > 21) {
    return "bust"
  } else if (score === 21) {
    return "blackjack"
  } else {
    return "active"
  }
}

const removePlayer = (players, id) => {
  const index = players.indexOf(id);
  if (index > -1) {
    players.splice(index, 1)
  }
  return players;
}

module.exports = {
  createPlayers,
  shuffle,
  playerTotal,
  checkPlayerStatus,
  removePlayer,
  checkDealerStatus,
  twistTotal
}