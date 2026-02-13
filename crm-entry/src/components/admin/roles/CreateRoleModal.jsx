import { useEffect, useState } from "react";
import { createRole } from "../../../api/admin/roles.api";
import { getDomains } from "../../../api/admin/domains.api";

export default function CreateRoleModal({ onClose, onCreated }) {
  const [roleName, setRoleName] = useState("");
  const [domainCode, setDomainCode] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [description, setDescription] = useState("");
  const [domains, setDomains] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  /* LOAD DOMAINS */
  useEffect(() => {
    const loadDomains = async () => {
      const data = await getDomains();
      setDomains(Array.isArray(data) ? data : []);
    };
    loadDomains();
  }, []);

  /* AUTO GENERATE ROLE CODE */
  useEffect(() => {
    if (domainCode && roleName) {
      const formatted = roleName
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");

      setRoleCode(`${domainCode}_${formatted}`);
    } else {
      setRoleCode("");
    }
  }, [domainCode, roleName]);

  /* CREATE ROLE */
  const handleCreate = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!roleName || !domainCode) {
        setError("Domain and Role Name are required");
        return;
      }

      await createRole({
        roleName,
        roleCode,
        domainCode,
        description,
      });

      onCreated();
      onClose();
    } catch (err) {
      if (err?.response?.status === 409) {
        setError(`Role "${roleCode}" already exists`);
      } else {
        setError("Failed to create role");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[560px] rounded-lg shadow-xl p-6 space-y-4">

        <h3 className="text-lg font-semibold">Create Role</h3>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border rounded px-3 py-2">
            {error}
          </div>
        )}

        {/* DOMAIN SELECT */}
        <select
          value={domainCode}
          onChange={(e) => setDomainCode(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-white"
        >
          <option value="">Select Domain</option>
          {domains.map((d) => (
            <option key={d.domainCode} value={d.domainCode}>
              {d.domainCode}
            </option>
          ))}
        </select>

        {/* ROLE NAME INPUT */}
        <input
          type="text"
          placeholder="Enter Role Name (e.g. User)"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        {/* AUTO ROLE CODE */}
        <input
          type="text"
          value={roleCode}
          disabled
          className="w-full border rounded px-3 py-2 text-sm font-mono bg-gray-100"
          placeholder="Auto Generated Role Code"
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={saving}
            className="px-5 py-2 text-sm bg-blue-600 text-white rounded"
          >
            {saving ? "Creating..." : "Create Role"}
          </button>
        </div>

      </div>
    </div>
  );
}