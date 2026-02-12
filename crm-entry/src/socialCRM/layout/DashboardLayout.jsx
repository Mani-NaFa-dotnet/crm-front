import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { loadCapabilities } from "../store/capabilities.store";
import { FacebookPageProvider } from "../context/FacebookPageContext";

export default function DashboardLayout() {
  const [caps, setCaps] = useState(null);

  useEffect(() => {
    loadCapabilities()
      .then(setCaps)
      .catch(() => {});
  }, []);

  return (
    <FacebookPageProvider>
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex-1 bg-gray-50 overflow-auto">
          <Topbar />

          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </FacebookPageProvider>
  );
}
