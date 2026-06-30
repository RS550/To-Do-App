function NavBar({ focusMode, setFocusMode, showPet, setShowPet }) {
  
    return (
    <nav className="navBar">
      <button
        className="focus"
        onClick={() => setFocusMode((prev) => !prev)}
      >
        {focusMode ? 'Exit Focus' : 'Focus'}
      </button>

      <label className="toggleSwitch">
        <input
          type="checkbox"
          checked={!showPet}
          onChange={() => setShowPet((prev) => !prev)}
        />
        <span className="toggleSlider"></span>
        <span className="toggleLabel">Pet View</span>
      </label>
    </nav>
  );
}

export default NavBar;