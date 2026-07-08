import petImage from './assets/idle.gif';
import Heartmeter from './Heartmeter.jsx';

function Card({className, heartsOwned}){

    return (
        <div className={`card${className ? ` ${className}` : ''}`}>
            <img
              className="card-image"
              src={petImage}
              alt="BlueBerry"
            ></img>
            <h2 className="card-title">Blueberry</h2>
            <Heartmeter heartsOwned={heartsOwned} />

        </div>
    );
}


export default Card;