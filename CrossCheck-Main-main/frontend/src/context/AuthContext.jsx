import { createContext,useContext,useMemo,useState } from 'react';
import { api } from '../services/api';
const C=createContext(null);
export function AuthProvider({children}){
 const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('crosscheck_user')||'null'));
 const login=async credentials=>{const data=await api.login(credentials);localStorage.setItem('crosscheck_token',data.token);localStorage.setItem('crosscheck_user',JSON.stringify(data.user));setUser(data.user);return data;};
 const register=async details=>{const data=await api.register(details);localStorage.setItem('crosscheck_token',data.token);localStorage.setItem('crosscheck_user',JSON.stringify(data.user));setUser(data.user);return data;};
 const updateUser=next=>{localStorage.setItem('crosscheck_user',JSON.stringify(next));setUser(next);};
 const logout=()=>{localStorage.removeItem('crosscheck_token');localStorage.removeItem('crosscheck_user');setUser(null);};
 return <C.Provider value={useMemo(()=>({user,login,register,updateUser,logout}),[user])}>{children}</C.Provider>
}
export const useAuth=()=>useContext(C);
