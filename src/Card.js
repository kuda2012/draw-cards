import React from "react";
import "./Card.css";

const Card = ({ image, id, count }) => {
  return (
    <div className="Card" id={id}>
      <img src={image} alt={`Card${count}`} />
    </div>
  );
};

export default Card;
