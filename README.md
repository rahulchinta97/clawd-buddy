# ClawBuddy 🐾

**AI Agent Command Center** — A comprehensive React dashboard for orchestrating, monitoring, and coordinating autonomous AI agents.

Build, deploy, and manage multi-agent teams with real-time status updates, task coordination, meeting intelligence, and council-style debates.

## Features

✨ **Command Deck** — Real-time mission metrics, activity feeds, and agent status at a glance

🤖 **Agent Management** — View agent profiles, skills, task history, accuracy scores, and current activities

📋 **Task Board** — Drag-and-drop Kanban workflow (To Do → Doing → Needs Input → Done)

📊 **AI Log** — Filterable agent observations, reminders, FYI's, and general notes with live categorization

🏛️ **Council** — Multi-agent debate sessions with message limits, participant tracking, and consensus formation

📞 **Meeting Intelligence** — Meeting summaries with markdown support, action item tracking, external participant detection, recording links, and Fathom integration

## Tech Stack

- **React 19** — Latest React with Suspense and automatic batching
- **Vite** — Lightning-fast build tool with HMR
- **Framer Motion** — Smooth animations and transitions
- **dnd-kit** — Modern drag-and-drop for Kanban tasks
- **Recharts** — Charts and graphs (pie charts, bar charts)
- **Lucide React** — Beautiful icon library
- **DOMPurify** — XSS protection for markdown rendering
- **date-fns** — Date formatting and calculations

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Gateway Token

Copy `.env.example` to `.env.local` and add your OpenClaw Gateway token:

```bash
cp .env.example .env.local
```

Get your token from:
- **Path:** `C:\Users\rahul\.openclaw\openclaw.json`
- **Field:** `gateway.auth.token`

```env
VITE_GATEWAY_URL=ws://localhost:18789
VITE_GATEWAY_TOKEN=your-token-here
```

### 3. Start Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Project Structure

```
clawd-buddy/
├── src/
│   ├── App.jsx              # Main application component (all features)
│   ├── main.jsx             # React DOM entry point
│   └── styles.css           # Global styling (glassmorphism, animations)
├── index.html               # HTML entry point
├── package.json             # Dependencies & scripts
├── vite.config.js           # Vite configuration
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore patterns
└── README.md                # This file
```

## Available Scripts

```bash
npm run dev      # Start dev server with HMR
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Component Overview

### Reusable UI Components

- **`GlassCard`** — Frosted glass card with optional ref forwarding
- **`Badge`** — Styled badge with custom colors
- **`Button`** — Primary, secondary, and ghost variants
- **`Input`** — Accessible text input
- **`Toggle`** — On/off switch buttons
- **`Select`** — Dropdown with custom icon
- **`ScrollArea`** — Scrollable content container
- **`Dialog`** — Modal with animations

### Feature Sections

- **Command Deck** — Metrics, activity feed, agent roster
- **Agents** — Agent profiles with detail modal
- **Task Board** — Drag-and-drop Kanban with dnd-kit
- **AI Log** — Filterable agent log entries by category
- **Council** — Multi-agent debate sessions with collapsible messages
- **Meetings** — Smart meeting management with charts, filters, search, pagination

## Key Features Deep Dive

### Meeting Intelligence

- **Search & Filters** — Find meetings by title, type, date range, action items, or external participants
- **Smart Pagination** — Browse 25 meetings per page with safe boundary handling
- **Charts** — Pie chart for meeting type distribution, bar chart for monthly trends
- **Markdown Support** — Meeting summaries with h4 headings, bold text, lists, and XSS protection
- **Action Items** — Track open tasks with assignees and completion status
- **External Detection** — Flag meetings with external participants and show their domains
- **Fathom Integration** — Links to recorded meeting videos and shareable meeting links
- **AI Insights** — Contextual summaries of key discussion points

### Drag-and-Drop Tasks

- **Kanban Board** — Move tasks between columns (To Do → Doing → Needs Input → Done)
- **Smooth Animations** — Framer Motion for task reordering and transitions
- **Priority Badges** — Color-coded priority levels (low, medium, high, urgent)
- **Progress Tracking** — Visual progress bars for in-progress tasks
- **Activation Constraint** — Prevents accidental drags (8px threshold)

### Council Debates

- **Message Limits** — Participants have a speaking limit (e.g., 5 messages)
- **Status Tracking** — Active, idle, or done states for each participant
- **Expandable Sessions** — Collapse/expand debate threads to focus on key discussions
- **Timestamp Tracking** — Know when each message was sent

## Performance Optimizations

✅ **Memoized Functions** — `useMemo` for expensive calculations (markdown rendering, filtering, sorting)
✅ **Lazy Animations** — Staggered animations with `transition.delay`
✅ **Chart Optimization** — `ResponsiveContainer` for responsive Recharts
✅ **Drag Performance** — Pointer sensor with activation constraint for snappy DnD

## Accessibility

✅ **ARIA Labels** — Buttons and interactive elements with accessible descriptions
✅ **Semantic HTML** — Proper heading hierarchy and form structure
✅ **Keyboard Navigation** — All buttons and controls are keyboard accessible
✅ **Live Regions** — Pagination state updates announce to screen readers
✅ **Disabled States** — Visual feedback for disabled buttons with titles

## Security

🔒 **XSS Protection** — All markdown content is sanitized with DOMPurify
🔐 **Environment Variables** — Gateway token stored in `.env.local` (not committed to git)
🛡️ **Readonly Inputs** — Action item checkboxes are readonly (UI-only, no state sync)

## Contributing

All work happens on the **main branch** — you have full control.

When making changes:
1. Test locally (`npm run dev`)
2. Verify no console errors
3. Commit and push
4. Changes are live on next deploy

## Future Enhancements

- 🔌 **Real Gateway Integration** — Connect to live OpenClaw API for real agent data
- 🔐 **Token Settings Panel** — UI to paste and save Gateway token securely
- 📱 **Mobile Responsive** — Optimize for mobile viewing
- 🌙 **Dark Mode Toggle** — Already supports dark mode via CSS variables
- 🔔 **Live Notifications** — Real-time updates via WebSocket
- 💾 **Persistent State** — LocalStorage or backend sync for user preferences
- 📤 **Export Meetings** — Download meeting summaries as PDF or Markdown
- 🤖 **Agent Scripting** — Create custom council prompts and agent personalities

## License

MIT

## Questions?

- Check the `package.json` for all dependencies
- Review `vite.config.js` for build configuration
- Inspect `styles.css` for the glassmorphism design system
- Check `index.html` for theme variables and font setup
