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
  if(form.name.trim().length<2)return setError('Please Enter A Valid Full Name.');
  if(form.password.length<8)return setError('Password Must Contain At Least 8 Characters.');
  if(!/[A-Z]/.test(form.password)||!/[a-z]/.test(form.password)||!/[0-9]/.test(form.password))return setError('Password Must Include Uppercase, Lowercase And A Number.');
  if(form.password!==form.confirmPassword)return setError('Passwords Do Not Match.');
  setBusy(true);
  try{await register({name:form.name.trim(),email:form.email.trim(),role:form.role,password:form.password});navigate('/app');}
  catch(err){setError(err.message?.replace(/^"|"$/g,'')||'Registration Failed. Please Try Again.');}
  finally{setBusy(false);}
 };
 return <div className="auth-page">
  <div className="auth-brand">
   <Logo light/>
   <div><span className="eyebrow">CREATE YOUR WORKSPACE ACCESS</span><h1>Join CrossCheck.<br/>Build Trusted Teams.</h1><p>Register Securely As An Administrator, HR Professional Or Recruiter And Begin Managing Candidate Verification.</p></div>
   <div className="auth-points"><span><ShieldCheck/> Secure Account Creation</span><span><ShieldCheck/> Role-Based Workspace Access</span><span><ShieldCheck/> Traceable User Activity</span></div>
  </div>
  <div className="auth-panel register-panel">
   <form onSubmit={submit}>
    <div className="auth-title-icon"><UserPlus/><div><h2>Create Account</h2><p>Enter Your Details To Register.</p></div></div>
    {error&&<div className="error">{error}</div>}
    <label>Full Name<input name="name" value={form.name} onChange={update} placeholder="Enter Your Full Name" required maxLength="80"/></label>
    <label>Email Address<input name="email" value={form.email} onChange={update} type="email" placeholder="name@company.com" required maxLength="120"/></label>
    <label>Register As<select name="role" value={form.role} onChange={update} required><option value="RECRUITER">Recruiter</option><option value="HR">HR</option><!--<option value="ADMIN">Admin</option>--></select></label>
    <label>Password<div className="password"><input name="password" value={form.password} onChange={update} type={show?'text':'password'} placeholder="Minimum 8 Characters" required/><button type="button" aria-label="Show Password" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div></label>
    <label>Confirm Password<div className="password"><input name="confirmPassword" value={form.confirmPassword} onChange={update} type={showConfirm?'text':'password'} placeholder="Re-Enter Your Password" required/><button type="button" aria-label="Show Confirm Password" onClick={()=>setShowConfirm(!showConfirm)}>{showConfirm?<EyeOff/>:<Eye/>}</button></div></label>
    <small className="password-help">Use Uppercase, Lowercase And A Number.</small>
    <button className="btn full" disabled={busy}>{busy?'Creating Account…':'Create Account'}</button>
    <div className="auth-switch">Already Registered? <Link to="/login">Login Here</Link></div>
    <Link className="back" to="/">← Back To Home</Link>
   </form>
  </div>
 </div>;
}
