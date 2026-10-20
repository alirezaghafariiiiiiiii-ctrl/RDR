/* atmosphere.js - day/night cycle, weather (dust storm, rain, fog), lightning */
function tod(){dayT=(dayT+1/7200)%1;const sun=-Math.cos(dayT*6.2832);NI=Math.max(0,Math.min(1,(.2-sun)*2.2));GL=Math.max(0,1-Math.abs(sun-.08)*3);
if(--wt<=0){wt=2400+rnd()*3000;const r=rnd();wn=r<.4?0:r<.6?1:r<.85?2:3}
if(wn!=wx){wf=Math.max(0,wf-.004);if(wf<=0){wx=wn;if(wx)TX.push({x:P.x,y:P.y-34,s:['','DUST STORM!','RAIN','FOG'][wx],l:90,c:C.cr})}}else if(wx)wf=Math.min(1,wf+.004);
VIS=(1-.3*NI)*(wx==1?1-.4*wf:wx==2?1-.2*wf:wx==3?1-.5*wf:1);
for(const p of WPA){if(wx==2){p.x+=-1.2;p.y+=7+4*p.v}else{p.x+=3.5+3*p.v;p.y+=Math.sin((tick+p.v*90)/18)*.5}if(p.x>W+8)p.x=-8;if(p.x<-8)p.x=W+8;if(p.y>H+8)p.y=-8;if(p.y<-8)p.y=H+8}
if(lg>0)lg--;if(th>0&&--th==0)snd(55,.9,'sawtooth',.1);if(wx==2&&wf>.8&&!lg&&rnd()<.0012){lg=14;th=30+(rnd()*60|0)}}
function skyDraw(){g.globalAlpha=GL*.2;R('#e0642a',0,0,W,H);g.globalAlpha=NI*.4;R('#10104a',0,0,W,H);g.globalAlpha=1;
const px=(P.x-cam.x)*cam.z,py=(P.y-10-cam.y)*cam.z;
if(NI>.05){const r=70+Math.sin(tick/7)*2,gr=g.createRadialGradient(px,py,r*.3,px,py,r*2.4);gr.addColorStop(0,'rgba(10,10,36,0)');gr.addColorStop(1,'rgba(6,6,24,'+.6*NI+')');g.fillStyle=gr;g.fillRect(0,0,W,H);g.globalCompositeOperation='lighter';const g2=g.createRadialGradient(px,py,2,px,py,r);g2.addColorStop(0,'rgba(255,190,90,'+.22*NI+')');g2.addColorStop(1,'rgba(255,190,90,0)');g.fillStyle=g2;g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over'}
if(wx&&wf>0){const n=Math.round(WPA.length*wf);
if(wx==1){g.globalAlpha=wf*.28;R('#c8903a',0,0,W,H);g.globalAlpha=1;for(let i=0;i<n;i++){const p=WPA[i];R('#e8c88a99',p.x,p.y,5+p.v*7,1)}}
else if(wx==2){g.globalAlpha=wf*.2;R('#3a5a8a',0,0,W,H);g.globalAlpha=1;for(let i=0;i<n;i++){const p=WPA[i];R('#bcd4f0aa',p.x,p.y,1,4+p.v*3)}}
else{const gr=g.createRadialGradient(px,py,45,px,py,230);gr.addColorStop(0,'rgba(216,208,196,'+.1*wf+')');gr.addColorStop(1,'rgba(216,208,196,'+.8*wf+')');g.fillStyle=gr;g.fillRect(0,0,W,H);g.fillStyle='rgba(235,230,220,'+.07*wf+')';for(let k=0;k<4;k++){const o=(tick*.25*(k+1)+k*120)%(W+200)-100;g.fillRect(o,k*H/4,200,H/5)}}}
if(lg>0){g.globalAlpha=lg/14*.55;R('#e8f0ff',0,0,W,H);g.globalAlpha=1}}
