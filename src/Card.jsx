import petImage from './assets/idle.gif'

function Card({className}){
    return (
        <div className={`card${className ? ` ${className}` : ''}`}>
            <img
              className="cardImage"
              src={petImage}
              alt="BlueBerry"
            ></img>
            <h2 className="cardTitle">Blueberry</h2>
            <p className="cardText">pet status info here</p>
        </div>
    );
}


export default Card;