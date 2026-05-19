import { useState, useEffect } from "react";
import "../../App.css";
import "./Home.css";
import Navbar from "../../components/Navbar";

function Home({ setPage, isLoggedIn, handleLogout }) {
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs?status=Open")
      .then((res) => res.json())
      .then((data) => setRecentJobs(data.slice(0, 4)))
      .catch((err) => console.error("Failed to fetch jobs:", err));
  }, []);

  const getPostedTime = (postedAt) => {
    const now = new Date();
    const posted = new Date(postedAt);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMins < 60) return `${diffMins} минутын өмнө`;
    if (diffHours < 24) return `${diffHours} цагийн өмнө`;
    return `${diffDays} өдрийн өмнө`;
  };

  return (
    <div className="home-page">
      <Navbar setPage={setPage} active="home" isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <section className="home-hero">
        <div className="home-hero-left">
          <h1 className="home-title">
            Нэг удаагийн <span>ажил</span><br />хайх, олох платформ
          </h1>
          <p className="home-subtitle">
            Цагийн ажлаа хялбар хайж олоод, орлогоо удирдаарай.
            Ажил олгогч та ажилчдаа хурдан олж, цаг төлбөрийг тооцоолоорой.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
            <button
              className="profile-btn"
              style={{ padding: "10px 24px", fontSize: "15px" }}
              onClick={() => setPage("signup")}
            >
              Эхлэх
            </button>
            <button
              className="home-outline-btn"
              style={{ padding: "10px 24px", fontSize: "15px" }}
              onClick={() => setPage("jobs")}
            >
              Танилцах
            </button>
          </div>
        </div>
        <div className="home-hero-right">
          <div className="home-hero-img-placeholder" />
        </div>
      </section>

      <section className="home-steps" id="steps">
        <h2>Бид хэрхэн ажилладаг вэ?</h2>
        <div className="home-steps-grid">
          <div className="home-step-card">
            <div className="home-step-number">1</div>
            <h3>Ажил нийтлэх</h3>
            <p>Хийлгэх ажлаа тайлбарлаж, үнэ тохироод, хэн нэгэн зөвшөөрөхийг хүлээ.</p>
          </div>
          <div className="home-step-card">
            <div className="home-step-number">2</div>
            <h3>Ажил хүлээж авах</h3>
            <p>Өөрийн орон дээрх боломжит ажлуудыг үзэж, өөрийн цагт тааруулж нэгдээрэй.</p>
          </div>
          <div className="home-step-card">
            <div className="home-step-number">3</div>
            <h3>Цалингаа авах</h3>
            <p>Даалгаврыг гүйцэтгэж, итгэлтэйгээр харилцан ажиллаж, найдвартайгаар хүлээн ав.</p>
          </div>
        </div>
      </section>

      <section className="home-recent">
        <h2 className="home-recent-title">Сүүлд нэмэгдсэн ажлууд</h2>
        <p className="home-recent-sub">Танд тохирсон нэг удаагийн ажлаа сонгоорой</p>

        <div className="home-recent-grid">
          {recentJobs.length > 0 ? recentJobs.map((job) => (
            <div className="home-recent-card" key={job._id}>
              <h3 className="home-recent-name">{job.title}</h3>
              <p className="home-recent-price">{job.price.toLocaleString()}₮</p>
              <div className="home-recent-meta">
                <p>Байршуулсан: {getPostedTime(job.postedAt)}</p>
                <p>Хаяг: {job.location}</p>
              </div>
              <button className="home-recent-btn" onClick={() => setPage("jobs")}>
                Дэлгэрэнгүй
              </button>
            </div>
          )) : (
            <p style={{ color: "#6b7280" }}>Ажил ачаалж байна...</p>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "36px" }}>
          <button
            className="profile-btn"
            style={{ padding: "12px 32px", fontSize: "15px", background: "#111827", border: "none" }}
            onClick={() => setPage("jobs")}
          >
            Бүх ажил харах
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;