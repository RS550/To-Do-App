import picture from './assets/idle.gif'

function Card(){
    return (
        <div className="card">
            <img className="cardImage" src={picture} alt ="BlueBerry"></img>
            <h2 className="cardTitle">Blueberry</h2>
            <p className="cardText">pet status info here</p>
        </div>
    );
}

export default Card;
