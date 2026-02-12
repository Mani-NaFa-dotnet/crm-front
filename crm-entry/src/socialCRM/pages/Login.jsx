import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connectFacebook } from "../api/auth.api";
import { loadCapabilities } from "../store/capabilities.store";
import { Button } from "../components/common";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    loadCapabilities()
      .then(caps => {
        if (caps.connected) {
          navigate("/crm/socialmedia/dashboard");
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SocialMediaCRM</h1>
        <p className="text-gray-600 mb-8">Manage Facebook like Zoho Social</p>
        <Button 
          variant="primary" 
          onClick={connectFacebook}
          size="lg"
          className="w-full"
        >
          Connect Facebook
        </Button>
      </div>
    </div>
  );
}
