// src/hooks/useRequireAuth.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRequireAuth() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token_sesion")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
}
