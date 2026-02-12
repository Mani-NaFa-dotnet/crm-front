import { useState } from "react";
import { updatePermission } from "../../../api/admin/permissions.api";

export default function EditPermissionModal({
  permission,
  onClose,
  onUpdated,
}) {
  const [active, setActive] = useState(permission.active);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePermission(permission.permissionId, {
        isActive: active,
      });
      onUpdated();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-scaleIn">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-xl">✏️</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Edit Permission
              </h3>
              <p className="text-xs text-slate-600">Modify permission settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-all duration-200"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 space-y-5">
          {/* Permission Info Card */}
          <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg">🏷️</span>
                <div className="flex-1">
                  <div className="text-xs text-slate-500 font-medium mb-1">Permission Code</div>
                  <code className="text-sm font-mono text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block">
                    {permission.permissionCode}
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-lg">📦</span>
                <div className="flex-1">
                  <div className="text-xs text-slate-500 font-medium mb-1">Module</div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                    <span>📁</span>
                    {permission.module}
                  </span>
                </div>
              </div>

              {permission.description && (
                <div className="flex items-start gap-3">
                  <span className="text-lg">📝</span>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 font-medium mb-1">Description</div>
                    <p className="text-sm text-slate-700">{permission.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Toggle */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">🔄</span>
                <div>
                  <div className="text-sm font-semibold text-slate-800">Permission Status</div>
                  <p className="text-xs text-slate-600 mt-0.5">Enable or disable this permission</p>
                </div>
              </div>
              
              {/* Custom Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600 shadow-inner"></div>
                <span className={`ml-3 text-sm font-semibold ${active ? 'text-green-700' : 'text-slate-600'}`}>
                  {active ? '✓ Active' : '✗ Inactive'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-white hover:border-slate-400 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
