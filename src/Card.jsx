import petImage from './assets/idle.gif'
import heartImage from './assets/heart.png';

function Card({className}){

    return (
        <div className={`card${className ? ` ${className}` : ''}`}>
            <img
              className="card-image"
              src={petImage}
              alt="BlueBerry"
            ></img>
            <h2 className="card-title">Blueberry</h2>

        </div>
    );
}


export default Card;