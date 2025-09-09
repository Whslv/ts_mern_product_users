"use client";
import { useState } from "react";
import { getDashboard, login } from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleCancel = async () => {
    try {
      setEmail("");
      setPassword("");
    } catch {
      alert("Cancel failed");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push(`/dashboard`);
    } catch (err) {
      alert("Login failed");
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
          <form
            className="registration__form"
            onSubmit={handleLogin}
          >
            <input
              className="form__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              className="form__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <div className="form__lable">
              <input className="form__checkbox" type="checkbox" />
              Remember the password.
            </div>
            <div className="form__button">
              <button type="submit" className="button--orange">
                Login
              </button>
              <button onClick={handleCancel} className="button--white">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
