import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const status = params.get("status");

    if (status === "connected") {
      navigate("/crm/socialmedia/dashboard", { replace: true });
    }

    if (status === "connected_select_resource") {
      navigate("/crm/socialmedia/dashboard");
    }

    if (!status) {
      navigate("/login");
    }
  }, []);

  return <p>Finalizing Facebook connection...</p>;
}
