import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

// activeTab / setActiveTab are lifted up to App so the tab selection can
function NavBar({ activeTab, setActiveTab }) {
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box className="navBar">
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="view tabs"
        
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        <Tab
          label="Blueberry"
          className="nav-tab-0"
          id="nav-tab-0"
          aria-controls="nav-tabpanel-0"
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#cac0f5',
              color:'#43139e',
            },
          }}
        />
        <Tab
          label="List"
          className="nav-tab-1"
          id="nav-tab-1"
          aria-controls="nav-tabpanel-1"
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#cac0f5',
              color:'#43139e',
            },
          }}
        />
        <Tab
          label="Lofi"
          className="nav-tab-2"
          id="nav-tab-2"
          aria-controls="nav-tabpanel-2"
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#cac0f5',
              color:'#43139e',

            },
          }}
        />
        <Tab
          label="Settings"
          className="nav-tab-3"
          id="nav-tab-3"
          aria-controls="nav-tabpanel-3"
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#cac0f5',
              color:'#43139e',
            },
          }}
        />
      </Tabs>
    </Box>
  );
}
 
export default NavBar;
 

