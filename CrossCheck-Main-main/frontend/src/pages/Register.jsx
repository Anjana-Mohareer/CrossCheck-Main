import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {Eye,EyeOff,ShieldCheck,UserPlus} from 'lucide-react';
import Logo from '../components/Logo';
import {useAuth} from '../context/AuthContext';

const initial={name:'',email:'',role:'RECRUITER',password:'',confirmPassword:''};

export default function Register(){
 const [form,setForm]=useState(initial);
 const [show,setShow]=useState(false);
 const [showConfirm,setShowConfirm]=useState(false);
 const [error,setError]=useState('');
 const [busy,setBusy]=useState(false);
 const {register}=useAuth();
 const navigate=useNavigate();
 const update=e=>setForm({...form,[e.target.name]:e.target.value});
 const submit=async e=>{
  e.preventDefault();setError('');
  if(form.name.trim().length<2)return setError('Please enter a valid full name.');
  if(form.password.length<8)return setError('Password must contain at least 8 characters.');
  if(!/[A-Z]/.test(form.password)||!/[a-z]/.test(form.password)||!/[0-9]/.test(form.password))return setError('Password must include uppercase, lowercase and a number.');
  if(form.password!==form.confirmPassword)return setError('Passwords do not match.');
  setBusy(true);
  try{await register({name:form.name.trim(),email:form.email.trim(),role:form.role,password:form.password});navigate('/app');}
  catch(err){setError(err.message?.replace(/^"|"$/g,'')||'Registration failed. Please try again.');}
  finally{setBusy(false);}
 };
 return <div className="auth-page">
  <div className="auth-brand">
   <Logo light/>
   <div><span className="eyebrow">CREATE YOUR WORKSPACE ACCESS</span><h1>Join CrossCheck.<br/>Build trusted teams.</h1><p>Register securely as an administrator, HR professional or recruiter and begin managing candidate verification.</p></div>
   <div className="auth-points"><span><ShieldCheck/> Secure account creation</span><span><ShieldCheck/> Role-based workspace access</span><span><ShieldCheck/> Traceable user activity</span></div>
  </div>
  <div className="auth-panel register-panel">
   <form onSubmit={submit}>
    <div className="auth-title-icon"><UserPlus/><div><h2>Create account</h2><p>Enter your details to register.</p></div></div>
    {error&&<div className="error">{error}</div>}
    <label>Full name<input name="name" value={form.name} onChange={update} placeholder="Enter your full name" required maxLength="80"/></label>
    <label>Email address<input name="email" value={form.email} onChange={update} type="email" placeholder="name@company.com" required maxLength="120"/></label>
    <label>Register as<select name="role" value={form.role} onChange={update} required><option value="RECRUITER">Recruiter</option><option value="HR">HR</option><option value="ADMIN">Admin</option></select></label>
    <label>Password<div className="password"><input name="password" value={form.password} onChange={update} type={show?'text':'password'} placeholder="Minimum 8 characters" required/><button type="button" aria-label="Show password" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div></label>
    <label>Confirm password<div className="password"><input name="confirmPassword" value={form.confirmPassword} onChange={update} type={showConfirm?'text':'password'} placeholder="Re-enter your password" required/><button type="button" aria-label="Show confirm password" onClick={()=>setShowConfirm(!showConfirm)}>{showConfirm?<EyeOff/>:<Eye/>}</button></div></label>
    <small className="password-help">Use uppercase, lowercase and a number.</small>
    <button className="btn full" disabled={busy}>{busy?'Creating account…':'Create Account'}</button>
    <div className="auth-switch">Already registered? <Link to="/login">Login here</Link></div>
    <Link className="back" to="/">← Back to home</Link>
   </form>
  </div>
 </div>;
}
