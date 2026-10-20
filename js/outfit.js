/* outfit.js - wardrobe: outfits, bandana mask and a hat that can fall off.
   Loads after deadeye.js and before input.js. Hooks existing functions by wrapping them (bottom of file).

   HAT      Taking a hit can knock it off (always from explosions, 20% from bullets).
            Walk over it to pick it up. Without a hat your face is seen: bounty gains +25%.
            You always get a fresh hat at the next checkpoint (end of wave / leaving the store).
   MASK     Bandana ($150). While worn, bounty gains are halved - but storekeepers and traveling
            merchants refuse to serve you.
   OUTFITS  COWBOY (free), GENTLEMAN ($200, store prices -10%, hat falls off half as often),
            DUSTER ($300, the hat never falls off).

   Controls  O = next outfit, B = mask on/off (not during a fight; touch buttons OUT / MSK).
             W in the store (or the WARDROBE button) = open the wardrobe page. */
const Wardrobe=(()=>{
  const OUTFITS=[
    {id:'cowboy',name:'COWBOY',price:0,perk:'CLASSIC',hc:'#f6f0e0',bc:C.cr,bd:C.r},
    {id:'gentleman',name:'GENTLEMAN',price:200,perk:'STORE -10%',hc:'#2a2438',bc:'#4a5a8a',bd:'#e8c050'},
    {id:'duster',name:'DUSTER',price:300,perk:'HAT STAYS ON',hc:'#6a4a2a',bc:'#8a6a3a',bd:'#3a2438'}];
  const MASK={name:'BANDANA',price:150,perk:'BOUNTY -50%'};
  const orig={man,hurt,upd,init,saveG,applyG,promptDraw,draw,buy,shopUI,shopTap,pr,offer,evAct};
  const fresh=()=>({cur:'cowboy',own:{cowboy:1},maskOwned:0,mask:0,hat:1});
  let me=fresh(),fallen=[],page=false,toastAt=0;

  const outfit=()=>OUTFITS.find(o=>o.id==me.cur);
  const apply=()=>{const o=outfit();P.hc=o.hc;P.bc=o.bc;P.bd=o.bd};
  const toast=(s,c=C.cr)=>TX.push({x:P.x,y:P.y-40,s,l:60,c});
  const busy=()=>E.some(e=>e.ag);

  // ---- hat ----
  function dropHat(){
    me.hat=0;
    fallen.push({x:P.x+(Math.random()-.5)*18,y:P.y+3,t:0});
    toast('HAT LOST!',C.r);snd(240,.2,'triangle',.05);
  }
  function onHurt(n){
    if(!me.hat||me.cur=='duster')return;
    if(Math.random()<(n>=2?1:.2)*(me.cur=='gentleman'?.5:1))dropHat();
  }
  function pre(){
    for(const h of fallen){
      h.t++;
      if(Math.hypot(h.x-P.x,h.y-P.y)<11){h.d=1;me.hat=1;toast('HAT BACK ON');snd(600,.1,'triangle')}
      else if(h.t>1800)h.d=1;
    }
    fallen=fallen.filter(h=>!h.d);
  }

  // ---- wanted level: mask halves new bounty, a missing hat adds 25% ----
  function post(b0){
    if(bounty<=b0)return;
    const m=(me.hat?1:1.25)*(me.mask?.5:1);
    if(m==1)return;
    bounty=b0+Math.round((bounty-b0)*m);
    if(tick-toastAt>90){toastAt=tick;toast(me.mask?'MASKED: BOUNTY HALVED':'RECOGNIZED! BOUNTY +25%',me.mask?C.cr:C.r)}
  }

  // ---- changing clothes while playing ----
  function cycle(){
    if(busy())return toast('NOT DURING A FIGHT',C.r);
    const owned=OUTFITS.filter(o=>me.own[o.id]);
    if(owned.length<2)return toast('BUY OUTFITS AT THE STORE');
    me.cur=owned[(owned.findIndex(o=>o.id==me.cur)+1)%owned.length].id;
    apply();toast(outfit().name);snd(500,.08,'triangle');
  }
  function toggleMask(){
    if(!me.maskOwned)return toast('BUY A BANDANA AT THE STORE');
    if(busy())return toast('NOT DURING A FIGHT',C.r);
    me.mask=me.mask?0:1;toast(me.mask?'MASK ON':'MASK OFF');snd(500,.08,'triangle');
  }

  // ---- wardrobe page inside the store (rows 1-3 outfits, 4 mask, 7 back) ----
  function rowAct(i){
    if(i==6){page=false;snd(500,.05);return}
    if(i<3){
      const o=OUTFITS[i];
      if(!me.own[o.id]){if(cash<o.price)return snd(100,.1);cash-=o.price;me.own[o.id]=1;snd(800,.1,'triangle')}
      me.cur=o.id;apply();
    }else if(i==3){
      if(!me.maskOwned){if(cash<MASK.price)return snd(100,.1);cash-=MASK.price;me.maskOwned=1;snd(800,.1,'triangle')}
      me.mask=me.mask?0:1;
    }
  }
  function drawPage(){
    T('WARDROBE',192,36,C.cr,12);
    T('CASH $'+cash,192,50,C.wl,7);
    for(let i=0;i<7;i++){
      if(i==4||i==5)continue;
      const y=68+i*26;
      let name='BACK TO STORE',perk='',state='',ok=true;
      if(i<3){
        const o=OUTFITS[i];
        name=o.name;perk=o.perk;
        state=me.cur==o.id?'WORN':me.own[o.id]?'OWNED':'$'+o.price;
        ok=me.cur!=o.id&&(!!me.own[o.id]||cash>=o.price);
      }else if(i==3){
        name=MASK.name;perk=MASK.perk;
        state=me.maskOwned?(me.mask?'ON':'OFF'):'$'+MASK.price;
        ok=!!me.maskOwned||cash>=MASK.price;
      }
      R(C.k,50,y,284,22);
      R(i==6?C.t:ok?C.wd:'#4a3a4a',52,y+2,280,18);
      T((i+1)+' '+name,62,y+14,ok||i==6?C.cr:'#8a7a8a',8,'left');
      if(perk)T(perk,226,y+14,ok?C.wl:'#8a7a8a',5);
      if(state)T(state,324,y+14,ok?C.cr:'#8a7a8a',8,'right');
    }
  }

  // ---- HUD (screen space) ----
  const BTN=[['OUT',212,cycle],['MSK',240,toggleMask]];
  function hud(){
    X=g;
    T(outfit().name+(me.mask?' + MASK':''),4,174,C.cr,5,'left');
    if(!me.hat&&(tick>>4&1))T('NO HAT! BOUNTY +25%',4,184,C.r,5,'left');
    if(tm){
      g.globalAlpha=.45;
      for(const[s,y]of BTN){R(C.k,316,y+BY,30,26);R(C.wd,318,y+2+BY,26,22);T(s,331,y+17+BY,C.cr,5)}
      g.globalAlpha=1;
    }
  }

  // ---- hooks into existing functions ----
  init=function(){orig.init();me=fresh();fallen=[];page=false;apply()};
  upd=function(){pre();const b0=bounty;orig.upd();post(b0)};
  hurt=function(n){const hp=P.hp;orig.hurt(n);if(P.hp<hp)onHurt(n)};

  // player sprite: missing hat, duster coat tails, bandana
  man=function(o){
    if(o!==P)return orig.man(o);
    if(me.hat)orig.man(o);
    else{
      X.save();X.beginPath();X.rect(o.x-30,o.y-15,60,60);X.clip();   // clip away the hat rows
      orig.man(o);X.restore();
      R('#3a2438',o.x-2,o.y-16,5,2);                                 // hair instead
    }
    if(me.cur=='duster'){R(o.bc,o.x-4,o.y-6,9,3);R('#5a3f2a',o.x-4,o.y-4,9,1)}
    if(me.mask){R('#3a4a8a',o.x-2,o.y-13,5,2);R('#2a3566',o.x+(Math.cos(o.a)<0?2:-3),o.y-12,1,2)}
  };

  promptDraw=function(){
    orig.promptDraw();
    if(S!='p')return;
    const hc=outfit().hc;
    for(const h of fallen){
      R('#0003',h.x-4,h.y,9,2);R(hc,h.x-4,h.y-2,9,2);R(hc,h.x-2,h.y-5,5,3);R('#00000030',h.x-4,h.y-1,9,1);
      if(tick>>4&1)T('HAT',h.x,h.y-9,C.cr,5);
    }
  };
  draw=function(){orig.draw();if(S=='p'&&!PA)hud()};

  // store: -10% for the gentleman, no service while masked, wardrobe page
  pr=function(i){const v=orig.pr(i);return i!=5&&me.cur=='gentleman'?Math.round(v*.9):v};
  offer=function(){const o=orig.offer();if(me.cur=='gentleman')o[1]=Math.round(o[1]*.9);return o};
  evAct=function(){
    if(me.mask&&EV&&EV.ty=='merchant'&&EV.s.hp>0&&Math.hypot(P.x-EV.s.x,P.y-EV.s.y)<28){
      TX.push({x:EV.s.x,y:EV.s.y-26,s:'NO MASKS HERE!',l:60,c:C.r});snd(100,.1);return 1;
    }
    return orig.evAct();
  };
  buy=function(i){
    if(page)return rowAct(i);
    if(me.mask&&i<5){snd(100,.1);return}
    if(i==6)page=false;
    orig.buy(i);
  };
  shopUI=function(){
    if(page)return drawPage();
    orig.shopUI();
    R(C.k,140,250,104,14);R(C.wd,142,252,100,10);
    T(tm?'WARDROBE':'W  WARDROBE',192,260,C.cr,5);
    if(me.mask)T('TAKE OFF THE MASK TO SHOP',192,24,C.r,6);
  };
  shopTap=function(p){
    const by=BY/2|0;
    if(p[0]>140&&p[0]<244&&p[1]>=250+by&&p[1]<264+by){page=!page;snd(500,.05);return}
    orig.shopTap(p);
  };

  // save / load (a fresh hat at every checkpoint)
  saveG=function(w){
    orig.saveG(w);
    me.hat=1;fallen=[];page=false;
    try{sv.out={cur:me.cur,own:me.own,maskOwned:me.maskOwned,mask:me.mask};localStorage.setItem('dl_save',JSON.stringify(sv))}catch(e){}
  };
  applyG=function(v){
    orig.applyG(v);
    const o=v.out;
    if(!o||typeof o!='object')return;
    me=fresh();
    for(const x of OUTFITS)if(o.own&&o.own[x.id])me.own[x.id]=1;
    const f=OUTFITS.find(x=>x.id==o.cur&&me.own[x.id]);
    me.cur=f?f.id:'cowboy';
    me.maskOwned=o.maskOwned?1:0;me.mask=me.maskOwned&&o.mask?1:0;
    apply();
  };

  // extra input (e.code so it works with any keyboard layout, e.g. Persian)
  addEventListener('keydown',e=>{
    if(e.repeat)return;
    if(S=='s'&&e.code=='KeyW'){page=!page;snd(500,.05)}
    else if(S=='p'&&!PA){if(e.code=='KeyO')cycle();else if(e.code=='KeyB')toggleMask()}
  });
  addEventListener('touchstart',e=>{
    if(S!='p'||PA||!tm)return;
    for(const t of e.changedTouches){
      const[x,y]=pt(t);
      for(const[,by,fn]of BTN)if(x>=316&&x<346&&y>=by+BY&&y<by+26+BY){e.preventDefault();e.stopPropagation();fn();return}
    }
  },{capture:true,passive:false});

  return{cycle,toggleMask};
})();
