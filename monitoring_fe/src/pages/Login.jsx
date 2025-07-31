import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("DATA DARI BACKEND:", data);

      if (res.ok && data.user) {
        // Simpan user ke localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
      
        const divisionId = data.user.division_id;
      
        // Arahkan berdasarkan division_id
        if (divisionId === "1") {
          navigate("/Preplanning");
        } else if (["2", "3", "4", "5", "6","7"].includes(divisionId)) {
          navigate("/planner");
        } else {
          navigate("/home");
        }
      } else {
        alert(data.message || "Login gagal");
      }
      
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="logo-section">
          <img src="./logo.png" alt="Dirgantara Indonesia" />
        </div>
        <div className="login-box">
          <h2>Selamat Datang 👋</h2>
          <p>Silakan login untuk melanjutkan</p>
          <form onSubmit={handleLogin}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Masukkan username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p className="register-link">
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
  
};

export default Login;
