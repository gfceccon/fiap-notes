import { useState, useEffect } from "react";

import { AuthService } from "../../services/auth/auth-service";
import { AuthPayload } from "../../services/auth/types";

export default function useFilter() {
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if(filter == ""){

    }
  }, [filter]);

  async function handleFilter(_filter: string) {
    try {
      setLoading(true);
      const {
        data: { token },
      } = await AuthService.login(payload);

      localStorage.setItem("token", token);
      setAuthenticated(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as ErrorResponse;
        alert(err.response?.data.erro);
      } else {
        alert("Erro insesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return { filter, loading, handleLogin, handleLogout, handleRegister };
}
