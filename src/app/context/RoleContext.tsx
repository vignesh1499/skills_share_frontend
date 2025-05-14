import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { decodeToken } from "../utils/decodeToken";
import Cookies from "js-cookie";

type Role = "user" | "provider" | ""; // extendable
type RoleContextType = {
  role: Role;
  setRole: (role: Role) => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>("");

  useEffect(() => {
    const token = Cookies.get("token");
    const decoded = token ? decodeToken(token) : null;
    const extractedRole =
      decoded?.role === "user" || decoded?.role === "provider"
        ? decoded.role
        : "user";
    setRoleState(extractedRole);
    localStorage.setItem("role", extractedRole);
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("role", newRole);
  };

  const value = useMemo(() => ({ role, setRole }), [role]);

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};
