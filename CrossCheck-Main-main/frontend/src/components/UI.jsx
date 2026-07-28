export const Badge=({value})=><span className={`badge ${(value||'').toLowerCase().replaceAll(' ','-')}`}>{value}</span>;
export const Loader=()=> <div className="loader"><span></span><p>Loading Secure Hiring Data…</p></div>;
export const Empty=({text='No Records Found'})=><div className="empty">{text}</div>;
export const PageTitle=({title,subtitle,action})=><div className="page-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
