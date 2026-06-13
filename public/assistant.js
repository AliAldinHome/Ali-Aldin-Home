(function(){
/* ═══════════════════════════════════════════
   HEARTLAND ASSISTANT — no API, no cost
   Knowledge base + calculators + lead capture
═══════════════════════════════════════════ */

var css = ''
+'#hl-launch{position:fixed;bottom:22px;right:22px;width:60px;height:60px;border-radius:50%;background:#1F1F1F;border:none;cursor:pointer;z-index:99998;box-shadow:0 10px 30px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;transition:transform .2s;}'
+'#hl-launch:hover{transform:scale(1.06);}'
+'#hl-panel{position:fixed;bottom:94px;right:22px;width:380px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 130px);background:#FAF8F6;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.18);z-index:99999;display:none;flex-direction:column;overflow:hidden;border:1px solid #E4DFD8;}'
+'#hl-panel.open{display:flex;animation:hlUp .25s ease;}'
+'@keyframes hlUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}'
+'#hl-head{background:#1F1F1F;padding:16px 20px 13px;}'
+'#hl-head .t1{font-family:Montserrat,sans-serif;font-size:8px;letter-spacing:.4em;color:#C9A96E;text-transform:uppercase;}'
+'#hl-head .t2{font-family:Montserrat,sans-serif;font-size:15px;font-weight:500;letter-spacing:.12em;color:#fff;text-transform:uppercase;margin-top:2px;}'
+'#hl-head .t3{font-family:Montserrat,sans-serif;font-size:9px;color:rgba(255,255,255,.45);margin-top:5px;line-height:1.5;}'
+'#hl-close{position:absolute;top:14px;right:14px;background:none;border:none;color:rgba(255,255,255,.6);font-size:20px;cursor:pointer;line-height:1;}'
+'#hl-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}'
+'.hl-m{max-width:85%;padding:11px 14px;border-radius:14px;font-family:Montserrat,sans-serif;font-size:14px;line-height:1.65;font-weight:300;white-space:pre-line;}'
+'.hl-bot{background:#fff;border:1px solid #E4DFD8;color:#1F1F1F;align-self:flex-start;border-bottom-left-radius:4px;}'
+'.hl-user{background:rgba(201,169,110,.16);border:1px solid rgba(201,169,110,.3);color:#1F1F1F;align-self:flex-end;border-bottom-right-radius:4px;}'
+'.hl-chips{display:flex;flex-wrap:wrap;gap:7px;align-self:flex-start;max-width:95%;}'
+'.hl-chip{background:#fff;border:1.5px solid #C9A96E;color:#1F1F1F;border-radius:999px;padding:8px 14px;font-family:Montserrat,sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;}'
+'.hl-chip:hover{background:#1F1F1F;color:#fff;border-color:#1F1F1F;}'
+'.hl-typing{display:flex;gap:4px;padding:12px 14px;background:#fff;border:1px solid #E4DFD8;border-radius:14px;border-bottom-left-radius:4px;align-self:flex-start;}'
+'.hl-typing span{width:6px;height:6px;border-radius:50%;background:#C9A96E;animation:hlB 1s infinite;}'
+'.hl-typing span:nth-child(2){animation-delay:.15s}.hl-typing span:nth-child(3){animation-delay:.3s}'
+'@keyframes hlB{0%,60%,100%{opacity:.3}30%{opacity:1}}'
+'#hl-inrow{display:flex;gap:8px;padding:12px;border-top:1px solid #E4DFD8;background:#F7F5F3;}'
+'#hl-in{flex:1;border:1.5px solid #E4DFD8;border-radius:999px;padding:11px 16px;font-family:Montserrat,sans-serif;font-size:16px;font-weight:300;outline:none;background:#fff;}'
+'#hl-in:focus{border-color:#C9A96E;}'
+'#hl-send{width:44px;height:44px;border-radius:50%;background:#1F1F1F;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}'
+'#hl-send:hover{background:#B89455;}'
+'#hl-foot{text-align:center;font-family:Montserrat,sans-serif;font-size:8px;letter-spacing:.14em;color:#999;text-transform:uppercase;padding:7px;background:#F7F5F3;}'
+'#hl-tip{position:fixed;bottom:30px;right:92px;background:#1F1F1F;color:#fff;font-family:Montserrat,sans-serif;font-size:13px;font-weight:400;padding:11px 16px;border-radius:14px;border-bottom-right-radius:4px;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:99997;max-width:210px;line-height:1.5;cursor:pointer;animation:hlTipIn .4s ease;}'+'#hl-tip::after{content:"";position:absolute;right:-7px;bottom:10px;border-top:7px solid transparent;border-bottom:7px solid transparent;border-left:8px solid #1F1F1F;}'+'#hl-tip .x{position:absolute;top:-7px;right:-7px;width:20px;height:20px;background:#C9A96E;border-radius:50%;color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center;}'+'@keyframes hlTipIn{from{opacity:0;transform:translateX(10px);}to{opacity:1;transform:translateX(0);}}'+'@media(max-width:480px){#hl-tip{max-width:160px;font-size:12px;bottom:30px;right:88px;}}'
+'@media(max-width:480px){#hl-panel{right:16px;left:16px;width:auto;bottom:88px;height:calc(100vh - 160px);}}';

var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

var launch=document.createElement('button');
launch.id='hl-launch';launch.setAttribute('aria-label','Open Heartland Assistant');
launch.innerHTML='<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#C9A96E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 14.2c-2.2-1.6-3.4-2.8-3.4-4 0-1 .8-1.6 1.6-1.6.7 0 1.4.5 1.8 1.2.4-.7 1.1-1.2 1.8-1.2.8 0 1.6.6 1.6 1.6 0 1.2-1.2 2.4-3.4 4z" fill="#C9A96E"/></svg>';
document.body.appendChild(launch);

var panel=document.createElement('div');
panel.id='hl-panel';
panel.innerHTML='<div id="hl-head"><div class="t1">The Heartland</div><div class="t2">Assistant</div><div class="t3">General information only — not financial, legal, or mortgage advice.</div><button id="hl-close" aria-label="Close">×</button></div><div id="hl-msgs"></div><div id="hl-inrow"><input id="hl-in" placeholder="Ask a question…" aria-label="Your question"/><button id="hl-send" aria-label="Send"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div id="hl-foot">The Heartland Agent · Ali Aldin · Right at Home Realty</div>';
document.body.appendChild(panel);

var msgs=document.getElementById('hl-msgs');
var input=document.getElementById('hl-in');
var pending=null;var opened=false;

/* ── helpers ── */
function fmt(n){return '$'+Math.round(n).toLocaleString('en-CA');}
function scroll(){msgs.scrollTop=msgs.scrollHeight;}
function user(t){var d=document.createElement('div');d.className='hl-m hl-user';d.textContent=t;msgs.appendChild(d);scroll();}
function bot(t,chips){
  var ty=document.createElement('div');ty.className='hl-typing';ty.innerHTML='<span></span><span></span><span></span>';
  msgs.appendChild(ty);scroll();
  setTimeout(function(){
    ty.remove();
    var d=document.createElement('div');d.className='hl-m hl-bot';d.textContent=t;msgs.appendChild(d);
    if(chips&&chips.length){var c=document.createElement('div');c.className='hl-chips';
      chips.forEach(function(ch){var b=document.createElement('button');b.className='hl-chip';b.textContent=ch;
        b.onclick=function(){c.remove();user(ch);route(ch);};c.appendChild(b);});
      msgs.appendChild(c);}
    scroll();
  },550);
}
var HOME_CHIPS=['💰 Down payment','🏠 Land transfer tax','📋 Closing costs','📈 Current rates','💬 Talk to Ali'];

/* ── calculators ── */
function minDown(p){if(p>=1500000)return p*0.20;if(p<=500000)return p*0.05;return 25000+(p-500000)*0.10;}
function cmhcRate(dp){if(dp>=0.20)return 0;if(dp>=0.15)return 0.028;if(dp>=0.10)return 0.031;return 0.04;}
function ltt(p,brackets){var t=0,prev=0;for(var i=0;i<brackets.length;i++){var b=brackets[i];if(p>prev)t+=(Math.min(p,b[0])-prev)*b[1];prev=b[0];if(p<=b[0])break;}return t;}
var ON=[[55000,.005],[250000,.01],[400000,.015],[2000000,.02],[Infinity,.025]];
var TOR=[[55000,.005],[250000,.01],[400000,.015],[2000000,.02],[3000000,.025],[4000000,.035],[5000000,.045],[10000000,.055],[20000000,.065],[Infinity,.075]];
function parsePrice(t){var m=t.replace(/[, ]/g,'').match(/\$?(\d+(?:\.\d+)?)(k|m)?/i);if(!m)return null;var n=parseFloat(m[1]);if(m[2]){if(m[2].toLowerCase()==='k')n*=1000;else n*=1000000;}if(n<10000&&n>=10)n*=1000;return n>=10000?n:null;}

/* ── knowledge base ── */
var KB=[
{k:['closing cost','closing costs','fees when buying','buyer fees'],a:'Plan for roughly 1.5%–4% of the purchase price in closing costs in Ontario. The big items: land transfer tax (use my calculator!), legal fees (~$1,500–$2,500), title insurance (~$250–$400), home inspection (~$400–$600), and adjustments for prepaid taxes or utilities. Want me to calculate your land transfer tax?',c:['🏠 Land transfer tax','💬 Talk to Ali']},
{k:['first time','first-time','fthb','rebate','incentive','program'],a:'Key first-time buyer supports in Ontario (as of early 2026 — verify current rules with Ali):\n• Ontario land transfer tax rebate — up to $4,000 (Toronto adds up to $4,475 more)\n• FHSA — save $8,000/yr (max $40,000) tax-free toward your first home\n• RRSP Home Buyers Plan — withdraw up to $60,000 tax-free\nAli can walk you through which ones apply to you.',c:['💬 Talk to Ali','💰 Down payment']},
{k:['deposit'],a:'A deposit is paid within 24 hours of an accepted offer and shows good faith — in the GTA it is commonly around 5% of the purchase price, held in trust by the listing brokerage. It forms part of your down payment at closing. It is different from your down payment, which is the full amount you put toward the purchase.',c:['💰 Down payment','💬 Talk to Ali']},
{k:['worth','valuation','market analysis','cma','value of my home','home worth'],a:'Ali prepares free, no-obligation Comparative Market Analyses (CMAs) using recent comparable sales in your neighbourhood — far more accurate than any online estimator. Want one for your home?',c:['🏡 Get my free valuation','💬 Talk to Ali']},
{k:['commission','how much do you charge','your fee','cost to sell'],a:'Real estate commissions in Ontario are not fixed by law — they are fully negotiable and vary by situation. The structure is best discussed directly so Ali can explain exactly what is included. No pressure, no obligation.',c:['💬 Talk to Ali']},
{k:['selling process','sell my house','how to sell','list my home','steps to sell'],a:'The selling journey in brief: 1) free home valuation, 2) prep & staging advice, 3) professional photos & listing, 4) showings & offers, 5) negotiation, 6) closing. Most GTA homes follow this over 4–10 weeks depending on the market. Ali guides you through every step.',c:['🏡 Get my free valuation','💬 Talk to Ali']},
{k:['buying process','how to buy','steps to buy'],a:'Buying in brief: 1) mortgage pre-approval, 2) define your wishlist & budget, 3) tour homes (including pre-market listings Ali can access), 4) offer & negotiation, 5) conditions like financing and inspection, 6) closing day. Buyer representation typically costs you nothing directly.',c:['🔍 Start my home search','💬 Talk to Ali']},
{k:['pre-approval','preapproval','pre approved','how much can i qualify'],a:'A pre-approval is a lender verifying your income, credit, and documents to confirm how much they will lend — it locks a rate for 90–120 days and makes your offers stronger. A pre-qualification is just an estimate. Get pre-approved before house hunting. Ali can connect you with trusted mortgage brokers.',c:['💬 Talk to Ali','📈 Current rates']},
{k:['stress test'],a:'Federally regulated lenders test whether you could afford payments at the higher of your contract rate + 2% or 5.25% (the minimum qualifying rate). It reduces your maximum approval amount but protects you against rate increases. Figures current as of early 2026 — verify with your lender.',c:['📈 Current rates','💬 Talk to Ali']},
{k:['fixed','variable'],a:'Fixed = your rate is locked for the term (predictable payments). Variable = your rate moves with your lender prime rate (historically often cheaper, but it can rise). The right choice depends on your finances and risk tolerance — that is licensed mortgage-broker territory, and Ali can introduce you to great ones.',c:['📈 Current rates','💬 Talk to Ali']},
{k:['title insurance'],a:'Title insurance protects you against title fraud, survey issues, and defects in ownership history — a one-time premium of roughly $250–$400 in Ontario, usually arranged by your lawyer at closing. Most lenders require it.',c:['📋 Closing costs']},
{k:['status certificate','condo document'],a:'When buying a condo, the status certificate (~$100 from the condo corp) reveals the building finances, reserve fund, legal issues, and your unit fees. Always have a lawyer review it — it is one of the most important condo conditions.',c:['💬 Talk to Ali']},
{k:['condition','conditions'],a:'Common offer conditions in Ontario: financing (lender confirms your mortgage), home inspection, and for condos a status certificate review. Conditions protect you — waiving them strengthens an offer but adds risk. Ali helps you decide strategically case by case.',c:['💬 Talk to Ali']},
{k:['inspection'],a:'A home inspection (~$400–$600) checks structure, roof, electrical, plumbing, and HVAC — typically 2–3 hours. Highly recommended for resale homes. In competitive situations, a pre-offer inspection can keep your offer condition-free but informed.',c:['📋 Closing costs','💬 Talk to Ali']},
{k:['staging','stage'],a:'Staged homes typically photograph better, show better, and often sell faster. Sometimes it is a full furniture package; often it is smart decluttering and styling what you have. Ali advises what your specific home needs as part of the listing prep — often at little or no cost.',c:['🏡 Get my free valuation']},
{k:['best time to sell','when should i sell','best time'],a:'Spring (March–June) traditionally brings the most buyers in the GTA, with fall a strong second. But the best time is personal — low competition in winter can actually favour sellers. Ali can run the numbers for your specific neighbourhood and timing.',c:['🏡 Get my free valuation','💬 Talk to Ali']},
{k:['bully','bidding war','multiple offers'],a:'A bully (pre-emptive) offer is submitted before the seller scheduled offer date — usually strong and short-fused. Multiple-offer situations need strategy: pricing, deposit size, conditions, and closing flexibility all matter. This is exactly where having Ali on your side pays off.',c:['💬 Talk to Ali']},
{k:['closing day','what happens on closing'],a:'On closing day your lawyer transfers funds, registers the title in your name, pays land transfer tax, and releases keys — usually by late afternoon. You will sign documents with your lawyer a few days before. Budget for closing costs beyond the down payment.',c:['📋 Closing costs']},
{k:['bridge'],a:'Bridge financing is a short-term loan covering the gap when you buy your new home before your current one closes — typically days to a few weeks, interest-only. Useful but needs both firm sale and purchase agreements. A mortgage broker can price it for you.',c:['💬 Talk to Ali']},
{k:['assignment'],a:'An assignment sale means buying (or selling) a pre-construction contract before final closing. There are HST, tax, and builder-consent wrinkles — get advice before committing. Ali can walk you through whether an assignment makes sense for you.',c:['💬 Talk to Ali']},
{k:['rent or buy','rent vs','renting vs'],a:'The honest answer: it depends on how long you will stay (5+ years usually favours buying), your down payment, and local rent vs. ownership costs. Buying builds equity; renting buys flexibility. Ali can run a real comparison with actual GTA West numbers for your situation.',c:['💬 Talk to Ali','💰 Down payment']},
{k:['new construction','pre-construction','pre construction','builder'],a:'Pre-construction offers customization and deposit-over-time structures, but watch for: HST treatment, development charges (cap them in the contract!), occupancy fees before final closing, and delays. Resale is what-you-see-is-what-you-get. Ali works with both and can compare honestly.',c:['💬 Talk to Ali']},
{k:['capital gains','tax when selling','tax on sale'],a:'Your principal residence is generally exempt from capital gains tax in Canada (you must still report the sale). Investment properties are taxable on a portion of the gain. Specific tax advice should come from an accountant — Ali can refer you to good ones.',c:['💬 Talk to Ali']},
{k:['area','where do you work','which cities','language','arabic'],a:'Ali serves the GTA West — Mississauga, Brampton, Oakville, Milton, Burlington, Etobicoke, Georgetown, and surrounding communities — in both English and Arabic.',c:['💬 Talk to Ali']},
{k:['mortgage broker','lender','who should i get a mortgage'],a:'A good mortgage broker shops dozens of lenders for your best rate and terms — usually at no direct cost to you. Ali works alongside trusted, licensed brokers and is happy to make a warm introduction.',c:['💬 Talk to Ali']}
];

/* ── intents ── */
function route(raw){
  var t=raw.toLowerCase();

  /* pending flows first */
  if(pending){handlePending(raw,t);return;}

  if(/talk|contact|call|speak|human|connect me|reach ali|^💬/.test(t)){startLead();return;}
  if(/🏡|free valuation/.test(t)){window.location.hash='';try{pickCat('seller');}catch(e){}bot('Perfect — I have opened the valuation form just below the chat. Fill it in and Ali will respond within 24 hours!',HOME_CHIPS);panel.classList.remove('open');document.getElementById('picker').scrollIntoView({behavior:'smooth'});return;}
  if(/🔍|home search/.test(t)){try{pickCat('buyer');}catch(e){}panel.classList.remove('open');document.getElementById('picker').scrollIntoView({behavior:'smooth'});return;}
  if(/down ?payment|💰/.test(t)){pending={type:'down',step:'price'};bot('Happy to! What is the approximate purchase price? (e.g. 750,000 or 750k)');return;}
  if(/land transfer|ltt|🏠 land/.test(t)){pending={type:'ltt',step:'price',data:{}};bot('Sure — what is the approximate purchase price?');return;}
  if(/cmhc|mortgage insurance|default insurance/.test(t)){pending={type:'down',step:'price'};bot('CMHC insurance depends on your down payment. What is the approximate purchase price?');return;}
  if(/interest rate|current rate|rates|prime|bank of canada|📈/.test(t)){doRates();return;}

  /* KB match */
  var best=null,score=0;
  KB.forEach(function(e){var s=0;e.k.forEach(function(k){if(t.indexOf(k)>-1)s+=k.length;});if(s>score){score=s;best=e;}});
  if(best){bot(best.a,best.c||HOME_CHIPS);return;}

  /* no match → lead */
  bot('Great question — that one deserves Ali\'s personal answer rather than a canned one. Want me to have him reach out? It takes 20 seconds.',['Yes — have Ali contact me','Ask something else']);
}

function handlePending(raw,t){
  if(/cancel|never ?mind|stop/.test(t)){pending=null;bot('No problem! What else can I help with?',HOME_CHIPS);return;}

  if(pending.type==='down'){
    var p=parsePrice(raw);
    if(!p){bot('Hmm, I could not read that as a price — try something like 750,000 or 750k.');return;}
    var d=minDown(p),dp=d/p,r=cmhcRate(dp),loan=p-d,prem=loan*r;
    var out='For a '+fmt(p)+' purchase:\n• Minimum down payment: '+fmt(d)+' ('+(dp*100).toFixed(1)+'%)';
    if(r>0){out+='\n• Estimated CMHC insurance at minimum down: '+fmt(prem)+' ('+(r*100).toFixed(2)+'% of the loan, added to your mortgage; Ontario PST of ~8% on the premium is due in cash at closing)';}
    else{out+='\n• At 20%+ down, no mortgage default insurance is required.';}
    if(p>=1500000){out+='\nHomes of $1.5M+ require at least 20% down (uninsurable).';}
    out+='\n\nRules current as of early 2026 — your lender confirms exact figures.';
    pending=null;bot(out,['🏠 Land transfer tax','📈 Current rates','💬 Talk to Ali']);return;
  }

  if(pending.type==='ltt'){
    if(pending.step==='price'){
      var p2=parsePrice(raw);
      if(!p2){bot('Try a format like 850,000 or 850k 🙂');return;}
      pending.data.price=p2;pending.step='city';
      bot('Is the property in the City of Toronto (including Etobicoke)? Toronto charges an additional municipal land transfer tax.',['Yes — Toronto','No — outside Toronto']);return;
    }
    if(pending.step==='city'){
      pending.data.tor=/yes|toronto/.test(t);pending.step='ftb';
      bot('Are you a first-time home buyer? (You may qualify for rebates.)',['Yes, first-time buyer','No']);return;
    }
    if(pending.step==='ftb'){
      var ftb=/yes|first/.test(t);var p3=pending.data.price;
      var prov=ltt(p3,ON);var tor=pending.data.tor?ltt(p3,TOR):0;
      var rebP=ftb?Math.min(prov,4000):0;var rebT=(ftb&&pending.data.tor)?Math.min(tor,4475):0;
      var total=prov-rebP+tor-rebT;
      var out='Land transfer tax on '+fmt(p3)+':\n• Ontario LTT: '+fmt(prov);
      if(pending.data.tor)out+='\n• Toronto municipal LTT: '+fmt(tor);
      if(ftb){out+='\n• First-time buyer rebate: −'+fmt(rebP+rebT);}
      out+='\n• Total due at closing: '+fmt(Math.max(total,0));
      out+='\n\nBased on standard residential brackets as of early 2026 — your lawyer confirms the exact amount at closing.';
      pending=null;bot(out,['💰 Down payment','📋 Closing costs','💬 Talk to Ali']);return;
    }
  }

  if(pending.type==='lead'){
    if(pending.step==='name'){pending.data.name=raw.trim();pending.step='phone';bot('Thanks '+pending.data.name.split(' ')[0]+'! Best phone number for Ali to reach you?');return;}
    if(pending.step==='phone'){pending.data.phone=raw.trim();pending.step='email';bot('And your email address?');return;}
    if(pending.step==='email'){
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw.trim())){bot('That does not look like a valid email — mind double-checking?');return;}
      pending.data.email=raw.trim();
      bot('Sending your details to Ali…');
      fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({formType:'consultation',name:pending.data.name,phone:pending.data.phone,email:pending.data.email,topic:'Heartland Assistant chat enquiry',notes:'Lead captured via website chatbot.'+(pending.data.q?(' Last question: '+pending.data.q):'')})})
      .then(function(r){if(r.ok){bot('Done! ✓ Ali will reach out within 24 hours — usually much sooner. You will also get a confirmation email. Anything else I can help with meanwhile?',HOME_CHIPS);}else{throw 0;}})
      .catch(function(){bot('Hmm, something went wrong sending that. You can reach Ali directly at 416.606.0494 or on WhatsApp — sorry about that!',HOME_CHIPS);});
      pending=null;return;
    }
  }
}

function startLead(q){pending={type:'lead',step:'name',data:{q:q||''}};bot('Ali would love to help personally. What is your name?');}

function doRates(){
  bot('One moment — checking the Bank of Canada…');
  fetch('/api/rates').then(function(r){return r.json();}).then(function(d){
    if(d&&!d.error&&(d.overnight||d.prime)){
      var out='Official Bank of Canada figures'+(d.date?(' as of '+d.date):'')+':';
      if(d.overnight)out+='\n• Policy (overnight) rate: '+d.overnight+'%';
      if(d.prime)out+='\n• Prime rate: '+d.prime+'%';
      out+='\n\nActual mortgage rates vary by lender, term, and your profile — a licensed mortgage broker can quote your real rate. Want Ali to connect you with one?';
      bot(out,['Yes — have Ali contact me','No thanks']);
    }else{
      bot('I could not reach the Bank of Canada feed right now. Rates change frequently — Ali can get you accurate, current numbers through his trusted mortgage brokers. Want him to reach out?',['Yes — have Ali contact me','No thanks']);
    }
  }).catch(function(){bot('Connection hiccup on my end. Ali can get you current rate info directly — want him to reach out?',['Yes — have Ali contact me','No thanks']);});
}

/* ── wire up ── */
function send(){var v=input.value.trim();if(!v)return;input.value='';user(v);
  if(/yes — have ali|yes - have ali/i.test(v)){startLead();return;}
  if(/ask something else|no thanks/i.test(v)){bot('Sure! What else can I help with?',HOME_CHIPS);return;}
  if(!pending){var t=v.toLowerCase();var unknown=true;
    /* remember question for lead context */
    KB.forEach(function(e){e.k.forEach(function(k){if(t.indexOf(k)>-1)unknown=false;});});
    if(unknown&&!/rate|down|land|transfer|talk|contact|call|valuation/.test(t)){ if(pending===null){} }
  }
  route(v);}
document.getElementById('hl-send').onclick=send;
input.addEventListener('keydown',function(e){if(e.key==='Enter')send();});
document.getElementById('hl-close').onclick=function(){panel.classList.remove('open');};
launch.onclick=function(){
  var et=document.getElementById('hl-tip');if(et)et.remove();try{localStorage.setItem('hlTipSeen','1');}catch(_){}
  panel.classList.toggle('open');
  if(panel.classList.contains('open')&&!opened){opened=true;
    bot('Hi! 👋 I\'m the Heartland Assistant. I can answer common Ontario buying & selling questions, calculate your land transfer tax or minimum down payment, and check official Bank of Canada rates. What can I help with?',HOME_CHIPS);}
  if(panel.classList.contains('open'))input.focus();
};

/* ── subtle tooltip before first click ── */
var tipShown=false;
function showTip(){
  if(tipShown||localStorage.getItem('hlTipSeen'))return;
  tipShown=true;
  var tip=document.createElement('div');
  tip.id='hl-tip';
  tip.innerHTML='<span class="x">×</span>Questions about buying or selling? Ask me!';
  document.body.appendChild(tip);
  tip.querySelector('.x').onclick=function(e){e.stopPropagation();tip.remove();try{localStorage.setItem('hlTipSeen','1');}catch(_){}};
  tip.onclick=function(){tip.remove();launch.click();};
  setTimeout(function(){if(tip.parentNode)tip.style.transition='opacity .4s';},8000);
  setTimeout(function(){if(tip.parentNode){tip.style.opacity='0';setTimeout(function(){tip.remove();},400);}},8400);
}
setTimeout(showTip,2500);

})();
