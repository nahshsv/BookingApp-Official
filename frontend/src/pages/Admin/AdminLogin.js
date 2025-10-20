import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/login", form);

      if (res.data.success) {
        // ✅ Lưu token và role vào localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userId", res.data.userId);

        if (res.data.role === "admin") {
          navigate("/admin"); // ✅ chuyển qua dashboard
        } else {
          setError("❌ You are not authorized to access admin panel");
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-[380px]"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Login
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="oni@gmail.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="••••••"
            required
          />
        </div>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
