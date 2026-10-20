/* game.js - init, collision, spawning, damage, per-frame update (upd) and camera (misc) */
function init(){cam.z=1;cam.lx=cam.ly=0;cam.px=null;sc=0;wave=0;cash=0;mh=5;mx=6;wp=0;hasSG=0;dyn=0;DY=[];HR.x=230;HR.y=424;HR.on=0;HR.call=0;HR.ct=0;HR.bd=0;deOn=0;dm=100;mt=0;tapDE=0;PA=0;MK=[];exq=[];ext=0;WT=null;wnt=1500;P={x:192,y:150,hp:5,am:6,cd:0,rl:0,a:0,t:0,fl:0,iv:0,m:0,hc:'#f6f0e0',bc:C.cr,bd:C.r};E=[];B=[];Q=[];F=[];TX=[];
BR=[[132,126,1],[252,152,1],[210,178,0],[108,172,0],[312,130,0],[172,122,0],[300,186,1],[60,190,0],[440,160,1],[540,150,0],[630,170,0],[236,372,1],[270,410,0],[470,300,1],[560,320,0],[120,340,0],[690,300,1],[380,320,0]].map(([x,y,t])=>({x,y,t,hp:t?1:2}));hk={bank:0,bcd:0,tr:0,pb:0,pt:0,sp:0,gv:0};trn.on=0;trn.x=9999;trn.t=900;trn.st=0;trn.g=0;trn.n=0;dayT=.3;wx=0;wn=0;wf=0;wt=2400;msn=0;msShown=-1;STAT={kill:0,boss:0,bank:0,train:0};STAT0={kill:0,boss:0,bank:0,train:0};DLG=null;dlT=0;EV=null;evt=1500;V=[];CP=[];AN=[];bounty=0;hon=0;hs=900;for(let i=0;i<8;i++)V.push({x:100+rnd()*240,y:120+rnd()*56,hp:2,t:0,wa:0,ws:0,a:0,m:0,fl:0,hc:['#6a4a2a','#4a6a8a','#8a4a6a','#d8c8a0'][i%4],bc:['#c8a878','#8a6a4a','#9a8aaa','#7a9a7a'][i%4]});for(let i=0;i<50;i++){const x=60+rnd()*(WW-120),y=60+rnd()*(WH-120);if(AN.length>=24||rr(x,y,8)||(x<420&&y<310))continue;const s=AN.length%3;AN.push({x,y,s,hp:[2,2,7][s],mx:[2,2,7][s],t:0,f:0,fl:0,cd:0,wa:0,ws:0})}for(let i=0;i<70;i++){const x=60+rnd()*(WW-120),y=60+rnd()*(WH-120);if(rr(x,y,6))continue;if(i<40){const t=rnd()<.4?1:0;BR.push({x,y,t,hp:t?1:2})}else F.push({x,y,k:'$'})}nextWave()}
function nextWave(){wave++;left=wave+3;if(wave%4==0){bossQ=1;left=Math.ceil(wave/2)+1}ban=130;if(wave>1&&P.hp<mh){F.push({x:P.x+24,y:P.y,k:'h'})}}
const rr=(x,y,r)=>{if(x<r+4||x>WW-r-4||y<26||y>WH-16)return 1;for(const o of O)if(x+r>o[0]&&x-r<o[0]+o[2]&&y>o[1]&&y-4<o[1]+o[3])return 1;for(const q of BR)if(q.hp>0&&Math.abs(x-q.x)<r+4&&y>q.y-6&&y-4<q.y+2)return 1;return 0};
const mv=(e,dx,dy)=>{if(!rr(e.x+dx,e.y,3))e.x+=dx;if(!rr(e.x,e.y+dy,3))e.y+=dy};
function pf(x,y,n,c,sp,l,gv=0){for(let i=0;i<n;i++)Q.push({x,y,vx:(rnd()-.5)*sp*2,vy:(rnd()-.5)*sp*2,l:l*(.5+rnd()),c,g:gv})}
let ac;function snd(f,d,t='square',v=.04){try{ac=ac||new AudioContext();const o=ac.createOscillator(),n=ac.createGain(),a=ac.currentTime;o.type=t;o.frequency.setValueAtTime(f,a);o.frequency.exponentialRampToValueAtTime(Math.max(20,f/4),a+d);n.gain.setValueAtTime(v,a);n.gain.exponentialRampToValueAtTime(.001,a+d);o.connect(n);n.connect(ac.destination);o.start();o.stop(a+d)}catch(e){}}
function spawn(kf){let k=kf??(bossQ?2:pickK());if(kf==null)bossQ=0;
for(let i=0;i<60;i++){const an=rnd()*6.28,s=kf==3?[P.x+Math.cos(an)*230,P.y+Math.sin(an)*230]:[40+rnd()*(WW-80),40+rnd()*(WH-80)];if((kf!=3&&Math.hypot(s[0]-P.x,s[1]-P.y)<280)||rr(s[0],s[1],4))continue;
E.push({x:s[0],y:s[1],k,hp:eh(k),ag:k==3?1:0,cd:50+rnd()*50,t:0,s:rnd()<.5?1:-1,fl:0,dash:0,a:0,m:1,hc:['#4f6a2a','#e8d8a8','#000','#1a1a2a','#6a5a3a','#a85a2a','#3a2a1a'][k],bc:['#8a5a3a','#7a5a9a','#000','#6a1a1a','#4a6a4a','#8a3a2a','#5a2a5a'][k],bd:k==1?C.r:k==3?C.cr:k==4?'#e8d8a8':k==5?C.r:0});return}}
function hurt(n){const p=P;if(p.iv>0)return;p.hp-=n;p.iv=50;p.fl=6;shake=5;snd(100,.25,'sawtooth',.07);TX.push({x:p.x,y:p.y-24,s:'OUCH',l:40,c:C.r});if(p.hp<=0){S='o';ov=0;if(sc>best){best=sc;try{localStorage.setItem('dl_best',best)}catch(e){}}pf(p.x,p.y-8,30,C.r,2.5,30,.1)}}
function dmg(e,n){e.hp-=n;e.fl=4;e.ag=1;pf(e.x,e.y-8,5,C.wd,1.5,14,.08);snd(160,.06,'square',.03);if(e.hp<=0){const v=[100,200,1000,400,250,220,300][e.k];sc+=v;cash+=v;if(e.wt){cash+=e.rw;sc+=e.rw;hon=Math.min(100,hon+6);TX.push({x:P.x,y:P.y-38,s:'BOUNTY COLLECTED +$'+e.rw,l:120,c:'#ffd040'});snd(900,.4,'triangle');if(WT===e)WT=null;wnt=2400;for(let i=0;i<4;i++)F.push({x:e.x-12+i*8,y:e.y+4+rnd()*6,k:'m',v:60})}if(e.k==2)STAT.boss++;else STAT.kill++;hon=e.dep?Math.max(-100,hon-6):Math.min(100,hon+2);if(e.k!=2){CP.push({x:e.x,y:e.y,k:e.k,hc:e.hc,bc:e.bc,d:0});if(CP.length>40)CP.shift()}dm=Math.min(100,dm+(e.k==2?50:14));TX.push({x:e.x,y:e.y-22,s:'+'+v,l:45,c:C.cr});pf(e.x,e.y-8,18,C.k,2,26,.1);pf(e.x,e.y-8,8,e.hc,2,22,.1);
if(e.k==2){for(let i=0;i<5;i++)F.push({x:e.x+i*8-16,y:e.y+rnd()*8,k:'$'});F.push({x:e.x,y:e.y+10,k:'h'})}else if(e.k==3){F.push({x:e.x,y:e.y,k:'$'});F.push({x:e.x+6,y:e.y+4,k:'$'});F.push({x:e.x-6,y:e.y+4,k:'$'})}else if(rnd()<.55)F.push({x:e.x,y:e.y,k:'$'});else if(rnd()<.2)F.push({x:e.x,y:e.y,k:'h'})}}
function boom(r){if(r.hp>0&&r.hp!=-9)r.hp=0;r.hp=-9;
if(r.t){snd(70,.5,'sawtooth',.09);shake=10;pf(r.x,r.y-6,40,'#f6e3b4',3.5,22);pf(r.x,r.y-6,36,'#d46a52',3,26);pf(r.x,r.y-6,24,C.k,2.5,34,-.02);
for(const e of E)if(e.hp>0&&Math.hypot(e.x-r.x,e.y-r.y)<40)dmg(e,7);if(Math.hypot(P.x-r.x,P.y-r.y)<32)hurt(2);
for(const o of BR)if(o.hp>0&&Math.hypot(o.x-r.x,o.y-r.y)<40)boom(o)}else{pf(r.x,r.y-5,14,C.wd,2,24,.1);pf(r.x,r.y-5,8,C.wl,2,18,.1);if(rnd()<.6)F.push({x:r.x,y:r.y+4,k:'$'})}}
function upd(){const p=P;ACT=bestAct();coverUpd();if(mt){mt=0;if(ACT)ACT.go()}
if(tapDE){tapDE=0;deOn=deOn?0:(dm>=20?1:0);if(deOn)snd(120,.4,'sine',.08)}if(deOn){dm-=.5;if(dm<=0){dm=0;deOn=0}}else dm=Math.min(100,dm+.03);const sl=deOn&&tick%3;p.t++;p.cd--;p.iv>0&&p.iv--;p.fl>0&&p.fl--;
let dx=(K.d||K.ArrowRight?1:0)-(K.a||K.ArrowLeft?1:0),dy=(K.s||K.ArrowDown?1:0)-(K.w||K.ArrowUp?1:0);if(js.on){dx=js.x;dy=js.y}
let l=Math.hypot(dx,dy);if(l>1){dx/=l;dy/=l}p.m=l>.15;if(p.m){const v=(HR.on?2.1:1.15)*(1-.12*(wx==1)*wf);mv(p,dx*v,dy*v)}if(HR.on){HR.x=p.x;HR.y=p.y}
let n=null,nd=1e9;for(const e of E){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<nd){nd=d;n=e}}tgt=n;
if(j2.on&&Math.hypot(j2.x,j2.y)>.2)p.a=Math.atan2(j2.y,j2.x);else if(mouse.on)p.a=Math.atan2(cam.y+mouse.y/cam.z-(p.y-8),cam.x+mouse.x/cam.z-p.x);else if(n)p.a=Math.atan2(n.y-(n.k==2?14:8)-(p.y-8),n.x-p.x);else if(l>.15)p.a=Math.atan2(dy,dx);
if(p.rl>0){p.rl--;if(!p.rl){p.am=mx;snd(500,.08)}}if(K.r&&p.am<mx&&!p.rl)p.rl=70;if(p.am<=0&&!p.rl)p.rl=70;
const fh=md||K[' ']||(j2.on&&Math.hypot(j2.x,j2.y)>.3);
// Dead Eye: hold fire to mark targets, release to execute them all
if(!deOn)MK=[];else if(fh&&wp!=2&&p.am>0&&!p.rl&&!exq.length){if(tick%7==0&&MK.length<Math.min(6,p.am)){let bt=null,bd=1e9;for(const e of E)if(e.hp>0&&!MK.includes(e)){const d=Math.hypot(e.x-p.x,e.y-p.y);if(Math.abs(e.x-p.x)<190&&Math.abs(e.y-p.y)<140&&d<bd){bd=d;bt=e}}if(!bt)for(const r of BR)if(r.hp>0&&r.t&&!MK.includes(r)){const d=Math.hypot(r.x-p.x,r.y-p.y);if(d<150&&d<bd){bd=d;bt=r}}if(bt){MK.push(bt);snd(900+MK.length*80,.06,'triangle',.04)}}}else if(MK.length){exq=MK;MK=[];ext=0}
if(exq.length&&--ext<=0){ext=5;const e=exq.shift();if(e.hp>0&&p.am>0){const eb=e.k==2?14:8;p.a=Math.atan2(e.y-eb-(p.y-8),e.x-p.x);p.am--;p.cd=8;pf(p.x+Math.cos(p.a)*9,p.y-8+Math.sin(p.a)*9,5,'#fff3c0',1.6,5);for(let i=1;i<9;i++)Q.push({x:p.x+(e.x-p.x)*i/9,y:p.y-8+(e.y-eb-(p.y-8))*i/9,vx:0,vy:0,l:10,c:'#ffd04a',g:0});snd(420,.12,'square',.05);shake=Math.max(shake,2);if(BR.includes(e)){e.hp=0;boom(e)}else dmg(e,e.k==2?6:4)}}
if((fh&&(!deOn||wp==2))&&p.cd<=0&&(wp==2?dyn>0:p.am>0&&!p.rl)){if(wp==2){const c=Math.cos(p.a),s=Math.sin(p.a);dyn--;DY.push({x:p.x+c*6,y:p.y-8+s*6,vx:c*2.4,vy:s*2.4,l:55});p.cd=30;snd(300,.15,'triangle');if(!dyn)wp=0}else{const c=Math.cos(p.a),s=Math.sin(p.a),n=wp?6:1;for(let i=0;i<n;i++){const a=p.a+(rnd()-.5)*(wp?.5:.08),c=Math.cos(a),s=Math.sin(a),v=wp?3.6+rnd()*.8:4.4;B.push({x:p.x+c*8,y:p.y-8+s*8,vx:c*v,vy:s*v,o:1,l:wp?24:70})}p.am-=wp?Math.min(2,p.am):1;p.cd=(deOn?5:11)*(wp?2.4:1)|0;shake=Math.max(shake,1.5);pf(p.x+c*9,p.y-8+s*9,5,'#fff3c0',1.6,5);snd(wp?150:260,.14)}}
// enemies
for(const e of E){if(sl)continue;e.t++;e.fl>0&&e.fl--;const ex=p.x-e.x,ey=p.y-e.y,d=Math.hypot(ex,ey)||1;e.a=Math.atan2(ey,ex);if(e.dl){if(e.ag)e.dl=0;else continue}
if(!e.ag){if(d<(e.k==2?190:150)*VIS||e.fl>0)e.ag=1;else{if(e.t%120==1){e.wa=rnd()*6.28;e.ws=rnd()<.4?0:.28}if(e.ws){mv(e,Math.cos(e.wa)*e.ws,Math.sin(e.wa)*e.ws);e.a=e.wa}continue}}else if(d>340&&e.k!=3)e.ag=0;
if(e.k==2){if(e.dash>0){e.dash--;mv(e,ex/d*2.3,ey/d*2.3)}else{mv(e,ex/d*.5,ey/d*.5);if(e.t%140==0)e.dash=38}if(d<16)hurt(1)}
else if(e.k>3){if(e.tl>0)e.fl=3;enemy2(e,d,ex,ey)}
else{const want=e.k?60:85,sp=e.k?.8:.55;if(d>want+10)mv(e,ex/d*sp,ey/d*sp);else if(d<want-15)mv(e,-ex/d*sp,-ey/d*sp);else mv(e,-ey/d*sp*.7*e.s,ex/d*sp*.7*e.s);
if(e.t%100==0)e.s=-e.s;if(--e.cd<=0&&d<Math.max(90,180*VIS)){e.cd=e.k?60:100;const sh=e.k==3?[-.05,.05]:e.k?[-.2,0,.2]:[(rnd()-.5)*.25];for(const o of sh){const a=e.a+o;B.push({x:e.x+Math.cos(a)*7,y:e.y-8+Math.sin(a)*7,vx:Math.cos(a)*1.6,vy:Math.sin(a)*1.6,o:0,l:140})}pf(e.x+Math.cos(e.a)*8,e.y-8,3,'#fff3c0',1,4);snd(180,.1,'square',.02)}}}
// villagers, animals, hunters
for(const v of V){if(v.hp<=0)continue;if(v.fx){v.t++;v.fl>0&&v.fl--;continue}v.t++;v.fl>0&&v.fl--;if(v.t%100==1){v.wa=rnd()*6.28;v.ws=rnd()<.35?0:.25}if(v.x<70||v.x>350||v.y<114||v.y>186){v.wa=Math.atan2(150-v.y,210-v.x);v.ws=.3}v.m=v.ws>0;if(v.ws)mv(v,Math.cos(v.wa)*v.ws,Math.sin(v.wa)*v.ws);v.a=v.wa}
for(const a of AN){if(a.hp<=0)continue;a.t++;a.fl>0&&a.fl--;a.cd>0&&a.cd--;const dx=p.x-a.x,dy=p.y-a.y,d=Math.hypot(dx,dy)||1;let vx=0,vy=0,sp=.3;if(a.s==0&&d<110){vx=-dx/d;vy=-dy/d;sp=1.15}else if(a.s==1&&d<100){vx=dx/d;vy=dy/d;sp=.9;if(d<9&&!a.cd){hurt(1);a.cd=60}}else if(a.s==2&&a.hp<a.mx&&d<260){vx=dx/d;vy=dy/d;sp=1.1;if(d<13&&!a.cd){hurt(1);a.cd=60}}else{if(a.t%110==1){a.wa=rnd()*6.28;a.ws=rnd()<.4?0:1}vx=Math.cos(a.wa)*a.ws;vy=Math.sin(a.wa)*a.ws}if(vx||vy){mv(a,vx*sp,vy*sp);a.f=vx<0}}
if(!WT&&wave>=2&&--wnt<=0){const q=evPick();if(q){const nm=['RATTLESNAKE JACK','ONE-EYE PETE','BLACK BART','LOUD MARY','COYOTE KANE','DOC HOLLOW','SILAS CROW','NINE-TOES TOM'][rnd()*8|0],rw=Math.round((250+wave*40)/10)*10;WT=mkE(q[0],q[1],1,{wt:nm,rw,hp:8+wave+(wave/2|0),ag:0,age:0,hc:'#2a2a2a',bc:'#7a2a1a',bd:'#e8c050'});E.push(WT);TX.push({x:p.x,y:p.y-38,s:'WANTED: '+nm+'  $'+rw,l:140,c:'#ffd040'});snd(520,.35,'triangle',.06)}else wnt=300}
if(WT&&++WT.age>5400){E=E.filter(x=>x!==WT);TX.push({x:p.x,y:p.y-38,s:WT.wt+' ESCAPED',l:80,c:C.r});WT=null;wnt=1800}
if(HR.call&&!HR.on){const hx=p.x-HR.x,hy=p.y-HR.y,hd=Math.hypot(hx,hy)||1;let go=hd<20?1:0;if(!go){if(hd<(HR.bd||1e9)-1){HR.bd=hd;HR.ct=0}else if(++HR.ct>40)go=2;if(!go){const ox=HR.x,oy=HR.y;mv(HR,hx/hd*2.4,hy/hd*2.4);if(HR.x==ox&&HR.y==oy){HR.sd=HR.sd||1;mv(HR,-hy/hd*2.4*HR.sd,hx/hd*2.4*HR.sd);if(HR.x==ox&&HR.y==oy)HR.sd=-HR.sd}}}if(go==2)for(let i=0;i<12;i++){const a=i*.52,x=p.x+Math.cos(a)*26,y=p.y+Math.sin(a)*26;if(!rr(x,y,5)){HR.x=x;HR.y=y;break}}if(go){HR.call=0;HR.ct=0;HR.bd=0}}
nc=CP.some(c=>!c.d&&Math.hypot(c.x-p.x,c.y-p.y)<22);
if(bounty>=300&&--hs<=0){hs=Math.max(500,1600-bounty);if(E.filter(e=>e.k==3).length<1+(bounty/800|0)){spawn(3);TX.push({x:p.x,y:p.y-30,s:'BOUNTY HUNTERS!',l:70,c:C.r});snd(150,.5,'sawtooth',.06)}}
// bullets
for(const q of B){if(sl&&!q.o)continue;q.x+=q.vx;q.y+=q.vy;q.l--;if(q.x<0||q.x>WW||q.y<10||q.y>WH)q.l=0;
for(const o of O)if(q.x>o[0]&&q.x<o[0]+o[2]&&q.y+8>o[1]&&q.y+8<o[1]+o[3]){q.l=0;pf(q.x,q.y,3,C.wl,1.2,8)}
for(const r of BR)if(r.hp>0&&q.l>0&&Math.abs(q.x-r.x)<5&&q.y>r.y-9&&q.y<r.y+2){q.l=0;r.hp--;pf(q.x,q.y,3,C.wl,1.2,8);if(r.hp<=0)boom(r)}
if(q.o){for(const v of V)if(q.l>0&&v.hp>0&&Math.abs(q.x-v.x)<5&&Math.abs(q.y-(v.y-8))<8){q.l=0;v.hp--;v.fl=5;hon=Math.max(-100,hon-8);bounty+=60;TX.push({x:v.x,y:v.y-22,s:v.hp>0?'HEY!':'MURDER!',l:50,c:C.r});if(v.hp<=0){hon=Math.max(-100,hon-25);bounty+=400;pf(v.x,v.y-8,14,C.r,2,26,.1)}}
for(const a of AN)if(q.l>0&&a.hp>0&&Math.abs(q.x-a.x)<8&&Math.abs(q.y-(a.y-6))<8){q.l=0;a.hp--;a.fl=4;pf(a.x,a.y-6,4,C.r,1.5,12,.08);if(a.hp<=0){const v=[70,40,160][a.s];F.push({x:a.x,y:a.y,k:'m',v});TX.push({x:a.x,y:a.y-14,s:'HUNTED',l:40,c:C.cr})}}
for(const e of E){const bo=e.k==2;if(q.l>0&&e.hp>0&&Math.abs(q.x-e.x)<(bo?10:5)&&Math.abs(q.y-(e.y-(bo?14:8)))<(bo?15:8)){q.l=0;dmg(e,deOn?2:1)}}}
else if(p.iv<=0&&Math.abs(q.x-p.x)<4&&Math.abs(q.y-(p.y-8))<7){q.l=0;if(P.cv&&rnd()<.7){pf(q.x,q.y,4,C.wl,1.5,10);snd(220,.05,'square',.03)}else hurt(1)}}
for(const d of DY){d.l--;if(d.l>25){const nx=d.x+d.vx,ny=d.y+d.vy;if(!rr(nx,ny+8,2)){d.x=nx;d.y=ny}}if(d.l<=0)boom({x:d.x,y:d.y+8,t:1,hp:1})}DY=DY.filter(d=>d.l>0);
B=B.filter(q=>q.l>0);E=E.filter(e=>e.hp>0);
for(const f of F)if(Math.hypot(f.x-p.x,f.y-p.y)<10){f.d=1;if(f.k=='$'){sc+=50;cash+=50;TX.push({x:f.x,y:f.y-12,s:'+50',l:35,c:C.cr});snd(900,.08,'triangle')}else if(f.k=='m'){sc+=f.v;cash+=f.v;TX.push({x:f.x,y:f.y-12,s:'+$'+f.v,l:40,c:C.cr});snd(700,.1,'triangle')}else{p.hp=Math.min(mh,p.hp+1);TX.push({x:f.x,y:f.y-12,s:'+1 HP',l:40,c:'#ff9a8a'});snd(600,.15,'triangle')}}
F=F.filter(f=>!f.d);
if(left>0&&E.length<(6+wave/2|0)&&--st<=0){spawn();left--;st=45}
if(!left&&!E.some(e=>!e.ev&&!e.wt)&&!(trn.on&&trn.st==1)&&hk.bank!=1&&++wd>90){wd=0;saveG(wave+1);S='s';snd(700,.2,'triangle')}
// train
if(--trn.t==150){snd(330,.8,'sawtooth',.06);const gd=((trn.n|0)+1)%2==0;TX.push({x:P.x,y:P.y-30,s:gd?'GOLD TRAIN!':'TRAIN!',l:60,c:gd?'#ffd86a':C.r})}if(trn.t<=0&&!trn.on){trn.on=1;trn.x=WW+20;trn.t=2000;trn.n=(trn.n|0)+1;trn.g=trn.n%2==0;trn.st=0;trn.rob=0;trn.sT=0}
if(trn.on){if(trn.g&&!trn.st&&trn.x<=360){trn.st=1;trn.sT=1100;guards()}
if(trn.st==1){trn.sT--;if(trn.rob)trn.sT=Math.min(trn.sT,140);if(trn.sT<=0){trn.st=2;hk.tr=0}if(tick%6==0)pf(trn.x+11,156,1,'#d8d0c0',.6,30,-.04)}
else{trn.x-=trn.st==2?4.2:3.2;if(tick%4==0)pf(trn.x+11,156,1,'#d8d0c0',.6,30,-.04);const hit=e=>e.x>trn.x-4&&e.x<trn.x+172&&e.y>172&&e.y<196;if(hit(p))hurt(2);E.forEach(e=>hit(e)&&dmg(e,9))}
if(trn.x<-190)trn.on=0}
heistUpd();evUpd();
}
function misc(){for(const q of Q){q.x+=q.vx;q.y+=q.vy;q.vy+=q.g;q.l--}Q=Q.filter(q=>q.l>0);for(const t of TX)t.l--;TX=TX.filter(t=>t.l>0);shake*=.85;ban>0&&ban--;tod();musTick();tutor();stCheck();
{const mo=HR.on,pl=S=='p',vx=cam.px==null?0:P.x-cam.px,vy=cam.px==null?0:P.y-cam.py;cam.px=P.x;cam.py=P.y;const sp=Math.hypot(vx,vy);
let ox=0,oy=0;if(pl){if(j2.on&&Math.hypot(j2.x,j2.y)>.2){ox=j2.x*46;oy=j2.y*46}else if(mouse.on){ox=(mouse.x-W/2)*.32;oy=(mouse.y-H/2)*.32}else{ox=Math.cos(P.a)*14;oy=Math.sin(P.a)*14}
ox+=vx*(mo?20:9);oy+=vy*(mo?20:9)}
const ml=Math.hypot(ox,oy),mx2=mo?90:64;if(ml>mx2){ox*=mx2/ml;oy*=mx2/ml}
cam.lx+=(ox-cam.lx)*(mo?.03:.055);cam.ly+=(oy-cam.ly)*(mo?.03:.055);
const zt=!pl?1:deOn?1.2:mo?(sp>1.5?.8:.92):(md||(j2.on&&Math.hypot(j2.x,j2.y)>.3))?1.06:1;cam.z+=(zt-cam.z)*(deOn?.1:.04);if(Math.abs(zt-cam.z)<.003)cam.z=zt;cam.z=Math.max(.78,Math.min(1.25,cam.z));
const vw=W/cam.z,vh=H/cam.z,bob=mo&&sp>.5?Math.sin(tick*.33)*(sp>1.5?1.3:.6):0;
const tx=Math.max(0,Math.min(WW-vw,P.x+cam.lx-vw/2)),ty=Math.max(0,Math.min(WH-vh,P.y-10+cam.ly+bob-vh/2));
cam.x+=(tx-cam.x)*(mo?.07:.12);cam.y+=(ty-cam.y)*(mo?.07:.12)}
const zn=(P.x>780||P.y>490)?(P.x>1100?'DEAD MAN FLATS':P.y>700?'THE BADLANDS':'RIO BRAVO'):P.y>296?(P.x<150?'GRAVEYARD':P.x<360?'OUTLAW CAMP':'CHAPEL RIDGE'):(P.x<384?'VALENTINE':'SANTA FE DEPOT');if(S=='p'&&zn!=zone){zone=zn;zb=150}zb>0&&zb--;if(tick%9==0)pf(252,372,1,'#ffb040',.4,28,-.03);
tw.x+=.8;tw.y+=Math.sin(tick/20)*.3;if(tw.x>WW+20){tw.x=-20;tw.y=120+rnd()*(WH-200)}}
