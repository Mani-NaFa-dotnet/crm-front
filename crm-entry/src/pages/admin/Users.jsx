import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext";

import CreateUser from "../../components/admin/users/CreateUser";
import UsersTable from "../../components/admin/users/UsersTable";
import UserDrawer from "../../components/admin/users/UserDrawer";

import { getAdminUsers } from "../../api/admin/users.api";
import { lockUser, unlockUser } from "../../api/users/users.api";
import { getDomains } from "../../api/admin/domains.api";
import { getAdminRoles } from "../../api/admin/roles.api";

import useTableFilters from "../../hooks/useTableFilters";

export default function Users() {
  const { permissions, user } = useAuth();

  /* STATE */
  const [users, setUsers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  /* FILTERS */
  const [search, setSearch] = useState("");
  const [domainCode, setDomainCode] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [status, setStatus] = useState("");

  /* PAGINATION */
  const [page, setPage] = useState(1);
  const pageSize = 25;

  /* FETCH USERS */
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAdminUsers({ page, pageSize });

      // Supports both wrapper and raw array
      setUsers(res?.users ?? res ?? []);
    } catch (err) {
      console.error("Users fetch error:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /* FETCH DOMAINS + ROLES */
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [domainsData, rolesData] = await Promise.all([
          getDomains(),
          getAdminRoles(),
        ]);

        setDomains(Array.isArray(domainsData) ? domainsData : []);
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      } catch (err) {
        console.error("Reference data error:", err);
        setDomains([]);
        setRoles([]);
      }
    };

    loadReferenceData();
  }, []);

  /* FILTER USERS */
  const filteredUsers = useTableFilters(users, {
    search,
    domainCode,
    roleCode,
    status,
  });

  /* ACTIONS */
  const handleLock = async (userId) => {
    const reason = window.prompt(
      "Reason for locking this user?",
      "Violation of policy"
    );
    if (!reason) return;

    await lockUser(userId, reason);
    loadUsers();
  };

  const handleUnlock = async (userId) => {
    if (!window.confirm("Unlock this user?")) return;
    await unlockUser(userId);
    loadUsers();
  };

  const canLock =
    permissions?.includes("USER_LOCK") ||
    permissions?.includes("CRM_FULL_ACCESS");

  const canCreate =
    permissions?.includes("USER_CREATE") ||
    permissions?.includes("CRM_FULL_ACCESS");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* MODERN HEADER */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
                  <p className="text-sm text-gray-600">Manage users, roles, domains and access control</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700">{filteredUsers.length} Total Users</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-green-700">
                    {/* {filteredUsers.filter(u => u.isActive).length} Active */}
                    {filteredUsers.filter(u => u.accountStatus === "ACTIVE").length} Active

                  </span>
                </div>
              </div>
            </div>

            {canCreate && (
              <button
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create User
              </button>
            )}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl px-4 py-3 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* MODERN FILTER BAR */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-2.5 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={domainCode}
              onChange={(e) => setDomainCode(e.target.value)}
              className="border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="">All Domains</option>
              {domains.map((d) => (
                <option key={d.domainId} value={d.domainCode}>
                  {d.domainName}
                </option>
              ))}
            </select>

            <select
              value={roleCode}
              onChange={(e) => setRoleCode(e.target.value)}
              className="border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r.roleCode} value={r.roleCode}>
                  {r.roleName}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">✅ Active</option>
              <option value="LOCKED">🔒 Locked</option>
            </select>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <UsersTable
            users={filteredUsers}
            permissions={permissions}
            currentUserId={Number(user?.sub)}
            onLock={canLock ? handleLock : undefined}
            onUnlock={canLock ? handleUnlock : undefined}
            onSelectUser={(id) => {
              setSelectedUserId(id);
              setDrawerOpen(true);
            }}
          />
        </div>

        {/* USER DRAWER */}
        <UserDrawer
          open={drawerOpen}
          userId={selectedUserId}
          onClose={() => setDrawerOpen(false)}
          onUserUpdated={loadUsers}
        />

        {/* CREATE USER */}
        {createOpen && (
          <CreateUser
            onSuccess={() => {
              setCreateOpen(false);
              loadUsers();
            }}
            onClose={() => setCreateOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
