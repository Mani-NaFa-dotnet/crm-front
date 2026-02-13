import { useEffect, useState } from "react";
import { getUsers } from "../../api/admin/users.api";

export default function useUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return users;
}
