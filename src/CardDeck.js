import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Card from "./Card";
import "./CardDeck.css";
import { v4 as uuid } from "uuid";

const CardDeck = () => {
  const [cards, setCards] = useState([]);
  const [drawCard, setDrawCard] = useState(false);
  const [cardsRemaining, setCardsRemaining] = useState(true);
  const [cardsShuffled, setCardsShuffle] = useState(false);
  const [buttonText, setButtonText] = useState("Start Drawing!");
  const timerId = useRef();

  useEffect(() => {
    if (!cardsShuffled) {
      shuffleCard();
    }
    if (drawCard) {
      if (cardsRemaining) {
        timerId.current = setInterval(() => {
          getCard();
        }, 300);
      }
    }
  }, [cardsShuffled, drawCard, cardsRemaining]);

  const shuffleCard = () => {
    axios
      .get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((res) => {
        setCardsShuffle(res.data.deck_id);
      });
  };
  const getCard = () => {
    axios
      .get(`https://deckofcardsapi.com/api/deck/${cardsShuffled}/draw/?count=1`)
      .then((res) => {
        setCards((cards) => {
          if (res.data.remaining !== 0) {
            res.data.cards[0].id = uuid();
            return [...cards, res.data.cards[0]];
          } else {
            endGame();
            return cards;
          }
        });
      });
    setDrawCard(false);
  };
  const endGame = () => {
    setCardsRemaining(false);
    pauseDraws(true);
    setButtonText("Game Over");
    alert("Error: No more cards");
  };

  const pauseDraws = (endGame) => {
    clearInterval(timerId.current);
    timerId.current = undefined;
    if (!endGame) {
      setButtonText("Start Drawing!");
    }
  };
  const pullCard = () => {
    if (timerId.current) {
      pauseDraws();
    } else {
      setDrawCard(true);
      setButtonText("Stop Drawing!");
    }
  };

  return (
    <>
      <button onClick={pullCard}>{buttonText}</button>
      <div className="CardDeck">
        {cards.map((card, i) => (
          <Card
            image={card.image}
            value={card.value}
            suit={card.suit}
            code={card.code}
            key={card.id}
            count={i}
          />
        ))}
      </div>
    </>
  );
};

export default CardDeck;
