"use client";
import { useState, useRef, useCallback, useEffect } from "react";

const REMOVE_BG_KEY = "pBzBsLfZKHNxiiTEvbX4seU2";

const BACKGROUNDS = [
  { id: "nyc1",       label: "Times Square", emoji: "🗽", url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800" },
  { id: "tokyo1",     label: "Tokyo",        emoji: "🌸", url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800" },
  { id: "nyc2",       label: "NYC Noche",    emoji: "🌃", url: "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800" },
  { id: "city1",      label: "Ciudad",       emoji: "🏙️", url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800" },
  { id: "beach1",     label: "Playa",        emoji: "🏖️", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
  { id: "mountain1",  label: "Montañas",     emoji: "🏔️", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800" },
  { id: "forest1",    label: "Bosque",       emoji: "🌲", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800" },
  { id: "sunset1",    label: "Atardecer",    emoji: "🌅", url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800" },
  { id: "stadium1",   label: "Estadio",      emoji: "🏟️", url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800" },
  { id: "festival1",  label: "Festival",     emoji: "🎪", url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800" },
  { id: "mall1",      label: "Shopping",     emoji: "🛍️", url: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800" },
  { id: "snow1",      label: "Nieve",        emoji: "❄️", url: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800" },
  { id: "desert1",    label: "Desierto",     emoji: "🌵", url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800" },
  { id: "solid_black",label: "Negro",        emoji: "⬛", url: null, color: "#000000" },
  { id: "solid_white",label: "Blanco",       emoji: "⬜", url: null, color: "#ffffff" },
  { id: "solid_pink", label: "Rosa",         emoji: "🩷", url: null, color: "#ff2d78" },
];

const FRAMES = [
  { id: "neon",    label: "Neón",      emoji: "💜", accent: "#00cfff" },
  { id: "gold",    label: "Dorado",    emoji: "✨", accent: "#FFD700" },
  { id: "vintage", label: "Vintage",   emoji: "🎞️", accent: "#D2691E" },
  { id: "future",  label: "Futurista", emoji: "🤖", accent: "#00ff88" },
  { id: "minimal", label: "Minimal",   emoji: "◻️", accent: "rgba(255,255,255,0.8)" },
];

const FRAME_STYLES = {
  neon:    { border: "6px solid #00cfff",  boxShadow: "0 0 30px #00cfff, inset 0 0 30px rgba(0,207,255,0.1), 0 0 60px rgba(255,45,120,0.4)" },
  gold:    { border: "10px solid #FFD700", boxShadow: "0 0 30px #FFD700, inset 0 0 20px rgba(255,215,0,0.1)" },
  vintage: { border: "8px solid #8B4513",  boxShadow: "0 0 0 4px #D2691E, 0 0 0 8px #8B4513" },
  future:  { border: "4px solid #00ff88",  boxShadow: "0 0 40px #00ff88, inset 0 0 20px rgba(0,255,136,0.05), 0 0 80px rgba(0,136,255,0.3)" },
  minimal: { border: "2px solid rgba(255,255,255,0.8)", boxShadow: "0 0 20px rgba(255,255,255,0.1)" },
};

// ─────────────────────────────────────────────────────────────
// CINEMATIC SHOWCASE SCENES
// Each scene has: bg, accent, slogan, and a unique React component
// ─────────────────────────────────────────────────────────────

function SceneCar() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", zIndex:5, pointerEvents:"none" }}>
      {/* Road lines */}
      {[0,1,2,3].map(i => (
        <div key={i} className="road-line" style={{ animationDelay:`${i*0.4}s`, left:`${10+i*22}%` }} />
      ))}
      {/* Car drives in from left, comes OUT of frame, spins, goes back */}
      <div className="car-scene">
        <div className="car-body">
          {/* Car emoji big */}
          <span style={{ fontSize:72, display:"block", filter:"drop-shadow(0 15px 20px rgba(0,0,0,0.9))", lineHeight:1 }}>🏎️</span>
          {/* Speed lines */}
          <div className="speed-lines">
            {[0,1,2].map(i=><div key={i} className="speed-line" style={{ top:`${30+i*20}%`, animationDelay:`${i*0.1}s` }}/>)}
          </div>
        </div>
      </div>
      {/* Tire smoke */}
      <div className="tire-smoke" />
    </div>
  );
}

function SceneCandy() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", zIndex:5, pointerEvents:"none" }}>
      {/* Falling candies */}
      {["🍬","🍭","🍫","🍩","🧁","🍬","🍭","🍫"].map((c,i) => (
        <div key={i} className="candy-fall" style={{ left:`${8+i*12}%`, animationDelay:`${i*0.3}s`, fontSize: i%3===0?36:i%2===0?28:22 }}>
          {c}
        </div>
      ))}
      {/* Big hero candy bursting out */}
      <div className="candy-hero">
        <span style={{ fontSize:90, display:"block", filter:"drop-shadow(0 20px 25px rgba(0,0,0,0.95))", lineHeight:1 }}>🍬</span>
      </div>
      {/* Sparkle burst */}
      {[0,1,2,3,4,5].map(i=>(
        <div key={i} className="candy-spark" style={{ animationDelay:`${i*0.15}s`, "--angle":`${i*60}deg` }} />
      ))}
    </div>
  );
}

function SceneSneaker() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", zIndex:5, pointerEvents:"none" }}>
      {/* Motion trail */}
      {[0,1,2,3].map(i=>(
        <div key={i} className="sneaker-trail" style={{ animationDelay:`${i*0.08}s`, opacity: 1 - i*0.22 }} />
      ))}
      {/* Sneaker flies in and bounces */}
      <div className="sneaker-hero">
        <span style={{ fontSize:80, display:"block", filter:"drop-shadow(0 20px 22px rgba(0,0,0,0.95)) drop-shadow(0 0 30px rgba(255,45,120,0.6))", lineHeight:1 }}>👟</span>
      </div>
      {/* Impact rings */}
      <div className="impact-ring" style={{ animationDelay:"0s" }} />
      <div className="impact-ring" style={{ animationDelay:"0.3s" }} />
      {/* Stars */}
      {["⭐","✨","💫","⚡"].map((s,i)=>(
        <div key={i} className="star-burst" style={{ animationDelay:`${i*0.2}s`, "--tx":`${(i%2===0?1:-1)*60}px`, "--ty":`${-40-i*15}px`, left:`${30+i*10}%`, top:"40%" }}>
          {s}
        </div>
      ))}
    </div>
  );
}

function SceneBurger() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", zIndex:5, pointerEvents:"none" }}>
      {/* Fries raining */}
      {["🍟","🍔","🌮","🍕","🍟","🌭"].map((f,i)=>(
        <div key={i} className="food-fall" style={{ left:`${5+i*16}%`, animationDelay:`${i*0.25}s`, fontSize:i%2===0?30:22 }}>
          {f}
        </div>
      ))}
      {/* Hero burger */}
      <div className="burger-hero">
        <span style={{ fontSize:88, display:"block", filter:"drop-shadow(0 18px 24px rgba(0,0,0,0.95))", lineHeight:1 }}>🍔</span>
      </div>
      {/* Steam */}
      <div className="steam-1" />
      <div className="steam-2" />
      <div className="steam-3" />
    </div>
  );
}

function SceneAthleteJump() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", zIndex:5, pointerEvents:"none" }}>
      {/* Energy rings */}
      {[0,1,2].map(i=>(
        <div key={i} className="energy-ring" style={{ animationDelay:`${i*0.4}s` }} />
      ))}
      {/* Athlete */}
      <div className="athlete-jump">
        <span style={{ fontSize:80, display:"block", filter:"drop-shadow(0 20px 20px rgba(0,0,0,0.95)) drop-shadow(0 0 40px rgba(255,150,0,0.5))", lineHeight:1 }}>🏃</span>
      </div>
      {/* Lightning bolts */}
      {["⚡","⚡","⚡"].map((l,i)=>(
        <div key={i} className="lightning" style={{ animationDelay:`${i*0.2}s`, left:`${20+i*25}%` }}>
          {l}
        </div>
      ))}
    </div>
  );
}

function ScenePerfume() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", zIndex:5, pointerEvents:"none" }}>
      {/* Floating particles like mist */}
      {Array.from({length:20}).map((_,i)=>(
        <div key={i} className="mist-particle" style={{
          left:`${Math.random()*90+5}%`,
          animationDelay:`${i*0.2}s`,
          width: 4+Math.random()*8,
          height: 4+Math.random()*8,
          background:`hsla(${280+i*8},80%,70%,0.7)`
        }} />
      ))}
      {/* Perfume bottle hero */}
      <div className="perfume-hero">
        <span style={{ fontSize:82, display:"block", filter:"drop-shadow(0 18px 24px rgba(0,0,0,0.95)) drop-shadow(0 0 40px rgba(200,100,255,0.6))", lineHeight:1 }}>🧴</span>
      </div>
      {/* Sparkle ring */}
      {[0,1,2,3,4,5,6,7].map(i=>(
        <div key={i} className="perfume-spark" style={{ animationDelay:`${i*0.18}s`, "--angle":`${i*45}deg` }} />
      ))}
    </div>
  );
}

// ─── Showcase scenes config ───
const SCENES = [
  {
    id: "car",
    bg: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200",
    accent: "#ff4500",
    slogan: "SPEED BEYOND LIMITS",
    brand: "TURBO X",
    Component: SceneCar,
  },
  {
    id: "candy",
    bg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
    accent: "#ff2d78",
    slogan: "TASTE THE MOMENT",
    brand: "SWEET DROP",
    Component: SceneCandy,
  },
  {
    id: "sneaker",
    bg: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200",
    accent: "#00cfff",
    slogan: "MOVE DIFFERENT",
    brand: "AIR FORCE",
    Component: SceneSneaker,
  },
  {
    id: "burger",
    bg: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200",
    accent: "#ff9500",
    slogan: "FEEL THE CRUNCH",
    brand: "WILD BITE",
    Component: SceneBurger,
  },
  {
    id: "athlete",
    bg: "https://images.unsplash.com/photo-1474224017046-182ece80b263?w=1200",
    accent: "#00ff88",
    slogan: "PUSH YOUR LIMITS",
    brand: "ULTRA RUN",
    Component: SceneAthleteJump,
  },
  {
    id: "perfume",
    bg: "https://images.unsplash.com/photo-1518982380512-5a3c6f6a0b84?w=1200",
    accent: "#c084fc",
    slogan: "BREAK THE FRAME",
    brand: "AURORA",
    Component: ScenePerfume,
  },
];

export default function BillboardApp() {
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [bg, setBg] = useState("nyc1");
  const [frame, setFrame] = useState("neon");
  const [slogan, setSlogan] = useState("");
  const [brandLogo, setBrandLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [personBlob, setPersonBlob] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [tab, setTab] = useState("ejemplos");
  const [confetti, setConfetti] = useState([]);
  const [bgPreview, setBgPreview] = useState(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneIn, setSceneIn] = useState(true);
  const [particles, setParticles] = useState([]);

  const fileRef = useRef(null);
  const logoRef = useRef(null);
  const billboardRef = useRef(null);
  const autoTiltTimer = useRef(null);
  const autoTiltAngle = useRef(0);
  const isMouseOver = useRef(false);

  // Auto rotate scenes every 5s
  useEffect(() => {
    const t = setInterval(() => {
      setSceneIn(false);
      setTimeout(() => { setSceneIdx(i => (i + 1) % SCENES.length); setSceneIn(true); }, 600);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const startAutoTilt = useCallback(() => {
    clearInterval(autoTiltTimer.current);
    autoTiltTimer.current = setInterval(() => {
      if (isMouseOver.current) return;
      autoTiltAngle.current += 0.018;
      setTilt({
        x: Math.sin(autoTiltAngle.current * 0.7) * 5,
        y: Math.sin(autoTiltAngle.current) * 7,
      });
    }, 16);
  }, []);

  useEffect(() => {
    if (personBlob) startAutoTilt();
    return () => clearInterval(autoTiltTimer.current);
  }, [personBlob, startAutoTilt]);

  useEffect(() => {
    const sel = BACKGROUNDS.find(b => b.id === bg);
    setBgPreview(sel?.url || null);
  }, [bg]);

  const handleMouseMove = useCallback((e) => {
    if (!billboardRef.current) return;
    isMouseOver.current = true;
    const rect = billboardRef.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 10 });
  }, []);

  const handleMouseLeave = useCallback(() => { isMouseOver.current = false; }, []);

  const launchConfetti = (accent) => {
    const pieces = Array.from({ length: 90 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: [accent,"#ff2d78","#ff9500","#00cfff","#fff","#ffeb3b"][Math.floor(Math.random()*6)],
      size: Math.random() * 12 + 4, delay: Math.random() * 2,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3500);
    const pts = Array.from({ length: 45 }, (_, i) => ({
      id: i + Date.now(), x: 35 + Math.random() * 30, y: 20 + Math.random() * 50,
      vx: (Math.random() - 0.5) * 7, vy: -(Math.random() * 6 + 2),
      color: [accent,"#ff2d78","#ffeb3b","#fff"][i % 4],
      size: Math.random() * 12 + 5,
    }));
    setParticles(pts);
    setTimeout(() => setParticles([]), 2000);
  };

  const handleFile = useCallback((file) => {
    if (!file) return;
    setPhoto(URL.createObjectURL(file)); setPhotoFile(file);
    setPhotoUrl(null); setPersonBlob(null); setError(null); setTab("crear");
  }, []);

  const handleLogo = useCallback((file) => { if (file) setBrandLogo(URL.createObjectURL(file)); }, []);

  const useExample = (bg) => {
    setPhotoUrl(null); setPhotoFile(null); setPhoto(null);
    setBg(bg); setPersonBlob(null); setError(null); setTab("crear");
  };

  const removeBg = async () => {
    const fd = new FormData();
    if (photoFile) fd.append("image_file", photoFile);
    else if (photoUrl) fd.append("image_url", photoUrl);
    else throw new Error("No hay imagen");
    fd.append("size", "auto");
    const res = await fetch("https://api.remove.bg/v1.0/removebg", { method:"POST", headers:{"X-Api-Key":REMOVE_BG_KEY}, body:fd });
    if (!res.ok) throw new Error("Error al quitar el fondo");
    return res.blob();
  };

  const generate = async () => {
    if (!photo) { setError("Por favor subí una foto primero"); return; }
    setLoading(true); setPersonBlob(null); setError(null); setProgress(10);
    const iv = setInterval(() => setProgress(p => Math.min(p + 4, 85)), 400);
    try {
      setStatus("Quitando el fondo...");
      const blob = await removeBg();
      setProgress(100); setStatus("¡Listo!");
      setPersonBlob(URL.createObjectURL(blob));
      launchConfetti(FRAMES.find(f=>f.id===frame)?.accent || "#00cfff");
    } catch(e) { setError(e.message); }
    finally { clearInterval(iv); setLoading(false); }
  };

  const selectedBgData = BACKGROUNDS.find(b => b.id === bg);
  const frameStyle = FRAME_STYLES[frame] || FRAME_STYLES.neon;
  const accentColor = FRAMES.find(f=>f.id===frame)?.accent || "#00cfff";
  const scene = SCENES[sceneIdx];
  const SceneComp = scene.Component;

  return (
    <div style={{ minHeight:"100vh", background:"#04040a", fontFamily:"'DM Sans',sans-serif", color:"#fff", padding:"0 0 40px", position:"relative", overflow:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&display=swap');
        * { box-sizing:border-box; }

        /* ── TRANSITIONS ── */
        @keyframes fall { to { transform:translateY(110vh) rotate(720deg); opacity:0; } }
        @keyframes sceneIn  { 0%{opacity:0;transform:perspective(1000px) rotateY(-14deg) scale(.88) translateX(-28px);} 100%{opacity:1;transform:perspective(1000px) rotateY(0) scale(1) translateX(0);} }
        @keyframes sceneOut { 0%{opacity:1;transform:perspective(1000px) rotateY(0) scale(1);} 100%{opacity:0;transform:perspective(1000px) rotateY(12deg) scale(.9) translateX(28px);} }
        @keyframes particleUp { 0%{opacity:1;transform:translate(0,0) scale(1);} 100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0);} }
        @keyframes ambientFloat { 0%,100%{transform:translateY(0) translateX(0);opacity:.6;} 50%{transform:translateY(-40px) translateX(15px);opacity:.3;} }
        @keyframes headerShimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
        @keyframes btnPulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,45,120,.5);} 50%{box-shadow:0 0 0 14px rgba(255,45,120,0);} }
        .btn-pulse { animation:btnPulse 2s ease-in-out infinite; }

        /* ── PERSON (result billboard) ── */
        @keyframes personFloat { 0%,100%{transform:translateX(-50%) translateY(0) rotate(-.4deg) scale(1);} 25%{transform:translateX(-50%) translateY(-20px) rotate(.3deg) scale(1.012);} 50%{transform:translateX(-50%) translateY(-30px) rotate(-.2deg) scale(1.018);} 75%{transform:translateX(-50%) translateY(-16px) rotate(.4deg) scale(1.008);} }
        @keyframes shadowFloat { 0%,100%{transform:translateX(-50%) scaleX(1) scaleY(1);opacity:.75;} 50%{transform:translateX(-50%) scaleX(.65) scaleY(.55);opacity:.28;} }
        @keyframes personReveal { 0%{opacity:0;transform:translateX(-50%) translateY(100px) scale(.6);filter:blur(12px) brightness(2);} 60%{filter:blur(0) brightness(1.3);} 100%{opacity:1;transform:translateX(-50%) translateY(0) scale(1);filter:blur(0) brightness(1);} }
        .person-reveal { animation:personReveal 1s cubic-bezier(.22,1,.36,1) forwards, personFloat 4s ease-in-out 1.05s infinite; }
        .shadow-blob { animation:shadowFloat 4s ease-in-out infinite; }

        /* ── FRAME GLOWS ── */
        @keyframes glowNeon   { 0%,100%{box-shadow:0 0 25px #00cfff,0 0 55px rgba(255,45,120,.35),inset 0 0 20px rgba(0,207,255,.05);} 50%{box-shadow:0 0 60px #00cfff,0 0 120px rgba(255,45,120,.7),0 0 18px rgba(255,255,255,.15) inset;} }
        @keyframes glowGold   { 0%,100%{box-shadow:0 0 25px #FFD700,inset 0 0 15px rgba(255,215,0,.08);} 50%{box-shadow:0 0 75px #FFD700,0 0 22px rgba(255,248,220,.4) inset;} }
        @keyframes glowFuture { 0%,100%{box-shadow:0 0 35px #00ff88,0 0 75px rgba(0,136,255,.25);} 50%{box-shadow:0 0 85px #00ff88,0 0 170px rgba(0,136,255,.6);} }
        .glow-neon   { animation:glowNeon   2.2s ease-in-out infinite; }
        .glow-gold   { animation:glowGold   2.2s ease-in-out infinite; }
        .glow-future { animation:glowFuture 2.2s ease-in-out infinite; }

        @keyframes billboardIn { 0%{opacity:0;transform:perspective(900px) rotateX(20deg) rotateY(-8deg) scale(.78) translateY(50px);} 65%{transform:perspective(900px) rotateX(-4deg) rotateY(3deg) scale(1.04) translateY(-8px);} 100%{opacity:1;transform:perspective(900px) rotateX(0) rotateY(0) scale(1) translateY(0);} }
        .billboard-enter { animation:billboardIn 1s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes lightSweep { 0%{transform:translateX(-150%) skewX(-22deg);opacity:0;} 8%{opacity:.7;} 50%{opacity:.25;} 100%{transform:translateX(250%) skewX(-22deg);opacity:0;} }
        .light-sweep { position:absolute;top:0;left:0;width:35%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,.15),transparent);animation:lightSweep 5s ease-in-out infinite;pointer-events:none;z-index:6; }
        @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0) rotate(0);} 50%{opacity:1;transform:scale(1) rotate(180deg);} }
        .sparkle { position:absolute;width:9px;height:9px;border-radius:50%;animation:sparkle 2s ease-in-out infinite;pointer-events:none;z-index:11; }
        @keyframes glowRing { 0%,100%{opacity:.45;transform:translateX(-50%) scale(1);} 50%{opacity:.9;transform:translateX(-50%) scale(1.1);} }
        .glow-ring { animation:glowRing 4s ease-in-out infinite; }
        .scanlines::after { content:'';position:absolute;inset:0;border-radius:14px;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px);pointer-events:none;z-index:2; }
        @keyframes sloganPulse { 0%,100%{text-shadow:0 0 15px var(--ac),0 0 30px var(--ac);} 50%{text-shadow:0 0 30px var(--ac),0 0 60px var(--ac),0 0 90px var(--ac);} }
        .slogan-glow { animation:sloganPulse 2.5s ease-in-out infinite; }

        /* ════════════════════════════════════
           SCENE: CAR
        ════════════════════════════════════ */
        @keyframes carDrive {
          0%   { transform:translateX(-120%) translateY(0) rotate(0deg) scale(0.6); opacity:0; }
          15%  { opacity:1; transform:translateX(-20%) translateY(-10px) rotate(0deg) scale(1); }
          35%  { transform:translateX(50%) translateY(-80px) rotate(-15deg) scale(1.3); }
          55%  { transform:translateX(55%) translateY(-100px) rotate(-30deg) scale(1.4); }
          70%  { transform:translateX(50%) translateY(-80px) rotate(5deg) scale(1.3); }
          85%  { transform:translateX(-20%) translateY(-10px) rotate(0deg) scale(1); }
          100% { transform:translateX(-120%) translateY(0) rotate(0deg) scale(0.6); opacity:0; }
        }
        .car-scene { position:absolute; bottom:20%; left:0; width:100%; z-index:8; }
        .car-body  { animation:carDrive 4s cubic-bezier(.4,0,.2,1) infinite; display:inline-block; transform-origin:center bottom; }

        @keyframes roadLine { 0%{transform:translateX(100%);opacity:.6;} 100%{transform:translateX(-200%);opacity:.3;} }
        .road-line { position:absolute; bottom:22%; height:3px; width:15%; background:linear-gradient(to right,transparent,rgba(255,255,255,.4),transparent); animation:roadLine 1.2s linear infinite; }

        @keyframes smokeRise { 0%{transform:translateX(0) translateY(0) scale(.5);opacity:.7;} 100%{transform:translateX(-30px) translateY(-60px) scale(2);opacity:0;} }
        .tire-smoke { position:absolute; bottom:24%; left:30%; width:20px; height:20px; border-radius:50%; background:rgba(255,255,255,.15); animation:smokeRise 0.8s ease-out infinite; }
        .speed-lines { position:absolute; right:110%; top:0; height:100%; width:60px; }
        @keyframes speedLine { 0%{width:60px;opacity:.7;} 100%{width:0;opacity:0;} }
        .speed-line { position:absolute; height:3px; background:rgba(255,150,0,.7); border-radius:2px; animation:speedLine .3s ease-out infinite; right:0; }

        /* ════════════════════════════════════
           SCENE: CANDY
        ════════════════════════════════════ */
        @keyframes candyFall {
          0%   { transform:translateY(-20%) rotate(0deg) scale(0.5); opacity:0; }
          10%  { opacity:1; transform:translateY(0) rotate(20deg) scale(1); }
          60%  { transform:translateY(80%) rotate(180deg) scale(1); opacity:1; }
          80%  { transform:translateY(85%) rotate(200deg) scale(0.8); opacity:.5; }
          100% { transform:translateY(-20%) rotate(360deg) scale(0.5); opacity:0; }
        }
        .candy-fall { position:absolute; top:0; animation:candyFall 2.5s ease-in-out infinite; }

        @keyframes candyHero {
          0%   { transform:translateX(-50%) translateY(120%) scale(.4) rotate(-20deg); opacity:0; }
          20%  { opacity:1; transform:translateX(-50%) translateY(-30%) scale(1.2) rotate(10deg); }
          40%  { transform:translateX(-50%) translateY(-60%) scale(1.35) rotate(-5deg); }
          55%  { transform:translateX(-50%) translateY(-55%) scale(1.3) rotate(0deg); }
          75%  { transform:translateX(-50%) translateY(-55%) scale(1.28) rotate(0deg); }
          90%  { transform:translateX(-50%) translateY(0%) scale(.8) rotate(15deg); opacity:.5; }
          100% { transform:translateX(-50%) translateY(120%) scale(.4) rotate(-20deg); opacity:0; }
        }
        .candy-hero { position:absolute; bottom:10%; left:50%; animation:candyHero 3s cubic-bezier(.2,.8,.2,1.2) infinite; }

        @keyframes candySpark {
          0%   { transform:rotate(var(--angle)) translateX(0) scale(0); opacity:1; }
          50%  { transform:rotate(var(--angle)) translateX(50px) scale(1); opacity:.8; }
          100% { transform:rotate(var(--angle)) translateX(80px) scale(0); opacity:0; }
        }
        .candy-spark { position:absolute; bottom:40%; left:50%; width:8px; height:8px; border-radius:50%; background:#ff2d78; animation:candySpark 1.5s ease-out infinite; box-shadow:0 0 8px #ff2d78; }

        /* ════════════════════════════════════
           SCENE: SNEAKER
        ════════════════════════════════════ */
        @keyframes sneakerHero {
          0%   { transform:translateX(-150%) translateY(50%) rotate(-40deg) scale(.5); opacity:0; }
          20%  { opacity:1; transform:translateX(-50%) translateY(-50%) rotate(10deg) scale(1.2); }
          35%  { transform:translateX(-50%) translateY(-65%) rotate(-8deg) scale(1.35); }
          55%  { transform:translateX(-50%) translateY(-65%) rotate(0deg) scale(1.3); }
          70%  { transform:translateX(-50%) translateY(-65%) rotate(3deg) scale(1.32); }
          85%  { transform:translateX(50%) translateY(50%) rotate(30deg) scale(.7); opacity:.5; }
          100% { transform:translateX(-150%) translateY(50%) rotate(-40deg) scale(.5); opacity:0; }
        }
        .sneaker-hero { position:absolute; bottom:15%; left:50%; animation:sneakerHero 3.5s cubic-bezier(.2,.8,.2,1.1) infinite; }

        @keyframes sneakerTrail {
          0%,100% { opacity:0; }
          40%,60% { opacity:1; }
        }
        .sneaker-trail { position:absolute; bottom:25%; left:30%; width:60px; height:60px; font-size:50px; animation:sneakerTrail 3.5s ease-in-out infinite; filter:blur(3px); }

        @keyframes impactRing {
          0%  { transform:translateX(-50%) scale(0); opacity:1; }
          100%{ transform:translateX(-50%) scale(3); opacity:0; }
        }
        .impact-ring { position:absolute; bottom:20%; left:50%; width:60px; height:60px; border:3px solid #00cfff; border-radius:50%; animation:impactRing 1.5s ease-out infinite; }

        @keyframes starBurst {
          0%  { transform:translate(0,0) scale(0); opacity:1; }
          100%{ transform:translate(var(--tx),var(--ty)) scale(1.5); opacity:0; }
        }
        .star-burst { position:absolute; font-size:20px; animation:starBurst 1s ease-out infinite; }

        /* ════════════════════════════════════
           SCENE: BURGER / FOOD
        ════════════════════════════════════ */
        @keyframes foodFall {
          0%  { transform:translateY(-30%) rotate(0deg) scale(.6); opacity:0; }
          15% { opacity:1; }
          70% { transform:translateY(90%) rotate(270deg) scale(1); opacity:1; }
          100%{ transform:translateY(-30%) rotate(360deg) scale(.6); opacity:0; }
        }
        .food-fall { position:absolute; top:0; animation:foodFall 2s linear infinite; }

        @keyframes burgerHero {
          0%   { transform:translateX(-50%) translateY(150%) scale(.3) rotate(0deg); opacity:0; }
          25%  { opacity:1; transform:translateX(-50%) translateY(-40%) scale(1.3) rotate(-5deg); }
          45%  { transform:translateX(-50%) translateY(-55%) scale(1.35) rotate(3deg); }
          65%  { transform:translateX(-50%) translateY(-52%) scale(1.3) rotate(0deg); }
          85%  { transform:translateX(-50%) translateY(-52%) scale(1.28) rotate(-2deg); }
          95%  { transform:translateX(-50%) translateY(50%) scale(.6) rotate(10deg); opacity:.3; }
          100% { transform:translateX(-50%) translateY(150%) scale(.3) rotate(0deg); opacity:0; }
        }
        .burger-hero { position:absolute; bottom:10%; left:50%; animation:burgerHero 3.2s cubic-bezier(.2,.8,.2,1.1) infinite; }

        @keyframes steam {
          0%  { transform:translateX(0) translateY(0) scaleX(1); opacity:.6; }
          50% { transform:translateX(-5px) translateY(-30px) scaleX(1.3); opacity:.3; }
          100%{ transform:translateX(5px) translateY(-60px) scaleX(.8); opacity:0; }
        }
        .steam-1,.steam-2,.steam-3 { position:absolute; bottom:52%; width:8px; height:25px; border-radius:4px; background:rgba(255,255,255,.3); animation:steam 1s ease-out infinite; }
        .steam-1 { left:44%; animation-delay:0s; }
        .steam-2 { left:49%; animation-delay:.3s; }
        .steam-3 { left:54%; animation-delay:.6s; }

        /* ════════════════════════════════════
           SCENE: ATHLETE
        ════════════════════════════════════ */
        @keyframes athleteJump {
          0%   { transform:translateX(-50%) translateY(40%) scale(.7); opacity:0; }
          15%  { opacity:1; transform:translateX(-50%) translateY(0%) scale(1); }
          30%  { transform:translateX(-50%) translateY(-70%) scale(1.2) rotate(-5deg); }
          50%  { transform:translateX(-50%) translateY(-90%) scale(1.35) rotate(0deg); }
          65%  { transform:translateX(-50%) translateY(-70%) scale(1.2) rotate(5deg); }
          80%  { transform:translateX(-50%) translateY(0%) scale(1); }
          95%  { opacity:.4; transform:translateX(-50%) translateY(40%) scale(.7); }
          100% { opacity:0; transform:translateX(-50%) translateY(40%) scale(.7); }
        }
        .athlete-jump { position:absolute; bottom:10%; left:50%; animation:athleteJump 3s cubic-bezier(.2,.8,.2,1.1) infinite; }

        @keyframes energyRing {
          0%  { transform:translateX(-50%) scale(0); opacity:.8; }
          100%{ transform:translateX(-50%) scale(4); opacity:0; }
        }
        .energy-ring { position:absolute; bottom:18%; left:50%; width:50px; height:50px; border:3px solid #00ff88; border-radius:50%; animation:energyRing 2s ease-out infinite; box-shadow:0 0 10px #00ff88; }

        @keyframes lightning { 0%,100%{opacity:0;transform:translateY(0) scale(.5);} 50%{opacity:1;transform:translateY(-20px) scale(1.2);} }
        .lightning { position:absolute; bottom:30%; font-size:28px; animation:lightning .6s ease-in-out infinite; }

        /* ════════════════════════════════════
           SCENE: PERFUME
        ════════════════════════════════════ */
        @keyframes perfumeHero {
          0%   { transform:translateX(-50%) translateY(150%) scale(.3) rotate(-30deg); opacity:0; }
          20%  { opacity:1; transform:translateX(-50%) translateY(-45%) scale(1.25) rotate(10deg); }
          40%  { transform:translateX(-50%) translateY(-60%) scale(1.35) rotate(-5deg); }
          60%  { transform:translateX(-50%) translateY(-58%) scale(1.3) rotate(3deg); }
          80%  { transform:translateX(-50%) translateY(-58%) scale(1.28) rotate(0deg); }
          92%  { transform:translateX(-50%) translateY(50%) scale(.7) rotate(-15deg); opacity:.3; }
          100% { transform:translateX(-50%) translateY(150%) scale(.3) rotate(-30deg); opacity:0; }
        }
        .perfume-hero { position:absolute; bottom:10%; left:50%; animation:perfumeHero 3.5s cubic-bezier(.2,.8,.2,1.2) infinite; }

        @keyframes mistParticle {
          0%  { transform:translateY(0) scale(1); opacity:.7; }
          100%{ transform:translateY(-120px) scale(2); opacity:0; }
        }
        .mist-particle { position:absolute; bottom:50%; border-radius:50%; animation:mistParticle 2s ease-out infinite; }

        @keyframes perfumeSpark {
          0%  { transform:rotate(var(--angle)) translateX(0) scale(0); opacity:1; }
          60% { transform:rotate(var(--angle)) translateX(65px) scale(1); opacity:.7; }
          100%{ transform:rotate(var(--angle)) translateX(100px) scale(0); opacity:0; }
        }
        .perfume-spark { position:absolute; bottom:45%; left:50%; width:6px; height:6px; border-radius:50%; background:#c084fc; animation:perfumeSpark 2s ease-out infinite; box-shadow:0 0 8px #c084fc; }
      `}</style>

      {/* Confetti */}
      {confetti.map(p => <div key={p.id} style={{ position:"fixed",left:`${p.x}%`,top:"-20px",width:p.size,height:p.size,background:p.color,borderRadius:"50%",zIndex:9999,animation:`fall ${1.5+p.delay}s ease-in forwards` }} />)}
      {particles.map(p => <div key={p.id} style={{ position:"fixed",left:`${p.x}%`,top:`${p.y}%`,width:p.size,height:p.size,background:p.color,borderRadius:"50%",zIndex:9998,"--tx":`${p.vx*60}px`,"--ty":`${p.vy*60}px`,animation:"particleUp 1.8s ease-out forwards",boxShadow:`0 0 8px ${p.color}` }} />)}

      {/* Ambient orbs */}
      <div style={{ position:"fixed",top:"-20%",left:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(255,45,120,.08) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"ambientFloat 8s ease-in-out infinite" }} />
      <div style={{ position:"fixed",bottom:"-20%",right:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(0,207,255,.08) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"ambientFloat 10s ease-in-out 3s infinite" }} />

      <div style={{ maxWidth:520, margin:"0 auto", position:"relative", zIndex:1, padding:"0 20px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", paddingTop:24, marginBottom:16 }}>
          <h1 style={{ fontSize:34,fontWeight:900,letterSpacing:3,margin:0,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffeb3b,#00cfff,#ff2d78)",backgroundSize:"300% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"headerShimmer 4s ease infinite" }}>⚡ NEONBOARD AI</h1>
          <p style={{ color:"rgba(255,255,255,.35)",fontSize:12,marginTop:5,letterSpacing:2,textTransform:"uppercase" }}>Billboards virales · Efecto 3D · Sin edición</p>
        </div>

        {/* ── CINEMATIC SHOWCASE ── */}
        <div style={{ marginBottom:20, cursor:"pointer" }} onClick={() => setTab("crear")}>
          <div style={{ animation: sceneIn ? "sceneIn .6s cubic-bezier(.22,1,.36,1) forwards" : "sceneOut .5s ease-in forwards", position:"relative" }}>
            {/* 3D depth */}
            <div style={{ position:"absolute",top:6,right:-16,width:16,height:"calc(100% - 12px)",background:`linear-gradient(to right,${scene.accent}44,transparent)`,borderRadius:"0 4px 4px 0",zIndex:0 }} />
            <div style={{ position:"absolute",bottom:-13,left:6,width:"calc(100% - 12px)",height:13,background:`linear-gradient(to bottom,${scene.accent}33,transparent)`,borderRadius:"0 0 4px 4px",zIndex:0 }} />

            {/* Billboard */}
            <div className="scanlines" style={{ position:"relative",borderRadius:20,overflow:"hidden",aspectRatio:"3/4",maxHeight:440,border:`5px solid ${scene.accent}`,boxShadow:`0 0 40px ${scene.accent}88,0 0 80px ${scene.accent}44`,background:`url(${scene.bg}) center/cover` }}>
              {/* Dark overlay */}
              <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,.25)",zIndex:1 }} />
              {/* Light sweep */}
              <div className="light-sweep" />

              {/* SCENE ANIMATION */}
              <SceneComp />

              {/* Brand */}
              <div style={{ position:"absolute",top:"4%",left:"5%",zIndex:12,background:"rgba(0,0,0,.65)",backdropFilter:"blur(6px)",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:800,color:scene.accent,letterSpacing:3 }}>
                {scene.brand}
              </div>

              {/* Slogan */}
              <div className="slogan-glow" style={{ "--ac":scene.accent,position:"absolute",bottom:"5%",left:"5%",right:"5%",zIndex:12,background:"rgba(0,0,0,.72)",backdropFilter:"blur(8px)",borderRadius:12,padding:"12px 16px",textAlign:"center",fontSize:16,fontWeight:900,color:"#fff",border:`1px solid ${scene.accent}55`,letterSpacing:2 }}>
                {scene.slogan}
              </div>

              {/* Sparkles */}
              {[{top:"7%",left:"8%",color:scene.accent,delay:"0s"},{top:"11%",right:"10%",color:"#ffeb3b",delay:".7s"},{top:"30%",left:"5%",color:"#ff2d78",delay:"1.3s"},{top:"22%",right:"7%",color:scene.accent,delay:"2s"}].map((s,i) => (
                <div key={i} className="sparkle" style={{ top:s.top,left:s.left,right:s.right,background:s.color,animationDelay:s.delay,boxShadow:`0 0 8px ${s.color}`,zIndex:13 }} />
              ))}
            </div>
          </div>

          {/* Scene dots */}
          <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:14 }}>
            {SCENES.map((_,i) => (
              <div key={i} onClick={e=>{e.stopPropagation();setSceneIdx(i);}} style={{ width:i===sceneIdx?28:8,height:8,borderRadius:4,background:i===sceneIdx?scene.accent:"rgba(255,255,255,.2)",transition:"all .3s",cursor:"pointer" }} />
            ))}
          </div>

          {/* Scene labels */}
          <div style={{ display:"flex",justifyContent:"center",gap:6,marginTop:10,flexWrap:"wrap" }}>
            {SCENES.map((s,i) => (
              <button key={i} onClick={e=>{e.stopPropagation();setSceneIdx(i);}} style={{ padding:"4px 10px",background:i===sceneIdx?`${s.accent}22`:"rgba(255,255,255,.04)",border:i===sceneIdx?`1px solid ${s.accent}66`:"1px solid rgba(255,255,255,.08)",borderRadius:20,fontSize:10,color:i===sceneIdx?s.accent:"rgba(255,255,255,.4)",cursor:"pointer",transition:"all .2s",fontWeight:i===sceneIdx?700:400 }}>
                {s.brand}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex",gap:6,marginBottom:20 }}>
          {[["ejemplos","✨ Ejemplos"],["crear","🎨 Crear"],["galeria","🖼️ Galería"]].map(([t,label]) => (
            <button key={t} onClick={()=>setTab(t)} style={{ flex:1,padding:"10px 4px",background:tab===t?"rgba(255,45,120,.2)":"rgba(255,255,255,.05)",border:tab===t?"1px solid rgba(255,45,120,.5)":"1px solid rgba(255,255,255,.1)",borderRadius:10,color:"#fff",cursor:"pointer",fontWeight:tab===t?800:400,fontSize:12,transition:"all .2s" }}>{label}</button>
          ))}
        </div>

        {/* EJEMPLOS TAB */}
        {tab === "ejemplos" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.4)",fontSize:12,marginBottom:14 }}>Elegí un fondo para empezar 👇</p>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              {[
                { bg:"nyc1",     img:"https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400", label:"Times Square", desc:"El clásico viral" },
                { bg:"beach1",   img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", label:"Playa",        desc:"Verano infinito" },
                { bg:"tokyo1",   img:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400", label:"Tokyo",        desc:"Lights & culture" },
                { bg:"festival1",img:"https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400", label:"Festival",     desc:"Energía total" },
                { bg:"stadium1", img:"https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400", label:"Estadio",      desc:"Campeón" },
                { bg:"mountain1",img:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400", label:"Montañas",     desc:"Aventura pura" },
              ].map(ex => (
                <div key={ex.bg} onClick={()=>useExample(ex.bg)} style={{ cursor:"pointer",borderRadius:14,overflow:"hidden",border:"1px solid rgba(255,255,255,.1)",background:"rgba(255,255,255,.03)",transition:"transform .2s,border-color .2s,box-shadow .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04) translateY(-2px)";e.currentTarget.style.borderColor="rgba(255,45,120,.5)";e.currentTarget.style.boxShadow="0 8px 30px rgba(255,45,120,.15)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";e.currentTarget.style.boxShadow="none";}}>
                  <img src={ex.img} alt={ex.label} style={{ width:"100%",height:120,objectFit:"cover" }} />
                  <div style={{ padding:"10px 12px" }}>
                    <div style={{ fontSize:13,fontWeight:700 }}>📍 {ex.label}</div>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,.4)",marginTop:2 }}>{ex.desc}</div>
                    <div style={{ marginTop:8,padding:"6px",background:"rgba(255,45,120,.15)",border:"1px solid rgba(255,45,120,.3)",borderRadius:6,fontSize:11,textAlign:"center",color:"#ff2d78",fontWeight:700 }}>Usar este fondo →</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREAR TAB */}
        {tab === "crear" && (
          <div>
            <div style={{ marginBottom:18 }}>
              <p style={{ fontSize:11,letterSpacing:3,color:"#ff2d78",marginBottom:8,fontWeight:700 }}>01 · TU FOTO O PRODUCTO</p>
              <div onClick={()=>fileRef.current.click()} style={{ border:"2px dashed rgba(255,45,120,.4)",borderRadius:14,padding:photo?0:28,textAlign:"center",cursor:"pointer",overflow:"hidden",minHeight:90,display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color .2s,background .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,45,120,.8)";e.currentTarget.style.background="rgba(255,45,120,.05)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,45,120,.4)";e.currentTarget.style.background="transparent";}}>
                {photo
                  ? <div style={{ position:"relative",width:"100%" }}><img src={photo} alt="preview" style={{ width:"100%",maxHeight:160,objectFit:"cover" }}/><div style={{ position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.75)",padding:"4px 10px",borderRadius:6,fontSize:11 }}>📷 Cambiar</div></div>
                  : <div><div style={{ fontSize:36 }}>🤳</div><div style={{ fontSize:13,marginTop:6,color:"rgba(255,255,255,.6)" }}>Subí tu foto o producto</div></div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
            </div>

            <div style={{ marginBottom:18 }}>
              <p style={{ fontSize:11,letterSpacing:3,color:"#ff2d78",marginBottom:8,fontWeight:700 }}>02 · SLOGAN (OPCIONAL)</p>
              <input style={{ width:"100%",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:14,outline:"none",transition:"border-color .2s" }}
                onFocus={e=>e.target.style.borderColor="rgba(255,45,120,.6)"}
                onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.1)"}
                placeholder="Ej: Just Do It · Tu mejor versión" value={slogan} onChange={e=>setSlogan(e.target.value)} />
            </div>

            <div style={{ marginBottom:18 }}>
              <p style={{ fontSize:11,letterSpacing:3,color:"#ff2d78",marginBottom:8,fontWeight:700 }}>03 · TU LOGO (OPCIONAL)</p>
              <div onClick={()=>logoRef.current.click()} style={{ border:"1px dashed rgba(255,255,255,.2)",borderRadius:10,padding:"12px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"border-color .2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.45)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.2)"}>
                {brandLogo?<img src={brandLogo} alt="logo" style={{ width:50,height:50,objectFit:"contain",borderRadius:8 }}/>:<div style={{ fontSize:28 }}>🏷️</div>}
                <div style={{ fontSize:12,color:"rgba(255,255,255,.5)" }}>{brandLogo?"Logo cargado ✅":"Subí tu logo para agregarlo"}</div>
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleLogo(e.target.files[0])} />
            </div>

            <div style={{ marginBottom:18 }}>
              <p style={{ fontSize:11,letterSpacing:3,color:"#ff2d78",marginBottom:8,fontWeight:700 }}>04 · MARCO</p>
              <div style={{ display:"flex",gap:8 }}>
                {FRAMES.map(f => (
                  <button key={f.id} onClick={()=>setFrame(f.id)} style={{ flex:1,padding:"10px 4px",background:frame===f.id?"rgba(255,45,120,.18)":"rgba(255,255,255,.03)",border:frame===f.id?`1px solid ${f.accent}88`:"1px solid rgba(255,255,255,.08)",borderRadius:10,cursor:"pointer",color:"#fff",fontSize:11,textAlign:"center",transition:"all .2s",boxShadow:frame===f.id?`0 0 12px ${f.accent}44`:"none" }}>
                    <div style={{ fontSize:18 }}>{f.emoji}</div>
                    <div style={{ marginTop:4 }}>{f.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:22 }}>
              <p style={{ fontSize:11,letterSpacing:3,color:"#ff2d78",marginBottom:8,fontWeight:700 }}>05 · FONDO</p>
              {bgPreview && <img src={bgPreview} alt="bg" style={{ width:"100%",height:100,objectFit:"cover",borderRadius:10,marginBottom:10,opacity:.7 }} />}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6 }}>
                {BACKGROUNDS.map(b => (
                  <button key={b.id} onClick={()=>setBg(b.id)} style={{ background:bg===b.id?"rgba(255,45,120,.15)":"rgba(255,255,255,.03)",border:bg===b.id?"1px solid rgba(255,45,120,.5)":"1px solid rgba(255,255,255,.08)",borderRadius:8,padding:"8px 4px",cursor:"pointer",color:"#fff",textAlign:"center",transition:"all .15s" }}>
                    <div style={{ fontSize:18 }}>{b.emoji}</div>
                    <div style={{ fontSize:9,marginTop:2 }}>{b.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={loading} className={!loading?"btn-pulse":""} style={{ width:"100%",padding:"18px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:14,color:"#fff",fontSize:16,fontWeight:900,cursor:loading?"not-allowed":"pointer",opacity:loading?.8:1,letterSpacing:1,transition:"transform .15s" }}
              onMouseEnter={e=>{if(!loading)e.currentTarget.style.transform="scale(1.02)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}>
              {loading?`⚡ ${status} ${Math.round(progress)}%`:"⚡ CREAR BILLBOARD VIRAL"}
            </button>

            {loading && <div style={{ height:4,background:"rgba(255,255,255,.1)",borderRadius:2,marginTop:10 }}><div style={{ height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffeb3b)",borderRadius:2,transition:"width .4s" }} /></div>}
            {error && <div style={{ marginTop:12,padding:"14px",background:"rgba(255,80,80,.1)",border:"1px solid rgba(255,80,80,.2)",borderRadius:10,fontSize:13,color:"#ff8080" }}>⚠️ {error}</div>}

            {/* RESULT */}
            {personBlob && (
              <div style={{ marginTop:36 }}>
                <p style={{ textAlign:"center",fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:12,letterSpacing:2 }}>🖱️ MOVÉ EL MOUSE PARA EL EFECTO 3D</p>
                <div ref={billboardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ perspective:"900px",marginBottom:90 }}>
                  <div className="billboard-enter" style={{ transform:`perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,transition:"transform 0.1s ease-out",transformStyle:"preserve-3d",position:"relative" }}>
                    <div style={{ position:"absolute",top:6,right:-16,width:16,height:"calc(100% - 12px)",background:`linear-gradient(to right,${accentColor}55,transparent)`,borderRadius:"0 4px 4px 0",zIndex:0 }} />
                    <div style={{ position:"absolute",bottom:-13,left:6,width:"calc(100% - 12px)",height:13,background:`linear-gradient(to bottom,${accentColor}44,transparent)`,borderRadius:"0 0 4px 4px",zIndex:0 }} />
                    <div className={`scanlines glow-${frame==="neon"?"neon":frame==="gold"?"gold":frame==="future"?"future":"neon"}`} style={{ position:"relative",borderRadius:18,overflow:"visible",...frameStyle,aspectRatio:"3/4",background:selectedBgData?.color?selectedBgData.color:`url(${selectedBgData?.url}) center/cover` }}>
                      <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,.18)",borderRadius:14,zIndex:1 }} />
                      <div className="light-sweep" />
                      <div className="glow-ring" style={{ position:"absolute",bottom:"-12%",left:"50%",width:"80%",height:"55%",background:`radial-gradient(ellipse,${accentColor}2a 0%,transparent 65%)`,zIndex:3,borderRadius:"50%",pointerEvents:"none" }} />
                      {slogan && <div className="slogan-glow" style={{ "--ac":accentColor,position:"absolute",bottom:"5%",left:"5%",right:"5%",zIndex:4,background:"rgba(0,0,0,.72)",backdropFilter:"blur(6px)",borderRadius:12,padding:"12px 16px",textAlign:"center",fontSize:15,fontWeight:900,color:"#fff",border:`1px solid ${accentColor}44`,letterSpacing:1 }}>{slogan}</div>}
                      {brandLogo && <img src={brandLogo} alt="logo" style={{ position:"absolute",top:"4%",right:"4%",width:"16%",zIndex:5,borderRadius:8,objectFit:"contain",filter:"drop-shadow(0 2px 8px rgba(0,0,0,.7))" }} />}
                      <div className="shadow-blob" style={{ position:"absolute",bottom:"-6%",left:"50%",width:"62%",height:"6%",background:"radial-gradient(ellipse,rgba(0,0,0,.92) 0%,transparent 70%)",zIndex:3,borderRadius:"50%",pointerEvents:"none" }} />
                      <img src={personBlob} alt="persona" className="person-reveal" style={{ position:"absolute",bottom:"-22%",left:"50%",height:"148%",width:"auto",maxWidth:"98%",zIndex:10,objectFit:"contain",transformOrigin:"bottom center" }} />
                      {[{top:"7%",left:"8%",color:accentColor,delay:"0s"},{top:"11%",right:"10%",color:"#ffeb3b",delay:".75s"},{top:"28%",left:"5%",color:"#ff2d78",delay:"1.4s"},{top:"20%",right:"7%",color:accentColor,delay:"2.1s"}].map((s,i)=>(
                        <div key={i} className="sparkle" style={{ top:s.top,left:s.left,right:s.right,background:s.color,animationDelay:s.delay,boxShadow:`0 0 8px ${s.color}` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex",gap:8 }}>
                  <button onClick={()=>{const a=document.createElement("a");a.href=personBlob;a.download=`billboard-${Date.now()}.png`;a.click();}} style={{ flex:2,padding:"14px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",letterSpacing:1 }}>⬇️ Descargar</button>
                  <button onClick={()=>{setPersonBlob(null);setPhoto(null);setPhotoFile(null);setPhotoUrl(null);}} style={{ flex:1,padding:"14px",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",borderRadius:12,color:"#fff",fontSize:13,cursor:"pointer" }}>🔄 Nuevo</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "galeria" && (
          <div style={{ textAlign:"center",padding:"60px 20px",color:"rgba(255,255,255,.3)" }}>
            <div style={{ fontSize:48 }}>🖼️</div>
            <div style={{ marginTop:12,fontSize:14 }}>Usá descargar para guardar tus billboards</div>
            <button onClick={()=>setTab("crear")} style={{ marginTop:16,padding:"10px 24px",background:"rgba(255,45,120,.2)",border:"1px solid rgba(255,45,120,.4)",borderRadius:10,color:"#ff2d78",cursor:"pointer",fontSize:13 }}>Crear mi billboard →</button>
          </div>
        )}
      </div>
    </div>
  );
}
