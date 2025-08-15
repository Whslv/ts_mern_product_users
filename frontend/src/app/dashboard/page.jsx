"use client";
import { useRouter } from "next/navigation";
import { getMe, getDashboard } from "../../../lib/api";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getDashboard();
        setDashboard(data);
      } catch {
        router.push("/login");
      }
    })();
  }, []);

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__content">
          <pre>{JSON.stringify(dashboard, null, 2)}</pre>;
        </div>
      </div>
    </div>
  );
}
