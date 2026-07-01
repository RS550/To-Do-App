function NavBar({ showPet, setShowPet }) {

    return (
    <nav className="navBar">
      <label className="toggleSwitch">
        <input
          type="checkbox"
          checked={!showPet}
          onChange={() => setShowPet((prev) => !prev)}
        />
        <span className="toggleSlider"></span>
        <span className="toggleLabel">Pet View</span>
        <button className='completed-tasks'>Done</button>
        <button className='top-three'>Priority</button>
      </label>
    </nav>
  );
}

export default NavBar;