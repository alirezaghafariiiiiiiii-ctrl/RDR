/* deadeye.js - Dead Eye levels, body-part marks, ability cards and kill streaks.
   Loads after render.js and before input.js.
   game.js calls DeadEye.update(fh) from upd(); every other hook wraps an existing
   function at the bottom of this file, so the rest of the game stays untouched.

   Dead Eye level comes from fame (same formula as the rank on the HUD):
     LV1 DRIFTER     0+   body shots, 6 marks
     LV2 OUTLAW     10+   card HEADSHOT      - outlaws, shooters and brutes take a head shot (6 dmg)
     LV3 GUNSLINGER 30+   card SHARPSHOOTER  - weapon-hand shot disarms gunmen, leg shot stuns The Bull,
                                               enemy dynamite in the air can be marked and defused, 7 marks
     LV4 LEGEND     60+   card DEAD SHOT     - every kill refunds the bullet, 8 marks
   Kills without getting hurt build a STREAK that adds extra Dead Eye energy. */
const DeadEye=(()=>{
  const MAX_MARKS=[6,6,7,8];
  const CARD={2:'HEADSHOT',3:'SHARPSHOOTER',4:'DEAD SHOT'};
  const orig={dmg,hurt,upd,init,saveG,applyG,promptDraw,draw};
  let streak=0,lastKill=0,shownLevel=1;

  const fame=()=>STAT.kill+STAT.boss*5+STAT.bank*5+STAT.train*5;
  const level=()=>{const f=fame();return f>=60?4:f>=30?3:f>=10?2:1};

  // Which body part a Dead Eye shot goes for, by target type and level
  function part(e){
    const lv=level();
    if(e.k==2)return lv>=3?{n:'LEG',dmg:6,stun:90}:{n:'BODY',dmg:6};
    if(e.k>=3&&e.k<=5)return lv>=3?{n:'HAND',dmg:4,disarm:1}:{n:'BODY',dmg:4};
    return lv>=2?{n:'HEAD',dmg:6}:{n:'BODY',dmg:4};
  }

  // Marking phase: hold fire, one new target every 7 ticks
  function mark(p){
    if(tick%7||MK.length>=Math.min(MAX_MARKS[level()-1],p.am))return;
    let best=null,bd=1e9;
    if(level()>=3)for(const d of DY)if(d.en&&!MK.includes(d)){const dist=Math.hypot(d.x-p.x,d.y-p.y);if(dist<170&&dist<bd){bd=dist;best=d}}
    if(!best)for(const e of E)if(e.hp>0&&!MK.includes(e)){const d=Math.hypot(e.x-p.x,e.y-p.y);if(Math.abs(e.x-p.x)<190&&Math.abs(e.y-p.y)<140&&d<bd){bd=d;best=e}}
    if(!best)for(const r of BR)if(r.hp>0&&r.t&&!MK.includes(r)){const d=Math.hypot(r.x-p.x,r.y-p.y);if(d<150&&d<bd){bd=d;best=r}}
    if(best){MK.push(best);snd(900+MK.length*80,.06,'triangle',.04)}
  }

  // Execution phase: one marked target every 5 ticks
  function execute(p){
    if(!exq.length||--ext>0)return;
    ext=5;
    const t=exq.shift(),isDY=DY.includes(t);
    if(!(isDY||t.hp>0)||p.am<=0)return;
    const eb=isDY?0:t.k==2?14:8;
    p.a=Math.atan2(t.y-eb-(p.y-8),t.x-p.x);p.am--;p.cd=8;
    pf(p.x+Math.cos(p.a)*9,p.y-8+Math.sin(p.a)*9,5,'#fff3c0',1.6,5);
    for(let i=1;i<9;i++)Q.push({x:p.x+(t.x-p.x)*i/9,y:p.y-8+(t.y-eb-(p.y-8))*i/9,vx:0,vy:0,l:10,c:'#ffd04a',g:0});
    snd(420,.12,'square',.05);shake=Math.max(shake,2);
    if(BR.includes(t)){t.hp=0;boom(t)}
    else if(isDY)defuse(t);
    else hit(t,p);
  }

  function defuse(d){
    DY=DY.filter(x=>x!==d);
    pf(d.x,d.y,10,'#d8d0c0',1.4,18,-.02);
    sc+=25;cash+=25;
    TX.push({x:d.x,y:d.y-14,s:'DEFUSED +$25',l:45,c:'#7ad0ff'});
  }

  function hit(e,p){
    const prt=part(e);
    dmg(e,prt.dmg);
    if(e.hp>0){
      if(prt.disarm){e.cd=1e9;e.aim=0;TX.push({x:e.x,y:e.y-30,s:'DISARMED',l:45,c:'#7ad0ff'})}
      if(prt.stun){e.stun=prt.stun;TX.push({x:e.x,y:e.y-36,s:'KNEECAPPED',l:45,c:'#7ad0ff'})}
    }else{
      if(prt.n=='HEAD')TX.push({x:e.x,y:e.y-30,s:'HEADSHOT',l:40,c:'#ffd04a'});
      if(level()>=4){p.am=Math.min(mx,p.am+1);TX.push({x:p.x,y:p.y-30,s:'+1 BULLET',l:35,c:C.cr})}
    }
  }

  // Replaces the old inline Dead Eye block in game.js upd()
  function update(fh){
    const p=P;
    if(!deOn)MK=[];
    else if(fh&&wp!=2&&p.am>0&&!p.rl&&!exq.length)mark(p);
    else if(MK.length){exq=MK;MK=[];ext=0}
    execute(p);
  }

  // Stunned enemies are parked with the same flags the duel intro uses (dl=1, ag=0)
  function stunTick(){
    for(const e of E)if(e.stun>0){
      e.stun--;e.ag=0;e.dl=1;e.aim=0;e.tl=0;e.dash=0;
      if(!e.stun){e.dl=0;e.ag=1}
    }
  }

  function onKill(){
    streak++;lastKill=tick;
    const bonus=Math.min(20,streak*2);
    dm=Math.min(100,dm+bonus);
    if(streak>=2)TX.push({x:P.x,y:P.y-44,s:'STREAK x'+streak+'  EYE +'+bonus,l:50,c:'#ffd04a'});
  }

  function post(){
    if(streak&&tick-lastKill>480)streak=0;
    const lv=level();
    if(lv>shownLevel){
      shownLevel=lv;
      TX.push({x:P.x,y:P.y-52,s:'DEAD EYE LV'+lv+'  NEW CARD: '+CARD[lv],l:150,c:'#ffd04a'});
      snd(700,.2,'triangle',.06);snd(1000,.3,'triangle',.05);
    }
  }

  // World-space labels (runs inside the world transform)
  function world(){
    for(const m of MK){
      if(BR.includes(m)||m.hp<=0)continue;
      T(DY.includes(m)?'DEFUSE':part(m).n,m.x,m.y-(m.k==2?36:24),'#ffd04a',5);
    }
    for(const e of E)if(e.stun>0)T('STUN',e.x,e.y-(e.k==2?38:26),'#7ad0ff',5);
  }

  function hud(){
    X=g;
    const lv=level();
    T('EYE LV'+lv+(CARD[lv]?' '+CARD[lv]:''),4,152,'#ffd04a',5,'left');
    if(streak>=2)T('STREAK x'+streak,4,162,C.cr,5,'left');
  }

  // ---- hooks into existing functions ----
  dmg=function(e,n){const alive=e.hp>0;orig.dmg(e,n);if(alive&&e.hp<=0)onKill()};
  hurt=function(n){const hp=P.hp;orig.hurt(n);if(P.hp<hp)streak=0};
  upd=function(){stunTick();orig.upd();post()};
  init=function(){orig.init();streak=0;lastKill=0;shownLevel=1};
  // fame must survive Continue, so the kill stats go into the save too
  saveG=function(w){
    orig.saveG(w);
    try{sv.stat={...STAT};sv.stat0={...STAT0};localStorage.setItem('dl_save',JSON.stringify(sv))}catch(e){}
  };
  applyG=function(v){
    orig.applyG(v);
    const ok=s=>s&&['kill','boss','bank','train'].every(k=>Number.isFinite(s[k]));
    if(ok(v.stat)){STAT={...v.stat};STAT0=ok(v.stat0)?{...v.stat0}:{...v.stat}}
    streak=0;shownLevel=level();
  };
  promptDraw=function(){orig.promptDraw();if(S=='p')world()};
  draw=function(){orig.draw();if(S=='p'&&!PA)hud()};

  return{update,level};
})();
