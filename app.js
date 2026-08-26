(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  $('#navToggle')?.addEventListener('click', () => $('.nav').classList.toggle('open'));
  $$('.nav a').forEach(a => a.addEventListener('click', () => $('.nav').classList.remove('open')));

  $$('.role-tab').forEach(btn => btn.addEventListener('click', () => {
    $$('.role-tab').forEach(x => x.classList.remove('active'));
    $$('.role-panel').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    $('#role-' + btn.dataset.role).classList.add('active');
  }));

  function calcResources(){
    const nr=+$('#nResource').value||0, nt=+$('#nTech').value||0, np=+$('#nPilot').value||0;
    const p=Math.max(0,Math.min(1,+$('#pE1').value||0));
    const untouched=Math.max(0,nr-nt-np), expected=untouched*p;
    $('#formalUntouched').textContent=untouched.toFixed(0);
    $('#e1Expected').textContent=expected.toFixed(1);
    let msg='';
    if(nr<20) msg='资源 Gate：停止正式机制旗舰。';
    else if(nr<40) msg='仅适合技术/生物学先导；正式确认需增加中心。';
    else if(untouched<40) msg='扣除独立 TECH/PILOT 后不足 40：单中心正式确认数学上不可行。';
    else if(expected<40) msg='保守预计 E1 可分析患者不足 40：需多中心或降级。';
    else msg='达到单中心最低规划线，但仍需 L2–L4 后续 Gate 与签署 SAP。';
    $('#resourceDecision').textContent=msg;
  }
  ['nResource','nTech','nPilot','pE1'].forEach(id => $('#'+id)?.addEventListener('input',calcResources)); calcResources();

  const toast=(msg)=>{const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1400)};
  $$('.copy-btn').forEach(b=>b.addEventListener('click', async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);toast('已复制')}catch(e){toast('浏览器未允许自动复制')}}));

  const checks = [
    '可以批量盘点现有约 110 名 A 层候选患者',
    'patient—episode—lesion—specimen—block 可建立稳定键',
    '受控身份映射与分析工作区物理/权限分离',
    '同一标本全部蜡块可盘点，不限于诊断代表块',
    '第二病理医师可对所有拟进入 E1 的 near-L 独立复核',
    '诊断安全余量可锁定，病理负责人拥有停止切取权',
    '可实施 HGD exclusion buffer 与 sandwich H&E',
    '可进行显微切割/激光捕获与患者特异克隆回测',
    '每个平台可提供批次、LOD、输入量和失败日志',
    '当前只批准 L0–L2，L2 通过后才批准 L3',
    '正式队列只有在保守 N_E1_expected ≥40 或已落实多中心时才批准',
    'Delta_target 在 L4 生物学结果揭盲前冻结'
  ];
  const list=$('#meetingChecklist');
  checks.forEach((txt,i)=>{const id='ck'+i;const label=document.createElement('label');label.className='check-item';label.innerHTML=`<input type="checkbox" id="${id}"><span>${txt}</span>`;list.appendChild(label);const inp=$('#'+id);inp.checked=localStorage.getItem('25f_'+id)==='1';inp.addEventListener('change',()=>localStorage.setItem('25f_'+id,inp.checked?'1':'0'));});
  $('#resetChecks')?.addEventListener('click',()=>{$$('.check-item input').forEach(inp=>{inp.checked=false;localStorage.removeItem('25f_'+inp.id)});toast('已重置')});

  const docs=window.SOURCE_DOCS||[];
  let activeDoc=null, currentView='rendered';
  function kindLabel(k){return k==='markdown'?'方案文档':k==='tsv'?'数据表':'文本'}
  function renderList(filter=''){
    const q=filter.trim().toLowerCase();
    const hits=docs.filter(d=>!q || (d.title+' '+d.path+' '+d.raw).toLowerCase().includes(q));
    $('#searchCount').textContent=`${hits.length}/${docs.length}`;
    const box=$('#docList');box.innerHTML='';
    hits.forEach(d=>{const b=document.createElement('button');b.className='doc-item'+(activeDoc?.id===d.id?' active':'');b.innerHTML=`<b>${escapeHTML(d.title)}</b><small>${escapeHTML(d.path)}</small>`;b.addEventListener('click',()=>openDoc(d));box.appendChild(b)});
    if(q && hits.length && (!activeDoc || !hits.some(d=>d.id===activeDoc.id))) openDoc(hits[0], false);
  }
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function openDoc(d, refresh=true){activeDoc=d;$('#docType').textContent=kindLabel(d.kind);$('#docTitle').textContent=d.title;$('#docPath').textContent=d.path;$('#docRendered').innerHTML=d.html;$('#docRaw').textContent=d.raw;if(refresh)renderList($('#docSearch').value);setView(currentView);}
  function setView(v){currentView=v;$$('.view-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===v));$('#docRendered').hidden=v!=='rendered';$('#docRaw').hidden=v!=='raw';}
  $$('.view-btn').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  $('#docSearch')?.addEventListener('input',e=>renderList(e.target.value));
  renderList(); if(docs.length) openDoc(docs[0]);
})();