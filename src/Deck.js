import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
import Card from "./Card";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

function Deck() {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timeRef = useRef(null);

    // load deck from API into the state 
    useEffect(() => {
        async function getData() {
            let d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
            setDeck(d.data);
        }
        getData();
    }, [setDeck]);

    // if autodraw is true, draw one card every second 
    useEffect(() => {
        // draw a card and add it to "drawn" state 
        async function getCard() {
            let {deck_id} = deck;

            try {
                let drawResp = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);

                // if no cards left, change autodraw to false 
                if (drawResp.data.remaining === 0) {
                    setAutoDraw(false);
                    throw new Error("No cards remaining!");
                }

                const card = drawResp.data.cards[0];

                setDrawn(d => [
                    ...d,
                    {
                        id: card.code,
                        name: card.suit + " " + card.value,
                        image: card.image 
                    }
                ]);
            } catch (err) {
                alert(err);
            }
        }

        if (autoDraw && !timeRef.current) {
            timeRef.current = setInterval(async () => {
                await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timeRef.current);
            timeRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    };

    const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));

    return (
        <div>
            {deck ? (
                <button onClick={toggleAutoDraw}>
                    {autoDraw ? "Stop" : "Start"} drawing!
                </button>
            ) : null}
            <div>{cards}</div>
        </div>
    );
}

export default Deck;