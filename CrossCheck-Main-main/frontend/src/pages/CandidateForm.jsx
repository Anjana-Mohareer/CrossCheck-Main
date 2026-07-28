import {useEffect,useRef,useState} from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import {Camera,FileBadge,ImagePlus,Trash2,UserRound,BriefcaseBusiness,GraduationCap,FileCheck2} from 'lucide-react';
import {api} from '../services/api';
import {PageTitle} from '../components/UI';
import {useAuth} from '../context/AuthContext';

import emailjs from "@emailjs/browser";

const init={name:'',photoData:'',photoFileName:'',email:'',mobileNumber:'',position:'',experienceYears:0,skills:'',education:'',currentCompany:'',previousCompany:'',noticePeriodDays:30,expectedSalary:0,currentSalary:0,degree:'',university:'',graduationYear:'',marks:'',joiningDate:'',relievingDate:'',candidateInterest:80,interviewFeedback:80,previousAcceptanceRate:75,aadhaarNumber:'',panNumber:'',passportNumber:'',aadhaarDocumentData:'',aadhaarDocumentName:'',panDocumentData:'',panDocumentName:'',passportDocumentData:'',passportDocumentName:'',identityStatus:'PENDING',offerCompanyName:'',offerCandidateName:'',offerPosition:'',offerReferenceNumber:'',offerSalary:'',offerDate:'',proposedJoiningDate:'',offerLetterData:'',offerLetterName:'',offerLetterStatus:'PENDING',offerVerificationRemarks:''};
const titleCase=v=>v.replace(/\b\w/g,ch=>ch.toUpperCase());

export default function CandidateForm(){
 const {user}=useAuth();const {id}=useParams();const [f,setF]=useState(init);const [busy,setBusy]=useState(false);const [photoError,setPhotoError]=useState('');const [docError,setDocError]=useState('');const photoInput=useRef(null);const nav=useNavigate();
 useEffect(()=>{if(id)api.candidate(id).then(x=>{const allowed=user?.role==='ADMIN'||Number(x.createdByUserId)===Number(user?.id);if(!allowed){alert('Only The User Who Added This Candidate Or An Admin Can Edit It.');nav(`/app/candidates/${id}`);return}setF({...init,...x})}).catch(err=>alert(err.message||'Unable To Load Candidate.'))},[id,user?.id,user?.role,nav]);
 const field=(k,label,type='text',props={})=>{const capitalize=props.capitalize;const clean={...props};delete clean.capitalize;return <label>{label}<input type={type} value={f[k]??''} onChange={e=>{let value=type==='number'?Number(e.target.value):e.target.value;if(capitalize)value=titleCase(value);setF({...f,[k]:value})}} {...clean}/></label>};
 const choosePhoto=e=>{const file=e.target.files?.[0];setPhotoError('');if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)){setPhotoError('Please select a JPG, PNG or WEBP image.');e.target.value='';return}if(file.size>3*1024*1024){setPhotoError('Candidate photo must be 3 MB or smaller.');e.target.value='';return}const reader=new FileReader();reader.onload=()=>setF(v=>({...v,photoData:reader.result,photoFileName:file.name}));reader.onerror=()=>setPhotoError('Unable to read the selected photo.');reader.readAsDataURL(file)};
 const removePhoto=()=>{setF(v=>({...v,photoData:'',photoFileName:''}));if(photoInput.current)photoInput.current.value=''};
 const chooseIdentityDoc=(e,dataKey,nameKey)=>{const file=e.target.files?.[0];setDocError('');if(!file)return;const allowed=['application/pdf','image/jpeg','image/png','image/webp'];if(!allowed.includes(file.type)){setDocError('Identity documents must be PDF, JPG, PNG or WEBP.');e.target.value='';return}if(file.size>4*1024*1024){setDocError('Each identity document must be 4 MB or smaller.');e.target.value='';return}const reader=new FileReader();reader.onload=()=>setF(v=>({...v,[dataKey]:reader.result,[nameKey]:file.name,identityStatus:'PENDING'}));reader.onerror=()=>setDocError('Unable to read the selected identity document.');reader.readAsDataURL(file)};
 const chooseOfferLetter=e=>{const file=e.target.files?.[0];setDocError('');if(!file)return;const allowed=['application/pdf','image/jpeg','image/png','image/webp'];if(!allowed.includes(file.type)){setDocError('Offer Letter Must Be PDF, JPG, PNG Or WEBP.');e.target.value='';return}if(file.size>5*1024*1024){setDocError('Offer Letter Must Be 5 MB Or Smaller.');e.target.value='';return}const reader=new FileReader();reader.onload=()=>setF(v=>({...v,offerLetterData:reader.result,offerLetterName:file.name,offerLetterStatus:'PENDING',offerVerifiedBy:'',offerVerifiedAt:null}));reader.onerror=()=>setDocError('Unable To Read The Selected Offer Letter.');reader.readAsDataURL(file)};

 const sendCandidateEmail = async () => {
  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        user_name: f.name,
        user_email: f.email,
        user_phone: f.mobileNumber,
        position: f.position,
        company: f.currentCompany,
      },
      {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      }
    );
  } catch (error) {
    console.error("Email failed:", error);
  }
};

const submit = async (e) => {
  e.preventDefault();

  if (f.aadhaarNumber && !/^\d{12}$/.test(f.aadhaarNumber)) {
    alert("Aadhaar number must contain exactly 12 digits.");
    return;
  }

  if (f.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(f.panNumber)) {
    alert("PAN must use the format ABCDE1234F.");
    return;
  }

  setBusy(true);

  try {
    const c = id
      ? await api.updateCandidate(id, f)
      : await api.createCandidate(f);

    // Send Email
    await sendCandidateEmail();

    // Navigate after successful save and email
    nav(`/app/candidates/${c.id}`);

  } catch (err) {
    console.error(err);
    alert(err.message || "Unable to save candidate.");
  } finally {
    setBusy(false);
  }
};

 
 const identityUpload=(title,dataKey,nameKey)=><label className="identity-upload"><span>{title}</span><input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={e=>chooseIdentityDoc(e,dataKey,nameKey)}/><small>{f[nameKey]||'No File Selected'}</small>{f[dataKey]&&<button type="button" className="text-button" onClick={()=>setF(v=>({...v,[dataKey]:'',[nameKey]:'',identityStatus:'PENDING'}))}>Remove</button>}</label>;
 return <><PageTitle title={id?'Edit Candidate':'Add Candidate'} subtitle="Capture Candidate, Offer Letter, Employment, Education And Identity Information For Verification And Risk Analysis."/><form className="panel candidate-form" onSubmit={submit}>
 <nav className="candidate-form-sections" aria-label="Candidate Form Sections"><a href="#candidate-information">Candidate Information</a><a href="#offer-letter-verification">Offer Letter Verification</a><a href="#employment-verification">Employment Verification</a><a href="#education-verification">Education Verification</a><a href="#identity-verification">Identity Verification</a></nav>
 <section className="candidate-photo-editor"><div className="candidate-photo-preview">{f.photoData?<img src={f.photoData} alt={`${f.name||'Candidate'} profile`}/>:<Camera/>}</div><div><h3>Candidate Photo</h3><p>Upload A Clear Profile Photo. JPG, PNG Or WEBP Up To 3 MB.</p><input ref={photoInput} className="hidden-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto}/><div className="photo-buttons"><button type="button" className="btn secondary" onClick={()=>photoInput.current?.click()}><ImagePlus size={16}/>{f.photoData?'Change Photo':'Upload Photo'}</button>{f.photoData&&<button type="button" className="btn danger" onClick={removePhoto}><Trash2 size={16}/>Remove</button>}</div>{photoError&&<small className="photo-error">{photoError}</small>}</div></section>
 <div id="candidate-information"><FormSection icon={<UserRound/>} title="Candidate Information"><div className="section-fields">{field('name','Full Name','text',{capitalize:true})}{field('email','Email Address','email',{placeholder:'candidate@example.com'})}{field('mobileNumber','Mobile Number')}{field('position','Position / Role','text',{capitalize:true})}{field('experienceYears','Experience (Years)','number')}{field('skills','Skills (Comma Separated)','text',{capitalize:true})}{field('education','Highest Education','text',{capitalize:true})}{field('noticePeriodDays','Notice Period (Days)','number')}{field('currentSalary','Current Salary','number')}{field('expectedSalary','Expected Salary','number')}</div></FormSection></div>
 <div id="employment-verification"><FormSection icon={<BriefcaseBusiness/>} title="Employment Verification Details"><div className="section-fields">{field('currentCompany','Current Company','text',{capitalize:true})}{field('previousCompany','Previous Company','text',{capitalize:true})}{field('joiningDate','Current Joining Date','date')}{field('relievingDate','Previous Relieving Date','date')}</div></FormSection></div>
 <div id="education-verification"><FormSection icon={<GraduationCap/>} title="Education Verification Details"><div className="section-fields">{field('degree','Degree','text',{capitalize:true})}{field('university','University','text',{capitalize:true})}{field('graduationYear','Year')}{field('marks','Marks / CGPA')}</div></FormSection></div>
 <section id="offer-letter-verification" className="form-section offer-form-section"><div className="section-inline-title"><FileCheck2/><div><h3>Offer Letter Verification</h3><p>Upload The Offer Letter And Enter The Details Printed On It. The Status Will Remain Pending Until An Authorized User Reviews The Document.</p></div></div><div className="section-fields offer-fields">{field('offerCompanyName','Company Name On Offer','text',{capitalize:true})}{field('offerCandidateName','Candidate Name On Offer','text',{capitalize:true})}{field('offerPosition','Position On Offer','text',{capitalize:true})}{field('offerReferenceNumber','Offer Reference Number')}{field('offerSalary','Offered Salary')}{field('offerDate','Offer Date','date')}{field('proposedJoiningDate','Proposed Joining Date','date')}</div><label className="identity-upload offer-upload"><span>Upload Offer Letter</span><input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={chooseOfferLetter}/><small>{f.offerLetterName||'No File Selected'}</small>{f.offerLetterData&&<button type="button" className="text-button" onClick={()=>setF(v=>({...v,offerLetterData:'',offerLetterName:'',offerLetterStatus:'PENDING'}))}>Remove</button>}</label><div className="identity-note">The Backend Stores The Document And Review Result Only. It Does Not Mark The Offer Letter Verified Automatically.</div></section>
 <section id="identity-verification" className="form-section identity-form-section"><div className="section-inline-title"><FileBadge/><div><h3>Identity Verification</h3><p>Enter The Candidate’s Identity Numbers And Upload Supporting Documents. Identity Details Are Stored Only After HR Enters Them.</p></div></div><div className="identity-fields">{field('aadhaarNumber','Aadhaar Number','text',{inputMode:'numeric',maxLength:12,placeholder:'12-Digit Aadhaar Number'})}{field('panNumber','PAN Number','text',{maxLength:10,placeholder:'ABCDE1234F',onChange:e=>setF({...f,panNumber:e.target.value.toUpperCase()})})}{field('passportNumber','Passport Number','text',{maxLength:12,placeholder:'Passport Number'})}</div><div className="identity-upload-grid">{identityUpload('Upload Aadhaar Card','aadhaarDocumentData','aadhaarDocumentName')}{identityUpload('Upload PAN Card','panDocumentData','panDocumentName')}{identityUpload('Upload Passport','passportDocumentData','passportDocumentName')}</div>{docError&&<small className="photo-error">{docError}</small>}<div className="identity-note">Identity Status Remains <b>Pending</b> Until HR Or Admin Reviews It.</div></section>
 <div className="form-actions"><button type="button" className="btn secondary" onClick={()=>nav(-1)}>Cancel</button><button className="btn" disabled={busy}>{busy?'Saving…':'Save Candidate'}</button></div></form></>;
}
function FormSection({icon,title,children}){return <section className="form-section"><div className="section-inline-title">{icon}<div><h3>{title}</h3><p>Complete All Applicable Details For Accurate Verification.</p></div></div>{children}</section>}

