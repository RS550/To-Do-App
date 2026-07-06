import React from 'react';
import Button from '@mui/material/Button';

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
        localStorage.setItem('tasks', JSON.stringify(importedTasks));
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
      <h2>Settings:</h2>
      <div className='spacer'></div>

      <p> Export: Produce a JSON file to save current task list.</p>
      <div className="list-actions">
        <Button
          className="export-button"
          size="small"
          onClick={handleExport}
          sx={actionButtonSx}
        >
          Export
        </Button>

        <div className='spacer'></div>

        <p> Import: Accepts JSON file of tasks that were exported previously.</p>
        <Button
          className="function-button"
          size="small"
          onClick={handleImportClick}
          sx={actionButtonSx}
        >
          Import
        </Button>
        <input
          type="file"
          className="function-button"
          accept="application/json"
          ref={fileInputRef}
          onChange={handleImportChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

export default Settings;