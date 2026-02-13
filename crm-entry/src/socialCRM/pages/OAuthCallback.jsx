import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const status = params.get("status");
      const returnUrl = params.get("returnUrl");

  if (status === "connected") {
    navigate(returnUrl || "/crm/socialmedia/dashboard", { replace: true });
    return;
  }

  navigate("/login");
}, [navigate, params]);

  return <p>Finalizing Facebook connection...</p>;
}
