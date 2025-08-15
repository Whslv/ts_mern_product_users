"use client";
import { useEffect, useState } from "react";
import { register } from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inputError, setInputError] = useState("");
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setErrorMessage("");
      setInputError("");

      if (!username.trim()) {
        setErrorMessage("Username is required.");
        setInputError("username");
      } else if (!emailRegex.test(email)) {
        setErrorMessage("Please enter a valid email address.");
        setInputError("email");
      } else if (password.length < 8) {
        setErrorMessage("Password must be at least 8 characters long.");
        setInputError("password");
      } else {
        setErrorMessage("");
        setInputError("");
        await register(username, email, password);
        router.push("/dashboard");
      }
    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <div className="registration">
      <div className="registration__container">
        <div className="registration__header">
          <h2 className="app-name">Price Builder</h2>
        </div>
        <div className="registration__content">
          <h1 className="registration__title">Price It Right. Every Time.</h1>
          <form onSubmit={handleRegister} className="registration__form">
            <input
              className={`form__input ${inputError === "username" ? "input-error" : ""}`}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              className={`form__input ${inputError === "email" ? "input-error" : ""}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              className={`form__input ${inputError === "password" ? "input-error" : ""}`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="form__lable">
              <input className="form__checkbox" type="checkbox" required />I
              agree to the Terms and Privacy Policy.
            </div>
            <div className="form__button">
              <button type="submit" className="button--orange">
                Register
              </button>
              <button onClick={handleLogin} className="button--white">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
