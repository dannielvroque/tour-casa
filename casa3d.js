/* ------------------------------------------------------------------
   Maquete 3D da casa (WebGL2 próprio, sem bibliotecas).
   Monta paredes, pisos e móveis a partir de TOUR.casa3d (config.js).
   Dois modos: "vista de cima" (gira em volta da casa) e "caminhar"
   (primeira pessoa, com colisão nas paredes e nos móveis).
   ------------------------------------------------------------------ */
"use strict";
const Casa3D=(function(){
const ALT=3.0, WH=2.8, WT=.12, EYE=1.6, RAD=.25, D2R=Math.PI/180;

/* ---------- móveis: partes em frações [x0,z0,x1,z1,y0,y1,cor] da caixa w×d×h ----------
   cores: m = cor do móvel, d = escura, l = clara, g = folhagem, w = água, k = preto
   a "frente"/costas de cada peça fica do lado z=0 (norte) quando rot=0 */
const PRE={
  sofa:{w:2.0,d:.9,h:.85,c:'#8f8a7a',p:[[0,0,1,1,0,.45],[0,0,1,.28,.45,1],[0,.28,.1,1,.45,.7],[.9,.28,1,1,.45,.7],[.1,.28,.5,1,.45,.58,'l'],[.5,.28,.9,1,.45,.58,'l']]},
  poltrona:{w:.9,d:.9,h:.85,c:'#a0654a',p:[[0,0,1,1,0,.45],[0,0,1,.28,.45,1],[0,.28,.14,1,.45,.7],[.86,.28,1,1,.45,.7]]},
  mesa:{w:1.6,d:.9,h:.76,c:'#9a6b43',p:[[0,0,1,1,.93,1],[.03,.05,.09,.13,0,.93,'d'],[.91,.05,.97,.13,0,.93,'d'],[.03,.87,.09,.95,0,.93,'d'],[.91,.87,.97,.95,0,.93,'d']]},
  mesinha:{w:1.0,d:.6,h:.4,c:'#7a5233',p:[[0,0,1,1,.8,1],[.04,.08,.1,.18,0,.8,'d'],[.9,.08,.96,.18,0,.8,'d'],[.04,.82,.1,.92,0,.8,'d'],[.9,.82,.96,.92,0,.8,'d']]},
  cadeira:{w:.45,d:.45,h:.9,c:'#7a5233',p:[[0,0,1,1,.48,.55],[0,0,1,.12,.55,1],[0,0,.1,.1,0,.48,'d'],[.9,0,1,.1,0,.48,'d'],[0,.9,.1,1,0,.48,'d'],[.9,.9,1,1,0,.48,'d']]},
  tapete:{w:2.4,d:1.6,h:.03,c:'#b9654a',p:[[0,0,1,1,0,1]]},
  estante:{w:1.6,d:.35,h:1.9,c:'#6b4a2f',p:[[0,0,1,1,0,1],[.04,.5,.96,1,.1,.2,'d'],[.04,.5,.96,1,.4,.5,'d'],[.04,.5,.96,1,.7,.8,'d']]},
  armario:{w:1.8,d:.6,h:2.1,c:'#d9d2c6',p:[[0,0,1,1,0,1],[.49,.96,.51,1,.05,.95,'d']]},
  cama:{w:2.0,d:1.6,h:.95,c:'#9fb4c9',p:[[0,0,1,1,0,.4,'d'],[0,0,1,.06,.4,1,'d'],[.03,.08,.97,1,.4,.62,'l'],[.03,.4,.97,1,.62,.68],[.08,.1,.46,.3,.62,.74,'l'],[.54,.1,.92,.3,.62,.74,'l']]},
  criado:{w:.5,d:.45,h:.55,c:'#7a5233',p:[[0,0,1,1,0,1]]},
  bancada:{w:3.0,d:.65,h:.9,c:'#5b6b73',p:[[0,0,1,1,0,.94],[0,0,1,1,.94,1,'l']]},
  ilha:{w:1.6,d:.8,h:.95,c:'#5b6b73',p:[[0,0,1,1,0,.92],[-.0,0,1,1,.92,1,'l']]},
  geladeira:{w:.7,d:.7,h:1.85,c:'#dfe3e6',p:[[0,0,1,1,0,1],[.05,.96,.12,1,.55,.8,'k']]},
  fogao:{w:.6,d:.6,h:.9,c:'#c9ced1',p:[[0,0,1,1,0,.95],[.1,.1,.9,.9,.95,1,'k']]},
  banheira:{w:1.7,d:.8,h:.55,c:'#f1f1ee',p:[[0,0,1,1,0,.92],[.07,.1,.93,.9,.92,1,'w']]},
  vaso:{w:.4,d:.65,h:.7,c:'#f4f4f0',p:[[.1,0,.9,.32,0,1],[.05,.32,.95,1,0,.58]]},
  pia:{w:.6,d:.45,h:.85,c:'#8d7a68',p:[[0,0,1,1,0,.9],[0,0,1,1,.9,1,'l']]},
  planta:{w:.45,d:.45,h:1.1,c:'#8a5a3a',p:[[.15,.15,.85,.85,0,.3],[0,0,1,1,.3,1,'g']]},
  caixa:{w:1,d:1,h:1,c:'#9a8f80',p:[[0,0,1,1,0,1]]},
};

let cfg,opts,root,cv,gl,prog,U={},vbo;
let built=false,active=false,mode='orbit',fl=0;
let rooms=[],roomsById={},nF=0,colliders=[],ranges={ground:null,floor:[],ceil:[]};
let cam={ex:0,ey:0,ez:0,yaw:0,pitch:0};
let orb={yaw:.55,pitch:-.8,dist:17,tx:5,ty:1.2,tz:2.5};
let W=1,H=1,dpr=1,tw=null,raf=0,last=0,keys={},vp=new Float32Array(16);
let ui={},labels=[],curRoom=null,drag=null;

const hex=c=>{const n=parseInt(c.slice(1),16);return [(n>>16)/255,(n>>8&255)/255,(n&255)/255];};
const shade=(c,k)=>{const [r,g,b]=hex(c);const f=v=>Math.round(Math.max(0,Math.min(1,v*k))*255);return '#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('');};

/* ---------- geometria ---------- */
function pushBox(arr,x0,y0,z0,x1,y1,z1,col){
  const [r,g,b]=hex(col);
  const F=[
    [0,1,0, x0,y1,z0, x0,y1,z1, x1,y1,z1, x1,y1,z0],
    [0,-1,0, x0,y0,z0, x1,y0,z0, x1,y0,z1, x0,y0,z1],
    [1,0,0, x1,y0,z0, x1,y1,z0, x1,y1,z1, x1,y0,z1],
    [-1,0,0, x0,y0,z0, x0,y0,z1, x0,y1,z1, x0,y1,z0],
    [0,0,1, x0,y0,z1, x1,y0,z1, x1,y1,z1, x0,y1,z1],
    [0,0,-1, x0,y0,z0, x0,y1,z0, x1,y1,z0, x1,y0,z0]];
  for(const f of F){
    const n=f.slice(0,3),p=[f.slice(3,6),f.slice(6,9),f.slice(9,12),f.slice(12,15)];
    for(const i of [0,1,2,0,2,3])arr.push(p[i][0],p[i][1],p[i][2],n[0],n[1],n[2],r,g,b);
  }
}
function sideBox(r,side,a0,a1,y0,y1){
  const Y0=r.y0+y0,Y1=r.y0+y1;
  if(side==='n')return [r.x+a0,Y0,r.z,r.x+a1,Y1,r.z+WT];
  if(side==='s')return [r.x+a0,Y0,r.z+r.d-WT,r.x+a1,Y1,r.z+r.d];
  if(side==='w')return [r.x,Y0,r.z+a0,r.x+WT,Y1,r.z+a1];
  return [r.x+r.w-WT,Y0,r.z+a0,r.x+r.w,Y1,r.z+a1];
}
function walls(r,A){
  const wc=r.parede||'#eee7da';
  for(const side of ['n','s','w','e']){
    const L=(side==='n'||side==='s')?r.w:r.d;
    const ops=(r.aberturas||[]).filter(o=>o.lado===side).map(o=>({a:Math.max(0,o.pos-o.larg/2),b:Math.min(L,o.pos+o.larg/2),t:o.tipo||'porta'})).sort((p,q)=>p.a-q.a);
    const seg=(a0,a1,y0,y1,col,solid)=>{
      if(a1-a0<.01)return;
      const b=sideBox(r,side,a0,a1,y0,y1);pushBox(A,b[0],b[1],b[2],b[3],b[4],b[5],col);
      if(solid)colliders.push({fi:r.fi,x0:b[0],z0:b[2],x1:b[3],z1:b[5]});
    };
    let c=0;
    for(const o of ops){
      seg(c,o.a,0,WH,wc,true);
      if(o.t==='janela'){
        seg(o.a,o.b,0,.9,wc,true);seg(o.a,o.b,2.1,WH,wc,false);
        const g=sideBox(r,side,o.a,o.b,.9,2.1);
        if(side==='n'||side==='s'){g[2]+=WT*.4;g[5]-=WT*.4;}else{g[0]+=WT*.4;g[3]-=WT*.4;}
        pushBox(A,g[0],g[1],g[2],g[3],g[4],g[5],'#9fcbe8');
      }else seg(o.a,o.b,2.1,WH,wc,false);
      c=o.b;
    }
    seg(c,L,0,WH,wc,true);
  }
}
function furn(r,m,A){
  const P=PRE[m.m];if(!P)return;
  const sw=m.w||P.w,sd=m.d||P.d,sh=m.h||P.h,rot=(Math.round((m.rot||0)/90)%4+4)%4,mc=m.cor||P.c;
  const colOf={m:mc,d:shade(mc,.55),l:'#efe9df',g:'#3f7d3a',w:'#6fa8c9',k:'#202226'};
  for(const q of P.p){
    const a=q[0]*sw,b=q[1]*sd,c=q[2]*sw,d=q[3]*sd;let X0,Z0,X1,Z1;
    if(rot===0){X0=a;Z0=b;X1=c;Z1=d;}
    else if(rot===1){X0=sd-d;Z0=a;X1=sd-b;Z1=c;}
    else if(rot===2){X0=sw-c;Z0=sd-d;X1=sw-a;Z1=sd-b;}
    else{X0=b;Z0=sw-c;X1=d;Z1=sw-a;}
    pushBox(A,r.x+m.x+X0,r.y0+q[4]*sh,r.z+m.z+Z0,r.x+m.x+X1,r.y0+q[5]*sh,r.z+m.z+Z1,colOf[q[6]||'m']);
  }
  const fw=(rot&1)?sd:sw,fd=(rot&1)?sw:sd;
  if(sh>.4)colliders.push({fi:r.fi,x0:r.x+m.x,z0:r.z+m.z,x1:r.x+m.x+fw,z1:r.z+m.z+fd});
}
function build(){
  const G=[],per=[],cei=[];
  nF=cfg.andares.length;
  let minX=1e9,maxX=-1e9,minZ=1e9,maxZ=-1e9;
  cfg.andares.forEach((an,fi)=>{
    const A=[],C=[],y0=fi*ALT;
    for(const r of an.comodos){
      r.fi=fi;r.y0=y0;rooms.push(r);roomsById[r.id]=r;
      pushBox(A,r.x,y0-.2,r.z,r.x+r.w,y0,r.z+r.d,r.piso||'#b9a68c');
      pushBox(C,r.x,y0+WH,r.z,r.x+r.w,y0+ALT,r.z+r.d,'#ebe6de');
      walls(r,A);for(const m of r.moveis||[])furn(r,m,A);
      minX=Math.min(minX,r.x);maxX=Math.max(maxX,r.x+r.w);minZ=Math.min(minZ,r.z);maxZ=Math.max(maxZ,r.z+r.d);
    }
    per.push(A);cei.push(C);
  });
  pushBox(G,-40,-.45,-40,50,-.2,40,cfg.chao||'#7fae6a');
  pushBox(G,minX-1.5,-.2,maxZ,maxX+1.5,-.17,maxZ+14,'#cdbfa6');   // calçada na frente
  orb.tx=(minX+maxX)/2;orb.tz=(minZ+maxZ)/2;orb.ty=nF*ALT/2-.4;orb.dist=Math.max(maxX-minX,maxZ-minZ)*1.45+nF*2;
  const all=[];let n=0;const add=a=>{const s=n;for(const v of a)all.push(v);n+=a.length/9;return [s,a.length/9];};
  ranges.ground=add(G);per.forEach(a=>ranges.floor.push(add(a)));cei.forEach(a=>ranges.ceil.push(add(a)));
  vbo=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(all),gl.STATIC_DRAW);
  built=true;
}

/* ---------- WebGL ---------- */
function initGL(){
  gl=cv.getContext('webgl2',{antialias:true});
  if(!gl)return false;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o;};
  prog=gl.createProgram();
  gl.attachShader(prog,sh(gl.VERTEX_SHADER,`#version 300 es
in vec3 aP;in vec3 aN;in vec3 aC;uniform mat4 uM;out vec3 vN;out vec3 vC;out float vD;
void main(){gl_Position=uM*vec4(aP,1.);vN=aN;vC=aC;vD=gl_Position.w;}`));
  gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,`#version 300 es
precision highp float;in vec3 vN;in vec3 vC;in float vD;uniform vec3 uSun;uniform vec3 uFog;uniform float uLamp;out vec4 o;
void main(){vec3 n=normalize(vN);float d=max(dot(n,normalize(uSun)),0.);float h=.68+.32*n.y;
 float lamp=uLamp*(.35+.25*max(-n.y,0.)+.2*(1.-abs(n.y)))/(1.+vD*.06);
 vec3 c=vC*(.58*h+.55*d+lamp);c=c/(1.+.1*c);c=pow(c*1.2,vec3(.92));float f=1.-exp(-vD*.011);o=vec4(mix(c,uFog,f*.7),1.);}`));
  gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));
  U.m=gl.getUniformLocation(prog,'uM');U.sun=gl.getUniformLocation(prog,'uSun');U.fog=gl.getUniformLocation(prog,'uFog');U.lamp=gl.getUniformLocation(prog,'uLamp');
  return true;
}
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const norm=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l];};
function persp(f,a,n,fa){const t=1/Math.tan(f/2),m=new Float32Array(16);m[0]=t/a;m[5]=t;m[10]=(fa+n)/(n-fa);m[11]=-1;m[14]=2*fa*n/(n-fa);return m;}
function look(e,c){const f=norm(sub(c,e)),s=norm(cross(f,[0,1,0])),u=cross(s,f),m=new Float32Array(16);
  m[0]=s[0];m[4]=s[1];m[8]=s[2];m[1]=u[0];m[5]=u[1];m[9]=u[2];m[2]=-f[0];m[6]=-f[1];m[10]=-f[2];m[12]=-dot(s,e);m[13]=-dot(u,e);m[14]=dot(f,e);m[15]=1;return m;}
function mul(a,b){const o=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s;}return o;}
const dirOf=(y,p)=>[Math.sin(y)*Math.cos(p),Math.sin(p),-Math.cos(y)*Math.cos(p)];

function draw(){
  gl.viewport(0,0,cv.width,cv.height);
  gl.clearColor(.78,.87,.94,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);
  const e=[cam.ex,cam.ey,cam.ez],d=dirOf(cam.yaw,cam.pitch);
  vp=mul(persp((mode==='walk'?72:55)*D2R,W/H,.08,200),look(e,[e[0]+d[0],e[1]+d[1],e[2]+d[2]]));
  gl.useProgram(prog);gl.uniformMatrix4fv(U.m,false,vp);gl.uniform3f(U.sun,.45,.85,.35);gl.uniform3f(U.fog,.78,.87,.94);gl.uniform1f(U.lamp,mode==='walk'?1:0);
  gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
  for(const [nm,loc] of [['aP',0],['aN',1],['aC',2]]){const l=gl.getAttribLocation(prog,nm);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,3,gl.FLOAT,false,36,loc*12);}
  const dr=r=>gl.drawArrays(gl.TRIANGLES,r[0],r[1]);
  dr(ranges.ground);
  for(let i=0;i<=fl&&i<nF;i++)dr(ranges.floor[i]);
  if(mode==='walk')dr(ranges.ceil[fl]);                       // teto só na visão de dentro
}
function project(x,y,z){
  const cx=vp[0]*x+vp[4]*y+vp[8]*z+vp[12],cy=vp[1]*x+vp[5]*y+vp[9]*z+vp[13],cw=vp[3]*x+vp[7]*y+vp[11]*z+vp[15];
  if(cw<=.05)return null;return [(cx/cw*.5+.5)*W,(1-(cy/cw*.5+.5))*H];
}

/* ---------- câmera e movimento ---------- */
function orbitCam(){
  const d=dirOf(orb.yaw,orb.pitch);
  return {ex:orb.tx-d[0]*orb.dist,ey:orb.ty-d[1]*orb.dist,ez:orb.tz-d[2]*orb.dist,yaw:orb.yaw,pitch:orb.pitch};
}
const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
function fly(to,ms,done){
  const f={...cam};let dy=((to.yaw-f.yaw+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
  tw={t:0,ms,f,to,dy,done};mode='fly';
}
function hit(x,z){for(const c of colliders)if(c.fi===fl&&x>c.x0-RAD&&x<c.x1+RAD&&z>c.z0-RAD&&z<c.z1+RAD)return true;return false;}
function update(dt){
  if(tw){
    tw.t+=dt*1000;const k=Math.min(1,tw.t/tw.ms),e=ease(k);
    for(const p of ['ex','ey','ez','pitch'])cam[p]=tw.f[p]+(tw.to[p]-tw.f[p])*e;
    cam.yaw=tw.f.yaw+tw.dy*e;
    if(k>=1){const d=tw.done;tw=null;if(d)d();}
  }else if(mode==='orbit'){Object.assign(cam,orbitCam());}
  else if(mode==='walk'){
    const sp=2.3*dt,ty=(keys.ArrowLeft?-1:0)+(keys.ArrowRight?1:0);
    cam.yaw+=ty*1.8*dt;
    const f=(keys.w||keys.ArrowUp||keys.pf?1:0)-(keys.s||keys.ArrowDown||keys.pb?1:0),s=(keys.d||keys.pr?1:0)-(keys.a||keys.pl?1:0);
    if(f||s){
      const fx=Math.sin(cam.yaw),fz=-Math.cos(cam.yaw),rx=Math.cos(cam.yaw),rz=Math.sin(cam.yaw);
      let dx=(fx*f+rx*s),dz=(fz*f+rz*s);const l=Math.hypot(dx,dz)||1;dx=dx/l*sp;dz=dz/l*sp;
      if(!hit(cam.ex+dx,cam.ez))cam.ex+=dx;if(!hit(cam.ex,cam.ez+dz))cam.ez+=dz;
      cam.ex=Math.max(-20,Math.min(30,cam.ex));cam.ez=Math.max(-20,Math.min(25,cam.ez));
    }
    const r=rooms.find(q=>q.fi===fl&&cam.ex>q.x&&cam.ex<q.x+q.w&&cam.ez>q.z&&cam.ez<q.z+q.d)||null;
    if(r!==curRoom){curRoom=r;syncUI();}
  }
}
function enterRoom(id){
  const r=roomsById[id];if(!r)return;
  fl=r.fi;curRoom=r;
  fly({ex:r.x+r.w/2,ey:r.y0+EYE,ez:r.z+r.d/2,yaw:(r.olhar||0)*D2R,pitch:0},1300,()=>{mode='walk';syncUI();});
  mode='fly';syncUI();
}
function toOrbit(){
  const t=orbitCam();fly(t,1100,()=>{mode='orbit';syncUI();});mode='fly';syncUI();
}
function setFloor(i){
  if(mode==='walk'){const r=rooms.find(q=>q.fi===i);if(r)enterRoom(r.id);}
  else{fl=i;syncUI();}
}

/* ---------- interface ---------- */
function mk(tag,cls,txt,parent){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;if(parent)parent.appendChild(e);return e;}
function buildUI(){
  root.innerHTML='';
  cv=mk('canvas','',null,root);cv.id='mCv';
  ui.lbl=mk('div','layer',null,root);ui.lbl.style.pointerEvents='none';
  ui.bar=mk('div','ui glass',null,root);ui.bar.id='mBar';
  ui.bOrb=mk('button','btn','⬒ Vista de cima',ui.bar);ui.bWalk=mk('button','btn','🚶 Caminhar',ui.bar);
  ui.sep=mk('span','msep',null,ui.bar);
  ui.fl=[];cfg.andares.forEach((a,i)=>{const b=mk('button','btn',a.nome,ui.bar);b.onclick=()=>setFloor(i);ui.fl.push(b);});
  ui.hint=mk('div','ui',null,root);ui.hint.id='mHint';
  ui.photo=mk('button','btn ui',null,root);ui.photo.id='mPhoto';
  ui.pad=mk('div','ui',null,root);ui.pad.id='mPad';
  for(const [t,k,c] of [['▲','pf','u'],['◀','pl','l'],['▶','pr','r'],['▼','pb','d']]){
    const b=mk('button','btn '+c,t,ui.pad);
    const on=e=>{e.preventDefault();keys[k]=true;},off=()=>{keys[k]=false;};
    b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointerleave',off);b.addEventListener('pointercancel',off);
  }
  ui.bOrb.onclick=()=>{if(mode==='walk')toOrbit();};
  ui.bWalk.onclick=()=>{if(mode==='orbit'){const r=curRoom||rooms.find(q=>q.fi===fl);enterRoom(r.id);}};
  ui.photo.onclick=()=>{if(curRoom&&opts.has(curRoom.id))opts.onFotos(curRoom.id);};
  for(const r of rooms){
    const el=mk('div','m-lbl',null,ui.lbl);const b=mk('button','btn',r.nome||r.id,el);b.onclick=()=>enterRoom(r.id);
    if(opts.has(r.id)){const p=mk('button','btn','📷',el);p.title='Ver fotos 360°';p.onclick=()=>opts.onFotos(r.id);}
    labels.push({el,r});
  }
  cv.addEventListener('pointerdown',pDown);cv.addEventListener('pointermove',pMove);cv.addEventListener('pointerup',pUp);cv.addEventListener('pointercancel',pUp);
  cv.addEventListener('wheel',e=>{e.preventDefault();if(mode==='orbit')orb.dist=Math.max(6,Math.min(45,orb.dist*(1+e.deltaY*.001)));},{passive:false});
}
function syncUI(){
  if(!ui.bar)return;
  ui.bOrb.classList.toggle('cur',mode==='orbit');ui.bWalk.classList.toggle('cur',mode==='walk'||mode==='fly'&&false);
  ui.fl.forEach((b,i)=>b.classList.toggle('cur',i===fl));
  ui.hint.textContent=mode==='walk'?'WASD ou setas para andar · arraste para olhar ao redor · Esc sai':'Arraste para girar · roda do mouse para zoom · clique num cômodo para entrar';
  const has=mode==='walk'&&curRoom&&opts.has(curRoom.id);
  ui.photo.style.display=has?'block':'none';if(has)ui.photo.textContent='📷 Ver fotos 360° · '+(curRoom.nome||curRoom.id);
  ui.pad.style.display=mode==='walk'?'grid':'none';
  ui.lbl.style.display=mode==='orbit'?'':'none';
}
function labelsUpdate(){
  if(mode!=='orbit')return;
  for(const L of labels){
    const r=L.r,q=r.fi<=fl?project(r.x+r.w/2,r.y0+1.2,r.z+r.d/2):null;
    if(!q){L.el.style.display='none';continue;}
    L.el.style.display='flex';L.el.style.transform=`translate(${q[0].toFixed(1)}px,${q[1].toFixed(1)}px) translate(-50%,-50%)`;
  }
}

/* ---------- entrada ---------- */
const ptr=new Map();let pinch=0;
function pDown(e){cv.setPointerCapture(e.pointerId);ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});if(ptr.size===2){const [a,b]=[...ptr.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);}}
function pMove(e){
  const p=ptr.get(e.pointerId);if(!p)return;
  const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(ptr.size===2&&mode==='orbit'){const [a,b]=[...ptr.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch)orb.dist=Math.max(6,Math.min(45,orb.dist*pinch/d));pinch=d;return;}
  if(mode==='orbit'){orb.yaw-=dx*.006;orb.pitch=Math.max(-1.45,Math.min(-.12,orb.pitch-dy*.005));}
  else if(mode==='walk'){cam.yaw+=dx*.005;cam.pitch=Math.max(-1.2,Math.min(1.2,cam.pitch-dy*.004));}
}
function pUp(e){ptr.delete(e.pointerId);pinch=0;}
function kd(e){
  if(!active)return;
  const k=e.key.length===1?e.key.toLowerCase():e.key;
  if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k)){keys[k]=true;if(k.startsWith('Arrow'))e.preventDefault();}
}
function ku(e){const k=e.key.length===1?e.key.toLowerCase():e.key;keys[k]=false;}

function resize(){
  if(!root)return;
  const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;
  dpr=Math.min(devicePixelRatio||1,2);
  if(w!==W||h!==H||cv.width!==Math.round(w*dpr)){W=w;H=h;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);}
}
function loop(t){
  if(!active)return;raf=requestAnimationFrame(loop);
  const dt=Math.min(.05,(t-last)/1000||0);last=t;resize();update(dt);draw();labelsUpdate();
}

return {
  init(o){opts=o;cfg=o.cfg;root=o.root;},
  open(roomId){
    if(!cfg)return false;
    if(!built){buildUI();try{if(!initGL()){root.textContent='WebGL2 não disponível neste navegador.';return false;}build();}catch(err){console.error(err);return false;}}
    active=true;keys={};fl=nF-1;mode='orbit';curRoom=null;
    resize();Object.assign(cam,orbitCam());syncUI();
    addEventListener('keydown',kd);addEventListener('keyup',ku);
    last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
    if(roomId&&roomsById[roomId]){fl=roomsById[roomId].fi;syncUI();setTimeout(()=>{if(active)enterRoom(roomId);},500);}
    return true;
  },
  close(){active=false;cancelAnimationFrame(raf);removeEventListener('keydown',kd);removeEventListener('keyup',ku);keys={};tw=null;},
  has(id){return !!roomsById[id]||!!(cfg&&cfg.andares.some(a=>a.comodos.some(r=>r.id===id)));},
};
})();
