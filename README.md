# 🫐 Blueberries To-Do List

A React + Vite to-do app with task prioritization, due dates, drag-and-drop reordering, and a virtual pet companion to keep you company while you work.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white) ![MUI](https://img.shields.io/badge/MUI-9-007FFF?logo=mui&logoColor=white)

<img width="1886" height="2140" alt="BlueberriesList" src="https://github.com/user-attachments/assets/3a5ca300-edda-44b5-a8ca-8c02341856fb" />

🔗 Live demo: blueberries-to-do-app.vercel.app

## Features

- **Task creation** with an optional priority rating (1–5 stars) and due date, tucked behind an expandable "More Information" panel
- **Progress tracking** showing completed vs. total tasks
- **Flexible sorting** — switch between manual (drag-and-drop) order, priority, or due date without losing your original ordering
- **Inline editing** — double-click a task to rename it
- **Import / export** your task list as JSON, for backups or moving between devices
- **Persistent storage** — tasks are saved to `localStorage`, so your list survives a page refresh
- **Three views** via the nav bar:
  - **Blueberry** — task creation alongside a pet companion card
  - **List** — a focused task-creation view (no pet) plus the full task list below
  - **Lofi** — an embedded lofi video for background listening while you work

## Tech Stack

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/) — dev server & bundler
- [MUI (Material UI)](https://mui.com/) — Accordion, Tabs, ToggleButtons, Rating, DatePicker
- [dayjs](https://day.js.org/) — date handling for the due date picker
- [nanoid](https://github.com/ai/nanoid) — unique task IDs

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

### Installation

```bash
git clone https://github.com/RS550/To-Do-App.git
cd to-do-app
npm install
```

### Development

Start the local dev server:

```bash
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

### Build for production

```bash
npm run build
```

Output is generated in the `dist/` folder. Preview the production build locally with:

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── main.jsx                # App entry point, mounts <App /> to the DOM
├── App.jsx                 # Top-level layout, tab/view state, and localStorage load
├── App.css                 # Global styles
├── Header.jsx               # Page header
├── NavBar.jsx               # Tab navigation (Blueberry / List / Lofi / Settings)
├── Card.jsx                 # Pet companion card
├── Form.jsx                 # New task input + submit handling
├── DropDownMenu.jsx         # Expandable panel for priority + due date
├── TaskRanking.jsx          # Star-rating priority selector
├── TaskTracking.jsx         # Completed/total task counter, wraps Heartmeter
├── Heartmeter.jsx            # Heart-shaped progress meter (partial fill per heart)
├── TaskList.jsx              # Renders, sorts, filters, edits, and reorders tasks
├── Settings.jsx              # Settings tab: JSON export/import for the task list
├── SparkleCelebration.jsx    # Full-screen sparkle animation when all tasks are completed
└── assets/                  # Images (pet idle animation, heart icon, card background)
```

## Usage

1. Type a task into the input box and hit **+** to add it.
2. Optionally expand **More Information** to set a priority (star rating) and due date before submitting.
3. Use the sort controls above the task list to view tasks in manual, priority, or due-date order.
4. Double-click a task to edit its title; check the box to mark it complete; click **X** to delete it.
5. Use **Export**/**Import** on the Settings tab to save or load your task list as a JSON file.

## Known Issues / Roadmap

- Adjust contrast between background and text, tweak the settings tab.
- Add the option to select other youtube videos in the Lofi tab.

## License

[MIT](LICENSE)
