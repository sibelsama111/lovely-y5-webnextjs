import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// storage keys
const USERS_KEY = 'lovely5_users_v1';
const SESSION_KEY = 'lovely5_session_v1';

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(() => {
    try {
      if (typeof window === 'undefined') return null;
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  });
  const [loading] = useState(false);

  const registerClient = (data) => {
    // data: {rut, primernombre, segundonombre?, apellidos, correo, telefono, direccion, password}
    const users = loadUsers();
    const exists = users.find(u => u.correo === data.correo || u.telefono === data.telefono || u.rut === data.rut);
    if (exists) throw new Error('Usuario ya existe');
    const newUser = { ...data, role: 'client', pedidos: [], direcciones: [data.direccion] };
    users.push(newUser);
    saveUsers(users);
    return newUser;
  };

  const registerWorker = (data, code) => {
    // code must be LVLWRKR5
    if (code !== 'LVLWRKR5') throw new Error('Código inválido');
    const users = loadUsers();
    const exists = users.find(u => u.rut === data.rut || u.correo === data.correo);
    if (exists) throw new Error('Trabajador ya existe');
    const newWorker = { ...data, role: 'worker', puesto: 'Vendedor/a', sueldo_base: 560000 };
    users.push(newWorker);
    saveUsers(users);
    return newWorker;
  };

  const login = (identifier, password) => {
    // identifier can be email or telefono
    const users = loadUsers();
    const u = users.find(x => (x.correo === identifier || x.telefono === identifier) && x.password === password && x.role === 'client');
    if (!u) throw new Error('Credenciales inválidas');
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    router.push('/perfil');
  };

  const adminLogin = (rut, password) => {
    const users = loadUsers();
    const u = users.find(x => x.rut === rut && x.password === password && x.role === 'worker');
    if (!u) throw new Error('Credenciales inválidas');
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    router.push('/admin');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    router.push('/');
  };

  const updateProfile = (updates) => {
    const users = loadUsers();
    const idx = users.findIndex(u => u.rut === user.rut && u.role === user.role);
    if (idx === -1) throw new Error('Usuario no encontrado');
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
    setUser(users[idx]);
    localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx]));
    return users[idx];
  };

  const addOrderToHistory = (order) => {
    const users = loadUsers();
    const idx = users.findIndex(u => u.rut === (user && user.rut));
    if (idx === -1) return;
    users[idx].pedidos = users[idx].pedidos || [];
    users[idx].pedidos.push(order);
    saveUsers(users);
    setUser(users[idx]);
    localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx]));
  };

  const value = { user, registerClient, registerWorker, login, adminLogin, logout, updateProfile, addOrderToHistory, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}