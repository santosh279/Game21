const { popCards } = require("./game_helpers");

const debug = require("debug")("game21:gamebook")


function Deck(options) {
  debug("Creating a new deck of cards");

  this.deckList = generator(options.deckCount)
}


function generator(deckCount) {
  const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const deck = [];
  for (let d = 0; d < deckCount; d++) {
    for (let v = 0; v < values.length; v++) {
      for (let s = 0; s < suits.length; s++) {
        let card;
        if (["Jack", "Queen", "King"].includes(values[v])) {
          card = { displayValue: values[v], Suit: suits[s], value: 10 };
        } else {
          card = { displayValue: values[v], Suit: suits[s], value: v + 1 }
        }
        deck.push(card)
      }
    }
  }
  return deck;
}

exports.Game = function (opts) {
  debug("Creating Game");

  this.deck = new Deck(opts);
}

exports.DeckStack = function (deck) {
  this.stack = new deckList(deck)
}

function deckList(deck) {
  this.deckStack = deck
}

deckList.prototype.cards_remaining = function () {
  debug("Cards in Dealers Hand :" + " " + parseInt(this.deckStack.length))
  let cards = this.deckStack;
  return cards
}

deckList.prototype.getCards = function (iteration) {
  let numberOfIteration = iteration ? iteration : 2
  let cards = []
  for (let i = 0; i < numberOfIteration; i++) {
    let obj = this.deckStack.pop()
    cards.push(obj)
  }
  return cards;
}




