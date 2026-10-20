/* core.js - canvas setup, palette, drawing helpers, baked world (town + map) */
let H=288,BY=0,g,gM;const W=384,cv=document.getElementById('c'),bgc=document.createElement('canvas');g=gM=cv.getContext('2d');const wc=document.createElement('canvas');wc.width=520;wc.height=1080;const gW=wc.getContext('2d');gW.imageSmoothingEnabled=false;
const WW=1536,WH=960,cam={x:0,y:0,z:1,lx:0,ly:0,px:null,py:0},trn={x:9999,on:0,t:900};let zone='',zb=0;bgc.width=WW;bgc.height=WH;const b=bgc.getContext('2d');g.imageSmoothingEnabled=b.imageSmoothingEnabled=false;
const C={s:'#e8bd68',s2:'#dba85a',sd:'#c99048',w:'#d8964a',wl:'#ecb464',wd:'#a8622e',wdd:'#6e3d2a',t:'#5b9aa0',td:'#3f7a86',p:'#8a6a9c',pl:'#c8a0b8',cr:'#f6e3b4',r:'#b04a36',k:'#3a2438',gr:'#8a9a4a'};
let X=b,sd=7;const sr=()=>(sd=sd*16807%2147483647)/2147483647,rnd=Math.random;
const R=(c,x,y,w,h)=>{X.fillStyle=c;X.fillRect(Math.round(x),Math.round(y),w,h)};
const T=(s,x,y,c,z=6,al='center')=>{X.font=z+'px "Press Start 2P",monospace';X.textAlign=al;X.fillStyle=c;X.fillText(s,Math.round(x),Math.round(y))};
/* ---------- static town ---------- */
function sh(x,y,w,h,a){X.fillStyle='rgba(42,27,44,'+.2*(a||1)+')';X.beginPath();X.ellipse(x,y,w/2,h/2,0,0,6.3);X.fill()}
function bld(x,y,w,h,rh,wc){sh(x+w/2+7,y+h,w+16,10,1.3);for(let i=0;i<10;i++)R('#2a1b2c'+(i<5?'30':'22'),x+w+i,y+rh+i*.6,1,h-rh-2);R(C.wl,x+3,y-7,w-6,7);R(C.w,x+3,y-5,w-6,5);for(let i=x+6;i<x+w-3;i+=4)R(C.wd,i,y-7,1,7);R('#ffffff2a',x+3,y-7,w-6,1);R(C.wdd,x+3,y-1,w-6,1);R(C.wl,x,y,w,2);R(C.w,x,y+2,w,rh-2);for(let i=x+3;i<x+w;i+=4)R(C.wd,i,y+2,1,rh-2);R(C.wd,x,y+rh-2,w,2);R(C.wdd,x,y+rh,w,1);R(wc,x+2,y+rh+1,w-4,h-rh-1);for(let j=y+rh+4;j<y+h;j+=4)R('#0002',x+2,j,w-4,1);R(C.wdd,x+2,y+h-2,w-4,2);R('#00000026',x+2,y+h-6,w-4,4);R('#ffffff14',x+2,y+rh+1,w-4,2);R('#00000020',x+w-6,y+rh+1,4,h-rh-1);R('#ffffff10',x+2,y+rh+1,3,h-rh-1)}
function tree(x,y){sh(x+20,y+37,36,10,1.3);R('#5a3f6a',x+10,y+24,8,14);R('#3a2848',x+14,y+24,4,14);R('#5a3f6a',x+8,y+36,12,2);[[8,0,12],[4,4,20],[0,8,28],[0,14,28],[2,20,24],[6,24,16]].forEach(([a,c,w])=>{R(C.cr,x+a,y+c,w,4);R(C.pl,x+a+2,y+c+2,w-4,2);R('#ffffff30',x+a+1,y+c,Math.max(2,w/3),2);R('#6a4a7a44',x+a+w-4,y+c+2,4,2)})}
function dead(x,y){const c='#6a4a7a';R(c,x+6,y+10,5,18);R(c,x,y+4,4,10);R(c,x+2,y+12,6,3);R(c,x+11,y,4,16);R(c,x+9,y+10,4,3)}
function fence(x,y,n){for(let i=0;i<n;i++)R(C.wd,x+i*8,y,2,10);R(C.wl,x,y+2,n*8,2);R(C.wl,x,y+6,n*8,2)}
function crate(x,y){sh(x+6,y+9,13,4,1.1);R(C.wdd,x,y,9,9);R(C.wl,x+1,y+1,7,7);R(C.wd,x+1,y+4,7,1);R(C.wd,x+4,y+1,1,7)}
function rock(x,y,s=1){sh(x+5*s,y+6*s,11*s,4*s,1.2);R(C.wd,x,y+2*s,8*s,4*s);R(C.sd,x+s,y,6*s,4*s);R(C.wl,x+2*s,y,3*s,s)}
function bag(x,y){R('#7a5a2a',x,y+2,7,6);R(C.cr,x+1,y,5,2);R(C.cr,x+3,y+4,1,2)}
function bg(){X=b;sd=7;R(C.s,0,0,WW,WH);R('#e2b25f',0,112,W,74);R('#dba85a',0,112,W,1);R('#dba85a',0,185,W,1);
for(let i=0;i<9600;i++)R(sr()<.5?C.s2:C.sd,sr()*WW,sr()*WH,1,1);
for(let i=0;i<360;i++){X.fillStyle=sr()<.5?'#d9a45a1c':'#b8844024';X.beginPath();X.ellipse(sr()*WW,sr()*WH,14+sr()*40,5+sr()*14,0,0,6.3);X.fill()}for(let i=0;i<280;i++){const x=sr()*WW,y=sr()*WH;R('#6f8a4a',x,y,1,3);R('#8a9a5a',x+2,y+1,1,2);R('#6f8a4a',x+4,y,1,3)}
for(let i=0;i<440;i++){const x=sr()*WW,y=sr()*WH;R(C.sd,x,y,3,1);R(C.sd,x+1,y-1,1,1)}
tree(2,38);tree(146,184);dead(12,172);dead(350,172);dead(206,236);
fence(8,98,7);fence(334,114,6);fence(268,176,5);
// saloon
bld(56,30,62,22,18,C.w);bld(24,46,126,64,24,C.t);
R(C.wd,24,70,126,2);R(C.wdd,24,72,126,1);
for(const wx of[34,116]){R(C.wdd,wx-1,81,24,18);R(C.k,wx,82,22,16);[[2,3],[12,3],[2,9],[12,9]].forEach(([a,c])=>R('#e8d29a',wx+a,82+c-1,8,5))}
R(C.wdd,78,78,24,26);R(C.k,80,80,20,22);R(C.wd,82,82,8,14);R(C.wd,91,82,8,14);R(C.wl,83,83,1,12);
R(C.wdd,104,76,30,10);R(C.wl,105,77,28,8);T('SALOON',119,84,C.wdd,5);
R(C.cr,138,82,8,12);R(C.r,140,84,4,4);R(C.cr,138,96,8,1);
R(C.wl,28,108,118,4);R(C.wd,28,112,118,2);for(let x=30;x<146;x+=14){R(C.wdd,x,100,2,10)}R(C.wd,28,100,118,1);
R(C.td,24,100,126,1);
// bank
sh(306,108,92,10,1.4);R('#2a1b2c26',340,30,8,78);R(C.wdd,262,24,78,38);R(C.wl,264,26,74,32);R(C.wd,264,26,74,2);R(C.wd,264,56,74,2);
R('#c9824f',262,60,78,48);for(let y=60;y<108;y+=4){R('#a8602f',262,y,78,1);for(let x=262+((y/4)%2)*4;x<340;x+=8)R('#a8602f',x,y,1,4)}
R(C.wdd,264,64,74,20);R(C.cr,266,66,70,16);T('BANK',301,79,'#4a5a9a',10);
R(C.wdd,283,86,20,22);R(C.wd,285,88,7,20);R(C.wd,294,88,7,20);
R(C.k,268,90,12,10);R(C.k,322,90,12,10);R(C.wdd,262,106,78,2);
// sheriff
bld(258,198,82,48,22,C.wl);R(C.wdd,264,220,70,12);R(C.w,265,221,68,10);T('Sheriff',299,229,C.wdd,7);
R(C.wdd,284,232,14,14);R(C.k,286,234,10,12);R(C.k,266,234,12,8);R(C.cr,318,232,10,12);R(C.r,320,234,6,3);
// cabin
bld(10,216,72,46,22,C.w);R(C.wdd,22,236,16,26);R(C.k,24,238,12,24);R(C.k,52,238,14,12);R(C.cr,53,239,5,4);R(C.cr,60,239,5,4);R(C.cr,53,244,5,4);R(C.cr,60,244,5,4);
R(C.cr,38,222,12,3);R(C.cr,36,220,2,3);R(C.cr,50,220,2,3);R(C.k,41,225,2,2);R(C.k,46,225,2,2);
// covered wagon
R(C.wdd,38,148,42,4);R(C.cr,40,134,38,14);R(C.cr,43,131,32,3);R('#d8c590',40,142,38,2);R(C.wd,40,148,38,2);
for(const wx of[46,68]){R(C.k,wx,148,8,8);R(C.wl,wx+2,150,4,4);R(C.k,wx+3,151,2,2)}
crate(86,128);bag(96,146);bag(100,142);crate(270,112);bag(318,112);bag(326,116);crate(344,130);crate(330,134);
rock(100,60,1);rock(150,118,1);rock(350,240,2);rock(210,258);rock(20,190);rock(300,150);
for(let i=0;i<6;i++){const x=30+sr()*320,y=190+sr()*90;R(C.cr,x,y,3,1);R(C.cr,x+1,y+1,1,1)}
world2();X=g}
function mesa(x,y,w,h){const cs=[C.wl,C.w,'#c46e3a',C.wd,'#8a4a30'];for(let j=0;j<h;j+=5)R(cs[(j/5|0)%5],x,y+j,w,Math.min(5,h-j));R('#ffffff30',x,y,w,1);for(let i=0;i<w/5;i++)R('#0003',x+sr()*w,y+sr()*h,1,3+sr()*6);R('#0004',x,y+h-3,w,3);R('#0003',x,y,2,h);R('#00000028',x+w-4,y,4,h);R('#ffffff22',x,y,w,2);R('#2a1b2c2a',x,y+h,w,5);R('#2a1b2c26',x+w,y+5,6,h)}
function cactus(x,y){sh(x+9,y+16,16,5,1);const c='#4f6a3a';R('#2f4a2a',x+8,y+2,3,14);R(c,x+4,y,4,16);R(c,x,y+5,3,6);R(c,x,y+9,6,2);R(c,x+9,y+3,3,6);R(c,x+6,y+7,6,2);R('#6f8a4a',x+5,y+1,1,14);R('#e8a0a0',x+5,y-1,2,1)}
function tomb(x,y,c){if(c){R(C.wdd,x+3,y,2,10);R(C.wdd,x,y+3,8,2)}else{R('#9a8a9a',x,y,8,8);R('#7a6a7a',x,y+6,8,2);R('#c8b8c8',x+1,y+1,6,1)}}
function tent(x,y,w){sh(x+w/2+6,y+26,w+14,9,1.2);for(let j=0;j<12;j++){const hw=j*w/24+1;R(j%4<2?C.cr:'#e8d8a8',x+w/2-hw,y+j*2,hw*2,2)}R(C.k,x+w/2-3,y+14,6,10);R(C.wdd,x+w/2-1,y-4,2,6)}
function horse(x,y,c){sh(x+10,y+14,24,6,1.3);R(c,x,y,16,8);R('#00000030',x,y+5,16,3);R('#ffffff22',x+1,y,14,1);R(c,x+14,y-6,5,9);R(C.k,x+16,y-5,1,1);for(const l of[1,5,10,13])R(c,x+l,y+8,2,6);R(C.k,x-2,y,2,6);R(C.k,x+13,y-6,2,6);R(C.r,x+5,y-1,6,2)}
function world2(){R('#e2b25f',384,112,WW-384,74);R('#e2b25f',170,266,56,36);R('#e2b25f',0,300,WW,24);
R('#b8946a',360,172,WW-360,24);for(let x=360;x<WW;x+=6)R(C.wdd,x,176,3,16);R('#7a7a8a',360,179,WW-360,2);R('#7a7a8a',360,188,WW-360,2);R('#c0c0d0',360,179,WW-360,1);R('#c0c0d0',360,188,WW-360,1);
for(let x=400;x<WW-20;x+=90){R(C.wdd,x,150,3,26);R(C.wdd,x-5,152,13,2);R('#3a243866',x,153,90,1)}
bld(424,84,96,62,24,C.t);R(C.wdd,444,106,56,14);R(C.cr,446,108,52,10);T('DEPOT',472,116,C.wdd,7);R(C.k,432,118,14,14);R(C.k,500,118,14,14);R(C.wdd,466,122,16,24);R(C.k,468,124,12,22);R(C.wl,408,146,128,10);R(C.wd,408,156,128,3);
R(C.wdd,566,98,3,12);R(C.wdd,584,98,3,12);R(C.wd,564,70,26,26);R(C.w,566,72,22,22);for(let i=0;i<4;i++)R(C.wdd,564,76+i*5,26,1);R(C.wdd,570,62,14,8);R(C.k,562,68,30,2);
crate(620,138);crate(631,138);crate(625,129);crate(636,148);mesa(668,26,86,64);
bld(450,322,70,66,26,C.cr);R(C.wd,478,296,14,28);R(C.wl,480,298,10,24);R(C.cr,484,286,2,10);R(C.cr,481,289,8,2);R(C.t,460,350,8,14);R(C.t,502,350,8,14);R(C.wdd,478,358,14,30);R(C.k,480,360,10,28);
R(C.wdd,604,350,10,36);R(C.wd,602,382,14,6);R(C.wdd,600,384,3,6);R(C.wdd,615,384,3,6);mesa(676,384,76,66);
fence(24,326,12);fence(24,432,12);[[40,350,1],[62,346,1],[84,356,0],[50,382,0],[78,386,1],[100,372,0]].forEach(a=>tomb(...a));dead(110,396);
tent(176,350,36);tent(292,360,36);R(C.wdd,244,386,16,3);for(let a=0;a<6;a++)R('#7a6a7a',251+Math.cos(a)*9,386+Math.sin(a)*6,3,3);
horse(312,410,C.k);crate(226,372);bag(232,396);crate(182,382);bag(300,392);
CA.forEach(c=>cactus(c[0],c[1]));rock(560,272,2);rock(300,440);rock(130,450);
ZN.forEach(z=>z[0]=='c'?cactus(z[1],z[2]):z[0]=='r'?rock(z[1],z[2],1+z[1]%2):z[0]=='m'?mesa(z[1],z[2],z[3],z[4]):dead(z[1],z[2]));OP.forEach(o=>{bld(o[0],o[1],o[2],o[3],o[4],C[o[5]]);R(C.k,o[0]+o[2]/2-6,o[1]+o[3]-18,12,16);R(C.k,o[0]+8,o[1]+o[4]+8,12,10);R(C.k,o[0]+o[2]-20,o[1]+o[4]+8,12,10);crate(o[0]-12,o[1]+o[3]-10);crate(o[0]+o[2]+4,o[1]+o[3]-10);fence(o[0]-6,o[1]+o[3]+6,Math.ceil(o[2]/8)+1)});
mesa(0,0,WW,24);mesa(0,WH-14,WW,14);mesa(0,0,6,WH);mesa(WW-6,0,6,WH)}
function fire(){const h=8+(tick>>1&3);R('#0003',243,381,20,4);R('#d46a1a',247,385-h,10,h);R('#ffb040',249,388-h,6,h-3);R('#fff3a0',251,383-(h>>1),2,h>>1)}
function mill(){const a=tick/40;for(let k=0;k<4;k++){const c=Math.cos(a+k*1.571),s=Math.sin(a+k*1.571);for(let r=3;r<26;r+=2)R(r>16?C.cr:C.wd,609+c*r-1,350+s*r-1,3,3)}R(C.k,607,348,5,5)}
function train(){const x=Math.round(trn.x),y=194;R('#0004',x,y-2,172,5);R(C.k,x,y-24,50,20);R(C.k,x+6,y-36,10,14);R(C.wdd,x+4,y-38,14,3);R(C.r,x+30,y-34,18,14);R(C.k,x+33,y-31,12,8);R('#f6e3b4',x-2,y-16,3,6);
for(let i=0;i<2;i++){const cx=x+54+i*60;R(C.k,cx,y-26,56,22);R(i?(trn.g?'#d8a838':C.p):C.r,cx+2,y-24,52,18);if(i&&trn.g)R('#ffe58a',cx+2,y-24,52,2);R(C.wdd,cx+2,y-14,52,2);for(let j=0;j<4;j++)R('#e8d29a',cx+6+j*12,y-21,7,6)}
for(let w=0;w<12;w++){R(C.k,x+4+w*14,y-6,8,8);R('#9a9aaa',x+6+w*14,y-4,4,4)}}
