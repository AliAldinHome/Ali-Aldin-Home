(function(){
/* ═══════════════════════════════════════════════════════
   HEARTLAND ASSISTANT v2 — conversation memory, contextual
   follow-ups, expanded knowledge base. No API, no cost.
═══════════════════════════════════════════════════════ */

var css=''
+'#hl-launch{position:fixed;bottom:22px;right:22px;width:62px;height:62px;border-radius:50%;background:#1F1F1F;border:none;cursor:pointer;z-index:99998;box-shadow:0 10px 30px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;transition:transform .2s;}'
+'#hl-launch:hover{transform:scale(1.06);}'
+'#hl-launch .dot{position:absolute;top:2px;right:2px;width:16px;height:16px;background:#C9A96E;border-radius:50%;border:2px solid #1F1F1F;display:none;}'
+'#hl-launch.alert .dot{display:block;}'
+'#hl-tip{position:fixed;bottom:32px;right:96px;background:#1F1F1F;color:#fff;font-family:Montserrat,sans-serif;font-size:13px;font-weight:400;padding:11px 16px;border-radius:14px;border-bottom-right-radius:4px;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:99997;max-width:215px;line-height:1.5;cursor:pointer;animation:hlTipIn .4s ease;}'
+'#hl-tip::after{content:"";position:absolute;right:-7px;bottom:11px;border-top:7px solid transparent;border-bottom:7px solid transparent;border-left:8px solid #1F1F1F;}'
+'#hl-tip .x{position:absolute;top:-8px;right:-8px;width:21px;height:21px;background:#C9A96E;border-radius:50%;color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center;border:2px solid #FAF8F6;}'
+'@keyframes hlTipIn{from{opacity:0;transform:translateX(10px);}to{opacity:1;transform:translateX(0);}}'
+'#hl-panel{position:fixed;bottom:96px;right:22px;width:390px;max-width:calc(100vw - 32px);height:600px;max-height:calc(100vh - 130px);background:#FAF8F6;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.18);z-index:99999;display:none;flex-direction:column;overflow:hidden;border:1px solid #E4DFD8;}'
+'#hl-panel.open{display:flex;animation:hlUp .25s ease;}'
+'@keyframes hlUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}'
+'#hl-head{background:#1F1F1F;padding:15px 20px 12px;position:relative;flex-shrink:0;}'
+'#hl-head .t1{font-family:Montserrat,sans-serif;font-size:8px;letter-spacing:.4em;color:#C9A96E;text-transform:uppercase;}'
+'#hl-head .t2{font-family:Montserrat,sans-serif;font-size:15px;font-weight:500;letter-spacing:.12em;color:#fff;text-transform:uppercase;margin-top:2px;}'
+'#hl-head .t3{font-family:Montserrat,sans-serif;font-size:9px;color:rgba(255,255,255,.42);margin-top:5px;line-height:1.5;}'
+'#hl-close{position:absolute;top:13px;right:14px;background:none;border:none;color:rgba(255,255,255,.6);font-size:22px;cursor:pointer;line-height:1;}'
+'#hl-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}'
+'.hl-m{max-width:86%;padding:11px 14px;border-radius:15px;font-family:Montserrat,sans-serif;font-size:14px;line-height:1.65;font-weight:300;white-space:pre-line;}'
+'.hl-bot{background:#fff;border:1px solid #E4DFD8;color:#1F1F1F;align-self:flex-start;border-bottom-left-radius:4px;}'
+'.hl-user{background:rgba(201,169,110,.16);border:1px solid rgba(201,169,110,.3);color:#1F1F1F;align-self:flex-end;border-bottom-right-radius:4px;}'
+'.hl-chips{display:flex;flex-wrap:wrap;gap:7px;align-self:flex-start;max-width:96%;}'
+'.hl-chip{background:#fff;border:1.5px solid #C9A96E;color:#1F1F1F;border-radius:999px;padding:8px 14px;font-family:Montserrat,sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;}'
+'.hl-chip:hover{background:#1F1F1F;color:#fff;border-color:#1F1F1F;}'
+'.hl-chip.gold{background:#C9A96E;color:#fff;}'
+'.hl-chip.gold:hover{background:#1F1F1F;}'
+'.hl-typing{display:flex;gap:4px;padding:13px 15px;background:#fff;border:1px solid #E4DFD8;border-radius:15px;border-bottom-left-radius:4px;align-self:flex-start;}'
+'.hl-typing span{width:6px;height:6px;border-radius:50%;background:#C9A96E;animation:hlB 1s infinite;}'
+'.hl-typing span:nth-child(2){animation-delay:.15s}.hl-typing span:nth-child(3){animation-delay:.3s}'
+'@keyframes hlB{0%,60%,100%{opacity:.3}30%{opacity:1}}'
+'#hl-inrow{display:flex;gap:8px;padding:12px;border-top:1px solid #E4DFD8;background:#F7F5F3;flex-shrink:0;}'
+'#hl-in{flex:1;border:1.5px solid #E4DFD8;border-radius:999px;padding:11px 16px;font-family:Montserrat,sans-serif;font-size:16px;font-weight:300;outline:none;background:#fff;}'
+'#hl-in:focus{border-color:#C9A96E;}'
+'#hl-send{width:44px;height:44px;border-radius:50%;background:#1F1F1F;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}'
+'#hl-send:hover{background:#B89455;}'
+'#hl-foot{text-align:center;font-family:Montserrat,sans-serif;font-size:8px;letter-spacing:.14em;color:#999;text-transform:uppercase;padding:7px;background:#F7F5F3;flex-shrink:0;}'
+'@media(max-width:480px){#hl-panel{right:14px;left:14px;width:auto;bottom:88px;height:calc(100vh - 150px);}#hl-tip{max-width:165px;font-size:12px;right:90px;}}';

var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* launch button */
var launch=document.createElement('button');
launch.id='hl-launch';launch.setAttribute('aria-label','Open Heartland Assistant');
launch.innerHTML='<span class="dot"></span><svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#C9A96E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 14.2c-2.2-1.6-3.4-2.8-3.4-4 0-1 .8-1.6 1.6-1.6.7 0 1.4.5 1.8 1.2.4-.7 1.1-1.2 1.8-1.2.8 0 1.6.6 1.6 1.6 0 1.2-1.2 2.4-3.4 4z" fill="#C9A96E"/></svg>';
document.body.appendChild(launch);

var panel=document.createElement('div');
panel.id='hl-panel';
panel.innerHTML='<div id="hl-head"><div class="t1">The Heartland</div><div class="t2">Assistant</div><div class="t3">General info only — not financial, legal, or mortgage advice.</div><button id="hl-close" aria-label="Close">×</button></div><div id="hl-msgs"></div><div id="hl-inrow"><input id="hl-in" placeholder="Type your question…" aria-label="Your question"/><button id="hl-send" aria-label="Send"><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div id="hl-foot">The Heartland Agent · Ali Aldin · Right at Home Realty</div>';
document.body.appendChild(panel);

var msgs=document.getElementById('hl-msgs');
var input=document.getElementById('hl-in');

/* ── conversation memory ── */
var mem={
  asked:[],          /* topics covered */
  lastPrice:null,    /* last price used in a calc */
  qCount:0,          /* genuine questions asked */
  leadOffered:false, /* have we offered Ali yet */
  name:null
};
var pending=null;
var opened=false;

/* ── helpers ── */
function fmt(n){return '$'+Math.round(n).toLocaleString('en-CA');}
function scroll(){msgs.scrollTop=msgs.scrollHeight;}
function user(t){var d=document.createElement('div');d.className='hl-m hl-user';d.textContent=t;msgs.appendChild(d);scroll();}
function bot(t,chips,delay){
  var ty=document.createElement('div');ty.className='hl-typing';ty.innerHTML='<span></span><span></span><span></span>';
  msgs.appendChild(ty);scroll();
  setTimeout(function(){
    ty.remove();
    var d=document.createElement('div');d.className='hl-m hl-bot';d.textContent=t;msgs.appendChild(d);
    if(chips&&chips.length){
      var c=document.createElement('div');c.className='hl-chips';
      chips.forEach(function(ch){
        var label=typeof ch==='string'?ch:ch.t;
        var gold=typeof ch==='object'&&ch.gold;
        var b=document.createElement('button');b.className='hl-chip'+(gold?' gold':'');b.textContent=label;
        b.onclick=function(){c.remove();user(label);route(label);};
        c.appendChild(b);
      });
      msgs.appendChild(c);
    }
    scroll();
  },delay||540);
}

/* contextual follow-up chips — avoid repeating covered topics */
function followChips(extra){
  var pool=[
    {id:'down',t:'💰 Down payment'},
    {id:'ltt',t:'🏠 Land transfer tax'},
    {id:'closing',t:'📋 Closing costs'},
    {id:'rates',t:'📈 Current rates'},
    {id:'fthb',t:'🎁 First-time buyer help'},
    {id:'process',t:'🗺️ The buying process'},
    {id:'sell',t:'🏡 Thinking of selling?'}
  ];
  var chips=(extra||[]).slice();
  for(var i=0;i<pool.length&&chips.length<(extra?extra.length+2:4);i++){
    if(mem.asked.indexOf(pool[i].id)===-1)chips.push(pool[i].t);
  }
  chips.push('💬 Talk to Ali');
  return chips;
}

/* offer Ali after genuine engagement */
function maybeOfferAli(){
  if(mem.qCount>=3&&!mem.leadOffered){
    mem.leadOffered=true;
    setTimeout(function(){
      bot('By the way — you\'re asking exactly the kind of questions Ali loves to dig into properly. Want him to reach out with personalised answers? No pressure at all.',[{t:'Yes, have Ali reach out',gold:true},'Maybe later'],700);
    },900);
    return true;
  }
  return false;
}

/* ── calculators ── */
function minDown(p){if(p>=1500000)return p*0.20;if(p<=500000)return p*0.05;return 25000+(p-500000)*0.10;}
function cmhcRate(dp){if(dp>=0.20)return 0;if(dp>=0.15)return 0.028;if(dp>=0.10)return 0.031;return 0.04;}
function ltt(p,br){var t=0,prev=0;for(var i=0;i<br.length;i++){var b=br[i];if(p>prev)t+=(Math.min(p,b[0])-prev)*b[1];prev=b[0];if(p<=b[0])break;}return t;}
var ON=[[55000,.005],[250000,.01],[400000,.015],[2000000,.02],[Infinity,.025]];
var TOR=[[55000,.005],[250000,.01],[400000,.015],[2000000,.02],[3000000,.025],[4000000,.035],[5000000,.045],[10000000,.055],[20000000,.065],[Infinity,.075]];
function parsePrice(t){var m=t.replace(/[, ]/g,'').match(/\$?(\d+(?:\.\d+)?)(k|m)?/i);if(!m)return null;var n=parseFloat(m[1]);if(m[2]){if(m[2].toLowerCase()==='k')n*=1000;else n*=1000000;}if(n<10000&&n>=10)n*=1000;return n>=10000?n:null;}

/* ── KNOWLEDGE BASE (expanded) ── */
var KB=[
{id:'closing',k:['closing cost','closing costs','fees when buying','buyer fees','what fees'],a:'Plan for roughly 1.5%–4% of the purchase price in closing costs in Ontario. The main items:\n• Land transfer tax (often the biggest — I can calculate it)\n• Legal fees: ~$1,500–$2,500\n• Title insurance: ~$250–$400\n• Home inspection: ~$400–$600\n• Adjustments for prepaid property tax/utilities\nWant me to calculate your land transfer tax?'},
{id:'fthb',k:['first time','first-time','fthb','rebate','incentive','first home'],a:'Key first-time buyer supports in Ontario (as of early 2026 — confirm current rules with Ali):\n• Ontario land transfer tax rebate: up to $4,000 (Toronto adds up to $4,475 more)\n• FHSA: save $8,000/yr (max $40,000) tax-free toward your first home\n• RRSP Home Buyers Plan: withdraw up to $60,000 tax-free\nWant me to factor the rebate into a land transfer tax calculation?'},
{id:'deposit',k:['deposit'],a:'A deposit is paid within 24 hours of an accepted offer to show good faith — in the GTA it\'s commonly ~5% of the purchase price, held in trust by the listing brokerage. It becomes part of your down payment at closing. (Different from your down payment, which is the full amount you put toward the home.)'},
{id:'valuation',k:['worth','valuation','market analysis','cma','value of my home','home worth','what is my home'],a:'Ali prepares free, no-obligation Comparative Market Analyses using recent comparable sales in your specific neighbourhood — far more accurate than any online estimator. Want one for your home?'},
{id:'commission',k:['commission','how much do you charge','your fee','cost to sell','what do you charge'],a:'Real estate commissions in Ontario aren\'t fixed by law — they\'re fully negotiable and depend on the situation. Ali is always upfront about exactly what\'s included; it\'s best discussed directly so he can tailor it to your needs.'},
{id:'sell',k:['selling process','sell my house','how to sell','list my home','steps to sell','want to sell'],a:'The selling journey, briefly:\n1. Free home valuation\n2. Prep & staging advice\n3. Professional photos & listing\n4. Showings & offers\n5. Negotiation\n6. Closing\nMost GTA homes move through this in 4–10 weeks depending on the market. Ali guides every step.'},
{id:'process',k:['buying process','how to buy','steps to buy','want to buy','how does buying'],a:'Buying, briefly:\n1. Mortgage pre-approval\n2. Define wishlist & budget\n3. Tour homes (incl. pre-market listings Ali can access)\n4. Offer & negotiation\n5. Conditions (financing, inspection)\n6. Closing day\nBuyer representation usually costs you nothing directly.'},
{id:'preapproval',k:['pre-approval','preapproval','pre approved','how much can i qualify','qualify for'],a:'A pre-approval is a lender verifying your income, credit & documents to confirm how much they\'ll lend — it holds a rate for 90–120 days and makes your offers stronger. (A pre-qualification is just a rough estimate.) Get pre-approved before house hunting. Ali can connect you with trusted mortgage brokers.'},
{id:'stress',k:['stress test'],a:'Federally regulated lenders test whether you could afford payments at the higher of your contract rate + 2%, or 5.25%. It lowers your maximum approval but protects you against rate increases. Figures current as of early 2026 — confirm with your lender.'},
{id:'fixvar',k:['fixed','variable','fixed or variable'],a:'Fixed = rate locked for the term (predictable). Variable = moves with your lender\'s prime rate (historically often cheaper, but can rise). The right pick depends on your finances and risk comfort — that\'s licensed mortgage-broker territory, and Ali can introduce you to great ones.'},
{id:'title',k:['title insurance'],a:'Title insurance protects against title fraud, survey issues, and ownership defects — a one-time premium of ~$250–$400 in Ontario, usually arranged by your lawyer at closing. Most lenders require it.'},
{id:'status',k:['status certificate','condo document','condo status'],a:'When buying a condo, the status certificate (~$100 from the condo corp) reveals the building\'s finances, reserve fund, legal issues, and your unit fees. Always have a lawyer review it — one of the most important condo conditions.'},
{id:'condition',k:['condition','conditions','conditional offer'],a:'Common Ontario offer conditions: financing (lender confirms your mortgage), home inspection, and for condos a status certificate review. Conditions protect you — waiving them strengthens an offer but adds risk. Ali helps you decide strategically.'},
{id:'inspection',k:['inspection','home inspector'],a:'A home inspection (~$400–$600) checks structure, roof, electrical, plumbing & HVAC — usually 2–3 hours. Highly recommended for resale homes. In competitive situations a pre-offer inspection can keep your offer condition-free but informed.'},
{id:'staging',k:['staging','stage','should i stage'],a:'Staged homes typically photograph better, show better, and often sell faster. Sometimes it\'s a full furniture package; often it\'s smart decluttering and styling what you already have. Ali advises what your specific home needs — often at little or no cost.'},
{id:'timing',k:['best time to sell','when should i sell','best time to buy','best season'],a:'Spring (Mar–Jun) traditionally brings the most GTA buyers, with fall a strong second. But the best time is personal — low winter competition can actually favour sellers. Ali can run the numbers for your specific neighbourhood and timing.'},
{id:'bully',k:['bully','bidding war','multiple offers','offer night'],a:'A bully (pre-emptive) offer comes in before the seller\'s scheduled offer date — usually strong and short-fused. Multiple-offer situations need strategy: price, deposit size, conditions, and closing flexibility all matter. This is exactly where having Ali on your side pays off.'},
{id:'closingday',k:['closing day','what happens on closing','possession'],a:'On closing day your lawyer transfers funds, registers title in your name, pays land transfer tax, and releases keys — usually by late afternoon. You\'ll sign documents with your lawyer a few days before. Budget for closing costs beyond the down payment.'},
{id:'bridge',k:['bridge','bridge financing','buy before sell'],a:'Bridge financing is a short-term loan covering the gap when you buy your new home before your current one closes — typically days to a few weeks, interest-only. Useful, but needs both a firm sale and firm purchase. A mortgage broker can price it.'},
{id:'assignment',k:['assignment','assign'],a:'An assignment sale means buying or selling a pre-construction contract before final closing. Watch for HST, tax, and builder-consent wrinkles — get advice first. Ali can walk you through whether an assignment makes sense.'},
{id:'rentbuy',k:['rent or buy','rent vs','renting vs','should i rent'],a:'Honestly? It depends on how long you\'ll stay (5+ years usually favours buying), your down payment, and local rent-vs-ownership costs. Buying builds equity; renting buys flexibility. Ali can run a real comparison with actual GTA West numbers for your situation.'},
{id:'newcon',k:['new construction','pre-construction','pre construction','builder','new build'],a:'Pre-construction offers customization and deposit-over-time, but watch for: HST treatment, development charges (cap them in the contract!), occupancy fees before final closing, and delays. Resale is what-you-see-is-what-you-get. Ali works with both and compares honestly.'},
{id:'capgains',k:['capital gains','tax when selling','tax on sale','pay tax'],a:'Your principal residence is generally exempt from capital gains tax in Canada (you still report the sale). Investment properties are taxable on a portion of the gain. Specific tax advice should come from an accountant — Ali can refer you to good ones.'},
{id:'area',k:['area','where do you work','which cities','language','arabic','serve'],a:'Ali serves the GTA West — Mississauga, Brampton, Oakville, Milton, Burlington, Etobicoke, Georgetown and nearby — in both English and Arabic.'},
{id:'broker',k:['mortgage broker','lender','who should i get a mortgage','find a mortgage'],a:'A good mortgage broker shops dozens of lenders for your best rate and terms — usually at no direct cost to you. Ali works alongside trusted, licensed brokers and is happy to make a warm introduction.'},
{id:'invest',k:['investment','rental property','income property','cap rate','cash flow','brrrr','fix and flip','flip'],a:'GTA West has solid options for investors — from rental condos to multi-unit and value-add plays. Key things to weigh: cash flow, financing (20%+ down for rentals), and your timeline/strategy. Ali can share opportunities and real numbers aligned to your goals.'},
{id:'downhelp',k:['how much down','minimum down','down payment needed'],a:'Minimum down payment in Canada: 5% on the first $500K, 10% on the portion from $500K–$1.5M, and 20% on homes $1.5M+. Want me to calculate it for a specific price?'},
{id:'hst',k:['hst','tax on new home','sales tax'],a:'Resale homes generally have no HST. New/pre-construction homes do — but there are rebates (the New Housing Rebate) that often reduce it, and builders frequently include HST in the price for end-users. Always confirm in the contract. Ali can help you read the fine print.'}
];

/* ── intents / routing ── */
function route(raw){
  var t=raw.toLowerCase();

  if(pending){handlePending(raw,t);return;}

  /* lead triggers */
  if(/^yes.*ali|have ali|yes,? reach|reach out|yes please/i.test(raw)){startLead();return;}
  if(/maybe later|not now|no thanks|ask something|something else/i.test(raw)){bot('Of course! What else would you like to know?',followChips());return;}
  if(/talk|contact|call|speak|human|connect me|reach ali|^💬/.test(t)){startLead();return;}

  /* form jumps */
  if(/🏡|free valuation|get my free/.test(t)){try{pickCat('seller');}catch(e){}bot('Perfect — I\'ve opened the valuation form just below. Fill it in and Ali will respond within 24 hours!',null,400);panel.classList.remove('open');document.getElementById('picker').scrollIntoView({behavior:'smooth'});return;}
  if(/🔍|home search|start my home/.test(t)){try{pickCat('buyer');}catch(e){}panel.classList.remove('open');document.getElementById('picker').scrollIntoView({behavior:'smooth'});return;}

  /* calculators */
  if(/down ?payment|💰|minimum down|how much down/.test(t)){
    mem.asked.push('down');mem.qCount++;
    if(mem.lastPrice){pending={type:'down',step:'confirm'};bot('Want me to use the '+fmt(mem.lastPrice)+' from earlier, or a different price?',['Use '+fmt(mem.lastPrice),'Different price']);return;}
    pending={type:'down',step:'price'};bot('Happy to! What\'s the approximate purchase price? (e.g. 750,000 or 750k)');return;
  }
  if(/land transfer|ltt|🏠 land/.test(t)){
    mem.asked.push('ltt');mem.qCount++;
    if(mem.lastPrice){pending={type:'ltt',step:'confirmprice',data:{}};bot('Want me to use the '+fmt(mem.lastPrice)+' from earlier, or a different price?',['Use '+fmt(mem.lastPrice),'Different price']);return;}
    pending={type:'ltt',step:'price',data:{}};bot('Sure — what\'s the approximate purchase price?');return;
  }
  if(/cmhc|mortgage insurance|default insurance/.test(t)){mem.asked.push('down');mem.qCount++;pending={type:'down',step:'price'};bot('CMHC insurance depends on your down payment. What\'s the approximate purchase price?');return;}
  if(/interest rate|current rate|rates|prime|bank of canada|📈/.test(t)){mem.asked.push('rates');mem.qCount++;doRates();return;}

  /* KB match */
  var best=null,score=0;
  KB.forEach(function(e){var s=0;e.k.forEach(function(k){if(t.indexOf(k)>-1)s+=k.length;});if(s>score){score=s;best=e;}});
  if(best){
    if(mem.asked.indexOf(best.id)===-1)mem.asked.push(best.id);
    mem.qCount++;
    var lead='';
    if(mem.asked.length>1){
      /* reference prior topic occasionally */
    }
    bot(best.a,contextChips(best.id));
    maybeOfferAli();
    return;
  }

  /* greetings */
  if(/^(hi|hey|hello|good morning|good afternoon|yo|sup)\b/.test(t)){bot('Hi! 😊 What would you like to know about buying or selling in Ontario?',followChips());return;}
  if(/thank|thanks|cheers|appreciate/.test(t)){bot('You\'re very welcome! Anything else I can help with?',followChips());return;}

  /* unknown → lead */
  mem.qCount++;
  bot('That\'s a great question — and one that deserves Ali\'s personal answer rather than a generic one. Want me to have him reach out? Takes about 20 seconds.',[{t:'Yes, have Ali reach out',gold:true},'Ask something else']);
}

/* build chips that follow the topic just discussed */
function contextChips(id){
  var map={
    closing:['🏠 Land transfer tax','💰 Down payment'],
    fthb:['🏠 Land transfer tax','💰 Down payment'],
    ltt:['💰 Down payment','📋 Closing costs'],
    down:['🏠 Land transfer tax','📈 Current rates'],
    process:['💰 Down payment','📈 Current rates','🎁 First-time buyer help'],
    sell:['🏡 Get my free valuation','📋 Closing costs'],
    preapproval:['📈 Current rates','💰 Down payment'],
    invest:['📈 Current rates','💬 Talk to Ali'],
    valuation:['🏡 Get my free valuation']
  };
  return followChips(map[id]);
}

/* ── pending flows ── */
function handlePending(raw,t){
  if(/cancel|never ?mind|stop|exit/.test(t)){pending=null;bot('No problem! What else can I help with?',followChips());return;}

  if(pending.type==='down'){
    if(pending.step==='confirm'){
      if(/use|yes|same/.test(t)){doDown(mem.lastPrice);pending=null;return;}
      pending.step='price';bot('Sure — what price should I use?');return;
    }
    var p=parsePrice(raw);
    if(!p){bot('Hmm, I couldn\'t read that as a price — try something like 750,000 or 750k.');return;}
    mem.lastPrice=p;doDown(p);pending=null;return;
  }

  if(pending.type==='ltt'){
    if(pending.step==='confirmprice'){
      if(/use|yes|same/.test(t)){pending.data.price=mem.lastPrice;pending.step='city';askCity();return;}
      pending.step='price';bot('No problem — what price should I use?');return;
    }
    if(pending.step==='price'){
      var p2=parsePrice(raw);
      if(!p2){bot('Try a format like 850,000 or 850k 🙂');return;}
      pending.data.price=p2;mem.lastPrice=p2;pending.step='city';askCity();return;
    }
    if(pending.step==='city'){pending.data.tor=/yes|toronto/.test(t);pending.step='ftb';bot('Are you a first-time home buyer? You may qualify for rebates.',['Yes, first-time buyer','No']);return;}
    if(pending.step==='ftb'){
      var ftb=/yes|first/.test(t);var p3=pending.data.price;
      var prov=ltt(p3,ON);var tor=pending.data.tor?ltt(p3,TOR):0;
      var rebP=ftb?Math.min(prov,4000):0;var rebT=(ftb&&pending.data.tor)?Math.min(tor,4475):0;
      var total=prov-rebP+tor-rebT;
      var out='Land transfer tax on '+fmt(p3)+':\n• Ontario LTT: '+fmt(prov);
      if(pending.data.tor)out+='\n• Toronto municipal LTT: '+fmt(tor);
      if(ftb)out+='\n• First-time buyer rebate: −'+fmt(rebP+rebT);
      out+='\n• Total due at closing: '+fmt(Math.max(total,0));
      out+='\n\nBased on standard residential brackets (early 2026). Your lawyer confirms the exact amount.';
      pending=null;bot(out,contextChips('ltt'));maybeOfferAli();return;
    }
  }

  if(pending.type==='lead'){
    if(pending.step==='name'){mem.name=raw.trim();pending.data.name=raw.trim();pending.step='phone';bot('Thanks '+raw.trim().split(' ')[0]+'! 😊 Best phone number for Ali to reach you?');return;}
    if(pending.step==='phone'){pending.data.phone=raw.trim();pending.step='email';bot('Perfect. And your email address?');return;}
    if(pending.step==='email'){
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw.trim())){bot('That doesn\'t look quite right — mind double-checking the email?');return;}
      pending.data.email=raw.trim();
      bot('Sending your details to Ali…',null,300);
      var topics=mem.asked.join(', ');
      fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({formType:'consultation',name:pending.data.name,phone:pending.data.phone,email:pending.data.email,topic:'Heartland Assistant chat enquiry',notes:'Lead via website chatbot. Topics discussed: '+(topics||'general')+'.'})})
      .then(function(r){if(r.ok){bot('Done! ✓ Ali will reach out within 24 hours — usually much sooner. You\'ll also get a confirmation email shortly. Anything else meanwhile?',followChips());}else{throw 0;}})
      .catch(function(){bot('Hmm, something went wrong sending that. You can reach Ali directly at 416.606.0494 or on WhatsApp — sorry about that!',null);});
      pending=null;return;
    }
  }
}

function askCity(){bot('Is the property in the City of Toronto (including Etobicoke)? Toronto adds a municipal land transfer tax.',['Yes — Toronto','No — outside Toronto']);}

function doDown(p){
  var d=minDown(p),dp=d/p,r=cmhcRate(dp),loan=p-d,prem=loan*r;
  var out='For a '+fmt(p)+' purchase:\n• Minimum down payment: '+fmt(d)+' ('+(dp*100).toFixed(1)+'%)';
  if(r>0){out+='\n• Est. CMHC insurance at minimum down: '+fmt(prem)+' ('+(r*100).toFixed(2)+'% of the loan, added to your mortgage; ~8% Ontario PST on that premium is payable in cash at closing)';}
  else{out+='\n• At 20%+ down, no mortgage default insurance required.';}
  if(p>=1500000)out+='\nHomes $1.5M+ require at least 20% down (uninsurable).';
  out+='\n\nRules current as of early 2026 — your lender confirms exact figures.';
  bot(out,contextChips('down'));maybeOfferAli();
}

function startLead(){pending={type:'lead',step:'name',data:{}};bot(mem.name?('Great! I have you as '+mem.name+' — want Ali to use that? Just send your name to confirm or type a different one.'):'Ali would love to help personally. What\'s your name?');}

function doRates(){
  bot('One moment — checking the Bank of Canada…',null,300);
  fetch('/api/rates').then(function(r){return r.json();}).then(function(d){
    if(d&&!d.error&&(d.overnight||d.prime)){
      var out='Official Bank of Canada figures'+(d.date?(' (as of '+d.date+')'):'')+':';
      if(d.overnight)out+='\n• Policy (overnight) rate: '+d.overnight+'%';
      if(d.prime)out+='\n• Prime rate: '+d.prime+'%';
      out+='\n\nActual mortgage rates vary by lender, term, and your profile. Ali can connect you with a trusted mortgage broker for your real rate — want an intro?';
      bot(out,[{t:'Yes, have Ali reach out',gold:true},'No thanks']);maybeOfferAli();
    }else{
      bot('I couldn\'t reach the Bank of Canada feed right now. Rates change often — Ali can get you accurate, current numbers through his trusted brokers. Want him to reach out?',[{t:'Yes, have Ali reach out',gold:true},'No thanks']);
    }
  }).catch(function(){bot('Connection hiccup on my end. Ali can get you current rate info directly — want him to reach out?',[{t:'Yes, have Ali reach out',gold:true},'No thanks']);});
}

/* ── input ── */
function send(){var v=input.value.trim();if(!v)return;input.value='';user(v);route(v);}
document.getElementById('hl-send').onclick=send;
input.addEventListener('keydown',function(e){if(e.key==='Enter')send();});
document.getElementById('hl-close').onclick=function(){panel.classList.remove('open');};

var HOME_CHIPS=['💰 Down payment','🏠 Land transfer tax','📋 Closing costs','📈 Current rates','💬 Talk to Ali'];

launch.onclick=function(){
  var et=document.getElementById('hl-tip');if(et)et.remove();try{localStorage.setItem('hlTipSeen','1');}catch(_){}
  launch.classList.remove('alert');
  panel.classList.toggle('open');
  if(panel.classList.contains('open')&&!opened){opened=true;
    bot('Hi there! 👋 Ask me anything about buying or selling in Ontario — or tap an option below to get started.',HOME_CHIPS);}
  if(panel.classList.contains('open'))input.focus();
};

/* ── tooltip before first open ── */
var tipShown=false;
function showTip(){
  if(tipShown||opened||localStorage.getItem('hlTipSeen'))return;
  tipShown=true;
  var tip=document.createElement('div');tip.id='hl-tip';
  tip.innerHTML='<span class="x">×</span>Questions about buying or selling? Ask me!';
  document.body.appendChild(tip);
  launch.classList.add('alert');
  tip.querySelector('.x').onclick=function(e){e.stopPropagation();tip.remove();launch.classList.remove('alert');try{localStorage.setItem('hlTipSeen','1');}catch(_){}};
  tip.onclick=function(){tip.remove();launch.click();};
  setTimeout(function(){if(tip.parentNode){tip.style.transition='opacity .4s';tip.style.opacity='0';setTimeout(function(){tip.remove();},400);}},9000);
}
setTimeout(showTip,2800);
})();
