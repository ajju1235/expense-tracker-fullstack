import React, { useState } from "react";

function Login({ onLogin, onSwitch }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 FORGOT PASSWORD
  const [showForgot, setShowForgot] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // 🔐 LOGIN
  const handleLogin = async () => {

    if (!username || !password) {
      alert("Please enter username & password");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim()
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed ❌");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      console.log("User Data:", data.user);

      onLogin(data.user);

    } catch (err) {

      console.error(err);
      alert("Server error ❌");

    } finally {

      setLoading(false);

    }
  };

  // 🔥 FORGOT PASSWORD
  const handleForgotPassword = async () => {

    if (!username || !newPassword) {

      alert(
        "Enter username and new password"
      );

      return;
    }

    try {

      const res = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            newPassword
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {

        alert(
          data.message ||
          "Password reset failed ❌"
        );

        return;
      }

      alert(
        "Password reset successfully ✅"
      );

      setShowForgot(false);

      setNewPassword("");

    } catch (err) {

      console.error(err);

      alert("Server error ❌");

    }
  };

  return (

    <div
      className="container mt-5"
      style={{ maxWidth: "400px" }}
    >

      <h2 className="text-center mb-4">
        Login 🔐
      </h2>

      <input
        className="form-control mb-3"
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <input
        className="form-control mb-3"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        className="btn btn-primary w-100"
        onClick={handleLogin}
        disabled={loading}
      >

        {
          loading
            ? "Logging in..."
            : "Login"
        }

      </button>

      {/* 🔥 FORGOT PASSWORD */}

      <p
        className="text-center mt-3"
        style={{
          color: "blue",
          cursor: "pointer"
        }}
        onClick={() =>
          setShowForgot(!showForgot)
        }
      >
        Forgot Password?
      </p>

      {

        showForgot && (

          <div className="mt-3">

            <input
              className="form-control mb-2"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            />

            <button
              className="btn btn-warning w-100"
              onClick={
                handleForgotPassword
              }
            >
              Reset Password
            </button>

          </div>

        )

      }

      {/* REGISTER */}

      <p className="text-center mt-3">

        Don't have an account?{" "}

        <span
          style={{
            color: "blue",
            cursor: "pointer"
          }}
          onClick={onSwitch}
        >
          Register
        </span>

      </p>

    </div>
  );
}

export default Login;