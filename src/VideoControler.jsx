import React, { useState, useRef, useEffect } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import AddIcon from '@mui/icons-material/Add';
import usePersistedState from './usePersistedState.js';


// localStorage key used to persist any custom videos the user has added,
// independent of the built-in presets
const CUSTOM_VIDEOS_STORAGE_KEY = 'customVideos';

//StyleControls
const videoMenuItemSx = {
  '&.Mui-selected': {
    backgroundColor: '#8573d3',
    color: '#cac0f5',
    '&:hover': {
      backgroundColor: '#7160c1',
    },
  },
};

const videoButtonSx = {
  color: 'inherit',
  border: 'none',
  '&:hover': {
    backgroundColor: 'inherit',
  },
};

export const PRESET_VIDEOS = [
  { id: 'preset-1', name: 'Synthwave Radio', videoId: '4xDzrJKXOOY' },
  { id: 'preset-2', name: 'Lofi Girl', videoId: 'X4VbdwhkE10' },
  { id: 'preset-3', name: 'Spring Mornings', videoId: 'wePMdTNW3C4' },
  { id: 'preset-4', name: 'Costal Coffee Vibes', videoId: 'v7gCSBMuBog' },
];
 
// Pulls the 11-character video id out of any of the common YouTube URL
// shapes (watch?v=, youtu.be/, embed/, or a bare id pasted directly).
export function extractYouTubeId(input) {
  if (!input) return null;
  const trimmed = input.trim();
 
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /^([\w-]{11})$/,
  ];
 
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// selectedVideoId / setSelectedVideoId are lifted up to App so the choice
// can be shared with whatever renders the actual <iframe>.
function VideoControler({ 
    selectedVideoId,
    setSelectedVideoId,
    isPlaying,
    onToggle,
    panelId = 'video-dropdown',
   }) {
  
  const [customVideos, setCustomVideos] = usePersistedState(CUSTOM_VIDEOS_STORAGE_KEY, []);
const [menuAnchor, setMenuAnchor] = useState(null);
  const menuOpen = Boolean(menuAnchor);
 
  // swaps the menu's contents from "pick a video" to "paste a URL in",
  // same pattern DropDownMenu.jsx uses for creating a new sub-list
  const [addingVideo, setAddingVideo] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const newVideoInputRef = useRef(null);
 
  useEffect(() => {
    if (addingVideo && newVideoInputRef.current) {
      newVideoInputRef.current.focus();
    }
  }, [addingVideo]);
 
  const allVideos = [...PRESET_VIDEOS, ...customVideos];
  const selectedVideo = allVideos.find((v) => v.videoId === selectedVideoId);
 
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };
 
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setAddingVideo(false);
    setNewVideoUrl('');
    setUrlError('');
  };
 
  const handleSelect = (videoId) => {
    setSelectedVideoId(videoId);
    handleMenuClose();
  };
 
  const handleStartAddVideo = () => {
    setAddingVideo(true);
  };
 
  const handleNewVideoSubmit = (event) => {
    event.preventDefault();
    const videoId = extractYouTubeId(newVideoUrl);
 
    if (!videoId) {
      setUrlError('Enter a valid YouTube URL');
      return;
    }
 
    // if it's already in the list (preset or previously added), just
    // select it instead of creating a duplicate entry
    const existing = allVideos.find((v) => v.videoId === videoId);
    if (existing) {
      handleSelect(existing.videoId);
      return;
    }
 
    const newVideo = { id: `custom-${videoId}`, name: 'Custom video', videoId };
 
    setCustomVideos((prev) => [...prev, newVideo]);
 
    setSelectedVideoId(videoId);
    handleMenuClose();
  };
  
 
  return (
    <div className="video-dropdown-wrapper">
      <IconButton
        onClick={onToggle}
        aria-label={isPlaying ? 'pause video' : 'play video'}
        size="small"
        sx={videoButtonSx}
      >
        {isPlaying ? <MusicNoteIcon /> : <MusicOffIcon />}
      </IconButton>
      <Button
        className="video-dropdown"
        aria-label="select video"
        aria-controls={menuOpen ? `${panelId}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
        size="small"
        endIcon={<ArrowDropDownIcon />}
        onClick={handleMenuOpen}
        sx={videoButtonSx}
      >
        {selectedVideo ? selectedVideo.name : 'Select video'}
      </Button>
      <Menu
        id={`${panelId}-menu`}
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={handleMenuClose}
      >
        {allVideos.map((video) => (
          <MenuItem
            key={video.id}
            selected={selectedVideoId === video.videoId}
            onClick={() => handleSelect(video.videoId)}
            sx={videoMenuItemSx}
          >
            {video.name}
          </MenuItem>
        ))}
 
        {addingVideo ? (
          // a form so Enter submits; stopPropagation on keydown keeps
          // MUI's Menu from treating keystrokes as list-navigation
          // shortcuts (same trick DropDownMenu.jsx uses)
          <MenuItem
            disableRipple
            onKeyDown={(e) => e.stopPropagation()}
            sx={{ '&:hover': { backgroundColor: 'transparent' }, cursor: 'default' }}
          >
            <form
              className="new-video-form"
              onSubmit={handleNewVideoSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
            >
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <TextField
                  inputRef={newVideoInputRef}
                  size="small"
                  variant="standard"
                  placeholder="Paste YouTube URL"
                  value={newVideoUrl}
                  onChange={(e) => {
                    setNewVideoUrl(e.target.value);
                    if (urlError) setUrlError('');
                  }}
                  onClick={(e) => e.stopPropagation()}
                  error={Boolean(urlError)}
                />
                <Button type="submit" size="small" sx={videoButtonSx}>
                  Add
                </Button>
              </div>
              {urlError && (
                <span style={{ fontSize: '12px', color: '#b3261e' }}>{urlError}</span>
              )}
            </form>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleStartAddVideo} sx={videoMenuItemSx}>
            <AddIcon fontSize="small" style={{ marginRight: '6px' }} />
            Add video by URL
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
 
export default VideoControler;