import React from 'react';
import Button from '@mui/material/Button';
import { resetAllPersistedState } from './usePersistedState.js';

const actionButtonSx = {
  color: 'inherit',
  padding: '5px',
  marginTop: '3px',
  border: 'none',
  '&:hover': {
    color: 'rgb(75, 40, 115)',
  },
};

//Settings tab: houses task-list-wide actions (currently Export/Import),
function Settings({ tasks, setTasks }) {
  const fileInputRef = React.useRef(null);

  //Reset is destructive (wipes tasks, points, hearts, video, sub-lists), so
  //it asks for confirmation before actually clearing anything - same
  //reveal-a-sub-panel pattern used for "create new sub-list"/"add video" elsewhere.
  const [confirmingReset, setConfirmingReset] = React.useState(false);

  const handleResetClick = () => {
    setConfirmingReset(true);
  };

  const handleCancelReset = () => {
    setConfirmingReset(false);
  };

  const handleConfirmReset = () => {
    resetAllPersistedState();
    setConfirmingReset(false);
  };

  //downloads the current task list as a JSON file the user can save/share
  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.json';
    link.click();

    URL.revokeObjectURL(url);
  };

  //the actual <input type="file"> is hidden; this button just triggers it
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  //reads the chosen JSON file and replaces the current task list with it
  const handleImportChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        if (!Array.isArray(importedTasks)) {
          throw new Error('Imported file is not a task list');
        }
        setTasks(importedTasks);
      } catch (err) {
        console.error('Failed to import tasks:', err);
      }
    };
    reader.readAsText(file);

    //reset so importing the same filename again still fires onChange
    event.target.value = null;
  };

  return (
    <div className="settings-panel">
      <h2 className='settingsTitle'>Settings:</h2>

      <p className='export-text'> Export: Produce a JSON file to save current task list.</p>
      <Button
          className="export-button"
          size="small"
          onClick={handleExport}
          
        >
          Export
        </Button>
      
      <p className='inport-text'> Import: Accepts JSON file of tasks that were exported previously.</p>
        <Button
          className="import-button"
          size="small"
          onClick={handleImportClick}
          
        >
          Import
        </Button>
        <input
          type="file"
          className="export-button"
          accept="application/json"
          ref={fileInputRef}
          onChange={handleImportChange}
          style={{ display: 'none' }}
        />

      <p className='reset-text'> Reset: Permanently clears all saved data (tasks, points, hearts, videos and lists) on this device.</p>
      {confirmingReset ? (
        <div className="reset-confirm">
          <span className="reset-confirm-text">Are you sure? This can't be undone.</span>
          <Button
            className="reset-confirm-button"
            size="small"
            color="error"
            onClick={handleConfirmReset}
          >
            Yes, reset
          </Button>
          <Button
            className="reset-cancel-button"
            size="small"
            onClick={handleCancelReset}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          className="reset-button"
          size="small"
          onClick={handleResetClick}
        >
          Reset
        </Button>
      )}
    </div>
  );
}

export default Settings;