import { useState } from "react";
import "../../App.css";
import Navbar from "../../components/Navbar";
import authImage from "../../authImage.jpg";

function Login({ setPage, handleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return setError('И-мэйл болон нууц үг оруулна уу');
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }
      handleLogin(data);
    } catch (err) {
      setError('Сервертэй холбогдоход алдаа гарлаа');
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar setPage={setPage} active="login" isLoggedIn={false} handleLogout={() => {}} />

      <div className="auth-container">
        <div className="auth-left">
          <img src={authImage} alt="Ulaanbaatar" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2 className="auth-title">Нэвтрэх</h2>

            {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>{error}</p>}

            <label className="auth-label">И-мэйл хаяг</label>
            <input className="auth-input" type="email" placeholder="Та и-мэйл хаягаа оруулна уу"
              value={email} onChange={e => setEmail(e.target.value)} />

            <label className="auth-label">Нууц үг</label>
            <input className="auth-input" type="password" placeholder="Нууц үг оруулна уу"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

            <label className="auth-check">
              <input type="checkbox" defaultChecked />
              <span>Бүртгэл сануулах</span>
            </label>

            <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}
            </button>

            <p className="auth-bottom">
              Бүртгэл үүсгэх үү?{" "}
              <span onClick={() => setPage("signup")} style={{ cursor: "pointer" }}>Бүртгүүлэх</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;