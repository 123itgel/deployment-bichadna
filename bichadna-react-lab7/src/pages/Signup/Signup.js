import { useState } from "react";
import "../../App.css";
import Navbar from "../../components/Navbar";
import authImage from "../../authImage.jpg";

function Signup({ setPage, handleLogin }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email || !form.password || !form.confirm)
      return setError('Бүх талбарыг бөглөнө үү');
    if (form.password !== form.confirm)
      return setError('Нууц үг таарахгүй байна');
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, password: form.password }),
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
      <Navbar setPage={setPage} active="signup" isLoggedIn={false} handleLogout={() => {}} />

      <div className="auth-container">
        <div className="auth-left">
          <img src={authImage} alt="Ulaanbaatar" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2 className="auth-title">Бүртгэл үүсгэх</h2>

            {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>{error}</p>}

            <label className="auth-label">Нэр*</label>
            <input className="auth-input" type="text" placeholder="Таны нэр"
              value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} />

            <label className="auth-label">Утасны дугаар*</label>
            <input className="auth-input" type="text" placeholder="Та утасны дугаараа оруулна уу"
              value={form.phone} onChange={e => setForm(v => ({ ...v, phone: e.target.value }))} />

            <label className="auth-label">И-мэйл хаяг*</label>
            <input className="auth-input" type="email" placeholder="Та и-мэйл хаягаа оруулна уу"
              value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} />

            <label className="auth-label">Нууц үг*</label>
            <input className="auth-input" type="password" placeholder="Нууц үг оруулна уу"
              value={form.password} onChange={e => setForm(v => ({ ...v, password: e.target.value }))} />

            <label className="auth-label">Нууц үг давтах*</label>
            <input className="auth-input" type="password" placeholder="Нууц үгээ дахин оруулна уу"
              value={form.confirm} onChange={e => setForm(v => ({ ...v, confirm: e.target.value }))} />

            <label className="auth-check">
              <input type="checkbox" defaultChecked />
              <span>Үйлчилгээний нөхцөл зөвшөөрөх</span>
            </label>

            <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Түр хүлээнэ үү...' : 'Бүртгүүлэх'}
            </button>

            <p className="auth-bottom">
              Аль хэдийн бүртгэлтэй юу?{" "}
              <span onClick={() => setPage("login")} style={{ cursor: "pointer" }}>Нэвтрэх</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;