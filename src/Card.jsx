import petImage from './assets/idle.gif'
import heartImage from './assets/heart.png';

function Card({className}){

    return (
        <div className={`card${className ? ` ${className}` : ''}`}>
            <img
              className="cardImage"
              src={petImage}
              alt="BlueBerry"
            ></img>
            <h2 className="cardTitle">Blueberry</h2>
            <p className="cardText">Boo </p>
            <img
              className="heart-icon"
              src={heartImage} />
        </div>
    );
}


export default Card;