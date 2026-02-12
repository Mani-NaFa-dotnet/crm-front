// import { useEffect, useState } from "react";
// import {
//   getPermissions,
//   createPermission,
//   updatePermission,
// } from "../../api/admin/permissions.api";

// import CreatePermissionModal from "../../components/admin/permissions/CreatePermissionModal";
// import EditPermissionModal from "../../components/admin/permissions/EditPermissionModal";


// export default function Permissions() {
//   const [permissions, setPermissions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [showCreate, setShowCreate] = useState(false);
//   const [editing, setEditing] = useState(null);

//   /* =======================
//      LOAD
//      ======================= */
//   const loadPermissions = async () => {
//     try {
//       setLoading(true);
//       const res = await getPermissions();
//       setPermissions(res.data || []);
//     } catch (e) {
//       console.error("Failed to load permissions", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadPermissions();
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-sm text-slate-500">
//         Loading permissions…
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* HEADER */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-semibold text-slate-800">
//             Permissions
//           </h2>
//           <p className="text-sm text-slate-500">
//             Manage system permissions
//           </p>
//         </div>

//         <button
//           onClick={() => setShowCreate(true)}
//           className="px-3 py-2 bg-blue-600 text-white text-sm rounded"
//         >
//           + Add Permission
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white border rounded-md overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-slate-50 text-slate-600">
//             <tr>
//               <th className="px-4 py-3 text-left">
//                 Permission Code
//               </th>
//               <th className="px-4 py-3 text-left">
//                 Module
//               </th>
//               <th className="px-4 py-3 text-left">
//                 Status
//               </th>
//               <th className="px-4 py-3 text-right">
//                 Action
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y">
//             {permissions.map((p) => (
//               <tr key={p.permissionId}>
//                 <td className="px-4 py-3 font-mono">
//                   {p.permissionCode}
//                 </td>
//                 <td className="px-4 py-3">
//                   {p.module}
//                 </td>
//                 <td className="px-4 py-3">
//                   <span
//                     className={`px-2 py-1 text-xs rounded-full ${
//                       p.active
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {p.active ? "Active" : "Inactive"}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 text-right">
//                   <button
//                     onClick={() => setEditing(p)}
//                     className="text-blue-600 hover:underline text-sm"
//                   >
//                     Edit
//                   </button>
//                 </td>
//               </tr>
//             ))}

//             {permissions.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={4}
//                   className="px-4 py-6 text-center text-slate-500"
//                 >
//                   No permissions found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* CREATE */}
//       {showCreate && (
//         <CreatePermissionModal
//           onClose={() => setShowCreate(false)}
//           onCreated={loadPermissions}
//         />
//       )}

//       {/* EDIT */}
//       {editing && (
//         <EditPermissionModal
//           permission={editing}
//           onClose={() => setEditing(null)}
//           onUpdated={loadPermissions}
//         />
//       )}
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import {
  getPermissions,
  createPermission,
  updatePermission,
} from "../../api/admin/permissions.api";

import CreatePermissionModal from "../../components/admin/permissions/CreatePermissionModal";
import EditPermissionModal from "../../components/admin/permissions/EditPermissionModal";

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);

  /* LOAD */
  const loadPermissions = async () => {
    try {
      setLoading(true);
      const data = await getPermissions();

      console.log("Permissions API:", data);

      setPermissions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load permissions", e);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const activeCount = permissions.filter(p => p.active).length;
  const totalCount = permissions.length;

  return (
    <div className="min-h-full -m-8 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* MODERN HEADER */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Permissions
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Manage system-wide access permissions
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                <div className="text-xs text-green-600 font-medium">Active</div>
                <div className="text-lg font-bold text-green-700">{activeCount}</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                <div className="text-xs text-blue-600 font-medium">Total</div>
                <div className="text-lg font-bold text-blue-700">{totalCount}</div>
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="ml-2 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <span>➕</span>
                <span>Add Permission</span>
              </button>
            </div>
          </div>
        </div>

        {/* PERMISSIONS TABLE */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span>🏷️</span>
                      <span>Permission Code</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span>📦</span>
                      <span>Module</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span>📊</span>
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <div className="text-sm font-semibold text-slate-700">
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {permissions.map((p) => (
                  <tr 
                    key={p.permissionId}
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <code className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-mono">
                        {p.permissionCode}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg text-sm font-medium">
                        <span>📁</span>
                        {p.module}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          p.active
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        <span className={p.active ? "animate-pulse" : ""}>●</span>
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setEditing(p)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}

                {permissions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <span className="text-3xl">🔐</span>
                        </div>
                        <p className="text-slate-500 font-medium">No permissions found</p>
                        <p className="text-sm text-slate-400">Click "Add Permission" to create your first permission</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODALS */}
        {showCreate && (
          <CreatePermissionModal
            onClose={() => setShowCreate(false)}
            onCreated={loadPermissions}
          />
        )}

        {editing && (
          <EditPermissionModal
            permission={editing}
            onClose={() => setEditing(null)}
            onUpdated={loadPermissions}
          />
        )}
      </div>
    </div>
  );
}
