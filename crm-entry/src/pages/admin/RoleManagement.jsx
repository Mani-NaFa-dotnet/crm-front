// import { useEffect, useState } from "react";
// import { getAdminRoles } from "../../api/admin/roles.api";
// import RolePermissionsEditor from "../../components/admin/roles/RolePermissionsEditor";
// import CreateRoleModal from "../../components/admin/roles/CreateRoleModal";


// export default function RoleManagement() {
//   const [roles, setRoles] = useState([]);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadRoles = async () => {
//       try {
//         const res = await getAdminRoles();
//         setRoles(res.data || []);
//         setSelectedRole(res.data?.[0] || null);
//       } catch (e) {
//         console.error("Failed to load roles", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadRoles();
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-6 text-sm text-slate-500">
//         Loading roles…
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="mb-4">
//         <h2 className="text-xl font-semibold text-slate-800">
//           Role Management
//         </h2>
//         <p className="text-sm text-slate-500">
//           Define roles and assign permissions
//         </p>
//       </div>

//       <div className="grid grid-cols-12 gap-6">
//         {/* LEFT */}
//         <div className="col-span-4 bg-white border rounded-md">
//           <div className="px-4 py-3 border-b font-medium text-sm">
//             Roles
//           </div>

//           <div className="divide-y">
//             {roles.map((role) => {
//               const active =
//                 selectedRole?.roleCode === role.roleCode;

//               return (
//                 <div
//                   key={role.roleCode}
//                   onClick={() => setSelectedRole(role)}
//                   className={`px-4 py-3 cursor-pointer ${
//                     active
//                       ? "bg-blue-50 text-blue-700 font-medium"
//                       : "hover:bg-slate-50"
//                   }`}
//                 >
//                   <div>{role.roleName}</div>
//                   <div className="text-xs text-slate-400">
//                     {role.roleCode}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="col-span-8 bg-white border rounded-md p-4">
//           {selectedRole ? (
//             <RolePermissionsEditor role={selectedRole} />
//           ) : (
//             <div className="text-sm text-slate-500">
//               Select a role to manage permissions
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex items-center justify-between px-4 py-3 border-b">
//   <span className="text-sm font-medium text-slate-700">
//     Roles
//   </span>
//   <button
//     onClick={() => setShowCreate(true)}
//     className="text-xs text-blue-600 hover:underline"
//   >
//     + Add Role
//   </button>
// </div>

//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { getAdminRoles } from "../../api/admin/roles.api";

import RolePermissionsEditor from "../../components/admin/roles/RolePermissionsEditor";
import CreateRoleModal from "../../components/admin/roles/CreateRoleModal";

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  /* =======================
     LOAD ROLES
     ======================= */
const loadRoles = async () => {
  try {
    setLoading(true);

    const list = await getAdminRoles();

    setRoles(Array.isArray(list) ? list : []);

    setSelectedRole((prev) =>
      list.find((r) => r.roleCode === prev?.roleCode) ||
      list[0] ||
      null
    );

  } catch (e) {
    console.error("Failed to load roles", e);
    setRoles([]);
    setSelectedRole(null);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    loadRoles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* MODERN PAGE HEADER */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
              <p className="text-sm text-gray-600">Define roles and assign permissions</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium text-purple-700">{roles.length} Roles</span>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT PANEL — ROLES LIST */}
          <div className="col-span-4 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">
                  All Roles
                </span>
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Role
              </button>
            </div>

            {/* LIST */}
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {roles.map((role) => {
                const active = selectedRole?.roleCode === role.roleCode;

                return (
                  <div
                    key={role.roleCode}
                    onClick={() => setSelectedRole(role)}
                    className={`px-4 py-4 cursor-pointer transition-all ${
                      active
                        ? "bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`font-medium ${active ? "text-purple-700" : "text-gray-900"}`}>
                      {role.roleName}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {role.roleCode}
                      </span>
                    </div>
                  </div>
                );
              })}

              {roles.length === 0 && (
                <div className="px-4 py-12 text-center">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm text-gray-500">No roles found</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL — ROLE DETAILS */}
          <div className="col-span-8 bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            {selectedRole ? (
              <RolePermissionsEditor role={selectedRole} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-gray-500 font-medium">Select a role to manage permissions</p>
                  <p className="text-sm text-gray-400 mt-1">Choose from the list on the left</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CREATE ROLE MODAL */}
        {showCreate && (
          <CreateRoleModal
            onClose={() => setShowCreate(false)}
            onCreated={() => {
              setShowCreate(false);
              loadRoles(); // refresh roles list
            }}
          />
        )}
      </div>
    </div>
  );
}
