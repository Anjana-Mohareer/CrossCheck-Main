const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export async function request(path, options={}) {
  const token = localStorage.getItem('crosscheck_token');
  const headers = {...(options.body instanceof FormData ? {} : {'Content-Type':'application/json'}), ...(token?{Authorization:`Bearer ${token}`}:{}) , ...(options.headers||{})};
  const res = await fetch(`${API}${path}`, {...options, headers});
  if (!res.ok) { const text = await res.text(); throw new Error(text || `Request failed (${res.status})`); }
  if (res.status===204) return null;
  const type=res.headers.get('content-type')||'';
  return type.includes('application/json')?res.json():res.blob();
}
export const api = {
  register: body=>request('/auth/register',{method:'POST',body:JSON.stringify(body)}),
  login: body=>request('/auth/login',{method:'POST',body:JSON.stringify(body)}),
  forgot: body=>request('/auth/forgot-password',{method:'POST',body:JSON.stringify(body)}),
  profile: ()=>request('/profile'),
  updateProfile: body=>request('/profile',{method:'PUT',body:JSON.stringify(body)}),
  dashboard: ()=>request('/dashboard'),
  candidates: (q='')=>request(`/candidates${q?`?${q}`:''}`),
  candidate: id=>request(`/candidates/${id}`),
  createCandidate: body=>request('/candidates',{method:'POST',body:JSON.stringify(body)}),
  updateCandidate: (id,body)=>request(`/candidates/${id}`,{method:'PUT',body:JSON.stringify(body)}),
  deleteCandidate: id=>request(`/candidates/${id}`,{method:'DELETE'}),
  verify: (id,body)=>request(`/candidates/${id}/verification`,{method:'PUT',body:JSON.stringify(body)}),
  hire: id=>request(`/candidates/${id}/hire`,{method:'PUT'}),
  verifyOffer: (id,body)=>request(`/candidates/${id}/offer-verification`,{method:'PUT',body:JSON.stringify(body)}),
  upload: (id,type,file)=>{const f=new FormData();f.append('file',file);f.append('type',type);return request(`/candidates/${id}/documents`,{method:'POST',body:f});},
  report: id=>request(`/reports/candidate/${id}`),
  notifications: ()=>request('/notifications'),
  audits: ()=>request('/audit-logs'),
  users: ()=>request('/admin/users'),
  createUser: body=>request('/admin/users',{method:'POST',body:JSON.stringify(body)}),
};
