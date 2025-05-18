import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import { decodeToken } from "../utils/decodeToken";
import Cookies from "js-cookie";

type Role = "user" | "provider" | "";
type RoleContextType = {
  role: Role;
  setRole: (role: Role) => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>("");

  // Extract role from localStorage or token on first load
  useEffect(() => {
    let initialRole: Role = localStorage.getItem("role") as Role;

    if (!initialRole) {
      const token = Cookies.get("token");
      const decoded = token ? decodeToken(token) : null;
      initialRole =
        decoded?.role === "user" || decoded?.role === "provider"
          ? decoded.role
          : "user";
      localStorage.setItem("role", initialRole);
    }

    setRoleState(initialRole);
  }, []);

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("role", newRole);
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};
