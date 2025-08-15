"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleRegister = () => {
    router.push("/register");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__content">
          <h1 className="header__title">Welcome!</h1>
          <div className="header__button">
            <button
              type="button"
              onClick={handleRegister}
              className="button--orange"
            >
              Register
            </button>
            <button onClick={handleLogin} className="button--white">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
