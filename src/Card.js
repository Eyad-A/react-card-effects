import React, {useState} from "react";

function Card({name, image}) {
    return <img alt={name} src={image} />;
}

export default Card;