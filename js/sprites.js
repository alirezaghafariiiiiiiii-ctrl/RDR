/* sprites.js - small pixel-art sprites drawn every frame */
function barrel(x,y,t,hit){sh(x+3,y+2,14,5,1.3);R(C.k,x-5,y-9,10,12);R(t?C.r:C.w,x-4,y-8,8,10);R(t?'#d46a52':C.wl,x-4,y-8,2,10);R(C.wd,x-4,y-5,8,1);R(C.wd,x-4,y-1,8,1);R(C.wl,x-3,y-9,6,2);if(t){R(C.cr,x-2,y-6,4,1);R(C.k,x-1,y-4,2,2)}R('#00000030',x+2,y-8,2,10);R('#ffffff30',x-3,y-8,1,10)}
function man(o){const x=o.x,y=o.y,w=o.m?((o.t/7|0)&1):0,f=o.fl>0,f2=Math.cos(o.a)<0;
sh(x+3,y,13,4,1.4);R(C.k,x-3,y-4+w,3,4-w);R(C.k,x+1,y-3-w+1,3,3+w);
R(f?'#fff':o.bc,x-3,y-11,7,7);R('#00000030',x+1,y-11,3,7);R('#ffffff28',x-3,y-11,2,7);R('#00000028',x-3,y-6,7,2);if(o.bd)R(o.bd,x-2,y-12,5,1);
R(f?'#fff':o.hc,x-4,y-17,9,2);R(f?'#fff':o.hc,x-2,y-20,5,4);R('#00000030',x-4,y-16,9,1);R('#ffffff30',x-2,y-20,2,1);R('#e8b890',x-2,y-15,5,3);R(C.k,x+(f2?-2:1),y-14,1,1);
const gx=x+Math.cos(o.a)*6,gy=y-8+Math.sin(o.a)*6;R(C.wdd,(x+gx)/2,(y-8+gy)/2,2,2);R(C.k,gx-1,gy-1,3,3);R('#9a9aaa',gx,gy,1,1)}
function bull(o){const x=o.x,y=o.y,f=o.fl>0,w=(o.t/6|0)&1;sh(x+4,y,26,7,1.5);R(C.k,x-6,y-5+w,5,5);R(C.k,x+2,y-6-w+1,5,5);
R(f?'#fff':C.p,x-8,y-18,17,14);R(C.pl,x-6,y-16,13,3);R(C.k,x-8,y-9,17,2);R(f?'#fff':C.p,x-6,y-28,13,11);
R(C.cr,x-10,y-32,3,7);R(C.cr,x+8,y-32,3,7);R(C.cr,x-8,y-26,2,2);R(C.cr,x+7,y-26,2,2);R(C.r,x-4,y-24,2,2);R(C.r,x+2,y-24,2,2);R(C.k,x-3,y-19,7,3);R(C.cr,x-1,y-18,3,1)}
function pick(f){const y=f.y+Math.sin(tick/8+f.x)*1.5;sh(f.x+1,f.y+1,9,3,1);if(f.k=='$'){R('#7a5a2a',f.x-3,y-7,7,6);R(C.gr,f.x-2,y-9,5,2);R(C.cr,f.x,y-5,1,3)}else if(f.k=='m'){R('#7a5a3a',f.x-4,y-6,9,5);R('#a8825a',f.x-3,y-7,7,2);R(C.cr,f.x-1,y-4,3,1)}else{R(C.r,f.x-2,y-8,5,7);R(C.cr,f.x-1,y-11,3,3);R(C.cr,f.x-1,y-7,1,3)}}
function heart(x,y,f){['01010','11111','11111','01110','00100'].forEach((r,j)=>[...r].forEach((c,i)=>{if(c=='1')R(f?C.r:C.wd,x+i*2,y+j*2,2,2)}))}
