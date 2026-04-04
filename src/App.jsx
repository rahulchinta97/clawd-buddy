import { forwardRef, useEffect, useMemo, useState } from "react";
import { DndContext, PointerSensor, useDroppable, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import DOMPurify from "dompurify";
import { format, formatDistanceToNow, isAfter, parseISO, subDays } from "date-fns";
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Calendar,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clock3,
  ExternalLink,
  Filter,
  Globe,
  LayoutDashboard,
  MessageSquareText,
  PanelTop,
  Radio,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const tabs = [
  { id: "deck", label: "Command Deck", icon: LayoutDashboard },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "tasks", label: "Task Board", icon: PanelTop },
  { id: "logs", label: "AI Log", icon: MessageSquareText },
  { id: "council", label: "Council", icon: Users },
  { id: "meetings", label: "Meetings", icon: Calendar },
];

const agents = [
  {
    id: "alpha",
    emoji: "🤖",
    name: "Agent Alpha",
    subtitle: "Systems architect and ship lead",
    type: "Code Agent",
    role: "Lead Engineer",
    accent: "#10b981",
    status: "active",
    currentActivity: "Compiling deployment handoff",
    lastSeen: "just now",
    tasksCompleted: 184,
    accuracy: 98.4,
    skills: ["Refactoring", "Infra", "Reviews", "Shipping"],
    bio: "Owns high-impact engineering work, unblocks execution, and keeps releases on track.",
  },
  {
    id: "dispatch",
    emoji: "📋",
    name: "Dispatch Bot",
    subtitle: "Traffic control for the AI workforce",
    type: "Coordinator",
    role: "Operations Director",
    accent: "#f59e0b",
    status: "idle",
    currentActivity: "Rebalancing incoming requests",
    lastSeen: "3m ago",
    tasksCompleted: 129,
    accuracy: 94.8,
    skills: ["Planning", "Routing", "Scheduling", "Escalation"],
    bio: "Coordinates priorities, routes work, and keeps every lane visible.",
  },
  {
    id: "audit",
    emoji: "🛡️",
    name: "Audit Bot",
    subtitle: "Quality guardrail and compliance watch",
    type: "Quality Agent",
    role: "Compliance Officer",
    accent: "#06b6d4",
    status: "active",
    currentActivity: "Scanning merge output for regressions",
    lastSeen: "just now",
    tasksCompleted: 216,
    accuracy: 99.1,
    skills: ["QA", "Traceability", "Risk Scoring", "Policy"],
    bio: "Validates changes, highlights risk, and keeps decision trails audit-ready.",
  },
];

const metricCards = [
  { label: "Active Missions", value: 42, trend: "+12%", icon: Target },
  { label: "Agents Online", value: 7, trend: "+2", icon: Radio },
  { label: "Completion Rate", value: 96, suffix: "%", trend: "+4.1%", icon: CheckCircle2 },
  { label: "Critical Alerts", value: 3, trend: "-2", icon: AlertTriangle },
];

const activityFeed = [
  ["🤖", "Agent Alpha merged the telemetry sync patch", "2m ago"],
  ["📋", "Dispatch Bot rerouted 4 tasks to the fast lane", "6m ago"],
  ["🛡️", "Audit Bot cleared the compliance sweep", "11m ago"],
  ["🤖", "Agent Alpha opened a rollback-safe deploy window", "19m ago"],
  ["📋", "Dispatch Bot requested input on Q2 launch scope", "24m ago"],
  ["🛡️", "Audit Bot flagged a missing retention note", "31m ago"],
  ["🤖", "Agent Alpha generated a release summary", "43m ago"],
];

const initialTasks = [
  { id: "task-1", title: "Draft incident response template", column: "todo", agent: "📋", priority: "high" },
  { id: "task-2", title: "Instrument background worker latency", column: "todo", agent: "🤖", priority: "medium" },
  { id: "task-3", title: "Review auth flow edge cases", column: "doing", agent: "🛡️", priority: "urgent", progress: 72 },
  { id: "task-4", title: "Prepare launch day command script", column: "doing", agent: "📋", priority: "high", progress: 46 },
  { id: "task-5", title: "Validate billing export formats", column: "needs_input", agent: "🛡️", priority: "medium" },
  { id: "task-6", title: "Confirm sales demo narrative", column: "needs_input", agent: "📋", priority: "low" },
  { id: "task-7", title: "Ship dashboard shell", column: "done", agent: "🤖", priority: "urgent" },
  { id: "task-8", title: "Close security review checklist", column: "done", agent: "🛡️", priority: "high" },
  { id: "task-9", title: "Summarize customer call themes", column: "todo", agent: "📋", priority: "low" },
  { id: "task-10", title: "Tune mission status animations", column: "doing", agent: "🤖", priority: "medium", progress: 58 },
];

const logEntries = [
  { id: 1, category: "observation", agent: "Agent Alpha", emoji: "🤖", message: "UI shell latency is stable after memoized chart data.", time: "3m ago" },
  { id: 2, category: "general", agent: "Dispatch Bot", emoji: "📋", message: "Routing workload remains balanced across engineering and quality lanes.", time: "11m ago" },
  { id: 3, category: "reminder", agent: "Audit Bot", emoji: "🛡️", message: "SOC2 evidence export is due before the next external review.", time: "16m ago" },
  { id: 4, category: "fyi", agent: "Dispatch Bot", emoji: "📋", message: "Two sales calls include external stakeholders from acme.io and northstar.dev.", time: "22m ago" },
  { id: 5, category: "observation", agent: "Audit Bot", emoji: "🛡️", message: "No drift detected in policy snapshots for the last 24 hours.", time: "29m ago" },
  { id: 6, category: "general", agent: "Agent Alpha", emoji: "🤖", message: "Command deck visuals now render at 60fps on desktop test profiles.", time: "42m ago" },
  { id: 7, category: "fyi", agent: "Agent Alpha", emoji: "🤖", message: "Meeting summaries are sanitized before rendering detail cards.", time: "57m ago" },
  { id: 8, category: "reminder", agent: "Dispatch Bot", emoji: "📋", message: "Needs Input lane has two items waiting on human approval.", time: "1h ago" },
  { id: 9, category: "general", agent: "Audit Bot", emoji: "🛡️", message: "Regression scan finished with zero critical findings.", time: "1h ago" },
];

const councilSessions = [
  {
    id: "c1",
    question: "Should ClawBuddy prioritize deployment automation or meeting intelligence in the next sprint?",
    status: "Live Debate",
    participants: [
      { emoji: "🤖", name: "Agent Alpha", sent: 3, limit: 5, status: "active" },
      { emoji: "📋", name: "Dispatch Bot", sent: 2, limit: 5, status: "idle" },
      { emoji: "🛡️", name: "Audit Bot", sent: 2, limit: 5, status: "active" },
    ],
    messages: [
      { emoji: "🤖", name: "Agent Alpha", number: 1, timestamp: "12m ago", text: "Deployment automation compounds value fastest because it accelerates every downstream release." },
      { emoji: "📋", name: "Dispatch Bot", number: 2, timestamp: "10m ago", text: "Meeting intelligence can reduce coordination drag immediately, especially with external calls ramping." },
      { emoji: "🛡️", name: "Audit Bot", number: 3, timestamp: "8m ago", text: "Automation without stronger observability raises release risk; pair investment with audit hooks." },
    ],
  },
  {
    id: "c2",
    question: "How aggressive should the system be when auto-reassigning blocked work?",
    status: "Consensus Forming",
    participants: [
      { emoji: "📋", name: "Dispatch Bot", sent: 4, limit: 4, status: "done" },
      { emoji: "🤖", name: "Agent Alpha", sent: 3, limit: 4, status: "active" },
      { emoji: "🛡️", name: "Audit Bot", sent: 4, limit: 4, status: "done" },
    ],
    messages: [
      { emoji: "📋", name: "Dispatch Bot", number: 1, timestamp: "41m ago", text: "Auto-reassign after 30 minutes of inactivity for medium priority work keeps throughput high." },
      { emoji: "🛡️", name: "Audit Bot", number: 2, timestamp: "36m ago", text: "Critical or regulated tasks should require explicit handoff acknowledgement before reassignment." },
      { emoji: "🤖", name: "Agent Alpha", number: 3, timestamp: "28m ago", text: "A confidence threshold plus owner context window would keep automation assertive but respectful." },
    ],
  },
];

const meetingTypeColors = {
  "1-on-1": "#60a5fa",
  external: "#a78bfa",
  sales: "#34d399",
  team: "#fb923c",
  standup: "#818cf8",
  planning: "#2dd4bf",
  interview: "#f472b6",
  "all-hands": "#facc15",
};

const meetingData = [
  {
    id: "m1",
    title: "Weekly Standup with Engineering",
    date: "2026-04-03T14:00:00Z",
    duration_minutes: 30,
    duration_display: "30m",
    attendees: ["Alice", "Bob", "Charlie", "Mina"],
    summary: "## Sprint pulse\nBackend API is **80% complete** and frontend polish is entering QA.\n\n- Finish telemetry cards\n- Validate mobile scroll behavior",
    action_items: [
      { task: "Review PR #42", assignee: "Alice", done: false },
      { task: "Update handoff docs", assignee: "Bob", done: true },
    ],
    ai_insights: "30 min meeting with 4 attendees. Delivery confidence remains high.",
    meeting_type: "standup",
    has_external_participants: false,
    external_domains: [],
    fathom_url: "https://example.com/recording/standup",
    share_url: "https://example.com/share/standup",
  },
  {
    id: "m2",
    title: "Northstar Pipeline Review",
    date: "2026-04-02T17:30:00Z",
    duration_minutes: 45,
    duration_display: "45m",
    attendees: ["Rhea", "Jon", "Elliot", "Kim"],
    summary: "## Deal movement\nClient wants a faster analytics proof-of-concept before April 18.\n\n- Prepare roadmap snapshot\n- Send security brief",
    action_items: [
      { task: "Share architecture brief", assignee: "Rhea", done: false },
      { task: "Schedule technical follow-up", assignee: "Kim", done: false },
    ],
    ai_insights: "External stakeholders asked detailed implementation questions. Buying intent is rising.",
    meeting_type: "sales",
    has_external_participants: true,
    external_domains: ["northstar.dev"],
    fathom_url: "https://example.com/recording/northstar",
    share_url: "https://example.com/share/northstar",
  },
  {
    id: "m3",
    title: "Founders 1-on-1: Product Focus",
    date: "2026-03-31T15:00:00Z",
    duration_minutes: 50,
    duration_display: "50m",
    attendees: ["Avery", "Jordan"],
    summary: "Discussed roadmap tension between platform reliability and feature storytelling.",
    action_items: [{ task: "Draft Q2 narrative options", assignee: "Jordan", done: false }],
    ai_insights: "High strategic alignment, but sequencing decisions remain open.",
    meeting_type: "1-on-1",
    has_external_participants: false,
    external_domains: [],
    fathom_url: null,
    share_url: "https://example.com/share/founders-focus",
  },
  {
    id: "m4",
    title: "Candidate Interview: Frontend Engineer",
    date: "2026-03-29T19:00:00Z",
    duration_minutes: 60,
    duration_display: "1h",
    attendees: ["Nina", "Marcus", "Priya"],
    summary: "Strong systems thinking and careful attention to accessibility tradeoffs.",
    action_items: [{ task: "Consolidate interview feedback", assignee: "Nina", done: true }],
    ai_insights: "Candidate showed strong product taste and concise communication.",
    meeting_type: "interview",
    has_external_participants: true,
    external_domains: ["candidate-mail.com"],
    fathom_url: null,
    share_url: null,
  },
  {
    id: "m5",
    title: "Customer Expansion Call - Acme",
    date: "2026-03-27T16:00:00Z",
    duration_minutes: 75,
    duration_display: "1h 15m",
    attendees: ["Lena", "Marco", "Pat", "Sofia", "Omar"],
    summary: "Explored enterprise rollout and advanced permissions needs.\n\n- Procurement wants pricing options\n- Security team requested retention details",
    action_items: [
      { task: "Send pricing deck", assignee: "Lena", done: false },
      { task: "Prepare retention FAQ", assignee: "Omar", done: false },
    ],
    ai_insights: "High revenue opportunity with security diligence gating timeline.",
    meeting_type: "sales",
    has_external_participants: true,
    external_domains: ["acme.io"],
    fathom_url: "https://example.com/recording/acme",
    share_url: "https://example.com/share/acme",
  },
  {
    id: "m6",
    title: "Product Planning Sprint 16",
    date: "2026-03-26T18:00:00Z",
    duration_minutes: 90,
    duration_display: "1h 30m",
    attendees: ["Avery", "Rhea", "Jon", "Mina"],
    summary: "Mapped sprint capacity across dashboard polish, alert routing, and council UX.",
    action_items: [
      { task: "Finalize scope doc", assignee: "Avery", done: true },
      { task: "Estimate alert-routing enhancements", assignee: "Jon", done: false },
    ],
    ai_insights: "Scope is ambitious; moving one low-priority enhancement may protect quality.",
    meeting_type: "planning",
    has_external_participants: false,
    external_domains: [],
    fathom_url: null,
    share_url: "https://example.com/share/planning-16",
  },
  {
    id: "m7",
    title: "Operations Team Sync",
    date: "2026-03-24T15:30:00Z",
    duration_minutes: 40,
    duration_display: "40m",
    attendees: ["Kim", "Elliot", "Rhea"],
    summary: "Reviewed ticket routing health and SLA breaches from the prior week.",
    action_items: [{ task: "Tune escalation thresholds", assignee: "Kim", done: false }],
    ai_insights: "SLA misses cluster around handoffs, not execution speed.",
    meeting_type: "team",
    has_external_participants: false,
    external_domains: [],
    fathom_url: null,
    share_url: null,
  },
  {
    id: "m8",
    title: "Design 1-on-1",
    date: "2026-03-22T14:30:00Z",
    duration_minutes: 35,
    duration_display: "35m",
    attendees: ["Mina", "Avery"],
    summary: "Talked through motion restraint, card density, and premium dashboard references.",
    action_items: [{ task: "Prototype updated tab transitions", assignee: "Mina", done: true }],
    ai_insights: "Visual direction is aligned; implementation complexity is manageable.",
    meeting_type: "1-on-1",
    has_external_participants: false,
    external_domains: [],
    fathom_url: null,
    share_url: null,
  },
  {
    id: "m9",
    title: "Company All-Hands",
    date: "2026-03-20T17:00:00Z",
    duration_minutes: 55,
    duration_display: "55m",
    attendees: ["Team A", "Team B", "Leadership", "Ops"],
    summary: "Shared quarterly goals, roadmap highlights, and team wins across the org.",
    action_items: [{ task: "Publish all-hands recap", assignee: "Ops", done: false }],
    ai_insights: "Morale is strong and launch confidence is improving across teams.",
    meeting_type: "all-hands",
    has_external_participants: false,
    external_domains: [],
    fathom_url: "https://example.com/recording/allhands",
    share_url: "https://example.com/share/allhands",
  },
  {
    id: "m10",
    title: "Daily Platform Standup",
    date: "2026-03-19T13:30:00Z",
    duration_minutes: 20,
    duration_display: "20m",
    attendees: ["Jon", "Alice", "Charlie"],
    summary: "Fast blocker review around queue health and deploy timing.",
    action_items: [{ task: "Verify queue drain metrics", assignee: "Charlie", done: false }],
    ai_insights: "Short meeting, clear ownership, one blocker with low blast radius.",
    meeting_type: "standup",
    has_external_participants: false,
    external_domains: [],
    fathom_url: null,
    share_url: null,
  },
];

const kanbanColumns = [
  { id: "todo", label: "To Do" },
  { id: "doing", label: "Doing" },
  { id: "needs_input", label: "Needs Input" },
  { id: "done", label: "Done" },
];

const statusTone = {
  active: "var(--emerald)",
  idle: "var(--amber)",
  error: "var(--red)",
  offline: "var(--muted)",
  done: "var(--cyan)",
};

const priorityTone = {
  low: "#64748b",
  medium: "#06b6d4",
  high: "#f59e0b",
  urgent: "#ef4444",
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function CountUp({ value, suffix = "" }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 1000;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * progress));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

const GlassCard = forwardRef(function GlassCard({ className, children }, ref) {
  return (
    <div ref={ref} className={cn("glass-card", className)}>
      {children}
    </div>
  );
});

function Badge({ children, className, style }) {
  return (
    <span className={cn("badge", className)} style={style}>
      {children}
    </span>
  );
}

function Button({ children, className, variant = "primary", ...props }) {
  return (
    <button className={cn("button", `button-${variant}`, className)} {...props}>
      {children}
    </button>
  );
}

function Input(props) {
  return <input className="input" {...props} />;
}

function Toggle({ pressed, onPressedChange, children }) {
  return (
    <button
      className={cn("toggle", pressed && "toggle-active")}
      type="button"
      onClick={() => onPressedChange(!pressed)}
    >
      {children}
    </button>
  );
}

function Select({ value, onChange, options }) {
  return (
    <div className="select-shell">
      <select className="select" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="select-icon" />
    </div>
  );
}

function ScrollArea({ className, children }) {
  return <div className={cn("scroll-area", className)}>{children}</div>;
}

function Dialog({ open, onOpenChange, title, children }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="dialog-panel glass-card"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
          >
            <div className="dialog-header">
              <div>
                <p className="eyebrow">Agent Detail</p>
                <h3>{title}</h3>
              </div>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function markdownToHtml(markdown) {
  const html = markdown
    .replace(/^## (.*)$/gm, "<h4>$1</h4>")
    .replace(/^\- (.*)$/gm, "<li>$1</li>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

  return DOMPurify.sanitize(`<p>${html}</p>`);
}

function relativeDate(date) {
  return formatDistanceToNow(parseISO(date), { addSuffix: true });
}

function TabButton({ tab, active, onClick, index }) {
  const Icon = tab.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn("tab-button", active && "tab-button-active")}
      onClick={onClick}
      type="button"
    >
      <Icon size={16} />
      {tab.label}
    </motion.button>
  );
}

function SortableTaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      layout
      ref={setNodeRef}
      style={style}
      className={cn("task-card glass-card", isDragging && "task-card-dragging")}
      whileHover={{ scale: 1.02 }}
      {...attributes}
      {...listeners}
    >
      <div className="task-topline">
        <Badge className="priority-badge" style={{ "--badge-color": priorityTone[task.priority] }}>
          <span className="priority-dot" />
          {task.priority}
        </Badge>
        <span className="task-agent">{task.agent}</span>
      </div>
      <h4>{task.title}</h4>
      {task.progress ? (
        <div className="progress-shell">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${task.progress}%` }} />
          </div>
          <span>{task.progress}%</span>
        </div>
      ) : null}
    </motion.div>
  );
}

function KanbanColumn({ column, tasks }) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <GlassCard className="kanban-column" ref={setNodeRef}>
      <div className="kanban-header">
        <h3>{column.label}</h3>
        <Badge>{tasks.length}</Badge>
      </div>
      <SortableContext items={tasks.map((task) => task.id)} strategy={rectSortingStrategy}>
        <div className="kanban-list">
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </GlassCard>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("deck");
  const [tasks, setTasks] = useState(initialTasks);
  const [logFilter, setLogFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [expandedCouncil, setExpandedCouncil] = useState("c1");
  const [meetingQuery, setMeetingQuery] = useState("");
  const [meetingTypeFilter, setMeetingTypeFilter] = useState([]);
  const [dateRange, setDateRange] = useState("all");
  const [hasActionItemsOnly, setHasActionItemsOnly] = useState(false);
  const [externalOnly, setExternalOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [expandedMeeting, setExpandedMeeting] = useState("m1");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const visibleLogs = useMemo(
    () => (logFilter === "all" ? logEntries : logEntries.filter((entry) => entry.category === logFilter)),
    [logFilter],
  );

  const typeCounts = useMemo(() => {
    const counts = {};
    for (const meeting of meetingData) {
      counts[meeting.meeting_type] = (counts[meeting.meeting_type] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: meetingTypeColors[name] || "#10b981" }));
  }, []);

  const monthlyTrend = useMemo(() => {
    const grouped = {};
    for (const meeting of meetingData) {
      const label = format(parseISO(meeting.date), "MMM");
      grouped[label] = (grouped[label] || 0) + 1;
    }
    return Object.entries(grouped).map(([month, meetings]) => ({ month, meetings }));
  }, []);

  const filteredMeetings = useMemo(() => {
    const lowerQuery = meetingQuery.toLowerCase();
    let next = [...meetingData].filter((meeting) => {
      const matchesQuery = meeting.title.toLowerCase().includes(lowerQuery);
      const matchesType = meetingTypeFilter.length === 0 || meetingTypeFilter.includes(meeting.meeting_type);
      const matchesActions = !hasActionItemsOnly || meeting.action_items.length > 0;
      const matchesExternal = !externalOnly || meeting.has_external_participants;

      let matchesDate = true;
      if (dateRange !== "all") {
        const days = Number(dateRange);
        matchesDate = isAfter(parseISO(meeting.date), subDays(new Date(), days));
      }

      return matchesQuery && matchesType && matchesActions && matchesExternal && matchesDate;
    });

    if (sortBy === "recent") next.sort((a, b) => parseISO(b.date) - parseISO(a.date));
    if (sortBy === "oldest") next.sort((a, b) => parseISO(a.date) - parseISO(b.date));
    if (sortBy === "duration") next.sort((a, b) => b.duration_minutes - a.duration_minutes);

    return next;
  }, [meetingQuery, meetingTypeFilter, hasActionItemsOnly, externalOnly, dateRange, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [meetingQuery, meetingTypeFilter, hasActionItemsOnly, externalOnly, dateRange, sortBy]);

  const paginatedMeetings = filteredMeetings.slice((page - 1) * 25, page * 25);

  const meetingStats = useMemo(() => {
    const totalMeetings = 247;
    const thisWeek = meetingData.filter((meeting) => isAfter(parseISO(meeting.date), subDays(new Date(), 7))).length;
    const openItems = meetingData.reduce(
      (sum, meeting) => sum + meeting.action_items.filter((item) => !item.done).length,
      0,
    );
    const avgDuration = Math.round(
      meetingData.reduce((sum, meeting) => sum + meeting.duration_minutes, 0) / meetingData.length,
    );

    return { totalMeetings, thisWeek, openItems, avgDuration };
  }, []);

  function findTask(taskId) {
    return tasks.find((task) => task.id === taskId);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const activeTask = findTask(active.id);
    const overTask = findTask(over.id);
    const overColumn = kanbanColumns.some((column) => column.id === over.id)
      ? over.id
      : overTask?.column;

    if (!activeTask || !overColumn) return;

    if (overTask && activeTask.column === overTask.column) {
      const columnTasks = tasks.filter((task) => task.column === activeTask.column);
      const oldIndex = columnTasks.findIndex((task) => task.id === active.id);
      const newIndex = columnTasks.findIndex((task) => task.id === over.id);
      const reordered = arrayMove(columnTasks, oldIndex, newIndex);
      const others = tasks.filter((task) => task.column !== activeTask.column);
      setTasks([...others, ...reordered]);
      return;
    }

    setTasks((current) =>
      current.map((task) => (task.id === active.id ? { ...task, column: overColumn } : task)),
    );
  }

  function toggleMeetingType(type) {
    setMeetingTypeFilter((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    );
  }

  function renderDeck() {
    return (
      <div className="tab-layout">
        <div className="metric-grid">
          {metricCards.map((metric) => {
            const Icon = metric.icon;
            return (
              <GlassCard key={metric.label} className="metric-card">
                <div className="metric-icon">
                  <Icon size={18} />
                </div>
                <div className="metric-copy">
                  <p>{metric.label}</p>
                  <h3>
                    <CountUp value={metric.value} suffix={metric.suffix} />
                  </h3>
                  <span className="trend-pill">
                    <ArrowUpRight size={14} />
                    {metric.trend}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="deck-panels">
          <GlassCard className="activity-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Recent Activity</p>
                <h3>Live mission stream</h3>
              </div>
              <Badge className="bounce-badge">12 unread</Badge>
            </div>
            <ScrollArea className="activity-list">
              {activityFeed.map(([emoji, action, time], index) => (
                <motion.div
                  key={action}
                  className="activity-item"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <span className="activity-avatar">{emoji}</span>
                  <div>
                    <p>{action}</p>
                    <span>{time}</span>
                  </div>
                </motion.div>
              ))}
            </ScrollArea>
          </GlassCard>

          <GlassCard className="status-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Agent Status</p>
                <h3>Command roster</h3>
              </div>
            </div>
            <div className="status-grid">
              {agents.map((agent) => (
                <motion.div key={agent.id} className="mini-agent-card" whileHover={{ y: -4 }}>
                  <div className="mini-agent-top">
                    <div>
                      <span className="agent-emoji">{agent.emoji}</span>
                      <strong>{agent.name}</strong>
                    </div>
                    <span
                      className={cn("status-dot", agent.status === "active" && "status-pulse")}
                      style={{ background: statusTone[agent.status] }}
                    />
                  </div>
                  <p>{agent.currentActivity}</p>
                  <span>{agent.lastSeen}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  function renderAgents() {
    return (
      <>
        <div className="agent-grid">
          {agents.map((agent) => (
            <GlassCard key={agent.id} className="agent-card">
              <div className="agent-card-top">
                <div className="agent-identity">
                  <span className="agent-emoji big">{agent.emoji}</span>
                  <div>
                    <h3>{agent.name}</h3>
                    <p>{agent.subtitle}</p>
                  </div>
                </div>
                <Badge style={{ borderColor: `${agent.accent}55`, color: agent.accent }}>{agent.status}</Badge>
              </div>
              <div className="agent-meta">
                <div>
                  <span>Type</span>
                  <strong>{agent.type}</strong>
                </div>
                <div>
                  <span>Role</span>
                  <strong>{agent.role}</strong>
                </div>
                <div>
                  <span>Tasks</span>
                  <strong>{agent.tasksCompleted}</strong>
                </div>
                <div>
                  <span>Accuracy</span>
                  <strong>{agent.accuracy}%</strong>
                </div>
              </div>
              <div className="skills-row">
                {agent.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
              <Button onClick={() => setSelectedAgent(agent)}>View Details</Button>
            </GlassCard>
          ))}
        </div>

        <Dialog open={Boolean(selectedAgent)} onOpenChange={() => setSelectedAgent(null)} title={selectedAgent?.name}>
          {selectedAgent ? (
            <div className="dialog-content">
              <p>{selectedAgent.bio}</p>
              <div className="dialog-stats">
                <GlassCard>
                  <span>Current Mission</span>
                  <strong>{selectedAgent.currentActivity}</strong>
                </GlassCard>
                <GlassCard>
                  <span>Last Seen</span>
                  <strong>{selectedAgent.lastSeen}</strong>
                </GlassCard>
                <GlassCard>
                  <span>Customizable</span>
                  <strong>Names and roles can be tailored to your AI team.</strong>
                </GlassCard>
              </div>
            </div>
          ) : null}
        </Dialog>
      </>
    );
  }

  function renderTasks() {
    return (
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="kanban-grid">
          {kanbanColumns.map((column) => (
            <KanbanColumn key={column.id} column={column} tasks={tasks.filter((task) => task.column === column.id)} />
          ))}
        </div>
      </DndContext>
    );
  }

  function renderLogs() {
    return (
      <div className="log-layout">
        <div className="toolbar">
          <div className="toolbar-left">
            <Filter size={16} />
            <span>Filter category</span>
          </div>
          <Select
            value={logFilter}
            onChange={setLogFilter}
            options={[
              { value: "all", label: "All categories" },
              { value: "observation", label: "Observation" },
              { value: "general", label: "General" },
              { value: "reminder", label: "Reminder" },
              { value: "fyi", label: "FYI" },
            ]}
          />
        </div>
        <GlassCard className="log-feed">
          {visibleLogs.map((entry, index) => (
            <motion.div
              key={entry.id}
              className="log-entry"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="log-entry-top">
                <div className="log-agent">
                  <span>{entry.emoji}</span>
                  <strong>{entry.agent}</strong>
                </div>
                <Badge className={`category-${entry.category}`}>{entry.category}</Badge>
              </div>
              <p>{entry.message}</p>
              <span>{entry.time}</span>
            </motion.div>
          ))}
        </GlassCard>
      </div>
    );
  }

  function renderCouncil() {
    return (
      <div className="council-list">
        {councilSessions.map((session) => {
          const isOpen = expandedCouncil === session.id;
          return (
            <GlassCard key={session.id} className="council-card">
              <button className="council-trigger" type="button" onClick={() => setExpandedCouncil(isOpen ? null : session.id)}>
                <div>
                  <p className="eyebrow">Council Session</p>
                  <h3>{session.question}</h3>
                </div>
                <div className="council-actions">
                  <Badge>{session.status}</Badge>
                  {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
              </button>
              <div className="participant-row">
                {session.participants.map((participant) => (
                  <div key={participant.name} className="participant-chip">
                    <span>{participant.emoji}</span>
                    <strong>{participant.name}</strong>
                    <span>
                      {participant.sent}/{participant.limit}
                    </span>
                    <span className="status-dot" style={{ background: statusTone[participant.status] }} />
                  </div>
                ))}
              </div>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="council-messages"
                  >
                    {session.messages.map((message, index) => (
                      <motion.div
                        key={message.number}
                        className="council-message"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                      >
                        <div className="council-message-top">
                          <div className="log-agent">
                            <span>{message.emoji}</span>
                            <strong>{message.name}</strong>
                            <Badge>#{message.number}</Badge>
                          </div>
                          <span>{message.timestamp}</span>
                        </div>
                        <p>{message.text}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </GlassCard>
          );
        })}
      </div>
    );
  }

  function renderMeetings() {
    return (
      <div className="meeting-layout">
        <div className="metric-grid">
          {[
            { label: "Total Meetings", value: meetingStats.totalMeetings, icon: Calendar },
            { label: "This Week", value: meetingStats.thisWeek, icon: TrendingUp },
            { label: "Open Action Items", value: meetingStats.openItems, icon: CheckSquare },
            { label: "Avg Duration", value: meetingStats.avgDuration, icon: Clock3, suffix: "m" },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <GlassCard key={metric.label} className="metric-card">
                <div className="metric-icon">
                  <Icon size={18} />
                </div>
                <div className="metric-copy">
                  <p>{metric.label}</p>
                  <h3>
                    <CountUp value={metric.value} suffix={metric.suffix} />
                  </h3>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="charts-grid">
          <GlassCard>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Meeting Type Distribution</p>
                <h3>Conversation mix</h3>
              </div>
            </div>
            <div className="chart-shell">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={typeCounts} dataKey="value" innerRadius={68} outerRadius={92} paddingAngle={3}>
                    {typeCounts.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="legend-grid">
              {typeCounts.map((entry) => (
                <div key={entry.name} className="legend-item">
                  <span className="legend-dot" style={{ background: entry.color }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Monthly Trend</p>
                <h3>Meeting volume</h3>
              </div>
            </div>
            <div className="chart-shell">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyTrend}>
                  <Tooltip />
                  <Bar dataKey="meetings" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="meeting-filters">
          <div className="search-shell">
            <Search size={16} />
            <Input value={meetingQuery} onChange={(event) => setMeetingQuery(event.target.value)} placeholder="Search meetings by title..." />
          </div>
          <div className="filter-row">
            {Object.keys(meetingTypeColors).map((type) => (
              <Toggle key={type} pressed={meetingTypeFilter.includes(type)} onPressedChange={() => toggleMeetingType(type)}>
                {type}
              </Toggle>
            ))}
          </div>
          <div className="filter-row wrap">
            {[
              { value: "7", label: "7d" },
              { value: "30", label: "30d" },
              { value: "90", label: "90d" },
              { value: "all", label: "All" },
            ].map((range) => (
              <Toggle key={range.value} pressed={dateRange === range.value} onPressedChange={() => setDateRange(range.value)}>
                {range.label}
              </Toggle>
            ))}
            <Toggle pressed={hasActionItemsOnly} onPressedChange={setHasActionItemsOnly}>
              Has Action Items
            </Toggle>
            <Toggle pressed={externalOnly} onPressedChange={setExternalOnly}>
              External Only
            </Toggle>
            <div className="sort-shell">
              <span>Sort</span>
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: "recent", label: "Most Recent" },
                  { value: "oldest", label: "Oldest First" },
                  { value: "duration", label: "Longest Duration" },
                ]}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="meeting-feed">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Meeting Feed</p>
              <h3>{filteredMeetings.length} records in view</h3>
            </div>
            <Badge>25 per page</Badge>
          </div>
          <div className="meeting-list">
            {paginatedMeetings.map((meeting) => {
              const isOpen = expandedMeeting === meeting.id;
              return (
                <motion.div key={meeting.id} layout className="meeting-card">
                  <button className="meeting-summary" type="button" onClick={() => setExpandedMeeting(isOpen ? null : meeting.id)}>
                    <div className="meeting-main">
                      <div className="meeting-headline">
                        <Badge style={{ color: meetingTypeColors[meeting.meeting_type], borderColor: `${meetingTypeColors[meeting.meeting_type]}44` }}>
                          {meeting.meeting_type}
                        </Badge>
                        <h4>{meeting.title}</h4>
                      </div>
                      <div className="meeting-meta">
                        <span>{format(parseISO(meeting.date), "MMM d, yyyy")}</span>
                        <span>{meeting.duration_display}</span>
                        <div className="avatar-row">
                          {meeting.attendees.slice(0, 3).map((name) => (
                            <span key={name} className="avatar">
                              {name.slice(0, 2).toUpperCase()}
                            </span>
                          ))}
                          {meeting.attendees.length > 3 ? <span className="avatar overflow">+{meeting.attendees.length - 3}</span> : null}
                        </div>
                        {meeting.action_items.length ? <Badge>{meeting.action_items.length} actions</Badge> : null}
                        {meeting.has_external_participants ? <Globe size={16} className="globe-icon" /> : null}
                      </div>
                    </div>
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="meeting-detail">
                        <div className="meeting-detail-grid">
                          <div>
                            <div className="sanitized-summary" dangerouslySetInnerHTML={{ __html: markdownToHtml(meeting.summary) }} />
                            <div className="insight-line">
                              <Sparkles size={15} />
                              <span>{meeting.ai_insights}</span>
                            </div>
                          </div>
                          <div className="action-panel">
                            <h5>Action Items</h5>
                            {meeting.action_items.map((item) => (
                              <label key={item.task} className="check-row">
                                <input type="checkbox" checked={item.done} readOnly />
                                <span>
                                  {item.task} - {item.assignee}
                                </span>
                              </label>
                            ))}
                            <div className="detail-meta">
                              <span>Attendees: {meeting.attendees.join(", ")}</span>
                              <span>External domains: {meeting.external_domains.join(", ") || "None"}</span>
                              <span>Captured: {relativeDate(meeting.date)}</span>
                            </div>
                            <div className="detail-actions">
                              <Button variant="secondary" disabled={!meeting.fathom_url}>
                                <ExternalLink size={14} />
                                Open Recording
                              </Button>
                              <Button variant="secondary" disabled={!meeting.share_url}>
                                <Globe size={14} />
                                Share Link
                              </Button>
                            </div>
                            <div className="send-row">
                              <span>Send To...</span>
                              <Select
                                value="action"
                                onChange={() => {}}
                                options={[
                                  { value: "action", label: "Action Items" },
                                  { value: "proposal", label: "Proposals" },
                                  { value: "leads", label: "Lead Magnets" },
                                ]}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          <div className="pagination-row">
            <Button variant="secondary" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
              Previous
            </Button>
            <span>
              Page {page} of {Math.max(1, Math.ceil(filteredMeetings.length / 25))}
            </span>
            <Button
              variant="secondary"
              onClick={() => setPage((current) => Math.min(Math.max(1, Math.ceil(filteredMeetings.length / 25)), current + 1))}
              disabled={page >= Math.max(1, Math.ceil(filteredMeetings.length / 25))}
            >
              Next
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const topAgent = agents[0];

  return (
    <div className="app-shell">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />
      <motion.header className="header glass-card" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="brand">
          <div className="brand-mark">🐾</div>
          <div>
            <h1>ClawBuddy</h1>
            <p>AI Agent Command Center</p>
          </div>
        </div>
        <div className="header-status">
          <div className="status-copy">
            <div className="status-line">
              <span className="status-dot status-pulse" style={{ background: "var(--emerald)" }} />
              <strong>{topAgent.name}: Online</strong>
            </div>
            <p>{topAgent.currentActivity}</p>
            <span>Last seen: {topAgent.lastSeen}</span>
          </div>
          <button className="settings-button" type="button" aria-label="Settings">
            <Settings size={18} />
          </button>
        </div>
      </motion.header>

      <nav className="tabs-bar glass-card">
        {tabs.map((tab, index) => (
          <TabButton key={tab.id} tab={tab} index={index} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="content-area"
        >
          {activeTab === "deck" && renderDeck()}
          {activeTab === "agents" && renderAgents()}
          {activeTab === "tasks" && renderTasks()}
          {activeTab === "logs" && renderLogs()}
          {activeTab === "council" && renderCouncil()}
          {activeTab === "meetings" && renderMeetings()}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
