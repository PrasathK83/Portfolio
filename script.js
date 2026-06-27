import * as THREE from "https://unpkg.com/three@0.163.0/build/three.module.js";

// ── Renderer ──────────────────────────────────────────────────────────────────
const canvas = document.getElementById("bg-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x070e1a, 1);

// ── Scene / Camera ────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 0, 18);

// ── Lighting ──────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x4488aa, 0.7));
const pA = new THREE.PointLight(0x24c8e8, 3.5, 55); pA.position.set(6, 5, 9); scene.add(pA);
const pB = new THREE.PointLight(0x2255cc, 2.2, 45); pB.position.set(-7,-4,7); scene.add(pB);
const pC = new THREE.PointLight(0x00aaff, 1.6, 35); pC.position.set(0, 8, 4); scene.add(pC);

// ── Background geometry ───────────────────────────────────────────────────────
const group = new THREE.Group(); scene.add(group);
const torusA = new THREE.Mesh(new THREE.TorusGeometry(4.4,0.045,24,320), new THREE.MeshStandardMaterial({color:0x24c8e8,emissive:0x0a4060,emissiveIntensity:0.55,transparent:true,opacity:0.55,metalness:0.7,roughness:0.08}));
torusA.rotation.x = Math.PI/2.6; group.add(torusA);
const torusB = new THREE.Mesh(new THREE.TorusGeometry(2.9,0.06,24,260), new THREE.MeshStandardMaterial({color:0x3d7fe0,emissive:0x0d1f60,emissiveIntensity:0.45,transparent:true,opacity:0.5,metalness:0.6,roughness:0.12}));
torusB.rotation.x = Math.PI/3.2; torusB.rotation.z = Math.PI/5; group.add(torusB);
const torusC = new THREE.Mesh(new THREE.TorusGeometry(1.65,0.038,20,180), new THREE.MeshStandardMaterial({color:0xaaddff,emissive:0x204888,emissiveIntensity:0.5,transparent:true,opacity:0.45,metalness:0.75,roughness:0.06}));
torusC.rotation.y = Math.PI/4; group.add(torusC);
const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.68,8), new THREE.MeshPhysicalMaterial({color:0x5bd4ff,emissive:0x1060b0,emissiveIntensity:0.9,transparent:true,opacity:0.72,metalness:0.45,roughness:0.1,clearcoat:1,clearcoatRoughness:0.05}));
group.add(core); group.position.set(4.5,0.2,0);

// ── Starfield ─────────────────────────────────────────────────────────────────
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(1600*3); const starCol = new Float32Array(1600*3);
for(let i=0;i<1600;i++){const i3=i*3;starPos[i3]=(Math.random()-0.5)*90;starPos[i3+1]=(Math.random()-0.5)*70;starPos[i3+2]=(Math.random()-0.5)*90;const p=Math.random();if(p<0.35){starCol[i3]=0.88;starCol[i3+1]=0.95;starCol[i3+2]=1.0;}else if(p<0.68){starCol[i3]=0.14;starCol[i3+1]=0.78;starCol[i3+2]=0.91;}else{starCol[i3]=0.24;starCol[i3+1]=0.48;starCol[i3+2]=0.9;}}
starGeo.setAttribute("position",new THREE.BufferAttribute(starPos,3));
starGeo.setAttribute("color",new THREE.BufferAttribute(starCol,3));
const stars = new THREE.Points(starGeo,new THREE.PointsMaterial({size:0.07,vertexColors:true,transparent:true,opacity:0.78,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true}));
scene.add(stars);

// ── Micro-orbs ────────────────────────────────────────────────────────────────
const orbData=[[-7,3.5,-3,0.22],[7,-4,-4,0.18],[-3,-5.5,-5,0.26],[8,5,-6,0.14],[-9,1,-7,0.2],[2,7,-4,0.16],[-5,-2.5,-3,0.12],[5,2.5,-8,0.24]];
const orbs=orbData.map(([x,y,z,r])=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,16,16),new THREE.MeshPhysicalMaterial({color:0x24a9d8,emissive:0x082040,emissiveIntensity:0.65,transparent:true,opacity:0.38,metalness:0.5,roughness:0.18,clearcoat:0.9}));m.position.set(x,y,z);scene.add(m);return m;});

// ══════════════════════════════════════════════════════════════════════════════
// ── WAR SYSTEM ────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

const TEAM = [
  { hull:0x00ccff, emissive:0x003366, laser:0x00ffff, engine:0x0088ff },
  { hull:0xff4400, emissive:0x881100, laser:0xff6600, engine:0xff2200 },
];

function buildShip(t) {
  const c = TEAM[t]; const g = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.ConeGeometry(0.14,0.72,7), new THREE.MeshPhysicalMaterial({color:c.hull,emissive:c.emissive,emissiveIntensity:0.65,metalness:0.88,roughness:0.08,clearcoat:0.9}));
  hull.rotation.z = -Math.PI/2; g.add(hull);
  const wingMat = new THREE.MeshStandardMaterial({color:c.hull,emissive:c.emissive,emissiveIntensity:0.35,metalness:0.7,roughness:0.14});
  [-1,1].forEach(s=>{const w=new THREE.Mesh(new THREE.BoxGeometry(0.38,0.03,0.4),wingMat);w.position.set(-0.08,0,s*0.28);g.add(w);});
  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.1,8,8,0,Math.PI*2,0,Math.PI/2), new THREE.MeshPhysicalMaterial({color:0xaaddff,emissive:0x224466,emissiveIntensity:0.9,transparent:true,opacity:0.75,clearcoat:1}));
  cockpit.position.set(0.12,0.09,0); g.add(cockpit);
  const finMat = new THREE.MeshStandardMaterial({color:c.emissive,emissive:c.emissive,emissiveIntensity:0.45,metalness:0.7,roughness:0.18});
  [-1,1].forEach(s=>{const f=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.26,0.03),finMat);f.position.set(-0.26,0.1,s*0.2);g.add(f);});
  const eng = new THREE.PointLight(c.engine,2.8,3.5); eng.position.set(-0.42,0,0); g.add(eng);
  const exhaust = new THREE.Mesh(new THREE.SphereGeometry(0.065,8,8), new THREE.MeshStandardMaterial({color:c.engine,emissive:c.engine,emissiveIntensity:2.5,transparent:true,opacity:0.75}));
  exhaust.position.set(-0.38,0,0); g.add(exhaust);
  return g;
}

// ── Explosion pool (pre-allocated) ────────────────────────────────────────────
const EXP_COUNT = 16;
const expPool = [];

for(let e=0;e<EXP_COUNT;e++){
  const PC=90;
  const geo=new THREE.BufferGeometry();
  const pa=new Float32Array(PC*3); const ca=new Float32Array(PC*3);
  geo.setAttribute("position",new THREE.BufferAttribute(pa,3));
  geo.setAttribute("color",new THREE.BufferAttribute(ca,3));
  const pts=new THREE.Points(geo,new THREE.PointsMaterial({size:0.2,vertexColors:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));
  scene.add(pts);

  // Pre-build debris shards
  const shards=[];
  for(let k=0;k<10;k++){
    const sh=new THREE.Mesh(new THREE.BoxGeometry(0.04+Math.random()*0.09,0.018,0.04+Math.random()*0.07), new THREE.MeshStandardMaterial({color:0x888888,emissive:0xff4400,emissiveIntensity:1.5,metalness:0.9,roughness:0.2}));
    sh.visible=false; scene.add(sh);
    shards.push({mesh:sh,vel:new THREE.Vector3(),rot:new THREE.Vector3((Math.random()-0.5)*0.18,(Math.random()-0.5)*0.18,(Math.random()-0.5)*0.18)});
  }

  // Random velocities (re-seeded on trigger)
  const vel=Array.from({length:PC},()=>new THREE.Vector3());
  expPool.push({pts,geo,vel,shards,active:false,life:0});
}
let expIdx=0;

// Screen flash overlay
const flashEl=document.createElement("div");
flashEl.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0;";
document.body.appendChild(flashEl);

function triggerExplosion(pos,teamIdx,big){
  const exp=expPool[expIdx%EXP_COUNT]; expIdx++;
  exp.active=true; exp.life=1.0;
  const isBlue=teamIdx===0;
  const pa=exp.geo.attributes.position.array;
  const ca=exp.geo.attributes.color.array;
  for(let i=0;i<90;i++){
    pa[i*3]=pos.x; pa[i*3+1]=pos.y; pa[i*3+2]=pos.z;
    const th=Math.random()*Math.PI*2; const ph=Math.acos(2*Math.random()-1);
    const sp=(big?0.07:0.04)+Math.random()*(big?0.18:0.1);
    exp.vel[i].set(Math.sin(ph)*Math.cos(th)*sp,Math.sin(ph)*Math.sin(th)*sp,Math.cos(ph)*sp);
    if(isBlue){ca[i*3]=0.1+Math.random()*0.2;ca[i*3+1]=0.65+Math.random()*0.35;ca[i*3+2]=1.0;}
    else{ca[i*3]=1.0;ca[i*3+1]=0.25+Math.random()*0.45;ca[i*3+2]=0.0;}
  }
  exp.geo.attributes.position.needsUpdate=true;
  exp.geo.attributes.color.needsUpdate=true;
  exp.pts.material.opacity=1.0;
  exp.pts.material.size=big?0.24:0.16;

  if(big){
    exp.shards.forEach(s=>{
      s.mesh.visible=true; s.mesh.position.copy(pos);
      s.mesh.material.emissive.setHex(isBlue?0x0088ff:0xff4400); s.mesh.material.emissiveIntensity=2.5;
      const th2=Math.random()*Math.PI*2; const ph2=Math.acos(2*Math.random()-1); const sv=0.06+Math.random()*0.1;
      s.vel.set(Math.sin(ph2)*Math.cos(th2)*sv,Math.sin(ph2)*Math.sin(th2)*sv,Math.cos(ph2)*sv);
    });
  }

  // Flash light that fades
  const fl=new THREE.PointLight(isBlue?0x00eeff:0xff6600,big?22:10,big?16:9);
  fl.position.copy(pos); scene.add(fl);
  const wfl=new THREE.PointLight(0xffffff,big?10:5,big?7:4); wfl.position.copy(pos); scene.add(wfl);
  let fl_life=1.0;
  const fadeFL=()=>{fl_life-=0.08;fl.intensity=(big?22:10)*fl_life;wfl.intensity=(big?10:5)*fl_life;if(fl_life>0)requestAnimationFrame(fadeFL);else{scene.remove(fl);scene.remove(wfl);}};
  requestAnimationFrame(fadeFL);

  // Screen flash
  if(big){
    flashEl.style.backgroundColor=isBlue?"rgba(0,200,255,0.22)":"rgba(255,80,0,0.25)";
    flashEl.style.transition="opacity 40ms linear"; flashEl.style.opacity="1";
    setTimeout(()=>{flashEl.style.transition="opacity 350ms ease";flashEl.style.opacity="0";},80);
  }
}

function updateExplosions(){
  for(const exp of expPool){
    if(!exp.active)continue;
    exp.life-=0.02;
    if(exp.life<=0){exp.active=false;exp.pts.material.opacity=0;exp.shards.forEach(s=>s.mesh.visible=false);continue;}
    exp.pts.material.opacity=Math.min(exp.life*1.1,1.0);
    const pa=exp.geo.attributes.position.array;
    for(let i=0;i<90;i++){pa[i*3]+=exp.vel[i].x;pa[i*3+1]+=exp.vel[i].y*0.98-0.0006;pa[i*3+2]+=exp.vel[i].z;exp.vel[i].multiplyScalar(0.96);}
    exp.geo.attributes.position.needsUpdate=true;
    exp.shards.forEach(s=>{
      if(!s.mesh.visible)return;
      s.mesh.position.add(s.vel); s.vel.multiplyScalar(0.95); s.vel.y-=0.0012;
      s.mesh.rotation.x+=s.rot.x; s.mesh.rotation.y+=s.rot.y; s.mesh.rotation.z+=s.rot.z;
      s.mesh.material.emissiveIntensity=exp.life*2.2;
    });
  }
}

// ── Ships ─────────────────────────────────────────────────────────────────────
const ships=[]; const lasers=[];

function spawnShip(t,idx){
  const isBlue=t===0;
  const sx=isBlue?-20-idx*4:20+idx*4;
  const sy=(Math.random()-0.5)*10;
  const sz=(Math.random()-0.5)*4-2;
  const mesh=buildShip(t); mesh.position.set(sx,sy,sz);
  const trailGeo=new THREE.BufferGeometry();
  const ta=new Float32Array(24*3);
  for(let j=0;j<24*3;j+=3){ta[j]=sx;ta[j+1]=sy;ta[j+2]=sz;}
  trailGeo.setAttribute("position",new THREE.BufferAttribute(ta,3));
  const trail=new THREE.Points(trailGeo,new THREE.PointsMaterial({color:TEAM[t].engine,size:0.1,transparent:true,opacity:0.6,blending:THREE.AdditiveBlending,depthWrite:false}));
  scene.add(trail); scene.add(mesh);
  ships.push({mesh,trail,trailGeo,trailHistory:[],team:t,idx,alive:true,hp:3,respawnTimer:0,
    speed:0.055+Math.random()*0.04,fireCD:40+Math.floor(Math.random()*80),
    dir:new THREE.Vector3(isBlue?1:-1,0,0)});
}

for(let t=0;t<2;t++) for(let i=0;i<3;i++) spawnShip(t,i);

function nearestEnemy(ship){
  let best=null,bd=Infinity;
  for(const s of ships){if(s.team===ship.team||!s.alive)continue;const d=ship.mesh.position.distanceTo(s.mesh.position);if(d<bd){bd=d;best=s;}}
  return best;
}

function fireLaser(ship,aimDir){
  const c=TEAM[ship.team];
  const m=new THREE.Mesh(new THREE.SphereGeometry(0.07,8,8), new THREE.MeshStandardMaterial({color:c.laser,emissive:c.laser,emissiveIntensity:4.5,transparent:true,opacity:0.95}));
  const d=aimDir.clone().normalize();
  m.position.copy(ship.mesh.position).addScaledVector(d,0.6);
  const gl=new THREE.PointLight(c.laser,2.4,4); m.add(gl);
  scene.add(m);
  lasers.push({mesh:m,team:ship.team,vel:d.multiplyScalar(0.35),life:160,alive:true});
}

// ── Pointer tracking ──────────────────────────────────────────────────────────
const ptr={x:0,y:0,tx:0,ty:0};
window.addEventListener("pointermove",e=>{ptr.tx=(e.clientX/window.innerWidth)*2-1;ptr.ty=(e.clientY/window.innerHeight)*2-1;});
window.addEventListener("resize",()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setSize(window.innerWidth,window.innerHeight);renderer.render(scene,camera);});

// ── Main loop ─────────────────────────────────────────────────────────────────
const clock=new THREE.Clock();

function animate(){
  // requestAnimationFrame(animate); // Static background requested
  const t=clock.getElapsedTime();
  ptr.x+=(ptr.tx-ptr.x)*0.04; ptr.y+=(ptr.ty-ptr.y)*0.04;

  // Background
  torusA.rotation.z=t*0.09; torusB.rotation.z=-t*0.13;
  torusC.rotation.x=t*0.17; torusC.rotation.y=t*0.11;
  core.rotation.x=t*0.22; core.rotation.y=t*0.28;
  core.scale.setScalar(1+Math.sin(t*2.4)*0.05);
  group.rotation.x=ptr.y*0.14; group.rotation.y=ptr.x*0.18;
  group.position.y=0.2+Math.sin(t*0.42)*0.5;
  stars.rotation.y=t*0.004; stars.rotation.x=t*0.002;
  orbs.forEach((o,i)=>{o.position.y+=Math.sin(t*0.48+i*1.2)*0.003;o.position.x+=Math.cos(t*0.38+i*0.9)*0.002;});

  // ── Ship AI + movement ────────────────────────────────────────────────────
  ships.forEach((ship,si)=>{
    if(!ship.alive){
      ship.respawnTimer--;
      if(ship.respawnTimer<=0){
        const ib=ship.team===0;
        ship.mesh.position.set(ib?-20-ship.idx*4:20+ship.idx*4,(Math.random()-0.5)*10,(Math.random()-0.5)*4-2);
        ship.mesh.visible=true; ship.trail.visible=true;
        ship.trailHistory=[]; ship.alive=true; ship.hp=3;
        ship.dir.set(ib?1:-1,0,0);
      }
      return;
    }

    const pos=ship.mesh.position;
    const enemy=nearestEnemy(ship);

    if(enemy){
      // Steer toward enemy (dogfight AI)
      const toEn=enemy.mesh.position.clone().sub(pos).normalize();
      ship.dir.lerp(toEn,0.022).normalize();
    } else {
      // Circle the center if no enemies alive
      const circleDir=new THREE.Vector3(-pos.y,pos.x,0).normalize();
      ship.dir.lerp(circleDir,0.04).normalize();
    }

    pos.addScaledVector(ship.dir,ship.speed);
    pos.y+=Math.sin(t*0.55+si*1.8)*0.004;

    // Face movement direction
    const ang=Math.atan2(ship.dir.y,ship.dir.x);
    ship.mesh.rotation.z=ang;
    ship.mesh.rotation.x=Math.sin(t*0.4+si*1.3)*0.1;

    // Trail
    ship.trailHistory.unshift(pos.clone());
    if(ship.trailHistory.length>24) ship.trailHistory.pop();
    const ta=ship.trailGeo.attributes.position.array;
    ship.trailHistory.forEach((p,idx)=>{ta[idx*3]=p.x;ta[idx*3+1]=p.y;ta[idx*3+2]=p.z;});
    ship.trailGeo.attributes.position.needsUpdate=true;

    // Fire toward enemy with a bit of lead/spread
    ship.fireCD--;
    if(ship.fireCD<=0&&enemy){
      const aim=enemy.mesh.position.clone().sub(pos);
      // Predictive lead: account for laser travel time
      const dist=aim.length(); const travelT=dist/0.35;
      const predicted=enemy.mesh.position.clone().addScaledVector(enemy.dir||new THREE.Vector3(0,0,0),travelT*enemy.speed*0.4);
      const aimDir=predicted.sub(pos);
      aimDir.x+=(Math.random()-0.5)*0.3; aimDir.y+=(Math.random()-0.5)*0.3;
      fireLaser(ship,aimDir);
      ship.fireCD=50+Math.floor(Math.random()*65);
    }

    // Boundary steering — steer back toward arena
    if(Math.abs(pos.x)>24||Math.abs(pos.y)>13){
      const toCenter=new THREE.Vector3(-pos.x*0.15,-pos.y*0.15,0).normalize();
      ship.dir.lerp(toCenter,0.18).normalize();
      if(Math.abs(pos.x)>28) pos.x=Math.sign(pos.x)*-20;
    }
  });

  // ── Laser update + collision ──────────────────────────────────────────────
  for(let li=lasers.length-1;li>=0;li--){
    const laser=lasers[li];
    if(!laser.alive){lasers.splice(li,1);continue;}
    laser.mesh.position.add(laser.vel);
    laser.life--;

    // vs ships
    for(const ship of ships){
      if(ship.team===laser.team||!ship.alive) continue;
      if(laser.mesh.position.distanceTo(ship.mesh.position)<0.65){
        triggerExplosion(laser.mesh.position.clone(),laser.team,false);
        ship.hp--;
        if(ship.hp<=0){
          // Death: two big explosions + debris
          triggerExplosion(ship.mesh.position.clone(),ship.team,true);
          const off=new THREE.Vector3((Math.random()-0.5)*0.6,(Math.random()-0.5)*0.6,0);
          triggerExplosion(ship.mesh.position.clone().add(off),ship.team,true);
          ship.mesh.visible=false; ship.trail.visible=false;
          ship.alive=false; ship.respawnTimer=180+Math.floor(Math.random()*120);
        } else {
          // Hit flash: ship hull lights up
          ship.mesh.traverse(o=>{if(o.isMesh&&o.material.emissiveIntensity!==undefined){const orig=o.material.emissiveIntensity;o.material.emissiveIntensity=4;setTimeout(()=>{if(o.material)o.material.emissiveIntensity=orig;},110);}});
        }
        laser.alive=false; break;
      }
    }

    // vs opposing lasers
    if(laser.alive){
      for(let oi=li-1;oi>=0;oi--){
        const other=lasers[oi];
        if(!other.alive||other.team===laser.team) continue;
        if(laser.mesh.position.distanceTo(other.mesh.position)<0.38){
          triggerExplosion(laser.mesh.position.clone(),laser.team,false);
          laser.alive=false; other.alive=false; break;
        }
      }
    }

    if(!laser.alive||laser.life<=0||laser.mesh.position.length()>32){
      scene.remove(laser.mesh); laser.mesh.geometry.dispose(); laser.mesh.material.dispose();
      lasers.splice(li,1);
    }
  }

  updateExplosions();

  camera.position.x+=(ptr.x*1.4-camera.position.x)*0.025;
  camera.position.y+=(-ptr.y*0.9-camera.position.y)*0.025;
  camera.lookAt(0,0,0);
  renderer.render(scene,camera);
}

animate();

// ── Section reveal ────────────────────────────────────────────────────────────
const revealEls=document.querySelectorAll(".reveal");
const revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("active");}),{threshold:0.14});
revealEls.forEach(el=>revealObs.observe(el));

// ── Hero parallax ─────────────────────────────────────────────────────────────
const hero=document.querySelector(".hero");
const photoRing=document.querySelector(".photo-ring");
const heroCopy=document.querySelector(".hero-copy");
if(hero&&photoRing&&heroCopy){
  hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-0.5;const y=(e.clientY-r.top)/r.height-0.5;photoRing.style.transform=	ranslate(px,px);heroCopy.style.transform=	ranslate(px,px);});
  hero.addEventListener("pointerleave",()=>{photoRing.style.transform="translate(0,0)";heroCopy.style.transform="translate(0,0)";});
}
