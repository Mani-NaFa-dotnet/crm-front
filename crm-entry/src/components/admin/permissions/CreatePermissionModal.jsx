import { useState } from "react";
import { createPermission } from "../../../api/admin/permissions.api";

export default function CreatePermissionModal({
  onClose,
  onCreated,
}) {
  const [permissionCode, setPermissionCode] = useState("");
  const [description, setDescription] = useState("");
  const [module, setModule] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    try { 
      setSaving(true);
      setError(null);

      if (!permissionCode || !module) {
        setError("Permission code and module are required");
        return;
      }

      await createPermission({
        permissionCode: permissionCode.trim(),
        description: description.trim(),
        module: module.trim(),
      });

      onCreated();
      onClose();
    } catch (e) {
      console.error(e);
      setError("Failed to create permission");
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
              <span className="text-xl">➕</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Create Permission
              </h3>
              <p className="text-xs text-slate-600">Add a new system permission</p>
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
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <span className="text-xl">⚠️</span>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Permission Code */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span>🏷️</span>
              <span>Permission Code</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="e.g., USER_CREATE, ROLE_EDIT"
              value={permissionCode}
              onChange={(e) => setPermissionCode(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-mono focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
            />
            <p className="text-xs text-slate-500 italic">⚠️ Permission code is immutable after creation</p>
          </div>

          {/* Module */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span>📦</span>
              <span>Module</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="e.g., HR, USER, AUTH, SALES"
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span>📝</span>
              <span>Description</span>
              <span className="text-slate-400 text-xs">(optional)</span>
            </label>
            <textarea
              placeholder="Describe what this permission allows..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none resize-none"
              rows={3}
            />
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
            onClick={handleCreate}
            disabled={saving || !permissionCode || !module}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Create Permission</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
