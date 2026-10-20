/* story.js - save/checkpoint, random events, story missions, tutorial hints */
function saveG(w){try{localStorage.setItem('dl_save',JSON.stringify(sv={v:1,wave:w,cash,mh,mx,wp,hasSG,dyn,hon,bounty,sc,dayT,story:msn}))}catch(e){}}
const okSave=v=>!!v&&v.v==1&&['wave','cash','mh','mx','wp','hasSG','dyn','hon','bounty','sc','dayT'].every(k=>Number.isFinite(v[k]))&&v.wave>=1&&v.mh>=1&&v.mx>=1&&v.wp>=0&&v.wp<=2;
function applyG(v){wave=v.wave-1;cash=v.cash;mh=v.mh;mx=v.mx;wp=v.wp;hasSG=v.hasSG;dyn=v.dyn;hon=v.hon;bounty=v.bounty;sc=v.sc;dayT=v.dayT;msn=v.story||0;msShown=-1;P.hp=mh;P.am=mx;nextWave();TX.push({x:P.x,y:P.y-30,s:'CHECKPOINT: WAVE '+wave,l:90,c:C.cr})}
function evPick(){for(let i=0;i<60;i++){const a=rnd()*6.28,d=220+rnd()*300,x=P.x+Math.cos(a)*d,y=P.y+Math.sin(a)*d;if(x<90||x>WW-90||y<90||y>WH-90||rr(x,y,14)||rr(x+20,y,6)||rr(x-20,y,6))continue;return[x,y]}return null}
function evStart(){const p=evPick();if(!p){evt=300;return}const ty=['wagon','duel','merchant'][rnd()*3|0],x=p[0],y=p[1];EV={ty,x,y,t:0,st:0};
if(ty!='duel'){V.push(EV.s={x:x+22,y:y+6,hp:3,t:0,wa:0,ws:0,a:0,m:0,fl:0,fx:1,hc:ty=='wagon'?'#6a4a2a':'#d8c8a0',bc:ty=='wagon'?'#8a6a4a':'#4a6a8a'})}
if(ty=='wagon'){for(let i=0,j=0;i<3&&j<40;j++){const bx=x+(rnd()-.5)*100,by=y+18+rnd()*30;if(rr(bx,by,4))continue;E.push(mkE(bx,by,0,{ev:1,ag:0}));i++}}
if(ty=='duel'){EV.e=mkE(x,y,3,{ev:1,ag:0,dl:1,hp:3,cd:40});E.push(EV.e)}
TX.push({x:P.x,y:P.y-34,s:{wagon:'WAGON UNDER ATTACK!',duel:'A GUNSLINGER WAITS...',merchant:'A MERCHANT CAMPS NEARBY'}[ty],l:110,c:'#ffd040'});snd(600,.3,'triangle',.05)}
function evEnd(m,r){if(m)TX.push({x:P.x,y:P.y-34,s:m,l:80,c:C.cr});if(EV.s){if(r||EV.ty=='merchant')V=V.filter(v=>v!==EV.s);else EV.s.fx=0}EV=null}
function evUpd(){if(!EV){if(S=='p'&&--evt<=0){evStart();evt=2400+(rnd()*1400|0)}return}
EV.t++;const d=Math.hypot(P.x-EV.x,P.y-EV.y);
if(EV.ty=='wagon'){const s=EV.s;if(s.hp<=0)evEnd('THE STRANGER DIED');else if(!E.some(e=>e.ev)){const r=120+wave*10;cash+=r;sc+=r;hon=Math.min(100,hon+8);TX.push({x:s.x,y:s.y-26,s:'THANK YOU! +$'+r,l:90,c:C.cr});for(let i=0;i<2;i++)F.push({x:s.x-8+i*14,y:s.y+8,k:'$'});snd(800,.3,'triangle');evEnd('')}else if(EV.t>5400){s.hp=0;hon=Math.max(-100,hon-3);evEnd('TOO LATE',1)}}
else if(EV.ty=='merchant'){if(EV.s.hp<=0||EV.t>4800)evEnd(EV.s.hp>0?'THE MERCHANT MOVES ON':'')}
else{const e=EV.e;if(!E.includes(e)){const w=EV.foul?.5:1,r=Math.round((150+wave*10)*w);cash+=r;sc+=r;hon=Math.min(100,hon+(EV.foul?2:8));TX.push({x:P.x,y:P.y-34,s:EV.foul?'DUEL WON (FOUL) +$'+r:'DUEL WON! +$'+r,l:90,c:C.cr});evEnd('')}
else if(!EV.st){if(d<130){EV.st=1;EV.c=0;EV.dr=150+(rnd()*80|0);TX.push({x:P.x,y:P.y-34,s:'DUEL! HOLD YOUR FIRE',l:80,c:C.r});snd(200,.3,'sawtooth',.06)}else if(EV.t>5400){E=E.filter(x=>x!==e);evEnd('')}}
else{EV.c++;if(!EV.dd&&e.ag&&!EV.foul){EV.foul=1;hon=Math.max(-100,hon-8);TX.push({x:P.x,y:P.y-34,s:'FOUL! -HONOR',l:70,c:C.r})}
if(!EV.dd){if(EV.c==50)TX.push({x:e.x,y:e.y-30,s:'STEADY...',l:50,c:C.cr});if(EV.c==EV.dr-45)TX.push({x:e.x,y:e.y-30,s:'READY...',l:40,c:C.cr});
if(EV.c>=EV.dr){EV.dd=1;e.dl=0;e.ag=1;e.cd=28;TX.push({x:e.x,y:e.y-30,s:'DRAW!',l:50,c:C.r});snd(500,.2,'square',.06)}}
if(d>300){E=E.filter(x=>x!==e);evEnd('DUEL CALLED OFF')}}}}
function offer(){const m=1-hon/500;if(P.hp<mh)return['HEAL +2 HP',Math.round(50*m),()=>{P.hp=Math.min(mh,P.hp+2)}];if(P.am<mx)return['AMMO',Math.round(30*m),()=>{P.am=mx}];return['DYNAMITE X3',Math.round(90*m),()=>{dyn+=3}]}
function evAct(){if(!EV||EV.ty!='merchant'||EV.s.hp<=0||Math.hypot(P.x-EV.s.x,P.y-EV.s.y)>28)return 0;
if(hon<-40){TX.push({x:EV.s.x,y:EV.s.y-26,s:'GET LOST, OUTLAW!',l:60,c:C.r});return 1}const o=offer();if(cash<o[1]){TX.push({x:EV.s.x,y:EV.s.y-26,s:'NEED $'+o[1],l:50,c:C.r});snd(100,.1);return 1}cash-=o[1];o[2]();TX.push({x:EV.s.x,y:EV.s.y-26,s:o[0]+'  -$'+o[1],l:60,c:C.cr});snd(800,.1,'triangle');return 1}
function wagonSp(x,y,cc,br){R('#0003',x-22,y+2,46,5);R(C.wdd,x-18,y-12,36,14);R(C.wd,x-17,y-11,34,3);R(cc,x-14,y-25,28,13);R('#d8c590',x-14,y-14,28,2);R(C.wdd,x-14,y-28,28,3);
for(const wx of br?[-12]:[-12,10]){R(C.k,x+wx-2,y-6,9,9);R(C.wl,x+wx,y-4,5,5);R(C.k,x+wx+1,y-3,3,3)}if(br){R(C.wd,x+6,y-2,12,3);R(C.k,x+8,y-5,2,4)}}
function evWorld(){if(!EV||EV.ty=='duel')return;wagonSp(EV.x,EV.y,EV.ty=='wagon'?C.cr:C.t,EV.ty=='wagon');
}
const ST=[
{who:'SHERIFF',tt:'WELCOME TO VALENTINE',d:['Outlaws are swarming Valentine.','Gun down 6 of them. I will pay you.'],g:'kill',n:6,r:150,h:3,x:'KILL OUTLAWS'},
{who:'SHERIFF',tt:'THE BULL',d:['The Bull leads them. Bring him down.','Dead or alive. I do not care which.'],g:'boss',n:1,r:400,h:5,x:'KILL THE BULL'},
{who:'OLD MINER',tt:'GOLD ON THE RAILS',d:['A gold train stops at the depot.','Crack its safe. The company owes me.'],g:'train',n:1,r:600,h:-3,x:'ROB THE GOLD TRAIN'},
{who:'GAMBLER',tt:'THE BIG SCORE',d:['The bank vault is full tonight.','Rob it, but expect the law.'],g:'bank',n:1,r:700,h:-5,x:'ROB THE BANK'},
{who:'NARRATOR',tt:'LEGEND OF THE WEST',d:['Your name is whispered across the West.','Survive to wave 10 to become a legend.'],g:'wave',n:10,r:1500,h:10,x:'REACH WAVE 10'}];
function stCheck(){if(S!='p')return;const m=ST[msn];if(DLG){DLG.t++;if(DLG.t>DLG.lines[DLG.i].length*2+150){DLG.i++;DLG.t=0;if(DLG.i>=DLG.lines.length)DLG=null}}
if(!m)return;if(msShown!=msn&&!DLG&&++dlT>90){msShown=msn;dlT=0;DLG={who:m.who,tt:m.tt,lines:m.d,i:0,t:0}}
const cur=m.g=='wave'?wave:STAT[m.g]-STAT0[m.g];if(cur>=m.n){cash+=m.r;sc+=m.r;hon=Math.max(-100,Math.min(100,hon+m.h));TX.push({x:P.x,y:P.y-40,s:'MISSION COMPLETE +$'+m.r,l:120,c:'#9fe8a0'});snd(900,.4,'triangle');shake=3;msn++;STAT0={...STAT};DLG=null;dlT=0}}
function hint(id,t){if(SEEN[id]||HINT)return;SEEN[id]=1;try{localStorage.setItem('dl_tut',JSON.stringify(SEEN))}catch(e){}HINT={t,l:300}}
function tutor(){if(HINT&&--HINT.l<=0)HINT=null;if(S!='p')return;hint('move','MOVE: LEFT STICK / WASD');if(P.t>420)hint('shoot','AIM + SHOOT: RIGHT STICK / MOUSE');if(P.cv)hint('cover','COVER BEHIND CRATES BLOCKS SHOTS');if(dm>=25)hint('eye','DEAD EYE: Q / EYE BUTTON SLOWS TIME');
if(ACT&&ACT.s=='LOOT')hint('loot','E / LOOT: SEARCH BODIES FOR CASH');if(ACT&&ACT.s=='RIDE')hint('horse','F / HRS: RIDE YOUR HORSE');if(hon<0)hint('hon','KILLING INNOCENTS COSTS HONOR');if(EV)hint('ev','YELLOW DOT ON MAP = RANDOM EVENT');if(nH)hint('heist','E: ROB IT. THE LAW WILL COME');if(bounty>0)hint('bty','BOUNTY? PAY IT IN THE STORE');if(wx==1)hint('wx','DUST STORM: LESS VISIBILITY');if(deOn)hint('mark','DEAD EYE: HOLD FIRE TO MARK, RELEASE TO EXECUTE');if(WT)hint('wt','WANTED OUTLAW: GOLD DOT ON MAP. DEAD OR ALIVE');if(E.some(e=>e.k==4&&e.aim>0))hint('rifle','RED LINE = RIFLEMAN. MOVE!')}
