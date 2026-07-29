import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { pb } from "./pb";

type AuthState = {
  email: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthState | null>(null);

// Редактор логинится в auth-коллекцию `editors` (ADR-013). PB SDK хранит токен
// в localStorage (pb.authStore) — сессия переживает перезагрузку.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(
    pb.authStore.record?.email ?? null,
  );

  useEffect(() => {
    return pb.authStore.onChange(() => {
      setEmail(pb.authStore.record?.email ?? null);
    });
  }, []);

  async function login(e: string, p: string) {
    await pb.collection("editors").authWithPassword(e, p);
  }
  function logout() {
    pb.authStore.clear();
  }

  return <Ctx.Provider value={{ email, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth вне AuthProvider");
  return v;
}
