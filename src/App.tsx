// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { api, setToken } from "./api";
import {
  BookOpen, Users, Package, MessageSquare, Bell, MapPin, Shield,
  Home, LogOut, Search, Plus, Star, Clock, Check, X,
  Edit, Trash2, ArrowLeft, Send, User, Lock,
  UserCheck, UserX, Flag, CheckCircle,
  Eye, Calendar, BarChart2,
  ChevronRight, RefreshCw, Layers, Activity,
  Mail, KeyRound, Building,
  GraduationCap, Hash, Pause, Play, ToggleLeft, ToggleRight,
  UserPlus, UserMinus, Volume2,
  Image, Download
} from "lucide-react";

// ══════════════════════════════════════════════════════════════
// GLOBAL STYLES INJECTOR
// ══════════════════════════════════════════════════════════════
function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; }
      html, body { height: 100%; overflow: hidden; }
      body { font-family: 'Inter', sans-serif; background: #0F172A; color: #F8FAFC; margin: 0; }
      #root { height: 100%; }
      ::selection { background: rgba(59,130,246,0.3); color: #fff; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      ::-webkit-scrollbar-thumb:hover { background: #475569; }
      input, textarea, select, button { font-family: 'Inter', sans-serif; }
      .pageAnim { animation: pgIn 0.25s ease-out forwards; }
      @keyframes pgIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .fadeIn { animation: fdIn 0.3s ease forwards; }
      @keyframes fdIn { from { opacity: 0; } to { opacity: 1; } }
      .pulse { animation: plsAnim 2s infinite; }
      @keyframes plsAnim {
        0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
        70%  { box-shadow: 0 0 0 7px rgba(16,185,129,0); }
        100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
      }
      .spin { animation: spnAnim 0.8s linear infinite; }
      @keyframes spnAnim { to { transform: rotate(360deg); } }
      
      .cardHover { transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
      .cardHover:hover { background: #1E293B !important; transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.15) !important; }
      
      .sideNavItem { transition: all 0.2s ease; border-radius: 12px !important; margin-bottom: 2px; }
      .sideNavItem:hover { background: rgba(255,255,255,0.04); }
      .sideNavActive { background: rgba(59,130,246,0.12) !important; color: #60A5FA !important; }
      .tabBtn { transition: all 0.2s ease; }
      .tabActive { border-bottom: 2px solid #3B82F6; color: #3B82F6 !important; }
      
      .msgBubbleMine { background: #3B82F6; border-radius: 16px 16px 4px 16px; box-shadow: 0 4px 12px rgba(59,130,246,0.2); }
      .msgBubbleOther { background: #1E293B; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px 16px 16px 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .chip { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:24px; font-size:11px; font-weight:600; letter-spacing: 0.3px; }
      
      .overlay { position:fixed; inset:0; background:rgba(15,23,42,0.8); backdrop-filter:blur(8px); z-index:100; display:flex; align-items:center; justify-content:center; animation: fdIn 0.2s ease; }
      .modal { background:#1E293B; border:1px solid rgba(255,255,255,0.08); border-radius:20px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); max-width:520px; width:90%; max-height:85vh; overflow-y:auto; }
      .authCard { background:#1E293B; border:1px solid rgba(255,255,255,0.08); border-radius:24px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
      
      .starFilled { color: #F59E0B; }
      .starEmpty  { color: rgba(255,255,255,0.2); }
    `;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);
  return null;
}

// ══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════════════════════
const C = {
  base: "#0F172A", depth: "#0B1120", surface: "#1E293B",
  card: "#1E293B", cardAlt: "#334155",
  border: "rgba(255,255,255,0.08)", borderLight: "rgba(255,255,255,0.12)",
  cyan: "#3B82F6", cyanLt: "#60A5FA", cyanDk: "#2563EB",
  amber: "#F59E0B", amberLt: "#FCD34D",
  green: "#10B981", red: "#EF4444", purple: "#6366F1", pink: "#EC4899",
  tx: "#F8FAFC", txS: "#E2E8F0", txM: "#94A3B8",
};

const inp = {
  width: "100%", background: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px", padding: "12px 16px", color: C.tx, fontSize: "14px", outline: "none", transition: "border 0.2s ease"
};
const btnP = {
  background: C.cyan, color: "#fff",
  border: "none", borderRadius: "12px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px",
  fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 10px rgba(59,130,246,0.3)", transition: "all 0.2s ease"
};
const btnS = {
  background: "transparent", color: C.txS, border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "12px", padding: "10px 20px", fontSize: "14px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s ease"
};
const btnD = {
  background: "rgba(239,68,68,0.1)", color: C.red, border: "1px solid rgba(239,68,68,0.2)",
  borderRadius: "12px", padding: "8px 14px", fontSize: "13px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease"
};
const btnG = {
  background: "rgba(16,185,129,0.1)", color: C.green, border: "1px solid rgba(16,185,129,0.2)",
  borderRadius: "12px", padding: "8px 14px", fontSize: "13px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease"
};

// ══════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ══════════════════════════════════════════════════════════════

export interface User {
  userId: string;
  name: string;
  email: string;
  department?: string;
  semester?: number;
  bio?: string;
  averageRating?: number;
  status: 'active' | 'blocked';
  role?: 'student' | 'admin';
  mutualCourses?: string[];
  adminLevel?: number;
  joined?: string;
  reports?: number;
  dept?: string;
}

export interface Resource {
  resourceId: string;
  title: string;
  category: 'Book' | 'Equipment' | 'Notes' | 'Other';
  condition?: string;
  maxBorrowDuration?: number;
  status: 'available' | 'borrowed' | 'paused' | 'flagged' | 'active';
  ownerId?: string;
  ownerName?: string;
  owner?: string;
  description?: string;
  reason?: string | null;
  date?: string | null;
}

export interface Announcement {
  announcementId: string;
  content: string;
  timestamp: string;
  author: string;
}

export interface StudyGroup {
  groupId: string;
  groupName: string;
  description: string;
  courseCode: string;
  maxMembers: number;
  visibility: 'public' | 'private';
  memberCount: number;
  members: User[];
  isCreator: boolean;
  joined: boolean;
  announcements: Announcement[];
}

// ══════════════════════════════════════════════════════════════
// MOCK DATA
// ══════════════════════════════════════════════════════════════
const currentUserData: User = {
  userId: "u001", name: "Alex Chen", email: "alex.chen@university.edu",
  department: "Computer Science", semester: 6,
  bio: "Passionate about algorithms & distributed systems. Always up for study sessions! 🚀",
  averageRating: 4.7, status: "active", role: "student",
};
const adminUserData: User = {
  userId: "a001", name: "Dr. Sarah Mills", email: "admin@university.edu",
  role: "admin", adminLevel: 2, status: "active",
};
const students: User[] = [
  { userId: "u002", name: "Priya Sharma", email: "priya.s@university.edu", department: "Computer Science", semester: 6, bio: "ML enthusiast, love competitive coding 🤖", averageRating: 4.9, status: "active", mutualCourses: ["CS401", "CS406"] },
  { userId: "u003", name: "James O'Brien", email: "james.o@university.edu", department: "Mathematics", semester: 5, bio: "Math nerd, tutor for calculus & linear algebra", averageRating: 4.6, status: "active", mutualCourses: ["MATH301"] },
  { userId: "u004", name: "Leila Mansour", email: "leila.m@university.edu", department: "Computer Science", semester: 7, bio: "Backend dev, coffee addict ☕", averageRating: 4.8, status: "active", mutualCourses: ["CS401", "CS410"] },
  { userId: "u005", name: "Daniel Park", email: "daniel.p@university.edu", department: "Physics", semester: 4, bio: "Quantum mechanics & computing enthusiast ⚛️", averageRating: 4.3, status: "active", mutualCourses: [] },
  { userId: "u006", name: "Sofia Martinez", email: "sofia.m@university.edu", department: "Computer Science", semester: 6, bio: "Frontend dev & UI/UX designer 🎨", averageRating: 4.7, status: "active", mutualCourses: ["CS401"] },
  { userId: "u007", name: "Marcus Johnson", email: "marcus.j@university.edu", department: "Electrical Engineering", semester: 5, bio: "IoT & embedded systems", averageRating: 4.2, status: "blocked", mutualCourses: [] },
];

// Unused mock data arrays removed to clean up scope
// ══════════════════════════════════════════════════════════════
// SHARED MICRO-COMPONENTS
// ══════════════════════════════════════════════════════════════

interface AvatarProps { name?: string; size?: number; }
function Avatar({ name, size = 36 }: AvatarProps) {
  const initials = name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";
  const colors = [C.cyanDk, "#5B21B6", "#065F46", "#92400E", "#1E40AF", "#831843"];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[colorIndex],
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.35, color: "#fff", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

interface BadgeProps { label: React.ReactNode; color?: string; bg?: string; }
function Badge({ label, color = C.cyan, bg }: BadgeProps) {
  const bgCol = bg || `${color}22`;
  return (
    <span className="chip" style={{ background: bgCol, color }}>
      {label}
    </span>
  );
}

interface StatusBadgeProps { status: string; }
function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<string, { color: string; label: string }> = {
    available: { color: C.green, label: "Available" },
    borrowed:  { color: C.amber, label: "Borrowed" },
    paused:    { color: C.txM,   label: "Paused" },
    pending:   { color: C.amber, label: "Pending" },
    approved:  { color: C.green, label: "Approved" },
    rejected:  { color: C.red,   label: "Rejected" },
    active:    { color: C.green, label: "Active" },
    blocked:   { color: C.red,   label: "Blocked" },
    overdue:   { color: C.red,   label: "Overdue" },
    returned:  { color: C.green, label: "Returned" },
    open:      { color: C.cyan,  label: "Open" },
    resolved:  { color: C.green, label: "Resolved" },
    flagged:   { color: C.red,   label: "Flagged" },
    investigating: { color: C.amber, label: "Investigating" },
    public:    { color: C.cyan,  label: "Public" },
    private:   { color: C.purple, label: "Private" },
  };
  const info = map[status] || { color: C.txM, label: status };
  return <Badge label={info.label} color={info.color} />;
}

interface StarRatingProps { rating?: number; size?: number; }
function StarRating({ rating = 0, size = 14 }: StarRatingProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? C.amber : "none"} color={i <= Math.round(rating) ? C.amber : C.txM} />
      ))}
      <span style={{ color: C.txS, fontSize: 12, marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </div>
  );
}

interface SectionHeaderProps { title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode; }
function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.tx, margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ color: C.txS, fontSize: 14, marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export interface TabData { id: string; label: string; icon?: React.ReactNode; count?: number; }
interface TabsProps { tabs: TabData[]; active: string; onSelect: (id: string) => void; }
function Tabs({ tabs, active, onSelect }: TabsProps) {
  return (
    <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
      {tabs.map(t => (
        <button key={t.id} className={`tabBtn${active === t.id ? " tabActive" : ""}`}
          onClick={() => onSelect(t.id)}
          style={{ background: "none", border: "none", borderBottom: active === t.id ? `2px solid ${C.cyan}` : "2px solid transparent",
            color: active === t.id ? C.cyanLt : C.txS, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: -1 }}>
          {t.icon && <span style={{ marginRight: 6 }}>{t.icon}</span>}
          {t.label}
          {t.count !== undefined && (
            <span style={{ marginLeft: 8, background: active === t.id ? C.cyan : C.border, borderRadius: 20, padding: "1px 7px", fontSize: 11, color: active === t.id ? "#fff" : C.txS }}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

interface StatCardProps { label: string; value: React.ReactNode; icon: React.ElementType; color?: string; sub?: React.ReactNode; }
function StatCard({ label, value, icon: Icon, color = C.cyan, sub }: StatCardProps) {
  return (
    <div style={{ ...cardStyle(), flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ color: C.txS, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>{label}</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: C.tx, margin: "6px 0 0" }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: C.txM, margin: "4px 0 0" }}>{sub}</p>}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={22} color={color} />
        </div>
      </div>
    </div>
  );
}

interface ModalProps { title: React.ReactNode; onClose: () => void; children: React.ReactNode; width?: number; }
function Modal({ title, onClose, children, width = 500 }: ModalProps) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: width }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.tx }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.txS, cursor: "pointer", padding: 4 }}><X size={18} /></button>
        </div>
        <div style={{ padding: "16px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

interface FormFieldProps { label: React.ReactNode; children: React.ReactNode; }
function FormField({ label, children }: FormFieldProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.txS, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

interface EmptyStateProps { icon: React.ElementType; title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode; }
function EmptyState({ icon: Icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: C.txM }}>
      <Icon size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
      <p style={{ fontSize: 18, fontWeight: 700, color: C.txS, margin: 0 }}>{title}</p>
      {subtitle && <p style={{ fontSize: 14, margin: "8px 0 20px" }}>{subtitle}</p>}
      {action}
    </div>
  );
}

function cardStyle(extra: React.CSSProperties = {}): React.CSSProperties {
  return { background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, ...extra };
}

interface StudentCardProps { student: User; actionEl?: React.ReactNode; }
function StudentCard({ student, actionEl }: StudentCardProps) {
  return (
    <div className="cardHover" style={{ ...cardStyle(), display: "flex", gap: 14, alignItems: "flex-start" }}>
      <Avatar name={student.name} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: C.tx, margin: 0 }}>{student.name}</p>
            <p style={{ fontSize: 12, color: C.txS, margin: "2px 0 0" }}>{student.department} · Sem {student.semester}</p>
          </div>
          <StarRating rating={student.averageRating} />
        </div>
        <p style={{ fontSize: 13, color: C.txM, margin: "6px 0 10px", lineHeight: 1.5 }}>{student.bio}</p>
        {student.mutualCourses && student.mutualCourses.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {student.mutualCourses.map(c => <Badge key={c} label={c} color={C.purple} />)}
          </div>
        )}
        {actionEl}
      </div>
    </div>
  );
}

interface ResourceCardProps { resource: Resource; actionEl?: React.ReactNode; }
function ResourceCard({ resource, actionEl }: ResourceCardProps) {
  const catColor: Record<string, string> = { Book: C.cyan, Equipment: C.amber, Notes: C.green };
  const color = catColor[resource.category] || C.txS;
  return (
    <div className="cardHover" style={cardStyle()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: C.tx, margin: 0 }}>{resource.title}</p>
          <p style={{ fontSize: 12, color: C.txS, margin: "4px 0" }}>by {resource.ownerName || resource.owner}</p>
        </div>
        <StatusBadge status={resource.status} />
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        <Badge label={resource.category} color={color} />
        {resource.condition && <Badge label={`Condition: ${resource.condition}`} color={C.txS} />}
        {resource.maxBorrowDuration && <Badge label={`Max ${resource.maxBorrowDuration}d`} color={C.txM} />}
      </div>
      <p style={{ fontSize: 13, color: C.txM, margin: "0 0 12px", lineHeight: 1.5 }}>{resource.description}</p>
      {actionEl}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODULE: AUTHENTICATION (UC 1–3, 5)
// ══════════════════════════════════════════════════════════════

interface AuthPageProps { onNavigate: (page: string) => void; onLogin?: (role: string) => void; }

function LoginPage({ onLogin, onNavigate }: AuthPageProps) {
  const [email, setEmail] = useState("alex.chen@university.edu");
  const [password, setPassword] = useState("password123");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (role: string) => {
    setLoading(true);
    setError("");
    try {
      if (role === "admin") {
        const data = await api.post('/api/auth/login', { email: 'admin@university.edu', password: 'admin123' });
        setToken(data.token);
        onLogin?.(JSON.stringify({ ...data.user, role: 'admin' }));
      } else {
        const data = await api.post('/api/auth/login', { email, password });
        setToken(data.token);
        onLogin?.(JSON.stringify(data.user));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ height: "100vh", background: C.base, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 40%, rgba(14,165,233,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(139,92,246,0.05) 0%, transparent 50%)" }} />
      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${C.cyan},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={24} color="#fff" />
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, background: `linear-gradient(135deg,${C.cyanLt},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              UniConnect
            </h1>
          </div>
          <p style={{ color: C.txM, fontSize: 14, margin: 0 }}>Your campus collaboration platform</p>
        </div>
        <div className="authCard" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.tx, marginTop: 0, marginBottom: 4 }}>Welcome back</h2>
          <p style={{ color: C.txM, fontSize: 13, marginBottom: 24 }}>Sign in with your university email</p>
          <FormField label="University Email">
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.txM }} />
              <input style={{ ...inp, paddingLeft: 36 }} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" />
            </div>
          </FormField>
          <FormField label="Password">
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.txM }} />
              <input type={showPw ? "text" : "password"} style={{ ...inp, paddingLeft: 36, paddingRight: 40 }} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.txM, cursor: "pointer" }}>
                <Eye size={16} />
              </button>
            </div>
          </FormField>
          <button onClick={() => onNavigate("resetPassword")} style={{ background: "none", border: "none", color: C.cyan, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 10 }}>
            Forgot password?
          </button>
          {error && <div style={{ background: "rgba(239,68,68,0.12)", border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 8, padding: "8px 12px", marginBottom: 12, color: C.red, fontSize: 13 }}>{error}</div>}
          <button onClick={() => handleLogin("student")} style={{ ...btnP, width: "100%", justifyContent: "center", marginBottom: 12, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? <RefreshCw size={16} className="spin" /> : <><Check size={16} /> Sign In</>}
          </button>
          <button onClick={() => onNavigate("adminLogin")} style={{ ...btnS, width: "100%", justifyContent: "center", fontSize: 13 }}>
            <Shield size={14} /> Admin Portal
          </button>
          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 20, textAlign: "center" }}>
            <span style={{ color: C.txM, fontSize: 13 }}>Don't have an account? </span>
            <button onClick={() => onNavigate("register")} style={{ background: "none", border: "none", color: C.cyan, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Register here</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminLoginPage({ onLogin, onNavigate }: AuthPageProps) {
  const [email, setEmail] = useState("admin@university.edu");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.post('/api/auth/login', { email, password });
      setToken(data.token);
      onLogin?.(JSON.stringify({ ...data.user, role: 'admin' }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ height: "100vh", background: C.base, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 40%, rgba(139,92,246,0.06) 0%, transparent 60%)" }} />
      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Shield size={32} color={C.purple} />
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, background: `linear-gradient(135deg,${C.cyanLt},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Admin Portal
            </h1>
          </div>
        </div>
        <div className="authCard" style={{ padding: 32, borderTop: `4px solid ${C.purple}` }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.tx, marginTop: 0, marginBottom: 4 }}>System Access</h2>
          <p style={{ color: C.txM, fontSize: 13, marginBottom: 24 }}>Restricted to university administration</p>
          <FormField label="Admin Email">
            <input style={{ ...inp }} value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@university.edu" />
          </FormField>
          <FormField label="Password">
            <input type="password" style={{ ...inp }} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </FormField>
          {error && <div style={{ color: C.red, fontSize: 13, padding: "8px 12px", background: "rgba(239,68,68,0.1)", borderRadius: 8, marginBottom: 12 }}>{error}</div>}
          <button onClick={handleLogin} style={{ ...btnP, width: "100%", justifyContent: "center", background: `linear-gradient(135deg,${C.purple},${C.cyanDk})`, marginBottom: 16 }} disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </button>
          <button onClick={() => onNavigate("login")} style={{ background: "none", border: "none", color: C.txM, fontSize: 13, cursor: "pointer", width: "100%" }}>
            Return to Student Portal
          </button>
        </div>
      </div>
    </div>
  );
}

// UC 1 – Register Account
function RegisterPage({ onNavigate }: AuthPageProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", dept: "Computer Science", semester: "6", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const depts = ["Computer Science", "Mathematics", "Physics", "Electrical Engineering", "Mechanical Engineering", "Chemistry", "Economics"];

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const { name, email, dept, semester, password } = form;
      const emailRegex = /^([a-zA-Z])(\d{2})(\d{4})@(lhr|isb|fsd|khi|pwr)\.nu\.edu\.pk$/i;
      const match = email.trim().match(emailRegex);
      if (!match) {
        throw new Error("Invalid campus email. Example: l240690@lhr.nu.edu.pk");
      }
      
      const letter = match[1].toLowerCase();
      const year = match[2];
      const campus = match[4].toLowerCase();

      const campusMap: Record<string, string> = { lhr: 'l', isb: 'i', fsd: 'f', khi: 'k', pwr: 'p' };
      if (campusMap[campus] !== letter) {
          throw new Error('Roll number character does not match campus location.');
      }
      
      const computedSemester = (26 - parseInt(year, 10)) * 2;
      const finalSemester = computedSemester > 0 ? computedSemester : parseInt(semester, 10);

      const data = await api.post('/api/auth/register', { name, email, department: dept, semester: finalSemester, password });
      localStorage.setItem('uc_pending_user_id', data.userId);
      onNavigate("verifyStudent");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ height: "100vh", background: C.base, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflowY: "auto" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 30%, rgba(139,92,246,0.06) 0%, transparent 60%)" }} />
      <div style={{ width: "100%", maxWidth: 460, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${C.cyan},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}><BookOpen size={18} color="#fff" /></div>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, background: `linear-gradient(135deg,${C.cyanLt},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>UniConnect</h1>
          </div>
        </div>
        <div className="authCard" style={{ padding: 32 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? C.cyan : C.border, transition: "background 0.3s" }} />
            ))}
          </div>
          {step === 1 ? (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.tx, marginTop: 0, marginBottom: 4 }}>Create account</h2>
              <p style={{ color: C.txM, fontSize: 13, marginBottom: 24 }}>Step 1 of 2 – Personal info</p>
              <FormField label="Full Name">
                <div style={{ position: "relative" }}>
                  <User size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.txM }} />
                  <input style={{ ...inp, paddingLeft: 34 }} value={form.name} onChange={e => upd("name", e.target.value)} placeholder="Your full name" />
                </div>
              </FormField>
              <FormField label="University Email">
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.txM }} />
                  <input style={{ ...inp, paddingLeft: 34 }} value={form.email} onChange={e => upd("email", e.target.value)} placeholder="yourname@university.edu" />
                </div>
              </FormField>
              <FormField label="Password">
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.txM }} />
                  <input type="password" style={{ ...inp, paddingLeft: 34 }} value={form.password} onChange={e => upd("password", e.target.value)} placeholder="Min 8 characters" />
                </div>
              </FormField>
              <button onClick={() => setStep(2)} style={{ ...btnP, width: "100%", justifyContent: "center" }}>Continue <ChevronRight size={16} /></button>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.tx, marginTop: 0, marginBottom: 4 }}>Academic details</h2>
              <p style={{ color: C.txM, fontSize: 13, marginBottom: 24 }}>Step 2 of 2 – Verify your student status</p>
              <FormField label="Department">
                <div style={{ position: "relative" }}>
                  <Building size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.txM }} />
                  <select style={{ ...inp, paddingLeft: 34, appearance: "none" }} value={form.dept} onChange={e => upd("dept", e.target.value)}>
                    {depts.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </FormField>
              <FormField label="Current Semester">
                <div style={{ position: "relative" }}>
                  <GraduationCap size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.txM }} />
                  <select style={{ ...inp, paddingLeft: 34, appearance: "none" }} value={form.semester} onChange={e => upd("semester", e.target.value)}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </FormField>
              <FormField label="Student ID">
                <div style={{ position: "relative" }}>
                  <Hash size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.txM }} />
                  <input style={{ ...inp, paddingLeft: 34 }} placeholder="e.g. STU20230042" />
                </div>
              </FormField>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ ...btnS, flex: 1, justifyContent: "center" }}><ArrowLeft size={15} /> Back</button>
                <button onClick={handleRegister} style={{ ...btnP, flex: 1, justifyContent: "center", opacity: loading ? 0.7 : 1 }} disabled={loading}>
                  {loading ? <RefreshCw size={15} className="spin" /> : <>Register <CheckCircle size={15} /></>}
                </button>
              </div>
              {error && <div style={{ background: "rgba(239,68,68,0.12)", border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 8, padding: "8px 12px", marginTop: 12, color: C.red, fontSize: 13 }}>{error}</div>}
            </>
          )}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ color: C.txM, fontSize: 13 }}>Already have an account? </span>
            <button onClick={() => onNavigate("login")} style={{ background: "none", border: "none", color: C.cyan, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// UC 2 – Verify Student Status
function VerifyStudentPage({ onNavigate }: AuthPageProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      const userId = localStorage.getItem('uc_pending_user_id');
      await api.post('/api/auth/verify', { userId, code });
      localStorage.removeItem('uc_pending_user_id');
      onNavigate("login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100vh", background: C.base, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>
        <div className="authCard" style={{ padding: 36, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: `${C.cyan}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Mail size={28} color={C.cyan} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.tx, margin: "0 0 8px" }}>Verify your email</h2>
          <p style={{ color: C.txM, fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
            We've sent a 6-digit code to <strong style={{ color: C.txS }}>your@university.edu</strong>. Enter it below to verify your student status.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
            <input value={code} onChange={e => setCode(e.target.value)} maxLength={6} style={{ width: "100%", height: 52, textAlign: "center", letterSpacing: 8, fontSize: 22, fontWeight: 700, background: C.depth, border: `1px solid ${C.borderLight}`, borderRadius: 10, color: C.tx }} placeholder="000000" />
          </div>
          {error && <div style={{ background: "rgba(239,68,68,0.12)", border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 8, padding: "8px 12px", marginBottom: 12, color: C.red, fontSize: 13 }}>{error}</div>}
          <button onClick={handleVerify} style={{ ...btnP, width: "100%", justifyContent: "center", marginBottom: 12, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? <RefreshCw size={16} className="spin" /> : <><CheckCircle size={16} /> Verify & Continue</>}
          </button>
          <button style={{ background: "none", border: "none", color: C.txS, fontSize: 13, cursor: "pointer" }}>
            Didn't receive it? Resend code
          </button>
        </div>
      </div>
    </div>
  );
}

// UC 5 – Reset Password
function ResetPasswordPage({ onNavigate }: AuthPageProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post('/api/auth/reset-password', { email });
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100vh", background: C.base, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div className="authCard" style={{ padding: 36 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: `${C.amber}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <KeyRound size={24} color={C.amber} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.tx, margin: "0 0 8px" }}>{sent ? "Check your email" : "Reset password"}</h2>
          {!sent ? (
            <>
              <p style={{ color: C.txM, fontSize: 13, marginBottom: 24 }}>Enter your university email and we'll send a reset link.</p>
              <FormField label="University Email">
                <input style={inp} placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
              </FormField>
              {error && <div style={{ background: "rgba(239,68,68,0.12)", border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 8, padding: "8px 12px", marginBottom: 12, color: C.red, fontSize: 13 }}>{error}</div>}
              <button onClick={handleReset} style={{ ...btnP, width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }} disabled={loading}>
                {loading ? <RefreshCw size={15} className="spin" /> : "Send Reset Link"}
              </button>
            </>
          ) : (
            <>
              <p style={{ color: C.txM, fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>We've sent a password reset link to your email. Check your inbox and follow the instructions.</p>
              <button onClick={() => onNavigate("login")} style={{ ...btnP, width: "100%", justifyContent: "center" }}>Back to Sign In</button>
            </>
          )}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button onClick={() => onNavigate("login")} style={{ background: "none", border: "none", color: C.txS, fontSize: 13, cursor: "pointer" }}>
              ← Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODULE: LAYOUT (Sidebar + TopBar + Shell)
// ══════════════════════════════════════════════════════════════
interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}
const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home },
    ],
  },
  {
    label: "Collaborate",
    items: [
      { id: "studyPartners", label: "Study Partners", icon: Users },
      { id: "studyGroups", label: "Study Groups", icon: Layers },
    ],
  },
  {
    label: "Resources",
    items: [
      { id: "resources", label: "Resources", icon: Package },
    ],
  },
  {
    label: "Connect",
    items: [
      { id: "messages", label: "Messages", icon: MessageSquare, badge: 2 },
      { id: "notifications", label: "Notifications", icon: Bell, badge: 3 },
      { id: "lostFound", label: "Lost & Found", icon: MapPin },
    ],
  },
];
const adminNavGroups: NavGroup[] = [
  {
    label: "Admin Panel",
    items: [
      { id: "adminDashboard", label: "Dashboard", icon: BarChart2 },
      { id: "adminUsers", label: "Manage Users", icon: UserCheck },
      { id: "adminResources", label: "Resource Listings", icon: Package },
      { id: "adminReports", label: "Platform Reports", icon: Flag },
    ],
  },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user?: User | null;
  isAdmin?: boolean;
}

function Sidebar({ currentPage, onNavigate, user: _user, isAdmin }: SidebarProps) {
  const groups = isAdmin ? adminNavGroups : navGroups;
  return (
    <div style={{ width: 224, background: C.depth, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", height: "100%", flexShrink: 0 }}>
      <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${C.cyan},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 900, fontSize: 17, background: `linear-gradient(135deg,${C.cyanLt},${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>UniConnect</span>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        {groups.map(group => (
          <div key={group.label} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.txM, textTransform: "uppercase", letterSpacing: 1.2, padding: "0 8px", marginBottom: 6 }}>{group.label}</p>
            {group.items.map(item => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button key={item.id} className={`sideNavItem${active ? " sideNavActive" : ""}`}
                  onClick={() => onNavigate(item.id)}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: active ? "rgba(14,165,233,0.1)" : "none", border: active ? `none` : "none", borderRight: active ? `2px solid ${C.cyan}` : "2px solid transparent", borderRadius: active ? "8px 0 0 8px" : 8, padding: "9px 10px", color: active ? C.cyanLt : C.txS, cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500, textAlign: "left" }}>
                  <Icon size={16} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && <span style={{ background: C.red, borderRadius: 20, padding: "1px 6px", fontSize: 10, fontWeight: 700, color: "#fff" }}>{item.badge}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
        {!isAdmin && (
          <button className="sideNavItem" onClick={() => onNavigate("profile")}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: currentPage === "profile" ? "rgba(14,165,233,0.1)" : "none", border: "none", borderRadius: 8, padding: "9px 10px", color: C.txS, cursor: "pointer", fontSize: 13, fontWeight: 500, textAlign: "left", marginBottom: 4 }}>
            <User size={16} /> Profile
          </button>
        )}
        <button className="sideNavItem" onClick={() => onNavigate("login")}
          style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", borderRadius: 8, padding: "9px 10px", color: C.red, cursor: "pointer", fontSize: 13, fontWeight: 500, textAlign: "left", opacity: 0.8 }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}
interface TopBarProps {
  user: User;
  currentPage: string;
  onNavigate: (page: string) => void;
}
function TopBar({ user, currentPage, onNavigate }: TopBarProps) {
  const pageLabels: Record<string, string> = {
    dashboard: "Dashboard", studyPartners: "Study Partners", studyGroups: "Study Groups",
    resources: "Resources", messages: "Messages", notifications: "Notifications",
    lostFound: "Lost & Found", profile: "Profile", adminDashboard: "Admin Dashboard",
    adminUsers: "Manage Users", adminResources: "Resource Listings", adminReports: "Platform Reports",
  };
  return (
    <div style={{ height: 58, background: C.depth, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: C.tx, margin: 0 }}>{pageLabels[currentPage] || "UniConnect"}</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => onNavigate("notifications")} style={{ background: "none", border: "none", color: C.txS, cursor: "pointer", position: "relative", padding: 4 }}>
          <Bell size={20} />
          <span style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: C.red }} />
        </button>
        <button onClick={() => onNavigate("messages")} style={{ background: "none", border: "none", color: C.txS, cursor: "pointer", position: "relative", padding: 4 }}>
          <MessageSquare size={20} />
          <span style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: C.cyan }} />
        </button>
        <button onClick={() => onNavigate("profile")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 8 }}>
          <Avatar name={user.name} size={30} />
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.tx, margin: 0 }}>{user.name}</p>
            <p style={{ fontSize: 10, color: C.txM, margin: 0 }}>{user.department || user.role}</p>
          </div>
        </button>
      </div>
    </div>
  );
}
interface AppShellProps {
  user: User;
  currentPage: string;
  onNavigate: (page: string) => void;
  isAdmin?: boolean;
  children: React.ReactNode;
}
function AppShell({ user, currentPage, onNavigate, isAdmin, children }: AppShellProps) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} user={user} isAdmin={isAdmin} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar user={user} currentPage={currentPage} onNavigate={onNavigate} />
        <div style={{ flex: 1, overflowY: "auto", background: C.base }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODULE: DASHBOARD
// ══════════════════════════════════════════════════════════════
interface DashboardPageProps { user?: any; onNavigate: (page: string) => void; }
function DashboardPage({ user, onNavigate }: DashboardPageProps) {
  const [stats, setStats] = useState({ partners: 0, groups: 0, resources: 0, loans: 0 });

  useEffect(() => {
    api.get('/api/users/dashboard').then(data => {
      if (data.stats) setStats(data.stats);
    }).catch(console.error);
  }, []);

  const recentActivity = [
    { icon: UserPlus, text: "Priya Sharma sent you a partner request", time: "2 min ago", color: C.cyan },
    { icon: CheckCircle, text: "Borrow request for 'Laptop Stand' approved", time: "1 hr ago", color: C.green },
    { icon: Volume2, text: "New announcement in Algorithms Study Squad", time: "3 hrs ago", color: C.purple },
    { icon: RefreshCw, text: "James O'Brien returned your book", time: "Yesterday", color: C.amber },
  ];
  return (
    <div className="pageAnim" style={{ padding: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.tx, margin: 0 }}>
          Good afternoon, <span style={{ color: C.cyanLt }}>{user?.name?.split(' ')[0] || 'Student'}</span> 👋
        </h1>
        <p style={{ color: C.txM, fontSize: 14, marginTop: 6 }}>Here's what's happening on campus today.</p>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Study Partners" value={stats.partners} icon={Users} color={C.cyan} sub="Joined partners" />
        <StatCard label="Active Groups" value={stats.groups} icon={Layers} color={C.purple} sub="Enrolled" />
        <StatCard label="My Resources" value={stats.resources} icon={Package} color={C.amber} sub="Listed" />
        <StatCard label="Active Loans" value={stats.loans} icon={BookOpen} color={C.green} sub="Borrowed" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODULE: PROFILE (UC 4, 6)
// ══════════════════════════════════════════════════════════════
interface ProfilePageProps { user: User; onNavigate: (page: string) => void; }
function ProfilePage({ user, onNavigate: _onNavigate }: ProfilePageProps) {
  const [profile, setProfile] = useState<any>(user);
  const [tab, setTab] = useState("view");
  const [editForm, setEditForm] = useState({ name: user.name, bio: user.bio || "", dept: user.department || "", semester: String(user.semester || "") });
  const [privacySettings, setPrivacySettings] = useState<Record<string, boolean | string>>({ showEmail: false, showDept: true, showSemester: true, showRating: true, allowPartnerRequests: true, profileVisibility: "public" });

  useEffect(() => {
    api.get('/api/users/me').then(data => {
      setProfile(data);
      setEditForm({ name: data.name, bio: data.bio || "", dept: data.department || "", semester: String(data.semester || "") });
      setPrivacySettings({
        showEmail: data.showEmail === 1,
        showDept: data.showDept === 1,
        showSemester: data.showSemester === 1,
        showRating: data.showRating === 1,
        allowPartnerRequests: data.allowRequests === 1,
        profileVisibility: data.visibility || "public"
      });
    }).catch(console.error);
  }, []);

  const upd = (k: string, v: string) => setEditForm(f => ({ ...f, [k]: v }));
  const togglePrivacy = (k: string) => setPrivacySettings(p => ({ ...p, [k]: !p[k] }));
  const depts = ["Computer Science", "Mathematics", "Physics", "Electrical Engineering", "Mechanical Engineering", "Chemistry", "Economics"];
  const tabs = [
    { id: "view", label: "My Profile" },
    { id: "edit", label: "Edit Profile" },
    { id: "privacy", label: "Privacy Settings" },
  ];
  return (
    <div className="pageAnim" style={{ padding: 28, maxWidth: 720, margin: "0 auto" }}>
      <Tabs tabs={tabs} active={tab} onSelect={setTab} />
      {tab === "view" && (
        <div>
          <div style={{ ...cardStyle(), display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ position: "relative" }}>
              <Avatar name={profile.name} size={72} />
              <div className="pulse" style={{ width: 12, height: 12, borderRadius: "50%", background: C.green, position: "absolute", bottom: 2, right: 2, border: `2px solid ${C.card}` }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: C.tx, margin: 0 }}>{profile.name}</h2>
              <p style={{ color: C.txS, fontSize: 14, margin: "4px 0 8px" }}>{profile.department} · Semester {profile.semester}</p>
              <StarRating rating={profile.avgRating || 0} />
              <p style={{ fontSize: 14, color: C.txM, margin: "12px 0 0", lineHeight: 1.6 }}>{profile.bio}</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[
              { label: "Study Partners", value: "-", icon: Users, color: C.cyan },
              { label: "Study Groups", value: "-", icon: Layers, color: C.purple },
              { label: "Resources Listed", value: "-", icon: Package, color: C.amber },
            ].map(s => (
              <div key={s.label} style={{ ...cardStyle({ textAlign: "center", padding: 16 }) }}>
                <s.icon size={22} color={s.color} style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 26, fontWeight: 800, color: C.tx, margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: C.txM, margin: "4px 0 0" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "edit" && (
        <div style={cardStyle()}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: C.tx, margin: "0 0 20px" }}>Edit Profile</h3>
          <FormField label="Display Name">
            <input style={inp} value={editForm.name} onChange={e => upd("name", e.target.value)} />
          </FormField>
          <FormField label="Bio">
            <textarea style={{ ...inp, height: 90, resize: "vertical", lineHeight: 1.5 }} value={editForm.bio} onChange={e => upd("bio", e.target.value)} />
          </FormField>
          <FormField label="Department">
            <select style={{ ...inp, appearance: "none" }} value={editForm.dept} onChange={e => upd("dept", e.target.value)}>
              {depts.map(d => <option key={d}>{d}</option>)}
            </select>
          </FormField>
          <FormField label="Current Semester">
            <select style={{ ...inp, appearance: "none" }} value={editForm.semester} onChange={e => upd("semester", e.target.value)}>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </FormField>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button style={{ ...btnP }}><Check size={15} /> Save Changes</button>
            <button style={{ ...btnS }} onClick={() => setTab("view")}><X size={15} /> Cancel</button>
          </div>
        </div>
      )}
      {tab === "privacy" && (
        <div style={cardStyle()}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: C.tx, margin: "0 0 6px" }}>Privacy Settings</h3>
          <p style={{ color: C.txM, fontSize: 13, marginBottom: 24 }}>Control what other students can see on your profile.</p>
          {[
            { key: "showEmail", label: "Show email address", desc: "Allow others to see your university email" },
            { key: "showDept", label: "Show department", desc: "Display your department on your profile" },
            { key: "showSemester", label: "Show semester", desc: "Display your current semester" },
            { key: "showRating", label: "Show rating", desc: "Allow others to see your average rating" },
            { key: "allowPartnerRequests", label: "Allow partner requests", desc: "Let other students send you study partner requests" },
          ].map(s => (
            <div key={s.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.tx, margin: 0 }}>{s.label}</p>
                <p style={{ fontSize: 12, color: C.txM, margin: "3px 0 0" }}>{s.desc}</p>
              </div>
              <button onClick={() => togglePrivacy(s.key)} style={{ background: "none", border: "none", cursor: "pointer", color: privacySettings[s.key] ? C.cyan : C.txM }}>
                {privacySettings[s.key] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <FormField label="Profile Visibility">
              <select style={{ ...inp, appearance: "none", maxWidth: 200 }} value={String(privacySettings.profileVisibility)} onChange={e => setPrivacySettings(p => ({ ...p, profileVisibility: e.target.value }))}>
                <option value="public">Public – Visible to all students</option>
                <option value="partners">Partners Only</option>
                <option value="private">Private – Hidden</option>
              </select>
            </FormField>
            <button style={{ ...btnP, marginTop: 4 }}><Check size={15} /> Save Privacy Settings</button>
          </div>
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.tx, margin: "0 0 6px" }}>Change Password</h3>
            <p style={{ color: C.txM, fontSize: 13, marginBottom: 16 }}>Update your account security credentials.</p>
            <FormField label="Current Password">
              <input type="password" style={{ ...inp, maxWidth: 300 }} placeholder="Current password" />
            </FormField>
            <FormField label="New Password">
              <input type="password" style={{ ...inp, maxWidth: 300 }} placeholder="Min 8 characters" />
            </FormField>
            <button style={{ ...btnP, marginTop: 10 }} onClick={() => alert("Password updated successfully!")}><KeyRound size={15} /> Update Password</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODULE: STUDY PARTNERS (UC 7–9)
// ══════════════════════════════════════════════════════════════
function StudyPartnersPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [tab, setTab] = useState("search");
  // --------------------------------------------------------------------------
  // UI & FILTER STATE
  // Manages the active tab and the search/filter inputs for the directory
  // --------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  // --------------------------------------------------------------------------
  // NETWORK DATA STATE
  // Holds real users from the DB instead of the legacy mocked static arrays
  // --------------------------------------------------------------------------
  const [discoverableStudents, setDiscoverableStudents] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [myPartners, setMyPartners] = useState<any[]>([]);

  // --------------------------------------------------------------------------
  // EFFECT: Fetch Initial Data
  // Loads search results, requests, and current partners simultaneously.
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [searchRes, reqRes, partRes] = await Promise.all([
          api.get('/api/partners/search'),
          api.get('/api/partners/requests'),
          api.get('/api/partners')
        ]);
        setDiscoverableStudents(searchRes);
        setIncomingRequests(reqRes);
        setMyPartners(partRes);
      } catch (err) {
        console.error("Failed to load partners data:", err);
      }
    };
    fetchData();
  }, [tab]);

  // --------------------------------------------------------------------------
  // HANDLER: Send Partner Request
  // Triggers UC 8 POST endpoint to request a new study partner.
  // --------------------------------------------------------------------------
  const sendRequest = async (userId: string) => {
    try {
      await api.post('/api/partners/requests', { toId: userId });
      alert("Partner request sent!");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // --------------------------------------------------------------------------
  // HANDLER: Accept/Decline Request
  // Triggers UC 9 PUT endpoint to accept or decline an incoming request.
  // --------------------------------------------------------------------------
  const handleRequestAction = async (id: string, action: "accept" | "decline") => {
    try {
      await api.put(`/api/partners/requests/${id}`, { action });
      setIncomingRequests(reqs => reqs.filter(r => r.id !== id));
      if (action === "accept") {
        setMyPartners(await api.get('/api/partners'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --------------------------------------------------------------------------
  // HANDLER: Remove Partner
  // Allows users to break the study partner relationship.
  // --------------------------------------------------------------------------
  const removePartner = async (partnerId: string) => {
    try {
      await api.delete(`/api/partners/${partnerId}`);
      setMyPartners(pts => pts.filter(p => p.id !== partnerId));
    } catch (err) {
      console.error(err);
    }
  };

  const depts = ["All", "Computer Science", "Mathematics", "Physics", "Electrical Engineering"];
  
  const filtered = discoverableStudents.filter(s =>
    (deptFilter === "All" || s.department === deptFilter) &&
    (searchQuery === "" || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.department || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs = [
    { id: "search", label: "Search Partners" },
    { id: "requests", label: "Partner Requests", count: incomingRequests.length },
    { id: "partners", label: "My Partners", count: myPartners.length },
  ];
  return (
    <div className="pageAnim" style={{ padding: 28 }}>
      <SectionHeader title="Study Partners" subtitle="Find and connect with students who share your courses" />
      <Tabs tabs={tabs} active={tab} onSelect={setTab} />
      {tab === "search" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.txM }} />
              <input style={{ ...inp, paddingLeft: 36 }} placeholder="Search by name, department, or course…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <select style={{ ...inp, width: 180, appearance: "none" }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              {depts.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {filtered.map(student => (
              <StudentCard key={student.id} student={student} actionEl={
                student.status === "blocked"
                  ? <Badge label="Account Blocked" color={C.red} />
                  : <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => sendRequest(student.id)} style={{ ...btnP, padding: "7px 14px", fontSize: 12 }}>
                        <UserPlus size={14} /> Send Request
                      </button>
                    </div>
              } />
            ))}
          </div>
        </div>
      )}
      {tab === "requests" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {incomingRequests.length === 0
            ? <EmptyState icon={Users} title="No pending requests" subtitle="Partner requests will appear here" />
            : incomingRequests.map(req => (
                <div key={req.id} style={{ ...cardStyle(), display: "flex", alignItems: "center", gap: 16 }}>
                  <Avatar name={req.fromName} size={46} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: C.tx, margin: 0 }}>{req.fromName}</p>
                    <p style={{ fontSize: 12, color: C.txS, margin: "2px 0 6px" }}>{req.fromDept} · Sem {req.fromSemester}</p>
                    <p style={{ fontSize: 12, color: C.txM, margin: 0 }}>Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StarRating rating={req.avgRating || 0} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => handleRequestAction(req.id, "accept")} style={btnG}><Check size={14} /> Accept</button>
                    <button onClick={() => handleRequestAction(req.id, "decline")} style={btnD}><X size={14} /> Decline</button>
                  </div>
                </div>
              ))
          }
        </div>
      )}
      {tab === "partners" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {myPartners.map(partner => (
            <StudentCard key={partner.id} student={partner} actionEl={
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => onNavigate("messages")} style={{ ...btnP, padding: "7px 14px", fontSize: 12 }}><MessageSquare size={14} /> Message</button>
                <button onClick={() => removePartner(partner.id)} style={{ ...btnD, padding: "7px 12px", fontSize: 12 }}><UserMinus size={14} /></button>
              </div>
            } />
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODULE: STUDY GROUPS (UC 10–14)
// ══════════════════════════════════════════════════════════════
function StudyGroupsPage() {
  // --------------------------------------------------------------------------
  // UI NAVIGATION STATE
  // --------------------------------------------------------------------------
  const [tab, setTab] = useState("myGroups");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [detailedGroup, setDetailedGroup] = useState<any>(null);
  
  // --------------------------------------------------------------------------
  // FORMS STATE
  // --------------------------------------------------------------------------
  const [_showCreate, _setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", desc: "", course: "", max: "8", visibility: "public" });
  const [newAnnouncement, setNewAnnouncement] = useState("");

  // --------------------------------------------------------------------------
  // NETWORK DATA STATE: Fetching live study groups from backend
  // --------------------------------------------------------------------------
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [discoverGroups, setDiscoverGroups] = useState<any[]>([]);

  // --------------------------------------------------------------------------
  // EFFECT: Fetch Initial Data
  // Fires on tab change to immediately retrieve the latest SQL records
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (tab === "myGroups") {
          setMyGroups(await api.get('/api/groups/mine'));
        } else if (tab === "discover") {
          setDiscoverGroups(await api.get('/api/groups/discover'));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroups();
  }, [tab]);

  // --------------------------------------------------------------------------
  // EFFECT: Fetch Singular Group Details (When viewing a specific group)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (selectedGroup) {
      api.get(`/api/groups/${selectedGroup}`)
        .then(setDetailedGroup)
        .catch(console.error);
    } else {
      setDetailedGroup(null);
    }
  }, [selectedGroup]);

  // --------------------------------------------------------------------------
  // HANDLERS: Network Mutators
  // --------------------------------------------------------------------------
  const handleJoin = async (id: string) => {
    try {
      await api.post(`/api/groups/${id}/join`, {});
      setTab("myGroups"); // Redirect to my groups on success
      setMyGroups(await api.get('/api/groups/mine'));
    } catch (err) { console.error(err); }
  };

  const handleLeave = async (id: string) => {
    try {
      await api.delete(`/api/groups/${id}/leave`);
      setSelectedGroup(null);
      setMyGroups(await api.get('/api/groups/mine'));
    } catch (err) { console.error(err); }
  };

  const createGroup = async () => {
    if (!newGroup.name) return alert("Group name required");
    try {
      await api.post('/api/groups', {
        name: newGroup.name,
        description: newGroup.desc,
        courseCode: newGroup.course,
        maxMembers: parseInt(newGroup.max, 10) || 10,
        visibility: newGroup.visibility
      });
      setTab("myGroups");
      setNewGroup({ name: "", desc: "", course: "", max: "10", visibility: "public" });
      setMyGroups(await api.get('/api/groups/mine'));
    } catch(err) { console.error(err); }
  };

  const postAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    try {
      await api.post(`/api/groups/${selectedGroup}/announcements`, { content: newAnnouncement });
      setNewAnnouncement("");
      // Refresh detailed group config
      setDetailedGroup(await api.get(`/api/groups/${selectedGroup}`));
    } catch(err) { console.error(err); }
  };

  const removeMember = async (userId: string) => {
    try {
      await api.delete(`/api/groups/${selectedGroup}/members/${userId}`);
      setDetailedGroup(await api.get(`/api/groups/${selectedGroup}`));
    } catch(err) { console.error(err); }
  };

  const tabs = [
    { id: "myGroups", label: "My Groups", count: myGroups.length },
    { id: "discover", label: "Discover", count: discoverGroups.length },
    { id: "create", label: "Create Group" },
  ];
  if (selectedGroup) {
    const grp = detailedGroup;
    if (!grp) return <div style={{ padding: 28 }}>Loading group details...</div>;
    return (
      <div className="pageAnim" style={{ padding: 28, maxWidth: 800, margin: "0 auto" }}>
        <button onClick={() => setSelectedGroup(null)} style={{ ...btnS, marginBottom: 20, padding: "8px 16px", fontSize: 13 }}><ArrowLeft size={15} /> Back to Groups</button>
        <div style={{ ...cardStyle(), marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.tx, margin: 0 }}>{grp.name}</h2>
              <p style={{ color: C.txS, fontSize: 13, margin: "6px 0 0" }}>{grp.description}</p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <StatusBadge status={grp.visibility || "public"} />
              {grp.isCreator === 1 && <Badge label="Creator" color={C.amber} />}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Badge label={grp.courseCode || "Global"} color={C.cyan} />
            <Badge label={`${grp.memberCount}/${grp.maxMembers} members`} color={C.txS} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={cardStyle()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.tx, margin: 0 }}>Members ({grp.members?.length || 0})</h3>
              {grp.isCreator === 1 && <button style={{ ...btnS, padding: "5px 10px", fontSize: 11 }}><UserPlus size={13} /> Invite</button>}
            </div>
            {grp.members?.map((m: any) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <Avatar name={m.name} size={32} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.tx, margin: 0 }}>{m.name}</p>
                  <p style={{ fontSize: 11, color: C.txM, margin: 0 }}>{m.department}</p>
                </div>
                {m.id === currentUserData.userId && <Badge label="You" color={C.cyan} />}
                {grp.isCreator === 1 && m.id !== currentUserData.userId && (
                  <button onClick={() => removeMember(m.id)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", padding: 4 }}><UserMinus size={15} /></button>
                )}
              </div>
            ))}
          </div>
          <div style={cardStyle()}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.tx, margin: "0 0 14px" }}>Announcements</h3>
            {grp.isCreator === 1 && (
              <div style={{ marginBottom: 16 }}>
                <textarea style={{ ...inp, height: 70, resize: "none", fontSize: 13 }} value={newAnnouncement} onChange={e => setNewAnnouncement(e.target.value)} placeholder="Post an announcement…" />
                <button onClick={postAnnouncement} style={{ ...btnP, marginTop: 8, padding: "7px 14px", fontSize: 12 }}><Send size={13} /> Post</button>
              </div>
            )}
            {(grp.announcements?.length ?? 0) === 0
              ? <EmptyState icon={Volume2} title="No announcements yet" subtitle="" />
              : grp.announcements?.map((a: any) => (
                  <div key={a.id} style={{ padding: "12px 14px", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 10 }}>
                    <p style={{ fontSize: 13, color: C.tx, margin: "0 0 6px", lineHeight: 1.5 }}>{a.content}</p>
                    <p style={{ fontSize: 11, color: C.txM, margin: 0 }}>{a.authorName} · {new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
            }
          </div>
        </div>
        {grp.isCreator === 0 && (
          <button onClick={() => handleLeave(grp.id)} style={{ ...btnD, marginTop: 20 }}><LogOut size={14} /> Leave Group</button>
        )}
      </div>
    );
  }
  return (
    <div className="pageAnim" style={{ padding: 28 }}>
      <SectionHeader title="Study Groups" subtitle="Collaborate with classmates on shared courses" />
      <Tabs tabs={tabs} active={tab} onSelect={setTab} />
      {tab === "myGroups" && (
        myGroups.length === 0
          ? <EmptyState icon={Layers} title="You haven't joined any groups" subtitle="Discover groups to join" action={<button onClick={() => setTab("discover")} style={btnP}>Explore Groups</button>} />
          : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {myGroups.map(g => (
                <div key={g.id} className="cardHover" style={cardStyle()}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: C.tx, margin: 0 }}>{g.name}</h3>
                    <StatusBadge status={g.visibility} />
                  </div>
                  <p style={{ fontSize: 13, color: C.txM, margin: "0 0 10px", lineHeight: 1.5 }}>{g.description}</p>
                  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    <Badge label={g.courseCode || "General"} color={C.cyan} />
                    <Badge label={`${g.memberCount}/${g.maxMembers}`} color={C.txS} />
                    {g.isCreator === 1 && <Badge label="Creator" color={C.amber} />}
                  </div>
                  <button onClick={() => setSelectedGroup(g.id)} style={{ ...btnS, padding: "7px 14px", fontSize: 12 }}>
                    <Eye size={14} /> View Group
                  </button>
                </div>
              ))}
            </div>
      )}
      {tab === "discover" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {discoverGroups.map(g => (
            <div key={g.id} className="cardHover" style={cardStyle()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.tx, margin: 0 }}>{g.name}</h3>
                <StatusBadge status={g.visibility} />
              </div>
              <p style={{ fontSize: 13, color: C.txM, margin: "0 0 10px", lineHeight: 1.5 }}>{g.description}</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <Badge label={g.courseCode || "General"} color={C.cyan} />
                <Badge label={`${g.memberCount}/${g.maxMembers} members`} color={C.txS} />
              </div>
              {g.isMember === 1
                ? <Badge label="Joined" color={C.green} />
                : g.visibility === "private"
                  ? <button style={{ ...btnS, padding: "7px 14px", fontSize: 12 }}><Lock size={14} /> Request to Join</button>
                  : <button onClick={() => handleJoin(g.id)} style={{ ...btnP, padding: "7px 14px", fontSize: 12 }}><Plus size={14} /> Join Group</button>
              }
            </div>
          ))}
        </div>
      )}
      {tab === "create" && (
        <div style={{ maxWidth: 540 }}>
          <div style={cardStyle()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.tx, margin: "0 0 20px" }}>Create New Study Group</h3>
            <FormField label="Group Name">
              <input style={inp} value={newGroup.name} onChange={e => setNewGroup(g => ({ ...g, name: e.target.value }))} placeholder="e.g. CS401 Algorithms Team" />
            </FormField>
            <FormField label="Description">
              <textarea style={{ ...inp, height: 80, resize: "none" }} value={newGroup.desc} onChange={e => setNewGroup(g => ({ ...g, desc: e.target.value }))} placeholder="What will your group study?" />
            </FormField>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="Course Code">
                <input style={inp} value={newGroup.course} onChange={e => setNewGroup(g => ({ ...g, course: e.target.value }))} placeholder="e.g. CS401" />
              </FormField>
              <FormField label="Max Members">
                <select style={{ ...inp, appearance: "none" }} value={newGroup.max} onChange={e => setNewGroup(g => ({ ...g, max: e.target.value }))}>
                  {[4,6,8,10,12,15,20].map(n => <option key={n}>{n}</option>)}
                </select>
              </FormField>
            </div>
            <FormField label="Visibility">
              <div style={{ display: "flex", gap: 10 }}>
                {["public", "private"].map(v => (
                  <button key={v} onClick={() => setNewGroup(g => ({ ...g, visibility: v }))}
                    style={{ flex: 1, padding: "10px 16px", borderRadius: 8, border: `1px solid ${newGroup.visibility === v ? C.cyan : C.border}`, background: newGroup.visibility === v ? `${C.cyan}15` : C.depth, color: newGroup.visibility === v ? C.cyan : C.txS, cursor: "pointer", fontWeight: 600, fontSize: 13, textTransform: "capitalize" }}>
                    {v === "public" ? <><Eye size={13} style={{ marginRight: 6 }} />Public</> : <><Lock size={13} style={{ marginRight: 6 }} />Private</>}
                  </button>
                ))}
              </div>
            </FormField>
            <button onClick={createGroup} style={{ ...btnP, marginTop: 4 }}><Plus size={16} /> Create Group</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODULE: RESOURCES (UC 15–27)
// ══════════════════════════════════════════════════════════════
interface ResourcesPageProps { user?: User | null; }
function ResourcesPage({ user: _user }: ResourcesPageProps) {
  const [tab, setTab] = useState("browse");
  const [searchQ, setSearchQ] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showHandover, setShowHandover] = useState(false);
  const [showReview, setShowReview] = useState<LendingTransaction | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [newResource, setNewResource] = useState({ title: "", category: "Book", condition: "Good", duration: "7", description: "" });
  const [userRating, setUserRating] = useState(0);

  const [allResources, setAllResources] = useState<any[]>([]);
  const [myResources, setMyResources] = useState<any[]>([]);
  const [borrowReqs, setBorrowReqs] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = [];
        if (catFilter !== "All") queryParams.push(`category=${catFilter}`);
        if (searchQ) queryParams.push(`q=${searchQ}`);
        const qs = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

        const [resRes, mineRes, reqsRes, histRes] = await Promise.all([
          api.get(`/api/resources${qs}`),
          api.get('/api/resources/mine'),
          api.get('/api/resources/borrow-requests'),
          api.get('/api/resources/history')
        ]);
        setAllResources(resRes.map((r: any) => ({ ...r, resourceId: r.id })));
        setMyResources(mineRes.map((r: any) => ({ ...r, resourceId: r.id })));
        setBorrowReqs(reqsRes.map((r: any) => ({ ...r, requestId: r.id, resource: { title: r.resourceTitle }, requester: { name: r.requesterName }, requestedDuration: r.duration, requestDate: new Date(r.createdAt).toLocaleDateString() })));
        setHistory(histRes.map((h: any) => ({ ...h, transactionId: h.id, startDate: new Date(h.startDate).toLocaleDateString(), returnDate: h.returnDate ? new Date(h.returnDate).toLocaleDateString() : null })));
      } catch (err) { console.error(err); }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [catFilter, searchQ, tab]);

  const cats = ["All", "Book", "Equipment", "Notes"];

  const toggleStatus = async (id: string) => {
    try {
      await api.patch(`/api/resources/${id}/toggle`, {});
      setMyResources(rs => rs.map(r => r.resourceId === id ? { ...r, status: r.status === "paused" ? "available" : "paused" } : r));
    } catch(err) { console.error(err); }
  };

  const removeResource = async (id: string) => {
    try {
      await api.delete(`/api/resources/${id}`);
      setMyResources(rs => rs.filter(r => r.resourceId !== id));
    } catch(err) { console.error(err); }
  };

  const submitPosting = async () => {
    if (!newResource.title) return alert("Title is required");
    try {
      await api.post('/api/resources', { 
        title: newResource.title, category: newResource.category, 
        condition: newResource.condition, maxDays: parseInt(newResource.duration, 10), 
        description: newResource.description 
      });
      setTab("myListings");
      setNewResource({ title: "", category: "Book", condition: "Good", duration: "7", description: "" });
    } catch (err) { console.error(err); }
  };

  const tabs = [
    { id: "browse", label: "Browse" },
    { id: "post", label: "Post Resource" },
    { id: "myListings", label: "My Listings", count: myResources.length },
    { id: "borrowRequests", label: "Borrow Requests", count: borrowReqs.filter(b => b.status === "pending").length },
    { id: "history", label: "Lending History" },
  ];
  return (
    <div className="pageAnim" style={{ padding: 28 }}>
      {showHandover && (
        <Modal title="Schedule Campus Handover" onClose={() => setShowHandover(false)}>
          <FormField label="Meeting Location">
            <input style={inp} defaultValue="Library Main Entrance" />
          </FormField>
          <FormField label="Date">
            <input type="date" style={inp} defaultValue="2024-03-13" />
          </FormField>
          <FormField label="Time">
            <input type="time" style={inp} defaultValue="14:00" />
          </FormField>
          <FormField label="Notes (optional)">
            <input style={inp} placeholder="Any special instructions?" />
          </FormField>
          <button onClick={() => setShowHandover(false)} style={{ ...btnP, marginTop: 8, width: "100%", justifyContent: "center" }}><Calendar size={15} /> Confirm Handover</button>
        </Modal>
      )}
      {showReview && (
        <Modal title="Rate & Review User" onClose={() => setShowReview(null)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <Avatar name={showReview.borrowerName} size={44} />
            <div>
              <p style={{ fontWeight: 700, color: C.tx, margin: 0 }}>{showReview.borrowerName}</p>
              <p style={{ fontSize: 12, color: C.txM, margin: "3px 0 0" }}>Returned: {showReview.resourceTitle}</p>
            </div>
          </div>
          <FormField label="Rating">
            <div style={{ display: "flex", gap: 8 }}>
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setUserRating(i)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <Star size={28} fill={i <= userRating ? C.amber : "none"} color={i <= userRating ? C.amber : C.txM} />
                </button>
              ))}
            </div>
          </FormField>
          <FormField label="Comment">
            <textarea style={{ ...inp, height: 80, resize: "none" }} placeholder="How was the experience?" />
          </FormField>
          <button onClick={() => setShowReview(null)} style={{ ...btnP, marginTop: 8, width: "100%", justifyContent: "center" }}><Star size={15} /> Submit Review</button>
        </Modal>
      )}
      {showReport && (
        <Modal title="Report Overdue / Damaged Item" onClose={() => setShowReport(false)}>
          <div style={{ padding: "12px 14px", background: `${C.red}12`, border: `1px solid ${C.red}33`, borderRadius: 8, marginBottom: 16 }}>
            <p style={{ color: C.red, fontSize: 13, margin: 0 }}>⚠ Filing a dispute will notify the admin team and the borrower.</p>
          </div>
          <FormField label="Issue Type">
            <select style={{ ...inp, appearance: "none" }}>
              <option>Item returned damaged</option>
              <option>Item not returned (overdue)</option>
              <option>Wrong item returned</option>
              <option>Other</option>
            </select>
          </FormField>
          <FormField label="Description">
            <textarea style={{ ...inp, height: 80, resize: "none" }} placeholder="Describe the issue in detail…" />
          </FormField>
          <button onClick={() => setShowReport(false)} style={{ ...btnD, marginTop: 8, width: "100%", justifyContent: "center" }}><Flag size={15} /> Submit Dispute</button>
        </Modal>
      )}
      <SectionHeader title="Resources" subtitle="Lend and borrow campus resources" />
      <Tabs tabs={tabs} active={tab} onSelect={setTab} />
      {tab === "browse" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.txM }} />
              <input style={{ ...inp, paddingLeft: 36 }} placeholder="Search resources…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
            </div>
            <select style={{ ...inp, width: 150, appearance: "none" }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {allResources.map(r => (
              <ResourceCard key={r.resourceId} resource={r} actionEl={
                <div style={{ display: "flex", gap: 8 }}>
                  {r.status === "available" && <button onClick={async () => {
                    try {
                      await api.post(`/api/resources/${r.resourceId}/borrow`, {});
                      alert("Borrow request sent!");
                    } catch(err: any) { alert("Error: " + err.message); }
                  }} style={{ ...btnP, padding: "7px 14px", fontSize: 12 }}><Download size={14} /> Request Borrow</button>}
                  <button style={{ ...btnS, padding: "7px 12px", fontSize: 12 }}><MessageSquare size={14} /> Contact</button>
                </div>
              } />
            ))}
          </div>
        </div>
      )}
      {tab === "post" && (
        <div style={{ maxWidth: 540 }}>
          <div style={cardStyle()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.tx, margin: "0 0 20px" }}>Post Resource for Lending</h3>
            <FormField label="Title">
              <input style={inp} value={newResource.title} onChange={e => setNewResource(r => ({ ...r, title: e.target.value }))} placeholder="e.g. Introduction to Algorithms 4th ed." />
            </FormField>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormField label="Category">
                <select style={{ ...inp, appearance: "none" }} value={newResource.category} onChange={e => setNewResource(r => ({ ...r, category: e.target.value }))}>
                  {["Book", "Equipment", "Notes", "Other"].map(c => <option key={c}>{c}</option>)}
                </select>
              </FormField>
              <FormField label="Condition">
                <select style={{ ...inp, appearance: "none" }} value={newResource.condition} onChange={e => setNewResource(r => ({ ...r, condition: e.target.value }))}>
                  {["Excellent", "Good", "Fair", "Poor"].map(c => <option key={c}>{c}</option>)}
                </select>
              </FormField>
            </div>
            <FormField label="Max Borrow Duration (days)">
              <input type="number" style={inp} value={newResource.duration} onChange={e => setNewResource(r => ({ ...r, duration: e.target.value }))} min="1" max="30" />
            </FormField>
            <FormField label="Description">
              <textarea style={{ ...inp, height: 80, resize: "none" }} value={newResource.description} onChange={e => setNewResource(r => ({ ...r, description: e.target.value }))} placeholder="Describe the item…" />
            </FormField>
            <FormField label="Upload Image (optional)">
              <div style={{ border: `2px dashed ${C.border}`, borderRadius: 8, padding: "24px 16px", textAlign: "center", background: C.depth, cursor: "pointer" }}>
                <Image size={24} color={C.txM} style={{ marginBottom: 8 }} />
                <p style={{ color: C.txM, fontSize: 13, margin: 0 }}>Click or drag to upload an image</p>
              </div>
            </FormField>
            <button onClick={submitPosting} style={{ ...btnP, marginTop: 4 }}><Plus size={16} /> Post Listing</button>
          </div>
        </div>
      )}
      {tab === "myListings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {myResources.map(r => (
            <div key={r.resourceId} style={cardStyle()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontWeight: 700, color: C.tx, margin: 0 }}>{r.title}</p>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <Badge label={r.category} color={C.cyan} />
                    <StatusBadge status={r.status} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => toggleStatus(r.resourceId)} style={{ ...btnS, padding: "6px 12px", fontSize: 12 }}>
                    {r.status === "paused" ? <><Play size={13} /> Resume</> : <><Pause size={13} /> Pause</>}
                  </button>
                  <button style={{ ...btnS, padding: "6px 10px", fontSize: 12 }}><Edit size={13} /></button>
                  <button onClick={() => removeResource(r.resourceId)} style={{ ...btnD, padding: "6px 10px", fontSize: 12 }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "borrowRequests" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {borrowReqs.map(req => (
            <div key={req.requestId} style={cardStyle()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontWeight: 700, color: C.tx, margin: "0 0 4px" }}>{req.resource.title}</p>
                  <p style={{ fontSize: 13, color: C.txS, margin: 0 }}>Requested by <strong>{req.requester.name}</strong> · {req.requestedDuration} days · {req.requestDate}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>
              {req.status === "pending" && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={async () => {
                    try {
                      await api.put(`/api/resources/borrow-requests/${req.requestId}`, { action: "approve" });
                      setBorrowReqs(rs => rs.map(r => r.requestId === req.requestId ? { ...r, status: "approved" } : r));
                    } catch(err) { console.error(err); }
                  }} style={btnG}><Check size={14} /> Approve</button>
                  <button onClick={async () => {
                    try {
                      await api.put(`/api/resources/borrow-requests/${req.requestId}`, { action: "reject" });
                      setBorrowReqs(rs => rs.map(r => r.requestId === req.requestId ? { ...r, status: "rejected" } : r));
                    } catch(err) { console.error(err); }
                  }} style={btnD}><X size={14} /> Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {tab === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {history.map(h => (
            <div key={h.transactionId} style={cardStyle()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontWeight: 700, color: C.tx, margin: "0 0 4px" }}>{h.resourceTitle}</p>
                  <p style={{ fontSize: 13, color: C.txS, margin: "0 0 6px" }}>Borrowed by <strong>{h.borrowerName}</strong></p>
                  <p style={{ fontSize: 12, color: C.txM, margin: 0 }}>
                    {h.startDate} → {h.returnDate || "Not returned"}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <StatusBadge status={h.status} />
                  {h.rating && <div style={{ marginTop: 8 }}><StarRating rating={h.rating} /></div>}
                </div>
              </div>
              {h.status === "active" && _user?.userId === h.ownerId && (
                <div style={{ marginTop: 12 }}>
                  <button onClick={async () => {
                     try {
                       await api.put(`/api/resources/transactions/${h.transactionId}/return`, {});
                     } catch(err) { console.error(err); }
                  }} style={{ ...btnG, padding: "7px 14px", fontSize: 12 }}><CheckCircle size={14} /> Mark Returned</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODULE: MESSAGES (UC 28)
// ══════════════════════════════════════════════════════════════
interface MessagesPageProps { user?: User | null; }
function MessagesPage({ user: _user }: MessagesPageProps) {
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState("");
  const [convos, setConvos] = useState<any[]>([]);
  const messagesEndRef = useRef<any>(null);

  const [partners, setPartners] = useState<any[]>([]);
  const [newTarget, setNewTarget] = useState<any>(null);

  useEffect(() => {
    api.get('/api/partners').then(setPartners).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const res = await api.get('/api/messages');
        setConvos(cs => {
          const newCs = res.map((c: any) => ({
            conversationId: c.id,
            participant: { name: c.participantName },
            messages: cs.find(x => x.conversationId === c.id)?.messages || [],
            lastMsg: c.lastMessage || "",
            unread: 0,
            time: new Date(c.lastMessageTime || c.createdAt).toLocaleTimeString()
          }));
          return newCs;
        });
        if (res.length > 0 && !activeConv && !newTarget) {
          setActiveConv(res[0].id);
        }
      } catch (err) { console.error(err); }
    };
    fetchConvos();
    const interval = setInterval(fetchConvos, 3000);
    return () => clearInterval(interval);
  }, [activeConv, newTarget]);

  useEffect(() => {
    if (!activeConv) return;
    const fetchMsgs = async () => {
      try {
        const res = await api.get(`/api/messages/${activeConv}/messages`);
        setConvos(cs => cs.map(c => c.conversationId === activeConv ? { 
           ...c, 
           messages: res.map((m: any) => ({ msgId: m.id, text: m.text, time: new Date(m.sentAt).toLocaleTimeString(), mine: m.mine === 1 })) 
        } : c));
      } catch (err) { console.error(err); }
    };
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 2000);
    return () => clearInterval(interval);
  }, [activeConv]);

  const currentConvo = convos.find(c => c.conversationId === activeConv);
  
  const sendMsg = async () => {
    if (!msgInput.trim()) return;
    if (!activeConv && !newTarget) return;
    const text = msgInput;
    setMsgInput("");
    try {
      const payload = activeConv ? { conversationId: activeConv, text } : { toUserId: newTarget.id, text };
      const apiRes = await api.post('/api/messages/send', payload);
      
      const targetConvId = activeConv || apiRes.conversationId;
      if (!activeConv) {
         setNewTarget(null);
         setActiveConv(targetConvId);
      }
      
      const res = await api.get(`/api/messages/${targetConvId}/messages`);
      setConvos(cs => cs.map(c => c.conversationId === targetConvId ? { 
         ...c, 
         messages: res.map((m: any) => ({ msgId: m.id, text: m.text, time: new Date(m.sentAt).toLocaleTimeString(), mine: m.mine === 1 })),
         lastMsg: text
      } : c));
    } catch (err) { console.error(err); }
  };
  return (
    <div className="pageAnim" style={{ height: "100%", display: "flex", overflow: "hidden" }}>
      <div style={{ width: 280, borderRight: `1px solid ${C.border}`, background: C.depth, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${C.border}` }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: C.tx, margin: "0 0 10px" }}>Messages</h2>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.txM }} />
            <input style={{ ...inp, paddingLeft: 32, fontSize: 13, padding: "8px 12px 8px 32px" }} placeholder="Search…" />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {partners.filter(p => !convos.some(c => c.participant.name === p.name)).length > 0 && (
            <div style={{ padding: "16px", borderBottom: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.txM, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Suggested Friends</p>
              {partners.filter(p => !convos.some(c => c.participant.name === p.name)).map(p => (
                <button key={p.id} onClick={() => { setActiveConv(null); setNewTarget(p); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px", background: newTarget?.id === p.id ? `${C.cyan}15` : "none", border: "none", borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  <Avatar name={p.name} size={32} />
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.tx, margin: 0, flex: 1 }}>{p.name}</p>
                </button>
              ))}
            </div>
          )}
          {convos.length > 0 && <p style={{ fontSize: 11, fontWeight: 700, color: C.txM, margin: "16px 16px 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Recent Conversations</p>}
          {convos.map(c => (
            <button key={c.conversationId} onClick={() => { setNewTarget(null); setActiveConv(c.conversationId); }}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 16px", background: activeConv === c.conversationId ? `${C.cyan}10` : "none", border: "none", borderLeft: activeConv === c.conversationId ? `3px solid ${C.cyan}` : "3px solid transparent", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              <div style={{ position: "relative" }}>
                <Avatar name={c.participant.name} size={38} />
                <div className="pulse" style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: C.green, border: `2px solid ${C.depth}` }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.tx, margin: 0 }}>{c.participant.name}</p>
                  <p style={{ fontSize: 10, color: C.txM, margin: 0 }}>{c.time}</p>
                </div>
                <p style={{ fontSize: 12, color: C.txM, margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.lastMsg}</p>
              </div>
              {c.unread > 0 && <span style={{ background: C.cyan, borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.unread}</span>}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {(currentConvo || newTarget) && (
          <>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: C.depth, display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={currentConvo ? currentConvo.participant.name : newTarget.name} size={36} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.tx, margin: 0 }}>{currentConvo ? currentConvo.participant.name : newTarget.name}</p>
                <p style={{ fontSize: 11, color: C.green, margin: 0 }}>● Online</p>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
              {currentConvo?.messages?.map((m: any) => (
                <div key={m.msgId} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                  {!m.mine && <Avatar name={currentConvo.participant.name} size={28} />}
                  <div className={m.mine ? "msgBubbleMine" : "msgBubbleOther"} style={{ maxWidth: "65%", padding: "10px 14px" }}>
                    <p style={{ fontSize: 13, color: "#fff", margin: 0, lineHeight: 1.5 }}>{m.text}</p>
                    <p style={{ fontSize: 10, color: m.mine ? "rgba(255,255,255,0.6)" : C.txM, margin: "4px 0 0", textAlign: m.mine ? "right" : "left" }}>{m.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, background: C.depth, display: "flex", gap: 10, alignItems: "flex-end" }}>
              <input style={{ ...inp, flex: 1, borderRadius: 20, padding: "10px 16px" }} placeholder="Type a message…" value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} />
              <button onClick={sendMsg} style={{ ...btnP, borderRadius: "50%", width: 40, height: 40, padding: 0, justifyContent: "center", flexShrink: 0 }}>
                <Send size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODULE: NOTIFICATIONS (UC 29)
// ══════════════════════════════════════════════════════════════
interface NotificationsPageProps { user?: User | null; }
function NotificationsPage({ user: _user }: NotificationsPageProps) {
  const [notifs, setNotifs] = useState<any[]>([]);

  useEffect(() => {
    const fetchNs = async () => {
      try {
        const res = await api.get('/api/notifications');
        setNotifs(res);
      } catch (err) { console.error(err); }
    };
    fetchNs();
    const interval = setInterval(fetchNs, 3000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      setNotifs(ns => ns.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };
  
  const markRead = async (id: string) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifs(ns => ns.map(x => x.id === id ? { ...x, isRead: true } : x));
    } catch (err) { console.error(err); }
  };
  const notifIcons = {
    partner: { icon: UserPlus, color: C.cyan },
    borrow: { icon: Package, color: C.green },
    group: { icon: Layers, color: C.purple },
    return: { icon: RefreshCw, color: C.amber },
    message: { icon: MessageSquare, color: C.cyan },
    reminder: { icon: Clock, color: C.red },
  };
  return (
    <div className="pageAnim" style={{ padding: 28, maxWidth: 680, margin: "0 auto" }}>
      <SectionHeader title="Notifications" subtitle={`${notifs.filter(n => !n.isRead).length} unread`}
        action={<button onClick={markAllRead} style={{ ...btnS, padding: "7px 14px", fontSize: 12 }}><Check size={14} /> Mark all read</button>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notifs.map(n => {
          const info = notifIcons[n.type] || { icon: Bell, color: C.txS };
          return (
            <div key={n.id} onClick={() => !n.isRead && markRead(n.id)}
              style={{ ...cardStyle({ padding: "14px 18px", cursor: n.isRead ? "default" : "pointer" }), borderLeft: `3px solid ${n.isRead ? C.border : info.color}`, opacity: n.isRead ? 0.7 : 1, transition: "all 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${info.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <info.icon size={18} color={info.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: n.isRead ? C.txS : C.tx, margin: 0, fontWeight: n.isRead ? 400 : 600 }}>{n.content}</p>
                  <p style={{ fontSize: 11, color: C.txM, margin: "4px 0 0" }}>{n.time}</p>
                </div>
                {!n.isRead && <div style={{ width: 8, height: 8, borderRadius: "50%", background: info.color, flexShrink: 0 }} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODULE: LOST & FOUND (UC 30)
// ══════════════════════════════════════════════════════════════
interface LostFoundPageProps { user?: User | null; }
function LostFoundPage({ user: _user }: LostFoundPageProps) {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [showReport, setShowReport] = useState(false);
  const [reportType, setReportType] = useState("Lost");
  const [descInput, setDescInput] = useState("");
  const [locInput, setLocInput] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/api/lost-found');
        setItems(res.map((x: any) => ({
          itemId: x.id, type: x.type, description: x.description, location: x.location,
          dateReported: new Date(x.createdAt).toLocaleDateString(), status: x.status, reporter: x.reporterName
        })));
      } catch (err) { console.error(err); }
    };
    fetchItems();
    const interval = setInterval(fetchItems, 3000);
    return () => clearInterval(interval);
  }, []);

  const submitReport = async () => {
    if (!descInput || !locInput) return alert("Description and Location are required");
    try {
      await api.post('/api/lost-found', { type: reportType, description: descInput, location: locInput });
      setShowReport(false);
      setDescInput(""); setLocInput("");
    } catch(err) { console.error(err); }
  };

  const resolveItem = async (id: string) => {
    try {
      await api.put(`/api/lost-found/${id}/resolve`);
    } catch(err) { console.error(err); }
  };

  const filtered = items.filter(i => filter === "All" || i.type === filter || (filter === "Open" ? i.status === "open" : i.status === "resolved"));
  return (
    <div className="pageAnim" style={{ padding: 28 }}>
      {showReport && (
        <Modal title={`Report ${reportType} Item`} onClose={() => setShowReport(false)}>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["Lost", "Found"].map(t => (
              <button key={t} onClick={() => setReportType(t)}
                style={{ flex: 1, padding: "9px 16px", borderRadius: 8, border: `1px solid ${reportType === t ? C.cyan : C.border}`, background: reportType === t ? `${C.cyan}15` : C.depth, color: reportType === t ? C.cyan : C.txS, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                {t}
              </button>
            ))}
          </div>
          <FormField label="Description">
            <textarea style={{ ...inp, height: 80, resize: "none" }} value={descInput} onChange={e => setDescInput(e.target.value)} placeholder="Describe the item in detail (color, brand, features)…" />
          </FormField>
          <FormField label="Location">
            <input style={inp} value={locInput} onChange={e => setLocInput(e.target.value)} placeholder="Where was it lost/found?" />
          </FormField>
          <FormField label="Upload Image (optional)">
            <div style={{ border: `2px dashed ${C.border}`, borderRadius: 8, padding: "20px 16px", textAlign: "center", background: C.depth, cursor: "pointer" }}>
              <Image size={20} color={C.txM} style={{ marginBottom: 6 }} />
              <p style={{ color: C.txM, fontSize: 12, margin: 0 }}>Click to upload image</p>
            </div>
          </FormField>
          <button onClick={submitReport} style={{ ...btnP, marginTop: 8, width: "100%", justifyContent: "center" }}><Flag size={15} /> Submit Report</button>
        </Modal>
      )}
      <SectionHeader title="Lost & Found" subtitle="Help reunite students with their belongings"
        action={<button onClick={() => setShowReport(true)} style={btnP}><Plus size={16} /> Report Item</button>} />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["All", "Lost", "Found", "Open"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${filter === f ? C.cyan : C.border}`, background: filter === f ? `${C.cyan}15` : "none", color: filter === f ? C.cyan : C.txS, cursor: "pointer", fontSize: 13, fontWeight: filter === f ? 600 : 400 }}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {filtered.map(item => (
          <div key={item.itemId} className="cardHover" style={{ ...cardStyle(), borderLeft: `3px solid ${item.type === "Lost" ? C.red : C.green}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge label={item.type} color={item.type === "Lost" ? C.red : C.green} />
                <StatusBadge status={item.status} />
              </div>
              <span style={{ fontSize: 11, color: C.txM }}>{item.dateReported}</span>
            </div>
            <p style={{ fontSize: 14, color: C.tx, margin: "0 0 8px", fontWeight: 500, lineHeight: 1.5 }}>{item.description}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <MapPin size={13} color={C.txM} />
              <span style={{ fontSize: 12, color: C.txM }}>{item.location}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: C.txM }}>Reported by: {item.reporter}</span>
              {item.status === "open" && <div style={{ display: "flex", gap: 8 }}><button onClick={() => resolveItem(item.itemId)} style={{ ...btnG, padding: "5px 12px", fontSize: 12 }}><Check size={13} /> Resolve</button><button style={{ ...btnS, padding: "5px 12px", fontSize: 12 }}><MessageSquare size={13} /> Contact</button></div>}
              {item.status === "resolved" && <Badge label="Reunited ✓" color={C.green} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODULE: ADMIN (UC 31–34)
// ══════════════════════════════════════════════════════════════
interface AdminDashboardPageProps { onNavigate: (page: string) => void; }
function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    api.get('/api/admin/dashboard').then(setData).catch(console.error);
  }, []);

  const stats = [
    { label: "Total Users", value: data ? data.totalUsers : "-", icon: Users, color: C.cyan, sub: `${data ? data.activeUsers : "-"} active` },
    { label: "Active Loans", value: data ? data.activeLoans : "-", icon: Package, color: C.amber, sub: `${data ? data.overdueLoans : "-"} overdue` },
    { label: "Study Groups", value: data ? data.totalGroups : "-", icon: Layers, color: C.purple, sub: `${data ? data.totalResources : "-"} listings` },
    { label: "Pending Reports", value: data ? data.pendingReports : "-", icon: Flag, color: C.red, sub: `${data ? data.lostItems : "-"} lost items` },
  ];
  return (
    <div className="pageAnim" style={{ padding: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: C.tx, margin: 0 }}>Admin Dashboard</h1>
        <p style={{ color: C.txM, fontSize: 14, marginTop: 4 }}>Platform health & management overview</p>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={cardStyle()}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.tx, margin: "0 0 16px" }}>Pending Actions</h3>
          {[
            { label: "User reports awaiting review", count: 3, color: C.red, page: "adminReports" },
            { label: "Flagged resource listings", count: 2, color: C.amber, page: "adminResources" },
            { label: "Blocked user appeals", count: 1, color: C.purple, page: "adminUsers" },
          ].map(a => (
            <button key={a.label} onClick={() => onNavigate(a.page)}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.txS, cursor: "pointer", fontSize: 13, marginBottom: 8, textAlign: "left" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{a.label}</span>
              <span style={{ background: `${a.color}22`, color: a.color, borderRadius: 20, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>{a.count}</span>
              <ChevronRight size={14} color={C.txM} />
            </button>
          ))}
        </div>
        <div style={cardStyle()}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.tx, margin: "0 0 16px" }}>Platform Stats</h3>
          {[
            { label: "Active Users", value: data ? `${data.activeUsers}` : "-", pct: 100, color: C.green },
            { label: "Resource Utilization", value: data ? `${data.totalResources} listed` : "-", pct: 100, color: C.amber },
            { label: "Group Fill Rate", value: data ? `${data.totalGroups} groups` : "-", pct: 100, color: C.purple },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: C.txS }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.tx }}>{s.value}</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 3, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
interface AdminUsersPageProps { user?: User | null; }
function AdminUsersPage({ user: _user }: AdminUsersPageProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => { api.get('/api/admin/users').then(setUsers).catch(console.error); }, []);
  const toggleBlock = async (id: string) => {
    try {
      await api.put(`/api/admin/users/${id}/block`);
      setUsers(us => us.map(u => u.id === id ? { ...u, status: u.status === "blocked" ? "active" : "blocked" } : u));
    } catch (err) { console.error(err); }
  };
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="pageAnim" style={{ padding: 28 }}>
      <SectionHeader title="Manage Users" subtitle="Block, unblock, and monitor student accounts" />
      <div style={{ position: "relative", maxWidth: 400, marginBottom: 20 }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.txM }} />
        <input style={{ ...inp, paddingLeft: 34 }} placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={cardStyle({ padding: 0, overflow: "hidden" })}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.surface }}>
              {["User", "Department", "Status", "Joined", "Reports", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.txM, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.card : "transparent" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={u.name} size={32} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.tx, margin: 0 }}>{u.name}</p>
                      <p style={{ fontSize: 11, color: C.txM, margin: 0 }}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: C.txS }}>{u.department}</td>
                <td style={{ padding: "12px 16px" }}><StatusBadge status={u.status} /></td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: C.txM }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ color: C.txM, fontSize: 13 }}>-</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <button onClick={() => toggleBlock(u.id)}
                    style={{ ...(u.status === "blocked" ? btnG : btnD), padding: "6px 12px", fontSize: 12 }}>
                    {u.status === "blocked" ? <><UserCheck size={13} /> Unblock</> : <><UserX size={13} /> Block</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════
// MODULE: ADMIN PAGES (Continued)
// ══════════════════════════════════════════════════════════════
interface AdminResourcesPageProps { user?: User | null; }
function AdminResourcesPage({ user: _user }: AdminResourcesPageProps) {
  const [res, setRes] = useState<any[]>([]);
  useEffect(() => { api.get('/api/admin/resources').then(setRes).catch(console.error); }, []);
  const removeItem = async (id: string) => {
    try {
      await api.delete(`/api/admin/resources/${id}`);
      setRes(rs => rs.filter(r => r.id !== id));
    } catch(err) { console.error(err); }
  };
  return (
    <div className="pageAnim" style={{ padding: 28 }}>
      <SectionHeader title="Resource Listings" subtitle="Moderate and manage platform resource listings" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {res.map(r => (
          <div key={r.id} style={{ ...cardStyle(), borderLeft: `3px solid ${r.reportCount > 0 ? C.red : C.green}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <p style={{ fontWeight: 700, color: C.tx, margin: 0 }}>{r.title}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p style={{ fontSize: 13, color: C.txS, margin: 0 }}>by {r.ownerName} · {r.category}</p>
                {r.reportCount > 0 && <p style={{ fontSize: 12, color: C.red, margin: "6px 0 0" }}>⚑ Reported {r.reportCount} times</p>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => removeItem(r.id)} style={btnD}><Trash2 size={14} /> Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
interface AdminReportsPageProps { user?: User | null; }
function AdminReportsPage({ user: _user }: AdminReportsPageProps) {
  const [reports, setReports] = useState<any[]>([]);
  useEffect(() => { api.get('/api/admin/reports').then(setReports).catch(console.error); }, []);
  const updateStatus = async (id: string, s: string) => {
    try {
      await api.put(`/api/admin/reports/${id}`, { status: s });
      setReports(rs => rs.map(x => x.id === id ? { ...x, status: s } : x));
    } catch(err) { console.error(err); }
  };
  return (
    <div className="pageAnim" style={{ padding: 28 }}>
      <SectionHeader title="Platform Reports" subtitle="Review and resolve user-submitted reports" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {reports.map(r => (
          <div key={r.id} style={cardStyle()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <Badge label={r.type} color={C.cyan} />
                  <StatusBadge status={r.status} />
                </div>
                <p style={{ fontWeight: 600, color: C.tx, margin: "0 0 4px" }}>{r.description}</p>
                <p style={{ fontSize: 13, color: C.txS, margin: 0 }}>
                  Reported: <strong>{r.reportedName}</strong> · By: {r.reporterName} · {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {r.status !== "resolved" && (
              <div style={{ display: "flex", gap: 8 }}>
                {r.status === "pending" && (
                  <button onClick={() => updateStatus(r.id, "investigating")}
                    style={btnS}><Activity size={14} /> Start Investigation</button>
                )}
                <button onClick={() => updateStatus(r.id, "resolved")}
                  style={btnG}><CheckCircle size={14} /> Mark Resolved</button>
                <button onClick={() => updateStatus(r.id, "escalated")} style={btnD}><Flag size={14} /> Escalate</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN APP – Router & State
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (userData: string) => {
    try {
      const user = JSON.parse(userData);
      const mappedUser: User = {
        userId: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        semester: user.semester,
        bio: user.bio,
        averageRating: user.avgRating || 0,
        status: user.status || 'active',
        role: user.role,
      };
      setCurrentUser(mappedUser);
      if (user.role === 'admin') {
        setIsAdmin(true);
        setCurrentPage('adminDashboard');
      } else {
        setIsAdmin(false);
        setCurrentPage('dashboard');
      }
    } catch {
      // Fallback for legacy role-string calls
      if (userData === 'admin') {
        setCurrentUser(adminUserData as User);
        setIsAdmin(true);
        setCurrentPage('adminDashboard');
      } else {
        setCurrentUser(currentUserData as User);
        setIsAdmin(false);
        setCurrentPage('dashboard');
      }
    }
  };

  const handleNavigate = (page: string) => {
    if (page === "login") {
      setCurrentUser(null);
      setIsAdmin(false);
      setToken(null); // Clear JWT on logout
    }
    setCurrentPage(page);
  };

  // Auth pages (not logged in)
  if (!currentUser) {
    return (
      <>
        <GlobalStyles />
        {currentPage === "login" && <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />}
        {currentPage === "adminLogin" && <AdminLoginPage onLogin={handleLogin} onNavigate={handleNavigate} />}
        {currentPage === "register" && <RegisterPage onNavigate={handleNavigate} />}
        {currentPage === "verifyStudent" && <VerifyStudentPage onNavigate={handleNavigate} />}
        {currentPage === "resetPassword" && <ResetPasswordPage onNavigate={handleNavigate} />}
      </>
    );
  }

  const pageComponents: Record<string, React.ReactNode> = {
    dashboard:        <DashboardPage user={currentUser} onNavigate={handleNavigate} />,
    studyPartners:    <StudyPartnersPage onNavigate={handleNavigate} />,
    studyGroups:      <StudyGroupsPage />,
    resources:        <ResourcesPage />,
    messages:         <MessagesPage />,
    notifications:    <NotificationsPage />,
    lostFound:        <LostFoundPage />,
    profile:          <ProfilePage user={currentUser} onNavigate={handleNavigate} />,
    adminDashboard:   <AdminDashboardPage onNavigate={handleNavigate} />,
    adminUsers:       <AdminUsersPage />,
    adminResources:   <AdminResourcesPage />,
    adminReports:     <AdminReportsPage />,
  };

  return (
    <>
      <GlobalStyles />
      <AppShell user={currentUser} currentPage={currentPage} onNavigate={handleNavigate} isAdmin={isAdmin}>
        {pageComponents[currentPage] || pageComponents["dashboard"]}
      </AppShell>
    </>
  );
}