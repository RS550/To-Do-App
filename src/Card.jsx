import picture from './assets/idle.gif'

function Card(){
    return (
        <div className="card">
            <img className="card-image" src={picture} alt ="BlueBerry"></img>
            <h2 className="card-title">Blueberry</h2>
            <p className="card-text">pet status info here</p>
        </div>
    );
}

export default Card;