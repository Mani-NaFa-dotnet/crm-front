import { useEffect, useMemo, useState } from "react";

import {
  getAllPermissions,
  getRolePermissionsByRoleCode,
  assignPermissionToRole,
  removePermissionFromRole,
} from "../../../api/admin/rolePermissions.api";

export default function RolePermissionsEditor({ role }) {
  const [allPermissions, setAllPermissions] = useState([]);
  const [initialAssigned, setInitialAssigned] = useState(new Set());
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /* =======================
     LOAD PERMISSIONS
     ======================= */
  useEffect(() => {
    if (!role?.roleCode) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        // APIs now return DATA directly (not AxiosResponse)
        const all = await getAllPermissions();
        const assigned = await getRolePermissionsByRoleCode(role.roleCode);

        const allList = Array.isArray(all) ? all : [];

        // backend may return:
        // 1) ["USER_VIEW", "USER_EDIT"]
        // 2) { permissions: [...] }
        const assignedList = Array.isArray(assigned)
          ? assigned
          : assigned?.permissions || [];

        const assignedCodes = new Set(assignedList);

        setAllPermissions(allList);
        setInitialAssigned(assignedCodes);
        setSelectedPermissions(new Set(assignedCodes));
      } catch (e) {
        console.error("Permission load failed", e);
        setError("Failed to load permissions");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [role.roleCode]);

  /* =======================
     GROUP BY MODULE
     ======================= */
  const permissionsByModule = useMemo(() => {
    const grouped = {};
    allPermissions.forEach((perm) => {
      const module = perm.module || "OTHER";
      if (!grouped[module]) grouped[module] = [];
      grouped[module].push(perm);
    });
    return grouped;
  }, [allPermissions]);

  /* =======================
     TOGGLE PERMISSION
     ======================= */
  const togglePermission = (code) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
    setSuccess(false);
  };

  /* =======================
     CHANGE DETECTION
     ======================= */
  const hasChanges = useMemo(() => {
    if (initialAssigned.size !== selectedPermissions.size) return true;
    for (const code of initialAssigned) {
      if (!selectedPermissions.has(code)) return true;
    }
    return false;
  }, [initialAssigned, selectedPermissions]);

  /* =======================
     SAVE
     ======================= */
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const toAdd = [...selectedPermissions].filter(
        (c) => !initialAssigned.has(c)
      );

      const toRemove = [...initialAssigned].filter(
        (c) => !selectedPermissions.has(c)
      );

      await Promise.all([
        ...toAdd.map((permissionCode) =>
          assignPermissionToRole({
            roleCode: role.roleCode,
            permissionCode,
          })
        ),
        ...toRemove.map((permissionCode) =>
          removePermissionFromRole({
            roleCode: role.roleCode,
            permissionCode,
          })
        ),
      ]);

      setInitialAssigned(new Set(selectedPermissions));
      setSuccess(true);
    } catch (e) {
      console.error("Permission update failed", e);
      setError("Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     UI STATES
     ======================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* MODERN HEADER */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-md">
            <span className="text-xl">🛡️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {role.roleName}
            </h3>
            <p className="text-sm text-slate-600 flex items-center gap-1.5">
              <span>🔐</span>
              <span>Manage permissions for this role</span>
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl animate-slideIn">
          <span className="text-2xl">✅</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">Success</p>
            <p className="text-sm text-green-600">Permissions updated successfully</p>
          </div>
        </div>
      )}

      {/* PERMISSIONS GRID */}
      <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <div className="divide-y divide-slate-200">
            {Object.entries(permissionsByModule).map(([module, perms]) => {
              const allChecked = perms.every((p) =>
                selectedPermissions.has(p.permissionCode)
              );

              return (
                <div key={module} className="bg-white">
                  {/* MODULE HEADER */}
                  <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-100 via-slate-50 to-white px-5 py-3 border-b border-slate-200 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📦</span>
                        <span className="font-bold text-slate-800 uppercase tracking-wide text-sm">
                          {module}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-xs font-semibold">
                          {perms.length}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPermissions((prev) => {
                            const next = new Set(prev);
                            if (allChecked) {
                              perms.forEach((p) =>
                                next.delete(p.permissionCode)
                              );
                            } else {
                              perms.forEach((p) =>
                                next.add(p.permissionCode)
                              );
                            }
                            return next;
                          });
                          setSuccess(false);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <span>{allChecked ? "✖️" : "✓"}</span>
                        <span>{allChecked ? "Clear all" : "Select all"}</span>
                      </button>
                    </div>
                  </div>

                  {/* MODULE PERMISSIONS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {perms.map((perm, index) => {
                      const checked = selectedPermissions.has(
                        perm.permissionCode
                      );

                      return (
                        <label
                          key={perm.permissionCode}
                          className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-all duration-150 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 group ${
                            checked ? "bg-gradient-to-r from-green-50/30 to-emerald-50/30" : ""
                          } ${index % 2 === 0 && perms.length % 2 !== 0 && index === perms.length - 1 ? "md:col-span-2" : ""}`}
                        >
                          {/* CUSTOM CHECKBOX */}
                          <div className="relative flex items-center justify-center mt-0.5">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                togglePermission(perm.permissionCode)
                              }
                              className="sr-only peer"
                            />
                            <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                              checked
                                ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 shadow-md"
                                : "border-slate-300 bg-white group-hover:border-purple-400"
                            }`}>
                              {checked && (
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className={`font-semibold text-sm mb-0.5 transition-colors ${
                              checked ? "text-green-700" : "text-slate-800"
                            }`}>
                              {perm.permissionCode}
                            </div>
                            {perm.description && (
                              <div className="text-xs text-slate-500 leading-relaxed">
                                {perm.description}
                              </div>
                            )}
                          </div>

                          {checked && (
                            <div className="flex-shrink-0">
                              <span className="text-green-500 text-lg">✓</span>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-white rounded-xl p-4 border-2 border-slate-200">
        <div className="text-sm text-slate-600">
          {hasChanges ? (
            <span className="flex items-center gap-2 font-medium text-orange-600">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              Unsaved changes
            </span>
          ) : (
            <span className="flex items-center gap-2 text-green-600">
              <span>✓</span>
              All changes saved
            </span>
          )}
        </div>
        
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Save Permissions</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
