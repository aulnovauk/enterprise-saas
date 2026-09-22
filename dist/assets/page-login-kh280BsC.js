import{r as i,i as k,k as z,j as e}from"./vendor-react-BcyhUrG9.js";import{C,I as W}from"./page-dashboard-I95rO4qd.js";const u="solarops-session",A=["admin","admin@solar.com","admin@solarops.io"],B={password:"admin@123"},b={userId:"admin",name:"Admin User",email:"admin@solarops.io",initials:"AM"};function v(){return[window.localStorage,window.sessionStorage]}function S(){if(typeof window>"u")return null;for(const o of v())try{const s=o.getItem(u);if(s)return JSON.parse(s)}catch{}return null}function R(o,s,a){const n=o.trim().toLowerCase();if(!A.includes(n)||s!==B.password)return null;const l={...b,email:n.includes("@")?n:b.email,loginAt:new Date().toISOString()};try{(a?window.localStorage:window.sessionStorage).setItem(u,JSON.stringify(l))}catch{}return F(),l}function T(){for(const o of v())try{o.removeItem(u)}catch{}F()}const g=new Set;function F(){g.forEach(o=>o())}function P(){const[o,s]=i.useState(()=>S());i.useEffect(()=>{const n=()=>s(S());return g.add(n),window.addEventListener("storage",n),()=>{g.delete(n),window.removeEventListener("storage",n)}},[]);const a=i.useCallback(()=>T(),[]);return{session:o,isAuthenticated:o!==null,logout:a}}const D=`
.sol-login-input {
  width: 100%;
  box-sizing: border-box;
  height: 48px;
  padding: 0 14px;
  font-family: inherit;
  font-size: 15px;
  color: #0F172A;
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: 10px;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.sol-login-input::placeholder { color: #94A3B8; }
.sol-login-input:focus {
  border-color: var(--brand-800);
  box-shadow: 0 0 0 3px rgba(18,48,126,.16);
}
.sol-login-primary {
  height: 50px;
  width: 100%;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background: var(--brand-800);
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(18,48,126,.26);
  transition: background .15s ease;
}
.sol-login-primary:hover { background: var(--brand-700); }
.sol-login-primary:disabled { opacity: .72; cursor: default; }
.sol-login-secondary {
  height: 50px;
  width: 100%;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: #0F172A;
  background: #FFFFFF;
  border: 1px solid #CBD5E1;
  border-radius: 10px;
  cursor: pointer;
  transition: background .15s ease;
}
.sol-login-secondary:hover { background: #F8FAFC; }
.sol-login-link { color: var(--brand-800); text-decoration: none; }
.sol-login-link:hover { color: var(--brand-700); }
`;function H(){var y;const o=k(),a=((y=z().state)==null?void 0:y.from)??"/",[n,l]=i.useState(""),[d,j]=i.useState(""),[x,w]=i.useState(!1),[c,I]=i.useState(!0),[h,r]=i.useState(""),[p,f]=i.useState(!1),m=i.useRef(void 0);i.useEffect(()=>()=>window.clearTimeout(m.current),[]);const E=t=>{if(t.preventDefault(),!p){if(!n.trim()){r("Enter your user ID.");return}if(!d){r("Enter your password.");return}r(""),f(!0),m.current=window.setTimeout(()=>{if(!R(n,d,c)){f(!1),r("Invalid user ID or password. Please try again.");return}o(a,{replace:!0})},600)}};return e.jsxs("div",{style:{width:"100%",minHeight:"100vh",background:"#FFFFFF",display:"flex",flexWrap:"wrap",alignItems:"stretch",fontFamily:"'Inter', system-ui, sans-serif"},children:[e.jsx("style",{children:D}),e.jsxs("div",{style:{flex:"1 1 380px",maxWidth:600,minWidth:0,boxSizing:"border-box",background:"var(--brand-800)",color:"#FFFFFF",padding:"56px 48px 48px",display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative",overflow:"hidden"},children:[e.jsx("div",{style:{position:"absolute",width:520,height:520,borderRadius:"50%",background:"radial-gradient(circle at 30% 30%, rgba(245,158,11,.22), rgba(245,158,11,0) 65%)",top:220,left:-140}}),e.jsxs("div",{style:{position:"relative",display:"flex",alignItems:"center",gap:14},children:[e.jsx("img",{src:"/solarops-logo.svg",alt:"SolarOps",style:{height:46,width:"auto",borderRadius:10,display:"block"}}),e.jsxs("span",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("span",{style:{fontSize:21,fontWeight:700,letterSpacing:"-.01em"},children:"SolarOps"}),e.jsx("span",{style:{fontSize:13,color:"var(--brand-200)"},children:"Asset Monitoring Suite"})]})]}),e.jsxs("div",{style:{position:"relative",padding:"48px 0"},children:[e.jsx("div",{style:{fontSize:12,fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",color:"#F59E0B",marginBottom:18},children:"SOLAR ASSET PLATFORM"}),e.jsx("div",{style:{fontSize:40,fontWeight:600,lineHeight:1.2,letterSpacing:"-.02em",marginBottom:18,maxWidth:460,textWrap:"pretty"},children:"Centralized solar asset data management and monitoring."}),e.jsx("div",{style:{fontSize:16,lineHeight:1.55,color:"var(--brand-200)",maxWidth:440},children:"JMR capture, KPI governance, loss analytics and management MIS in one governed platform."})]}),e.jsx("div",{style:{position:"relative",display:"flex",flexWrap:"wrap",gap:44,borderTop:"1px solid rgba(255,255,255,.16)",paddingTop:26},children:[{value:"220 MW",label:"Installed capacity"},{value:"12",label:"Plants monitored"},{value:"FY 2026-27",label:"Active reporting year"}].map(t=>e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:26,fontWeight:600},children:t.value}),e.jsx("div",{style:{fontSize:13,color:"var(--brand-200)",marginTop:4},children:t.label})]},t.label))})]}),e.jsxs("div",{style:{flex:"1 1 520px",minWidth:0,padding:"40px 40px 32px",display:"flex",flexDirection:"column",minHeight:"min(100vh, 760px)",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:6,fontSize:13,color:"#64748B"},children:[e.jsx("span",{children:"Need access?"}),e.jsx("a",{href:"#",className:"sol-login-link",style:{fontWeight:500},children:"Contact administrator"})]}),e.jsxs("form",{onSubmit:E,style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",maxWidth:420,width:"100%",margin:"0 auto",padding:"32px 0"},children:[e.jsx("h1",{style:{fontSize:30,fontWeight:600,letterSpacing:"-.02em",color:"#0F172A",margin:"0 0 8px"},children:"Sign in"}),e.jsx("p",{style:{fontSize:15,color:"#64748B",margin:"0 0 32px"},children:"Use your account credentials to continue."}),h&&e.jsxs("div",{role:"alert",style:{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px",marginBottom:22,background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:10},children:[e.jsx("span",{style:{fontSize:13,fontWeight:700,color:"#B91C1C",lineHeight:1.5},children:"!"}),e.jsx("span",{style:{fontSize:13,lineHeight:1.5,color:"#991B1B"},children:h})]}),e.jsx("label",{htmlFor:"login-user",style:{display:"block",fontSize:13,fontWeight:600,color:"#334155",marginBottom:8},children:"User ID"}),e.jsx("input",{id:"login-user",type:"text",autoComplete:"username",autoFocus:!0,placeholder:"admin@solar.com",value:n,onChange:t=>{l(t.target.value),r("")},className:"sol-login-input",style:{marginBottom:20}}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8},children:[e.jsx("label",{htmlFor:"login-pass",style:{fontSize:13,fontWeight:600,color:"#334155"},children:"Password"}),e.jsx("a",{href:"#",className:"sol-login-link",style:{fontSize:13,fontWeight:500},children:"Forgot password?"})]}),e.jsxs("div",{style:{position:"relative",marginBottom:20},children:[e.jsx("input",{id:"login-pass",type:x?"text":"password",autoComplete:"current-password",placeholder:"Enter your password",value:d,onChange:t=>{j(t.target.value),r("")},className:"sol-login-input",style:{padding:"0 76px 0 14px"}}),e.jsx("button",{type:"button",onClick:()=>w(t=>!t),style:{position:"absolute",right:10,top:11,height:26,padding:"0 10px",fontFamily:"inherit",fontSize:12,fontWeight:600,color:"var(--brand-800)",background:"var(--brand-50)",border:0,borderRadius:6,cursor:"pointer"},children:x?"Hide":"Show"})]}),e.jsxs("button",{type:"button",onClick:()=>I(t=>!t),"aria-pressed":c,style:{display:"flex",alignItems:"center",gap:10,marginBottom:28,padding:0,background:"none",border:0,cursor:"pointer",fontFamily:"inherit",textAlign:"left"},children:[e.jsx("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:18,height:18,borderRadius:5,border:"1px solid #94A3B8",color:"#FFFFFF",background:c?"var(--brand-800)":"#FFFFFF"},children:c&&e.jsx(C,{size:12,strokeWidth:3})}),e.jsx("span",{style:{fontSize:14,color:"#475569"},children:"Remember this device for 30 days"})]}),e.jsx("button",{type:"submit",className:"sol-login-primary",disabled:p,children:p?"Signing in…":"Sign in"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:14,margin:"26px 0"},children:[e.jsx("span",{style:{flex:1,height:1,background:"#E2E8F0"}}),e.jsx("span",{style:{fontSize:12,fontWeight:600,letterSpacing:".12em",textTransform:"uppercase",color:"#64748B"},children:"or"}),e.jsx("span",{style:{flex:1,height:1,background:"#E2E8F0"}})]}),e.jsx("button",{type:"button",className:"sol-login-secondary",children:"Continue with SSO"}),e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:10,marginTop:26,padding:"14px 16px",background:"#F1F5F9",borderRadius:10},children:[e.jsx(W,{size:15,color:"var(--brand-800)",style:{flexShrink:0,marginTop:2}}),e.jsx("span",{style:{fontSize:13,lineHeight:1.5,color:"#475569"},children:"Role-based access. Every sign-in and data change is recorded in the audit trail."})]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",gap:20,fontSize:12,color:"#64748B",borderTop:"1px solid #EDF1F6",paddingTop:18},children:[e.jsx("span",{children:"© AulNova Techsoft Pvt. Ltd"}),e.jsx("span",{children:"v1.0 · Prototype"})]})]})]})}export{H as L,P as u};
