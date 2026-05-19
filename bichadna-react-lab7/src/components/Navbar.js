import "../App.css";

export default function Navbar({ setPage, active, isLoggedIn, handleLogout }) {
  return (
    <div className="navbar">
      <h2 className="logo" style={{ cursor: "pointer" }} onClick={() => setPage("home")}>
        BiChadna
      </h2>

      <div className="nav-links">
        <span
          onClick={() => setPage("jobs")}
          style={{ cursor: "pointer", color: active === "jobs" ? "#3b82f6" : "gray" }}
        >
          Ажлын зарууд
        </span>
        <span
          onClick={() => { setPage("home"); setTimeout(() => document.getElementById("steps")?.scrollIntoView({ behavior: "smooth" }), 50); }}
          style={{ cursor: "pointer", color: "gray" }}
        >
          Хэрхэн ажилладаг
        </span>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {isLoggedIn ? (
          <>
            <button className="home-outline-btn" onClick={() => setPage("dashboard")}>
              Dashboard
            </button>
            <button className="profile-btn" onClick={handleLogout}>
              Гарах
            </button>
          </>
        ) : (
          <>
            <button className="home-outline-btn" onClick={() => setPage("login")}>
              Нэвтрэх
            </button>
            <button className="profile-btn" onClick={() => setPage("signup")}>
              Бүртгүүлэх
            </button>
          </>
        )}
      </div>
    </div>
  );
}
