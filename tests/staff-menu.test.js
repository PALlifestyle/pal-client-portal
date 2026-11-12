// Regression test: staff home menu blocks must always be visible, in order, in any load order, at phone size,
// and every menu must start CLOSED when the app opens, even if it was left open last time.
const {chromium}=require('playwright');const file=process.argv[2]||require('path').resolve(__dirname,'../index.html');
(async()=>{const b=await chromium.launch();let fail=0;
for(const scen of ['afterAP','afterXero','beforeAP']) for(const apOpen of [false,true]){
 const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
 await p.addInitScript(o=>{try{localStorage.setItem('clpV1','1');localStorage.setItem('clpV2','1');localStorage.setItem('clpOpen',JSON.stringify({AP:o,ACT:o,TEAM:o,REV:o}));localStorage.setItem('svcOpen',JSON.stringify(o?{'B|svcS_home':true,'B|svcS_pet':true,'B|svcS_proj':true,'B|svcS_rec':true,'B|svcS_mg':true}:{}));}catch(e){}},apOpen);
 await p.goto('file://'+file);await p.waitForTimeout(600);
 const r=await p.evaluate(async(scen)=>{const tab=document.getElementById('tabStaffDashboard');document.querySelectorAll('.tab-pane').forEach(t=>t.classList.remove('active'));tab.classList.add('active');let e0=tab;while(e0&&e0!==document.body){e0.style.display='block';e0=e0.parentElement;}
  isAdminUser=()=>true;meId=()=>'STAFF001';staffAllowed=()=>null;xeroCall=async()=>({success:true,items:[],plans:[],staff:[],hours:[],invoices:[],budgets:{},costs:[],records:[],partners:[]});fetchAllProjects=async()=>[];
  const pal=document.getElementById('staffKanbanPal');const h=document.createElement('div');h.id='staffApTitle';h.className='section-title';h.textContent='ACTION PLAN';pal.previousElementSibling.before(h);
  const cli=document.getElementById('staffKanbanClient');const cal=document.getElementById('calDayDetail');let at=cal;[h,pal.previousElementSibling,pal,cli.previousElementSibling,cli].forEach(e=>{at.after(e);at=e;});
  const xero=document.createElement('div');xero.innerHTML='<div class="section-title">XERO</div><div>x</div>';tab.append(xero);
  const mk=(id,t)=>{const d=document.createElement('div');d.id=id;d.innerHTML='<div class="section-title">'+t+'</div><div>body</div>';return d;};
  const blocks=[mk('actCard','ACTIONS'),mk('tmBox','TEAM'),mk('staffReviews','REVIEWS')];
  const unk=document.createElement('div');unk.id='unknownBox';unk.innerHTML='<div class="section-title">PROPERTY CARE</div><div>damage</div>';at.after(unk);
  const extras=['spDash','invDash','linDash','xeroDash'].map(id=>{const d=document.createElement('div');d.id=id;d.innerHTML='<div class="section-title">'+id+'</div><div>content</div>';return d;});
  extras.forEach(d=>{at.after(d);at=d;});
  if(scen==='afterAP')blocks.forEach(d=>{at.after(d);at=d;});else if(scen==='afterXero')blocks.forEach(d=>tab.append(d));else blocks.forEach(d=>h.before(d));
  try{svcApply('S');}catch(e){}await new Promise(r=>setTimeout(r,700));
  const heads=[...tab.querySelectorAll('.clpHead,.svcHead')].filter(x=>x.offsetParent).map(x=>x.textContent.replace(/[^A-Z ]/g,'').trim());
  const hiddenExtras=['spDash','invDash','linDash','xeroDash'].filter(id=>{const e=document.getElementById(id);return !e.offsetParent&&!e.closest('.svcBlk');});
  if(document.getElementById('unknownBox').classList.contains('svcHid'))hiddenExtras.push('unknownBox');
  const openAtStart=[...tab.querySelectorAll('.svcBlk')].filter(b=>!b.classList.contains('svcClosed')).map(b=>'OPEN:'+b.id).concat([...tab.querySelectorAll('.clpHead.svcTO')].map(t=>'OPEN:'+t.textContent.replace(/[^A-Z ]/g,'').trim()));
  return heads.concat(hiddenExtras.map(x=>'HIDDEN:'+x)).concat(openAtStart);},scen);
 const want=['ACTION PLAN','ACTIONS','HOME MANAGEMENT','PET CARE','PERSONAL PROJECTS','RECOMMENDED','MANAGEMENT','TEAM','REVIEWS'];
 const ok=JSON.stringify(r)===JSON.stringify(want)&&!errs.length;if(!ok)fail++;
 console.log((ok?'PASS':'FAIL'),scen,'AP open:'+apOpen,ok?'':JSON.stringify(r)+' '+errs.join('|'));await p.close();}
await b.close();console.log(fail?'REGRESSION FAILED':'ALL PASS');process.exit(fail?1:0);})();
