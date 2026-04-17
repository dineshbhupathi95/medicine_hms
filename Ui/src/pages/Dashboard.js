import React, { useState, useEffect } from "react";

// ── Inline styles (Light Theme) ──────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hd-root {
    font-family: 'DM Sans', sans-serif;
    background: #f8fafc;
    min-height: 100vh;
    color: #1e293b;
  }

  /* ── Welcome banner ── */
  .hd-banner {
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }
  .hd-banner-left { display: flex; align-items: center; gap: 1rem; }
  .hd-avatar {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 600; color: #fff;
    flex-shrink: 0;
  }
  .hd-welcome-sub { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
  .hd-welcome-name { font-size: 17px; font-weight: 600; color: #0f172a; }
  
  .hd-banner-right { display: flex; align-items: center; gap: 0.75rem; }
  .hd-search {
    background: #f1f5f9; border: 1px solid #e2e8f0;
    border-radius: 10px; padding: 0.5rem 0.875rem;
    display: flex; align-items: center; gap: 8px;
    color: #64748b; font-size: 13px; font-family: 'DM Sans', sans-serif;
    width: 240px;
    transition: all 0.2s;
  }
  .hd-search:focus-within { border-color: #cbd5e1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.05); }
  .hd-search input {
    background: none; border: none; outline: none;
    color: #1e293b; font-size: 13px; font-family: 'DM Sans', sans-serif;
    width: 100%;
  }
  .hd-search input::placeholder { color: #94a3b8; }
  .hd-date-badge {
    background: #f1f5f9; border: 1px solid #e2e8f0;
    border-radius: 10px; padding: 0.5rem 0.875rem;
    font-size: 12px; color: #64748b; font-family: 'DM Mono', monospace;
    white-space: nowrap;
  }

  /* ── Layout ── */
  .hd-body { padding: 1.75rem 2rem; max-width: 1400px; margin: 0 auto; }
  .hd-section-label {
    font-size: 11px; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;
  }

  /* ── KPI grid ── */
  .hd-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 1.5rem;
  }
  .hd-kpi {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 1.25rem;
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease;
  }
  .hd-kpi:hover { border-color: #cbd5e1; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  .hd-kpi-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    border-radius: 16px 16px 0 0;
  }
  .hd-kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
  .hd-kpi-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .hd-kpi-label { font-size: 13px; color: #64748b; font-weight: 500; margin-bottom: 4px; }
  .hd-kpi-value { font-size: 26px; font-weight: 700; color: #0f172a; line-height: 1; }
  .hd-kpi-trend { font-size: 12px; display: flex; align-items: center; gap: 4px; margin-top: 8px; font-weight: 500; }
  .hd-trend-up { color: #10b981; }
  .hd-trend-down { color: #ef4444; }

  /* ── Main grid ── */
  .hd-main-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 16px;
    margin-bottom: 1.5rem;
    align-items: start;
  }

  /* ── Cards ── */
  .hd-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 1.5rem;
  }
  .hd-card-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.5rem;
  }
  .hd-card-title { font-size: 15px; font-weight: 600; color: #1e293b; }
  .hd-chip {
    font-size: 11px; padding: 4px 12px; border-radius: 99px;
    background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b; font-weight: 600;
  }

  /* ── Bar chart ── */
  .hd-chart { display: flex; align-items: flex-end; gap: 12px; height: 160px; padding-top: 10px; }
  .hd-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .hd-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; background: #f1f5f9; border-radius: 6px; }
  .hd-bar {
    width: 100%; border-radius: 6px;
    transition: height 0.8s cubic-bezier(0.34,1.56,0.64,1);
  }
  .hd-bar-label { font-size: 11px; color: #94a3b8; font-family: 'DM Mono', monospace; font-weight: 500; }

  /* ── Progress bars ── */
  .hd-prog-row { margin-bottom: 1rem; }
  .hd-prog-meta { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; font-weight: 500; margin-bottom: 8px; }
  .hd-prog-track { background: #f1f5f9; border-radius: 99px; height: 6px; overflow: hidden; }
  .hd-prog-fill { height: 100%; border-radius: 99px; transition: width 1s ease; }

  /* ── Summary nums ── */
  .hd-sum-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1.5rem; }
  .hd-sum-tile { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 1rem; }
  .hd-sum-label { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
  .hd-sum-val { font-size: 22px; font-weight: 700; color: #1e293b; }

  /* ── Departments ── */
  .hd-dept-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    margin-bottom: 1.5rem;
  }
  .hd-dept {
    background: #ffffff; border: 1px solid #e2e8f0;
    border-radius: 16px; padding: 1.25rem;
    transition: all 0.2s ease;
  }
  .hd-dept:hover { border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
  .hd-dept-name { font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
  .hd-dept-val { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
  .hd-dept-sub { font-size: 12px; color: #64748b; margin-bottom: 12px; }
  .hd-dept-bar { background: #f1f5f9; border-radius: 99px; height: 5px; overflow: hidden; }
  .hd-dept-fill { height: 100%; border-radius: 99px; }

  /* ── Appointments table ── */
  .hd-table-wrap { overflow-x: auto; }
  .hd-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .hd-table th {
    font-size: 11px; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.08em;
    text-align: left; padding: 0 1rem 1rem;
    border-bottom: 1px solid #f1f5f9;
  }
  .hd-table td {
    padding: 1rem; color: #475569;
    border-bottom: 1px solid #f8fafc;
    vertical-align: middle;
  }
  .hd-table tr:last-child td { border-bottom: none; }
  .hd-table tr:hover td { background: #f8fafc; }
  .hd-pat-cell { display: flex; align-items: center; gap: 12px; }
  .hd-pat-avatar {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; flex-shrink: 0;
  }
  .hd-pat-name { font-weight: 600; color: #1e293b; }
  .hd-pill {
    font-size: 11px; padding: 4px 12px; border-radius: 99px;
    font-weight: 600; display: inline-block;
  }
  .hd-pill-confirmed { background: #ecfdf5; color: #059669; }
  .hd-pill-pending   { background: #fffbeb; color: #d97706; }
  .hd-pill-cancelled { background: #fef2f2; color: #dc2626; }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .hd-kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .hd-main-grid { grid-template-columns: 1fr; }
    .hd-dept-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .hd-body { padding: 1rem; }
    .hd-kpi-grid { grid-template-columns: 1fr 1fr; }
    .hd-dept-grid { grid-template-columns: 1fr; }
    .hd-banner { padding: 1rem; }
    .hd-date-badge { display: none; }
    .hd-search { width: 160px; }
  }
`;

// ── Data (Updated for Light Theme) ──────────────────────────────────────────
const kpis = [
  {
    label: "Total patients", value: "1,245", trend: "+12%", up: true,
    accent: "linear-gradient(90deg,#6366f1,#a855f7)",
    iconBg: "#eef2ff",
    iconColor: "#6366f1",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 21c0-4 2.7-7 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="17" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 21c0-3 1.3-5 3-5s3 2 3 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Appointments", value: "86", trend: "-3%", up: false,
    accent: "linear-gradient(90deg,#0ea5e9,#2563eb)",
    iconBg: "#f0f9ff",
    iconColor: "#0ea5e9",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Revenue", value: "₹45,000", trend: "+18%", up: true,
    accent: "linear-gradient(90deg,#f59e0b,#ea580c)",
    iconBg: "#fffbeb",
    iconColor: "#f59e0b",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Active doctors", value: "12", trend: "+2", up: true,
    accent: "linear-gradient(90deg,#10b981,#0d9488)",
    iconBg: "#ecfdf5",
    iconColor: "#10b981",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path d="M12 9v4m0 0v4m0-4h4m-4 0H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
];

const chartData = [
  { day: "Mon", val: 88 },
  { day: "Tue", val: 102 },
  { day: "Wed", val: 76 },
  { day: "Thu", val: 110 },
  { day: "Fri", val: 95 },
  { day: "Sat", val: 63 },
  { day: "Sun", val: 70 },
];
const maxVal = Math.max(...chartData.map(d => d.val));

const depts = [
  { name: "Cardiology",   val: 34, pct: 80, color: "#6366f1" },
  { name: "Neurology",    val: 21, pct: 60, color: "#0ea5e9" },
  { name: "Orthopedics",  val: 28, pct: 75, color: "#10b981" },
];

const appointments = [
  { name: "Ravi Kumar",   initials: "RK", dept: "Cardiology",  doctor: "Dr. Sharma",  time: "09:00 AM", status: "Confirmed", avatarBg: "#eef2ff", avatarColor: "#6366f1" },
  { name: "Priya Menon",  initials: "PM", dept: "Neurology",   doctor: "Dr. Dinesh",  time: "10:30 AM", status: "Pending",   avatarBg: "#f0f9ff", avatarColor: "#0ea5e9" },
  { name: "Arjun Reddy",  initials: "AR", dept: "Orthopedics", doctor: "Dr. Nair",     time: "11:15 AM", status: "Confirmed", avatarBg: "#ecfdf5", avatarColor: "#10b981" },
  { name: "Sonal Lal",    initials: "SL", dept: "General",     doctor: "Dr. Rao",      time: "01:00 PM", status: "Cancelled", avatarBg: "#fef2f2", avatarColor: "#ef4444" },
  { name: "Neha Kaur",    initials: "NK", dept: "Cardiology",  doctor: "Dr. Sharma",  time: "02:45 PM", status: "Confirmed", avatarBg: "#fdf2f8", avatarColor: "#db2777" },
];

const statusClass = { Confirmed: "hd-pill-confirmed", Pending: "hd-pill-pending", Cancelled: "hd-pill-cancelled" };

// ── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2.5"/>
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const ArrowUp = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
    <path d="M12 19V5m0 0-7 7m7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ArrowDown = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
    <path d="M12 5v14m0 0 7-7m-7 7-7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <style>{css}</style>
      <div className="hd-root">

        {/* ── Banner ── */}
        <header className="hd-banner">
          <div className="hd-banner-left">
            <div className="hd-avatar">DD</div>
            <div>
              <div className="hd-welcome-sub">Welcome back</div>
              <div className="hd-welcome-name">Dr. Dinesh</div>
            </div>
          </div>
          <div className="hd-banner-right">
            <div className="hd-search">
              <SearchIcon />
              <input placeholder="Search patients, doctors…" />
            </div>
            <div className="hd-date-badge">{today}</div>
          </div>
        </header>

        <div className="hd-body">

          {/* ── KPIs ── */}
          <div className="hd-section-label">Overview</div>
          <div className="hd-kpi-grid">
            {kpis.map((k, i) => (
              <div className="hd-kpi" key={i}>
                <div className="hd-kpi-accent" style={{ background: k.accent }} />
                <div className="hd-kpi-top">
                  <div className="hd-kpi-icon" style={{ background: k.iconBg, color: k.iconColor }}>{k.icon}</div>
                </div>
                <div className="hd-kpi-label">{k.label}</div>
                <div className="hd-kpi-value">{k.value}</div>
                <div className={`hd-kpi-trend ${k.up ? "hd-trend-up" : "hd-trend-down"}`}>
                  {k.up ? <ArrowUp /> : <ArrowDown />}
                  {k.trend} vs last period
                </div>
              </div>
            ))}
          </div>

          {/* ── Departments ── */}
          <div className="hd-section-label">Department Statistics</div>
          <div className="hd-dept-grid">
            {depts.map((d, i) => (
              <div className="hd-dept" key={i}>
                <div className="hd-dept-name">{d.name}</div>
                <div className="hd-dept-val">{d.val}</div>
                <div className="hd-dept-sub">patients · {d.pct}% capacity</div>
                <div className="hd-dept-bar">
                  <div className="hd-dept-fill" style={{ width: mounted ? `${d.pct}%` : "0%", background: d.color, transition: `width ${0.8 + i * 0.15}s ease` }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Visits + Summary ── */}
          <div className="hd-main-grid">
            <div className="hd-card">
              <div className="hd-card-header">
                <span className="hd-card-title">Patient Traffic — last 7 days</span>
                <span className="hd-chip">Weekly</span>
              </div>
              <div className="hd-chart">
                {chartData.map((d, i) => {
                  const isToday = i === 3;
                  const heightPct = mounted ? (d.val / maxVal) * 100 : 0;
                  return (
                    <div className="hd-bar-col" key={i} title={`${d.day}: ${d.val} patients`}>
                      <div className="hd-bar-wrap">
                        <div
                          className="hd-bar"
                          style={{
                            height: `${heightPct}%`,
                            background: isToday
                              ? "linear-gradient(180deg, #6366f1, #a855f7)"
                              : "#e2e8f0",
                            transition: `height ${0.6 + i * 0.07}s cubic-bezier(0.34,1.56,0.64,1)`,
                          }}
                        />
                      </div>
                      <span className="hd-bar-label">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hd-card">
              <div className="hd-card-header">
                <span className="hd-card-title">Patient Summary</span>
              </div>
              <div className="hd-sum-grid">
                {[
                  { label: "New",        val: "142" },
                  { label: "Follow-up",  val: "318" },
                  { label: "Discharged", val: "57"  },
                  { label: "Critical",   val: "8", color: "#ef4444" },
                ].map((s, i) => (
                  <div className="hd-sum-tile" key={i}>
                    <div className="hd-sum-label">{s.label}</div>
                    <div className="hd-sum-val" style={s.color ? { color: s.color } : {}}>{s.val}</div>
                  </div>
                ))}
              </div>
              {[
                { label: "OPD load",      pct: 70, color: "#6366f1" },
                { label: "Bed occupancy", pct: 55, color: "#0ea5e9" },
                { label: "ICU usage",     pct: 40, color: "#10b981" },
              ].map((p, i) => (
                <div className="hd-prog-row" key={i}>
                  <div className="hd-prog-meta"><span>{p.label}</span><span>{p.pct}%</span></div>
                  <div className="hd-prog-track">
                    <div className="hd-prog-fill" style={{ width: mounted ? `${p.pct}%` : "0%", background: p.color, transition: `width ${0.9 + i * 0.15}s ease` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Appointments ── */}
          <div className="hd-section-label">Recent Appointments</div>
          <div className="hd-card" style={{ padding: "1.5rem 0" }}>
            <div className="hd-table-wrap">
              <table className="hd-table">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: "1.5rem" }}>Patient</th>
                    <th>Department</th>
                    <th>Doctor</th>
                    <th>Time</th>
                    <th style={{ paddingRight: "1.5rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a, i) => (
                    <tr key={i}>
                      <td style={{ paddingLeft: "1.5rem" }}>
                        <div className="hd-pat-cell">
                          <div className="hd-pat-avatar" style={{ background: a.avatarBg, color: a.avatarColor }}>{a.initials}</div>
                          <span className="hd-pat-name">{a.name}</span>
                        </div>
                      </td>
                      <td>{a.dept}</td>
                      <td>{a.doctor}</td>
                      <td style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#64748b" }}>{a.time}</td>
                      <td style={{ paddingRight: "1.5rem" }}>
                        <span className={`hd-pill ${statusClass[a.status]}`}>{a.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}