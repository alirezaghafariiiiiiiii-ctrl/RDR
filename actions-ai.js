/* actions-ai.js - context action button, cover, enemy variants and AI
   NOTE: the mount/dismount action is called rideH(). The sprite is horse(x,y,c) in core.js.
   (They used to share the name "horse", which broke riding.) */
function rideH(){if(S!='p')return;if(HR.on){HR.on=0;HR.x=P.x;HR.y=P.y}else if(Math.hypot(HR.x-P.x,HR.y-P.y)<28){HR.on=1;snd(200,.12,'triangle')}else{HR.call=1;HR.ct=0;HR.bd=0;TX.push({x:P.x,y:P.y-26,s:'WHISTLE! HORSE COMING',l:50,c:C.cr});snd(1100,.25,'sine',.05)}}
function bestAct(){const p=P,L=[],cp=CP.find(c=>!c.d&&Math.hypot(c.x-p.x,c.y-p.y)<22);if(cp)L.push({pr:3,l:'LOOT BODY',s:'LOOT',go:()=>loot(cp)});
const w=nearH();if(w)L.push({pr:5,l:w==1?'ROB THE BANK':'CRACK THE SAFE',s:'ROB',go:()=>heistAct()});
if(EV&&EV.ty=='merchant'&&EV.s.hp>0&&Math.hypot(p.x-EV.s.x,p.y-EV.s.y)<28){const o=hon<-40?['NO SERVICE',0]:offer();L.push({pr:4,l:o[0]+(o[1]?' $'+o[1]:''),s:'BUY',go:()=>evAct()})}
if(!L.length&&!HR.on&&Math.hypot(HR.x-p.x,HR.y-p.y)<28)L.push({pr:1,l:'MOUNT HORSE',s:'RIDE',go:rideH});if(!L.length&&HR.on)L.push({pr:1,l:'DISMOUNT',s:'OFF',go:rideH});
L.sort((a,b)=>b.pr-a.pr);return L[0]||null}
function promptDraw(){if(S!='p')return;if(P.cv)T('COVER',P.x,P.y-26,'#7ad0ff',5);if(ACT)T((tm?'':'E  ')+ACT.l,P.x,P.y-34-(HR.on?8:0),C.cr,6)}
function coverUpd(){const p=P;p.cv=0;if(p.m||HR.on)return;let ne=null,nd=230;for(const e of E)if(e.ag){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<nd){nd=d;ne=e}}if(!ne)return;const a=Math.atan2(ne.y-p.y,ne.x-p.x);p.cv=rr(p.x+Math.cos(a)*11,p.y+Math.sin(a)*11,3)?1:0}
function eh(k){return[2+(wave>6?1:0),3+(wave>5?1:0),14+wave*2,8+wave,3+(wave>8?1:0),2,5+(wave>7?1:0)][k]}
function pickK(){const r=rnd(),w=wave,q=w>=5?.12:0,t=w>=4?.12:0,f=w>=3?.14:0;if(r<q)return 6;if(r<q+t)return 5;if(r<q+t+f)return 4;return w>1&&rnd()<.3+w*.03?1:0}
function enemy2(e,d,ex,ey){const k=e.k;
if(k==4){const want=170;if(e.aim>0){e.aim--;if(e.aim>8)e.a=Math.atan2(P.y-8-(e.y-8),P.x-e.x);if(e.aim==0){const a=e.a;B.push({x:e.x+Math.cos(a)*8,y:e.y-8+Math.sin(a)*8,vx:Math.cos(a)*3.3,vy:Math.sin(a)*3.3,o:0,l:120});pf(e.x+Math.cos(a)*9,e.y-8,4,'#fff3c0',1,4);snd(120,.2,'sawtooth',.04);e.cd=120}}
else{if(d>want+30)mv(e,ex/d*.55,ey/d*.55);else if(d<want-40)mv(e,-ex/d*.8,-ey/d*.8);else mv(e,-ey/d*.25*e.s,ex/d*.25*e.s);if(e.t%110==0)e.s=-e.s;if(--e.cd<=0&&d<300)e.aim=28}}
else if(k==5){const want=115;if(d>want+25)mv(e,ex/d*.6,ey/d*.6);else if(d<want-30)mv(e,-ex/d*.7,-ey/d*.7);else mv(e,-ey/d*.3*e.s,ex/d*.3*e.s);if(e.t%90==0)e.s=-e.s;
if(--e.cd<=0&&d<230&&d>50){e.cd=170;const v=Math.min(3,d/30);DY.push({x:e.x,y:e.y-8,vx:ex/d*v,vy:ey/d*v,l:55,en:1});TX.push({x:e.x,y:e.y-26,s:'TNT!',l:40,c:C.r});snd(300,.15,'triangle')}}
else{if(e.dash>0){e.dash--;mv(e,Math.cos(e.da)*3,Math.sin(e.da)*3);if(d<13&&!e.hit2){e.hit2=1;hurt(1);shake=4}}
else if(e.tl>0){e.tl--;e.a=Math.atan2(ey,ex);if(e.tl==0){e.da=e.a;e.dash=16;e.hit2=0}}
else{mv(e,ex/d*1.05,ey/d*1.05);if(d<75&&--e.cd<=0){e.tl=18;e.cd=70;TX.push({x:e.x,y:e.y-26,s:'!',l:20,c:C.r})}}}}
function lasers(){for(const e of E)if(e.aim>0){const a=e.a;g.strokeStyle='rgba(255,50,40,'+(.15+.55*(1-e.aim/28))+')';g.lineWidth=1;g.beginPath();g.moveTo(e.x,e.y-8);g.lineTo(e.x+Math.cos(a)*260,e.y-8+Math.sin(a)*260);g.stroke()}}
