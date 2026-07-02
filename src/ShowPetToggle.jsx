import CustomTabPanel from './CustomTabPanel.jsx';

function ShowPetToggle({ showPet, setShowPet }) {
  return (
    <nav className="show-pet">
      <label className="toggleSwitch">
        <input
          type="checkbox"
          checked={!showPet}
          onChange={() => setShowPet((prev) => !prev)}
        />
        <p>{showPet ? "Hide Blueberry" : "Show Blueberry"}</p>
        <span className="toggleSlider"></span>
      </label>
    </nav>
  );
}

export default ShowPetToggle;