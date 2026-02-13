import { useMemo } from "react";

export default function useTableFilters(users = [], filters = {}) {
  const { search, domainCode, roleCode, status } = filters;

  /* 🔑 Strong normalizer */
  const normalize = (str = "") =>
    str.toLowerCase().replace(/[\s_]+/g, "");

  return useMemo(() => {
    const q = normalize(search);

    return users.filter((u) => {
      const roles = Array.isArray(u.roles) ? u.roles : [];

      /* 🔍 SEARCH */
      const matchesSearch =
        !q ||
        normalize(u.username).includes(q) ||
        normalize(u.email).includes(q);

      /* 🏢 DOMAIN FILTER (DYNAMIC & FUTURE-PROOF) */
      const matchesDomain =
        !domainCode ||
        roles.some((r) =>
          normalize(r).startsWith(normalize(domainCode))
        );

      /* 👤 ROLE FILTER */
      const matchesRole =
        !roleCode ||
        roles.some((r) =>
          normalize(r).includes(normalize(roleCode))
        );

      /* 🔒 STATUS */
      const matchesStatus =
        !status ||
        u.accountStatus === status;

      return (
        matchesSearch &&
        matchesDomain &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, domainCode, roleCode, status]);
}