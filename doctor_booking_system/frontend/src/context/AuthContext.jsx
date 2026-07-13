import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

  useEffect(() => {
    // Check if user is stored in localStorage on load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const isExpired = parsedUser.loginTimestamp && (Date.now() - parsedUser.loginTimestamp > SESSION_TIMEOUT);
      
      if (isExpired) {
        logout();
      } else {
        setUser(parsedUser);
      }
    }
  }, []);

  const login = (userData) => {
    const sessionData = {
      ...userData,
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
