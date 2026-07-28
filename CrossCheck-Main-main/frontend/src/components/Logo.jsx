import { ShieldCheck } from 'lucide-react';
export default function Logo({light=false}){return <div className={`logo ${light?'light':''}`}><span className="logo-mark"><ShieldCheck size={23}/></span><span><b>CrossCheck</b><small>Before You Hire</small></span></div>}
