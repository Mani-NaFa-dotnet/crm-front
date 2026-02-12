import { Outlet, NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
   ${
     isActive
       ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
       : "text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-slate-900 hover:translate-x-1"
   }`;

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* MODERN WHITE SIDEBAR */}
      <aside className="w-64 bg-white flex flex-col flex-shrink-0 shadow-xl border-r border-slate-200">
        {/* HEADER */}
        <div className="px-5 py-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-wide text-slate-800">
                CRM Admin
              </h3>
              <p className="text-xs text-slate-500">Management Portal</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          <NavLink to="/admin/domains" className={linkClass}>
            <span className="text-lg">🌐</span>
            <span>Domains</span>
          </NavLink>
          <NavLink to="/admin/users" className={linkClass}>
            <span className="text-lg">👥</span>
            <span>Users</span>
          </NavLink>
          <NavLink to="/admin/roles" className={linkClass}>
            <span className="text-lg">🛡️</span>
            <span>Roles</span>
          </NavLink>
          <NavLink to="/admin/permissions" className={linkClass}>
            <span className="text-lg">🔐</span>
            <span>Permissions</span>
          </NavLink>
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => (window.location.href = "/logout")}
            className="w-full flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-4 py-3 shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
