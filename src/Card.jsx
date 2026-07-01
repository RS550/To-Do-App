<<<<<<< Updated upstream
import picture from './assets/idle.gif'

function Card(){
    return (
        <div className="card">
            <img className="cardImage" src={picture} alt ="BlueBerry"></img>
=======
import petImage from './assets/idle.gif'

function Card({className}){
    return (
        <div className={`card${className ? ` ${className}` : ''}`}>
            <img
              className="cardImage"
              src={petImage}
              alt="BlueBerry"
            ></img>
>>>>>>> Stashed changes
            <h2 className="cardTitle">Blueberry</h2>
            <p className="cardText">pet status info here</p>
        </div>
    );
}
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes


export default Card;