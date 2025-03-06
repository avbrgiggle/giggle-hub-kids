
import { Outlet } from "react-router-dom";
import ProviderSidebar from "./components/ProviderSidebar";

export default function ProviderLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <ProviderSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
