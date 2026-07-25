import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
  const REMEMBER_ME_TIMEOUT = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  useEffect(() => {
    // Check if user is stored in localStorage on load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Proactive session healing: if email is admin, ensure is_admin is true
      if (parsedUser.email === 'admin@edocbook.com' && !parsedUser.is_admin) {
        parsedUser.is_admin = true;
        localStorage.setItem('user', JSON.stringify(parsedUser));
      }
      
      const timeout = parsedUser.rememberMe ? REMEMBER_ME_TIMEOUT : SESSION_TIMEOUT;
      const isExpired = parsedUser.loginTimestamp && (Date.now() - parsedUser.loginTimestamp > timeout);
      
      if (isExpired) {
        logout();
      } else {
        setUser(parsedUser);
      }
    }
  }, []);

  const login = (userData, rememberMe = false) => {
    const sessionData = {
      ...userData,
      rememberMe,
      loginTimestamp: Date.now()
    };
    setUser(sessionData);
    localStorage.setItem('user', JSON.stringify(sessionData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
