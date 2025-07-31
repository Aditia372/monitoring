import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    division_id: "",
  });

  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/divisions")
      .then((res) => {
        setDivisions(res.data);
      })
      .catch((err) => {
        console.error("Gagal ambil divisi:", err);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", form);
      alert("Register berhasil!");
      setForm({ username: "", password: "", division_id: "" });
      navigate("/login"); // ✅ Redirect
    } catch (err) {
      console.error("Gagal register:", err);
      alert("Register gagal!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <form onSubmit={handleSubmit} className="register-form">
          <h2 className="form-title">Daftar Akun</h2>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              required
            />
          </div>

          <div className="form-group">
            <label>Divisi</label>
            <select
              name="division_id"
              value={form.division_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Divisi --</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.division_name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-button">Daftar</button>
        </form>
        <div className="logo-section">
          <img src="/logo.png" alt="Dirgantara Indonesia" />
        </div>
      </div>
    </div>
  );
};

export default Register;
