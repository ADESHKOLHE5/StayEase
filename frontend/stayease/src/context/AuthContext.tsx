import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Step 1: Create the context (like a global box to store auth info)
export const AuthContext = createContext(null);

// Step 2: Provider wraps your whole app so every page can read auth info
export const AuthProvider = ({ children }) => {
  // On page refresh, read token from localStorage so user stays logged in
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        return jwtDecode(savedToken); // decode token → { role, userId, sub, exp }
      } catch {
        return null; // token was broken, treat as logged out
      }
    }
    return null;
  });

  // ─── Called after a successful login ──────────────────────────────────────
  // Returns decoded user so the caller can immediately redirect based on role
  const login = (newToken) => {
    localStorage.setItem("token", newToken); // save token for page refreshes
    const decoded = jwtDecode(newToken);     // decode → { role, userId, ... }
    setUser(decoded);                        // save in global state
    return decoded;                          // return so Login.jsx can redirect
  };

  // ─── Called on logout ─────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token"); // wipe token from storage
    setUser(null);                    // clear global state
  };

  // Everything inside `value` is available to any component in the app
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};