import petImage from './assets/idle.gif'
import focusPicture from './assets/background.jpg';

function Card({focusMode}){
    return (
        <div className="card">
            <img
              className="cardImage"
              src={focusMode ? focusPicture : petImage}
              alt={focusMode ? "BlueBerry focusing" : "BlueBerry"}
            ></img>
            <h2 className="cardTitle">Blueberry</h2>
            <p className="cardText">pet status info here</p>
        </div>
    );
}
 


export default Card;
