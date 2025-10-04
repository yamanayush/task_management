import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/authSlice";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((s) => s.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Navigate to home when user is authenticated
  useEffect(() => {
    if (user && status === "idle") {
      navigate("/");
    }
  }, [user, status, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register(name, email, password));
      // Don't navigate immediately - let the auth state change handle the redirect
    } catch (error) {
      // Error is already handled in the auth slice
    }
  };

  return (
    <div className="w-full flex justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded w-full mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={status === "loading"} className="bg-purple-600 text-white px-4 py-2 rounded w-full">
          {status === "loading" ? "Creating..." : "Create Account"}
        </button>
        <div className="text-sm mt-3">
          Have an account? <Link to="/login" className="text-purple-700">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;

