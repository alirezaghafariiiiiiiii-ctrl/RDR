/* heist.js - bank robbery, gold train robbery, enemy factory */
const BK=[293,114],bar=(x,y,p)=>{R(C.k,x-17,y,34,6);R('#e8c050',x-15,y+1,32*p,4)};
const mkE=(x,y,k,o)=>Object.assign({x,y,k,hp:[2,3,14+wave*2,8+wave][k],ag:1,cd:50+rnd()*50,t:0,s:rnd()<.5?1:-1,fl:0,dash:0,a:0,m:1,hc:['#4f6a2a','#e8d8a8','#000','#1a1a2a','#6a5a3a','#a85a2a','#3a2a1a'][k],bc:['#8a5a3a','#7a5a9a','#000','#6a1a1a','#4a6a4a','#8a3a2a','#5a2a5a'][k],bd:k==1?C.r:0},o||{});
function nearH(){if(S!='p')return 0;if(!hk.bank&&hk.bcd<=0&&Math.hypot(P.x-BK[0],P.y-BK[1])<24)return 1;if(trn.on&&trn.st==1&&!trn.rob&&!hk.tr&&Math.hypot(P.x-(trn.x+142),P.y-206)<28)return 2;return 0}
function heistAct(){const w=nearH();if(!w)return 0;if(w==1){hk.bank=1;hk.pb=0;hk.sp=60;hk.gv=0;bounty+=500;hon=Math.max(-100,hon-10);TX.push({x:P.x,y:P.y-30,s:'STICK EM UP!',l:70,c:C.r});snd(180,.6,'sawtooth',.07)}else{hk.tr=1;hk.pt=0;TX.push({x:P.x,y:P.y-30,s:'PLANTING CHARGES',l:60,c:C.cr});snd(300,.2,'triangle')}return 1}
function guards(){for(let i=0,j=0;i<4&&j<60;j++){const x=trn.x+20+rnd()*150,y=206+rnd()*30;if(rr(x,y,4))continue;E.push(mkE(x,y,i==3?1:0));i++}TX.push({x:P.x,y:P.y-34,s:'GOLD TRAIN STOPPED!',l:90,c:'#ffd86a'})}
function heistUpd(){nH=nearH();hk.bcd>0&&hk.bcd--;
if(hk.bank==1){const d=Math.hypot(P.x-BK[0],P.y-BK[1]);if(d<46)hk.pb=Math.min(1,hk.pb+1/300);else hk.pb=Math.max(0,hk.pb-.004);if(d>=46&&hk.pb<=0&&++hk.gv>240){hk.bank=0;hk.bcd=1200;TX.push({x:P.x,y:P.y-30,s:'HEIST ABORTED',l:60,c:C.cr})}
if(--hk.sp<=0){hk.sp=170;if(E.filter(e=>e.dep).length<3+(wave/3|0))E.push(mkE(285+rnd()*16,254,1,{dep:1,hc:'#3a5a8a',bc:'#6a7aa0',bd:'#e8d060'}))}
if(hk.pb>=1){hk.bank=0;hk.bcd=5400;cash+=1000;sc+=1000;bounty+=300;STAT.bank++;for(let i=0;i<5;i++)F.push({x:BK[0]-16+i*8,y:BK[1]+8+rnd()*6,k:'m',v:100});TX.push({x:P.x,y:P.y-30,s:'VAULT CRACKED +$1000',l:90,c:C.cr});snd(900,.4,'triangle');shake=6}}
if(hk.tr==1){const d=Math.hypot(P.x-(trn.x+142),P.y-206);if(d<32)hk.pt=Math.min(1,hk.pt+1/240);else hk.pt=Math.max(0,hk.pt-.006);if(hk.pt>=1){hk.tr=0;trn.rob=1;STAT.train++;cash+=1100;sc+=1100;bounty+=400;hon=Math.max(-100,hon-8);for(let i=0;i<6;i++)F.push({x:trn.x+124+i*8,y:212+rnd()*8,k:'m',v:100});TX.push({x:P.x,y:P.y-30,s:'GOLD CAR OPENED +$1100',l:90,c:C.cr});snd(900,.4,'triangle');shake=8}}
if(!trn.on||trn.st!=1)hk.tr=0}
function heistWorld(){if(hk.bank==1)bar(BK[0],BK[1]-14,hk.pb);if(hk.tr==1)bar(trn.x+142,196,hk.pt);if(trn.on&&trn.g&&trn.st==1&&!trn.rob&&!hk.tr&&(tick>>4&1))T('GOLD',trn.x+142,166,'#ffd86a',6)}
