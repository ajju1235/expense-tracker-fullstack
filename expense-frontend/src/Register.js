import React, { useState } from "react";

function Register({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      // ❗ backend error handle
      if (!res.ok) {
        alert(data.message || "Registration failed ❌");
        return;
      }

      alert("Registered Successfully ✅");

      // 🔄 login page pe switch
      onSwitch();

    } catch (err) {
      alert("Server error ❌");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Register 📝</h2>

      <input
        className="form-control mb-3"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="form-control mb-3"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-success w-100" onClick={handleRegister}>
        Register
      </button>

      {/* 🔥 SWITCH TO LOGIN */}
      <p className="text-center mt-3">
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={onSwitch}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Register;