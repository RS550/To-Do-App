# 🫐 Blueberries To-Do List

A React + Vite to-do app with task prioritization, due dates, drag-and-drop reordering, and a virtual pet companion to keep you company while you work.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white) ![MUI](https://img.shields.io/badge/MUI-9-007FFF?logo=mui&logoColor=white)

<img width="1890" height="2466" alt="BlueberriesToDo" src="https://github.com/user-attachments/assets/b8b70197-dea0-40a3-a881-0a8c7bc18261" />
🔗 Live demo: [blueberries-to-do-app.vercel.app](https://blueberries-to-do-app.vercel.app)

## Features
 
- **Task creation** with an optional priority rating (1–5 stars), due date, and project assignment, tucked behind an expandable "More Information" panel — now positioned below the pet companion and jar so those stay front and center
- **Custom projects** — sort tasks into user-defined projects to keep different areas of your life separate
- **Fully editable tasks** — every field on a task can be edited after it's been added, not just the title
- **JarCharms** — a star-based visualization of your task list; each task is represented by a star that fills in with color as it's completed
- **Points & purchases** — completing a task earns points, which can be spent on hearts for your Blueberry companion (more purchasable visual assets — new Blueberry models, jar styles, star designs, and more — are planned)
- **Progress tracking** showing completed vs. total tasks
- **Flexible sorting** — switch between manual (drag-and-drop) order, priority, or due date without losing your original ordering
- **Import / export** your task list as JSON, for backups or moving between devices
- **Reset to base** — restore the app to its default state from the Settings tab
- **Persistent storage** — your data is saved to `localStorage`, so everything survives a page refresh
- **Three views** via the nav bar:
  - **Blueberry** — pet companion card and JarCharms visualization, with task creation below
  - **List** — a focused task-creation view (no pet) plus the full task list below
  - **Lofi** — choose from multiple background lofi videos, or add your own via the YouTube API; playback status (sound on/off) and the current video choice are visible from every tab through a small icon and dropdown
## Tech Stack
 
- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/) — dev server & bundler
- [MUI (Material UI)](https://mui.com/) — Accordion, Tabs, ToggleButtons, Rating, DatePicker
- [dayjs](https://day.js.org/) — date handling for the due date picker
- [nanoid](https://github.com/ai/nanoid) — unique task IDs
- [react-youtube](https://github.com/tjallingt/react-youtube) — wraps the YouTube IFrame Player API for the Lofi tab
## Getting Started
 
### Prerequisites
 
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm
### Installation
 
```
git clone https://github.com/RS550/To-Do-App.git
cd To-Do-App
npm install
```
 
### Development
 
Start the local dev server:
 
```
npm run dev
```
 
Then open the URL Vite prints (typically `http://localhost:5173`).
 
### Build for production
 
```
npm run build
```
 
Output is generated in the `dist/` folder. Preview the production build locally with:
 
```
npm run preview
```
 
### Linting
 
```
npm run lint
```
 
## Project Structure
 
```
src/
├── main.jsx                 # App entry point, mounts <App /> to the DOM
├── App.jsx                  # Top-level state (tasks, points, hearts, video, tab) and layout
├── App.css                  # Global styles
├── Header.jsx                # Page header
├── NavBar.jsx                # Tab navigation (Blueberry / List / Lofi / Settings)
├── Card.jsx                  # Pet companion card, wraps Heartmeter
├── Heartmeter.jsx             # Row of heart icons showing hearts purchased
├── TaskTracking.jsx           # Completed/total counter + points display, wraps JarCharms
├── JarCharms.jsx               # Draggable star-orb jar visualization of task progress
├── Form.jsx                   # New task input + submit handling (below Card/JarCharms)
├── DropDownMenu.jsx           # Priority/due date/project panel — shared by Form (create) and TaskItem (edit) via a `variant` prop
├── TaskRanking.jsx             # Star-rating priority selector used inside DropDownMenu
├── ControlBar.jsx              # Row above the task list: sort controls, buy-heart button, video controls
├── TaskListControls.jsx         # Sort-by dropdown + show/hide-completed toggle
├── VideoControler.jsx           # Lofi video picker (presets + custom URL via YouTube API) and play/pause icon
├── VideoPlayer.jsx              # Wraps react-youtube; exposes play/pause/toggle via a ref
├── TaskList.jsx                 # Renders the flat task list, or grouped-by-project view
├── SubListGroup.jsx              # One collapsible project section (used in grouped view)
├── TaskItem.jsx                  # Single task row; owns its own inline edit panel
├── useSortedTasks.js              # Hook: sorting/filtering/grouping logic for TaskList
├── usePersistedState.js           # Hook: localStorage-backed state shared across components, plus resetAllPersistedState()
├── Settings.jsx                    # Settings tab: JSON export/import and reset-to-base
├── SparkleCelebration.jsx           # Full-screen sparkle animation when all tasks are completed
└── assets/                          # Images (pet idle animation, heart icon, jar/star art, card background)
```
 
## Usage
 
1. Use the **Blueberry** or **List** tab to add a task: type a title and hit **+**.
2. Optionally expand **More Information** to set a priority (star rating), due date, and project before submitting.
3. Use the sort controls above the task list to view tasks in manual, priority, or due-date order.
4. Click a task to edit any of its fields; check the box to mark it complete; click **X** to delete it.
5. Completing tasks earns points — spend them on hearts for Blueberry from the Blueberry tab.
6. Head to the **Lofi** tab to pick a background video or add your own; your choice and sound status follow you to the other tabs via the icon and dropdown in the nav area.
7. Use **Export**/**Import** on the Settings tab to save or load your task list as a JSON file, or **Reset to base** to wipe all saved data (tasks, points, hearts, videos, and projects) on this device.

## Known Issues / Roadmap
 
- Drag and drop reordering can accidentally push items to the top of the list.
- Additional purchasable visual assets (new Blueberry models, jars, stars, etc.) are planned but not yet implemented.
## License
 
[MIT](https://github.com/RS550/To-Do-App/blob/main/LICENSE)
