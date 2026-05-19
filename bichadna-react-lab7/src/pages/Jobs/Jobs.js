import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import "../../App.css";

function Jobs({ setPage, isLoggedIn, handleLogout, currentUser }) {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    "Цэвэрлэгээ", "Хүнд хүчний ажил", "Асаргаа",
    "Засвар", "Хүргэлт", "Хоол хийх", "Технологи", "Сургалт", "Бусад"
  ];

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs?status=Open")
      .then((res) => res.json())
      .then((data) => { setJobs(data); setLoading(false); })
      .catch((err) => { console.error("Failed to fetch jobs:", err); setLoading(false); });
  }, []);

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

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "" || job.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <Navbar setPage={setPage} active="jobs" isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <div className="header">
        <h1>Боломжит бүх ажлууд</h1>
        <p>Та өөрт таалагдсан ажлыг сонгон, ажлаа эхлүүлээрэй.</p>
      </div>

      {/* search + filter */}
      <div style={{ maxWidth: "1100px", margin: "0 auto 24px", padding: "0 40px", display: "flex", gap: "12px" }}>
        <input
          type="text"
          placeholder="Ажил хайх..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, height: "44px", padding: "0 16px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "14px", outline: "none" }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ height: "44px", padding: "0 16px", border: "1px solid #d1d5db", borderRadius: "10px", fontSize: "14px", color: "#374151", cursor: "pointer", outline: "none", background: "white" }}
        >
          <option value="">Бүгд</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="container">
        {loading ? (
          <p style={{ color: "#6b7280", gridColumn: "span 2", textAlign: "center", padding: "40px 0" }}>Ачаалж байна...</p>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <div>
                <div className="title-row">
                  <h3 className="title">
                    {job.title}
                    <span className="category-inline">[{job.category}]</span>
                  </h3>
                  <span className="status">Нээлттэй</span>
                </div>
                <p className="desc">{job.description}</p>
                <div className="meta">
                  <p>Хаяг: {job.location}</p>
                  <p>Байршуулсан: {getPostedTime(job.postedAt)}</p>
                </div>
              </div>
              <hr />
              <div className="bottom">
                <span className="price">{job.price.toLocaleString()}₮</span>
                <button className="btn"
                  onClick={() => {
                    if (!currentUser) return alert('Хүсэлт илгээхийн тулд нэвтэрнэ үү');
                    fetch(`http://localhost:5000/api/jobs/${job._id}/apply`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: currentUser.id }),
                    }).then(r => r.json())
                      .then(data => {
                        if (data.message === 'Already applied') return alert('Та аль хэдийн хүсэлт илгээсэн байна');
                        alert('Хүсэлт амжилттай илгээгдлээ!');
                      });
                  }}>
                  Хүсэлт илгээх
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#6b7280", gridColumn: "span 2", textAlign: "center", padding: "40px 0" }}>
            Тохирох ажил олдсонгүй.
          </p>
        )}
      </div>
    </div>
  );
}

export default Jobs;