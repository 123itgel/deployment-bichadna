import { useState, useEffect } from "react";
import "../../App.css";
import "./Dashboard.css";
import Navbar from "../../components/Navbar";

const DAYS_MN = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];
const MONTHS_MN = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар",
  "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];

const categories = [
  "Цэвэрлэгээ", "Хүнд хүчний ажил", "Асаргаа",
  "Засвар", "Хүргэлт", "Хоол хийх", "Технологи", "Сургалт", "Бусад"
];

function Stars({ count, size = 16 }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: size }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

function BarChart({ data }) {
  const max = 12;
  const yLabels = [max, Math.ceil(max * 0.75), Math.ceil(max * 0.5), Math.ceil(max * 0.25), 0];
  return (
    <div style={{ display: 'flex', gap: '8px', height: '160px', alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', fontSize: '11px', color: '#9ca3af', textAlign: 'right', minWidth: '24px' }}>
        {yLabels.map(v => <span key={v}>{v}</span>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', flex: 1, height: '100%', borderLeft: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', paddingLeft: '6px' }}>
        {data.map((d) => (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '4px' }}>
            <div style={{ width: '100%', background: '#3b82f6', borderRadius: '4px 4px 0 0', height: `${(d.hours / max) * 100}%` }} />
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ data }) {
  if (data.length === 0) return <p style={{ color: "#9ca3af", fontSize: "13px" }}>Дата байхгүй байна.</p>;
  const max = Math.max(...data.map((d) => d.income), 1);
  const w = 400, h = 180;
  const pad = { top: 20, right: 20, bottom: 30, left: 60 };
  const iw = w - pad.left - pad.right;
  const ih = h - pad.top - pad.bottom;
  const points = data.map((d, i) => ({
    x: pad.left + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw),
    y: pad.top + ih - (d.income / max) * ih,
    label: d.month,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const yTicks = [0, Math.ceil(max * 0.25), Math.ceil(max * 0.5), Math.ceil(max * 0.75), max];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="db-line-svg">
      {yTicks.map((v) => {
        const y = pad.top + ih - (v / max) * ih;
        return (
          <g key={v}>
            <line x1={pad.left} x2={pad.left + iw} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4 3" />
            <text x={pad.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
              {v === 0 ? "0" : (v / 1000).toFixed(0) + "K"}
            </text>
          </g>
        );
      })}
      <path d={pathD} fill="none" stroke="#1d9e75" strokeWidth="2.5" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#1d9e75" strokeWidth="2.5" />
          <text x={p.x} y={h - 6} textAnchor="middle" fontSize="11" fill="#9ca3af">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

export default function Dashboard({ setPage, handleLogout, currentUser }) {
  const CURRENT_USER_ID = currentUser?.id;
  const [tab, setTab] = useState("history");
  const [allJobs, setAllJobs] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newJob, setNewJob] = useState({ title: '', category: '', location: '', price: '', description: '' });
  const [showPostForm, setShowPostForm] = useState(false);
  const [applicantsModal, setApplicantsModal] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ stars: 0, description: '' });
  const [postedFilter, setPostedFilter] = useState('Open');

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/jobs").then(r => r.json()),
      fetch("http://localhost:5000/api/profiles").then(r => r.json()),
      fetch(`http://localhost:5000/api/reviews/my/${currentUser?.id}`).then(r => r.json()),
    ]).then(([jobsData, profilesData, reviewsData]) => {
      setAllJobs(jobsData);
      setProfiles(profilesData);
      setMyReviews(reviewsData);
      setLoading(false);
    }).catch(err => { console.error(err); setLoading(false); });
  }, []);

  const refreshAll = () => {
    Promise.all([
      fetch("http://localhost:5000/api/jobs").then(r => r.json()),
      fetch("http://localhost:5000/api/profiles").then(r => r.json()),
      fetch(`http://localhost:5000/api/reviews/my/${currentUser?.id}`).then(r => r.json()),
    ]).then(([jobsData, profilesData, reviewsData]) => {
      setAllJobs(jobsData);
      setProfiles(profilesData);
      setMyReviews(reviewsData);
    });
  };

  const handlePostJob = async () => {
    if (!newJob.title || !newJob.price || !newJob.category || !newJob.location || !newJob.description)
      return alert('Бүх талбарыг бөглөнө үү');
    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newJob.title, category: newJob.category,
          description: newJob.description, location: newJob.location,
          authorId: CURRENT_USER_ID, price: parseInt(newJob.price),
        }),
      });
      const data = await res.json();
      setAllJobs(prev => [...prev, data]);
      alert('Ажил амжилттай нийтлэгдлээ!');
      setNewJob({ title: '', category: '', location: '', price: '', description: '' });
      setShowPostForm(false);
    } catch (err) {
      alert('Алдаа гарлаа. Сервер ажиллаж байгаа эсэхийг шалгана уу.');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.stars) return alert('Одны үнэлгээ өгнө үү');
    await fetch('http://localhost:5000/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: reviewModal.job._id,
        reviewerId: CURRENT_USER_ID,
        workerId: reviewModal.job.workerId,
        stars: reviewForm.stars,
        description: reviewForm.description,
      }),
    });
    await fetch(`http://localhost:5000/api/jobs/${reviewModal.job._id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hours: null }),
    });
    setReviewModal(null);
    setReviewForm({ stars: 0, description: '' });
    refreshAll();
  };

  // smart date format
  const getPostedTime = (postedAt) => {
    const now = new Date();
    const posted = new Date(postedAt);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMins < 60) return `${diffMins} минутын өмнө`;
    if (diffHours < 24) return `${diffHours} цагийн өмнө`;
    if (diffDays <= 7) return `${diffDays} өдрийн өмнө`;
    return posted.toISOString().split("T")[0];
  };

  const myPostedJobs = allJobs.filter((j) => j.authorId === CURRENT_USER_ID);
  const myHistory = allJobs.filter((j) => j.workerId === CURRENT_USER_ID);
  const myAcceptedJobs = allJobs.filter(j => j.workerId === CURRENT_USER_ID && j.status === 'Taken');
  const mySentApplications = allJobs.filter(j => j.applicants.includes(CURRENT_USER_ID) && j.workerId !== CURRENT_USER_ID);
  const availableJobs = allJobs.filter((j) => j.status === "Open" && j.authorId !== CURRENT_USER_ID);

  // filter posted jobs by selected status
  const filteredPostedJobs = myPostedJobs.filter(j => j.status === postedFilter);

  const totalIncome = myHistory.filter(j => j.status === "Done").reduce((sum, j) => sum + j.price, 0);
  const totalHours = myHistory.filter(j => j.status === "Done").reduce((sum, j) => sum + (j.hours || 0), 0);

  const today = new Date();
  const weekData = DAYS_MN.map((day, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const dayJobs = myHistory.filter(j => {
      if (!j.completedAt) return false;
      return new Date(j.completedAt).toDateString() === date.toDateString();
    });
    return { day: day.slice(0, 2), hours: dayJobs.reduce((sum, j) => sum + (j.hours || 0), 0) };
  });

  const monthlyData = [];
  for (let i = 3; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - i);
    const month = d.getMonth();
    const year = d.getFullYear();
    const monthJobs = myHistory.filter(j => {
      if (!j.completedAt || j.status !== "Done") return false;
      const jd = new Date(j.completedAt);
      return jd.getMonth() === month && jd.getFullYear() === year;
    });
    const income = monthJobs.reduce((sum, j) => sum + j.price, 0);
    if (income > 0) monthlyData.push({ month: MONTHS_MN[month], income });
  }

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Ачаалж байна...</div>;

  const filterBtns = [
    { label: 'Нээлттэй', value: 'Open', color: '#3b82f6' },
    { label: 'Ажиллаж байна', value: 'Taken', color: '#16a34a' },
    { label: 'Дууссан', value: 'Done', color: '#6b7280' },
  ];

  return (
    <div className="db-page">
      <Navbar setPage={setPage} active="dashboard" isLoggedIn={true} handleLogout={handleLogout} />

      {/* APPLICANTS MODAL */}
      {applicantsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', width: '480px', maxWidth: '95vw' }}>
            <h3 style={{ marginBottom: '4px', fontSize: '18px', fontWeight: 700 }}>Хүсэлт илгээсэн хүмүүс</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>{applicantsModal.jobTitle}</p>
            {applicantsModal.applicants.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>Хүсэлт ирээгүй байна.</p>
            ) : (
              <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {applicantsModal.applicants.map(a => (
                  <div key={a._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
                      {a.name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>{a.name}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>{a.phone}{a.email ? ` · ${a.email}` : ''}</p>
                      <div style={{ marginTop: '2px' }}>
                        <Stars count={Math.round(a.rating)} size={13} />
                        <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '4px' }}>{a.rating} · {a.jobsDone} ажил</span>
                      </div>
                    </div>
                    <button className="btn" style={{ background: '#1d9e75', fontSize: '12px', whiteSpace: 'nowrap' }}
                      onClick={() => {
                        fetch(`http://localhost:5000/api/jobs/${applicantsModal.jobId}/accept`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ workerId: a.id })
                        }).then(() => { refreshAll(); setApplicantsModal(null); });
                      }}>
                      Зөвшөөрөх
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button className="btn" style={{ background: '#6b7280', width: '100%' }} onClick={() => setApplicantsModal(null)}>Хаах</button>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', width: '420px', maxWidth: '95vw' }}>
            <h3 style={{ marginBottom: '4px', fontSize: '18px', fontWeight: 700 }}>Үнэлгээ өгөх</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
              {reviewModal.job.title} — {profiles.find(p => p.id === reviewModal.job.workerId)?.name}
            </p>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Одны үнэлгээ:</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} onClick={() => setReviewForm(v => ({ ...v, stars: s }))}
                    style={{ fontSize: '32px', cursor: 'pointer', color: s <= reviewForm.stars ? '#f59e0b' : '#d1d5db' }}>★</span>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Тайлбар:</p>
              <textarea className="auth-input" rows={3} placeholder="Ажилтны тухай бичих..."
                value={reviewForm.description}
                onChange={e => setReviewForm(v => ({ ...v, description: e.target.value }))}
                style={{ resize: 'vertical', height: 'auto' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn" style={{ flex: 1 }} onClick={handleSubmitReview}>Илгээх</button>
              <button className="btn" style={{ flex: 1, background: '#6b7280' }} onClick={() => { setReviewModal(null); setReviewForm({ stars: 0, description: '' }); }}>Болих</button>
            </div>
          </div>
        </div>
      )}

      <div className="db-body">
        {/* GREETING */}
        <div className="db-greeting-row">
          <div>
            <h1 className="db-greeting-title">Сайн байна уу, {currentUser?.name}!</h1>
            <p className="db-greeting-sub">Өнөөдрийн таны мэдээлэл энд байна</p>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="db-stats">
          <div className="db-stat-card">
            <div className="db-stat-top"><span className="db-stat-label">Нийт цаг</span></div>
            <div className="db-stat-value">{totalHours} цаг</div>
            <div className="db-stat-change green">Нийт ажилласан цаг</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-top"><span className="db-stat-label">Нийт орлого</span></div>
            <div className="db-stat-value">{totalIncome.toLocaleString()}₮</div>
            <div className="db-stat-change green">Нийт олсон орлого</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-top"><span className="db-stat-label">Гүйцэтгэсэн ажил</span></div>
            <div className="db-stat-value">{myHistory.filter(j => j.status === "Done").length}</div>
            <div className="db-stat-change green">Нийт дууссан</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-top"><span className="db-stat-label">Дундаж үнэлгээ</span></div>
            <div className="db-stat-value">{currentUser?.rating ?? '0'} / 5.0</div>
            <div className="db-stat-change gray">{currentUser?.jobsDone ?? 0} үнэлгээнээс</div>
          </div>
        </div>

        <div className="db-mid-sections">
          {/* MY POSTED JOBS */}
          <div className="db-posted-section">
            <div className="db-posted-header">
              <h2 className="db-section-title">Миний нийтэлсэн ажлууд</h2>
              <button className="db-post-outline-btn" onClick={() => setShowPostForm(v => !v)}>Ажлын зар нийтлэх +</button>
            </div>

            {/* filter buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {filterBtns.map(btn => (
                <button key={btn.value} onClick={() => setPostedFilter(btn.value)}
                  style={{
                    padding: '6px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
                    border: `1px solid ${postedFilter === btn.value ? btn.color : '#e5e7eb'}`,
                    background: postedFilter === btn.value ? btn.color : 'white',
                    color: postedFilter === btn.value ? 'white' : '#6b7280',
                    fontWeight: postedFilter === btn.value ? 600 : 400,
                  }}>
                  {btn.label} ({myPostedJobs.filter(j => j.status === btn.value).length})
                </button>
              ))}
            </div>

            {showPostForm && (
              <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <input className="auth-input" placeholder="Ажлын нэр*" value={newJob.title} onChange={e => setNewJob(v => ({ ...v, title: e.target.value }))} />
                <select className="auth-input" value={newJob.category} onChange={e => setNewJob(v => ({ ...v, category: e.target.value }))}>
                  <option value="">Ангилал сонгох</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input className="auth-input" placeholder="Хаяг*" value={newJob.location} onChange={e => setNewJob(v => ({ ...v, location: e.target.value }))} />
                <input className="auth-input" placeholder="Үнэ (₮)*" type="number" value={newJob.price} onChange={e => setNewJob(v => ({ ...v, price: e.target.value }))} />
                <textarea className="auth-input" placeholder="Тайлбар*" rows={3} value={newJob.description} onChange={e => setNewJob(v => ({ ...v, description: e.target.value }))} style={{ resize: "vertical" }} />
                <button className="auth-btn" onClick={handlePostJob}>Нийтлэх</button>
              </div>
            )}

            <div className="container" style={{ padding: 0, maxWidth: "100%" }}>
              {filteredPostedJobs.length > 0 ? filteredPostedJobs.map((job) => {
                const worker = profiles.find(p => p.id === job.workerId);
                return (
                  <div className="job-card" key={job._id}>
                    <div>
                      <div className="title-row">
                        <h3 className="title">{job.title}<span className="category-inline">[{job.category}]</span></h3>
                        <span className="status" style={{
                          background: job.status === 'Taken' ? '#ecfdf5' : job.status === 'Done' ? '#f3f4f6' : '#eaf2ff',
                          color: job.status === 'Taken' ? '#16a34a' : job.status === 'Done' ? '#6b7280' : '#3b82f6'
                        }}>
                          {job.status === "Open" ? "Нээлттэй" : job.status === "Taken" ? "Ажиллаж байна" : "Дууссан"}
                        </span>
                      </div>
                      <p className="desc">{job.description}</p>
                      <div className="meta">
                        <p>Хаяг: {job.location}</p>
                        <p>Байршуулсан: {getPostedTime(job.postedAt)}</p>
                        {job.status === 'Taken' && worker && (
                          <p style={{ color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>
                            Ажилтан: {worker.name} · {worker.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <hr />
                    <div className="bottom">
                      <span className="price">{job.price.toLocaleString()}₮</span>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {job.status === 'Open' && (
                          <button className="btn" style={{ background: '#6b7280', fontSize: '12px' }}
                            onClick={() => {
                              fetch(`http://localhost:5000/api/jobs/${job._id}/applicants`)
                                .then(r => r.json())
                                .then(data => setApplicantsModal({ jobId: job._id, jobTitle: job.title, applicants: data }));
                            }}>
                            Хүсэлтүүд ({job.applicants.length})
                          </button>
                        )}
                        {job.status === 'Taken' && (
                          <button className="btn" style={{ background: '#f59e0b', fontSize: '12px' }}
                            onClick={() => setReviewModal({ job })}>
                            Дууссан + Үнэлэх
                          </button>
                        )}
                        {job.status === 'Open' && (
                          <button className="btn" style={{ background: '#ef4444', fontSize: '12px' }}
                            onClick={() => {
                              if (window.confirm('Устгах уу?'))
                                fetch(`http://localhost:5000/api/jobs/${job._id}`, { method: 'DELETE' })
                                  .then(() => refreshAll());
                            }}>
                            Устгах
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }) : <p style={{ color: "#6b7280", padding: "20px 0" }}>
                {postedFilter === 'Open' ? 'Нээлттэй ажил байхгүй байна.' :
                 postedFilter === 'Taken' ? 'Ажиллаж байгаа ажил байхгүй байна.' :
                 'Дууссан ажил байхгүй байна.'}
              </p>}
            </div>
          </div>

          {/* MY ACCEPTED JOBS */}
          <div className="db-posted-section">
            <h2 className="db-section-title" style={{ marginBottom: "16px" }}>Миний хүлээж авсан ажлууд</h2>
            <div className="container" style={{ padding: 0, maxWidth: "100%" }}>
              {myAcceptedJobs.length > 0 ? myAcceptedJobs.map((job) => {
                const author = profiles.find(p => p.id === job.authorId);
                return (
                  <div className="job-card" key={job._id}>
                    <div>
                      <div className="title-row">
                        <h3 className="title">{job.title}</h3>
                        <span className="status" style={{ background: "#ecfdf5", color: "#16a34a" }}>Ажиллаж байна</span>
                      </div>
                      <div className="meta">
                        <p>Ажил олгогч: {author?.name || 'Тодорхойгүй'}</p>
                        <p>Байршуулсан: {getPostedTime(job.postedAt)}</p>
                        <p>Хаяг: {job.location}</p>
                        <p>Утас: {author?.phone}</p>
                        {author?.social && (
                          <p><a href={`https://${author.social}`} target="_blank" rel="noreferrer">{author.social}</a></p>
                        )}
                      </div>
                    </div>
                    <hr />
                    <div className="bottom">
                      <span className="price">{job.price.toLocaleString()}₮</span>
                    </div>
                  </div>
                );
              }) : <p style={{ color: "#6b7280", padding: "20px 0" }}>Хүлээж авсан ажил байхгүй байна.</p>}
            </div>
          </div>

          {/* SENT APPLICATIONS */}
          <div className="db-posted-section">
            <h2 className="db-section-title" style={{ marginBottom: "16px" }}>Миний илгээсэн хүсэлтүүд</h2>
            <div className="container" style={{ padding: 0, maxWidth: "100%" }}>
              {mySentApplications.length > 0 ? mySentApplications.map((job) => {
                const author = profiles.find(p => p.id === job.authorId);
                return (
                  <div className="job-card" key={job._id}>
                    <div>
                      <div className="title-row">
                        <h3 className="title">{job.title}</h3>
                        <span className="status" style={{ background: "#fef9c3", color: "#a16207" }}>Хүлээгдэж буй</span>
                      </div>
                      <div className="meta">
                        <p>Ажил олгогч: {author?.name || 'Тодорхойгүй'}</p>
                        <p>Хаяг: {job.location}</p>
                        <p>Байршуулсан: {getPostedTime(job.postedAt)}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="bottom">
                      <span className="price">{job.price.toLocaleString()}₮</span>
                    </div>
                  </div>
                );
              }) : <p style={{ color: "#6b7280", padding: "20px 0" }}>Илгээсэн хүсэлт байхгүй байна.</p>}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="db-tabs">
          <button className={`db-tab ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>Түүх</button>
          <button className={`db-tab ${tab === "applications" ? "active" : ""}`} onClick={() => setTab("applications")}>Миний хүсэлтүүд</button>
          <button className={`db-tab ${tab === "reviews" ? "active" : ""}`} onClick={() => setTab("reviews")}>Үнэлгээ</button>
          <button className={`db-tab ${tab === "analytics" ? "active" : ""}`} onClick={() => setTab("analytics")}>Дүн шинжилгээ</button>
        </div>

        {/* TAB: HISTORY */}
        {tab === "history" && (
          <div>
            <h2 className="db-section-title" style={{ marginBottom: "20px" }}>Ажлын түүх</h2>
            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr><th>Ажлын нэр</th><th>Ажил олгогч</th><th>Огноо</th><th>Цаг</th><th>Орлого</th><th>Төлөв</th></tr>
                </thead>
                <tbody>
                  {myHistory.map((j) => {
                    const author = profiles.find((p) => p.id === j.authorId);
                    return (
                      <tr key={j._id}>
                        <td><strong>{j.title}</strong></td>
                        <td>{author?.name}</td>
                        <td>{j.postedAt.split("T")[0]}</td>
                        <td>{j.hours ? `${j.hours} цаг` : "-"}</td>
                        <td style={{ color: "#1d9e75", fontWeight: 600 }}>{j.price.toLocaleString()}₮</td>
                        <td><span className={`db-status-badge ${j.status === "Done" ? "done" : "pending"}`}>{j.status === "Done" ? "Дууссан" : "Хүлээгдэж буй"}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: APPLICATIONS */}
        {tab === "applications" && (
          <div>
            <h2 className="db-section-title" style={{ marginBottom: "20px" }}>Миний хүсэлтүүд</h2>
            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr><th>Ажлын нэр</th><th>Ажил олгогч</th><th>Хаяг</th><th>Үнэ</th><th>Төлөв</th></tr>
                </thead>
                <tbody>
                  {availableJobs.map((j) => {
                    const author = profiles.find((p) => p.id === j.authorId);
                    return (
                      <tr key={j._id}>
                        <td><strong>{j.title}</strong></td>
                        <td>{author?.name}</td>
                        <td>{j.location}</td>
                        <td style={{ color: "#3b82f6", fontWeight: 600 }}>{j.price.toLocaleString()}₮</td>
                        <td><span className="db-status-badge pending">Хүлээгдэж буй</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: REVIEWS */}
        {tab === "reviews" && (
          <div>
            <h2 className="db-section-title" style={{ marginBottom: "20px" }}>Миний үнэлгээнүүд</h2>
            {myReviews.length === 0 ? (
              <p style={{ color: '#6b7280' }}>Үнэлгээ байхгүй байна.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myReviews.map((r, i) => {
                  const reviewer = profiles.find(p => p.id === r.reviewerId);
                  const job = allJobs.find(j => j._id === r.jobId);
                  return (
                    <div key={i} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '15px', color: '#111827' }}>{job?.title || 'Ажил'}</p>
                          <p style={{ fontSize: '13px', color: '#6b7280' }}>{reviewer?.name || 'Хэрэглэгч'}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Stars count={r.stars} size={18} />
                          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{r.createdAt?.split('T')[0]}</p>
                        </div>
                      </div>
                      {r.description && <p style={{ fontSize: '14px', color: '#374151', borderTop: '1px solid #f3f4f6', paddingTop: '10px', marginTop: '4px' }}>{r.description}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: ANALYTICS */}
        {tab === "analytics" && (
          <div>
            <h2 className="db-section-title" style={{ marginBottom: "20px" }}>Дүн шинжилгээ</h2>
            <div className="db-charts-grid">
              <div className="db-chart-card">
                <div className="db-chart-title">Долоо хоногийн цаг</div>
                <div className="db-chart-sub">Сүүлийн 7 хоногийн ажилласан цаг</div>
                <BarChart data={weekData} />
              </div>
              <div className="db-chart-card">
                <div className="db-chart-title">Сарын орлого</div>
                <div className="db-chart-sub">Сүүлийн 4 сарын нийт орлого</div>
                <LineChart data={monthlyData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}