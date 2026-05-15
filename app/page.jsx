"use client";
import { useState, useRef, useCallback, useEffect } from "react";

const REMOVE_BG_KEY = "pBzBsLfZKHNxiiTEvbX4seU2";

const BACKGROUNDS = [
  { id: "nyc1", label: "Times Square", emoji: "🗽", url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800" },
  { id: "tokyo1", label: "Tokyo", emoji: "🌸", url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800" },
  { id: "nyc2", label: "NYC Noche", emoji: "🌃", url: "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800" },
  { id: "city1", label: "Ciudad", emoji: "🏙️", url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800" },
  { id: "beach1", label: "Playa", emoji: "🏖️", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
  { id: "mountain1", label: "Montañas", emoji: "🏔️", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800" },
  { id: "forest1", label: "Bosque", emoji: "🌲", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800" },
  { id: "sunset1", label: "Atardecer", emoji: "🌅", url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800" },
  { id: "stadium1", label: "Estadio", emoji: "🏟️", url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800" },
  { id: "festival1", label: "Festival", emoji: "🎪", url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800" },
  { id: "mall1", label: "Shopping", emoji: "🛍️", url: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800" },
  { id: "snow1", label: "Nieve", emoji: "❄️", url: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800" },
  { id: "desert1", label: "Desierto", emoji: "🌵", url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800" },
  { id: "solid_black", label: "Negro", emoji: "⬛", url: null, color: "#000000" },
  { id: "solid_white", label: "Blanco", emoji: "⬜", url: null, color: "#ffffff" },
  { id: "solid_pink", label: "Rosa", emoji: "🩷", url: null, color: "#ff2d78" },
];

const FRAMES = [
  { id: "neon",    label: "Neón",      emoji: "💜", accent: "#00cfff" },
  { id: "gold",    label: "Dorado",    emoji: "✨", accent: "#FFD700" },
  { id: "vintage", label: "Vintage",   emoji: "🎞️", accent: "#D2691E" },
  { id: "future",  label: "Futurista", emoji: "🤖", accent: "#00ff88" },
  { id: "minimal", label: "Minimal",   emoji: "◻️", accent: "rgba(255,255,255,0.8)" },
];

const EXAMPLES = [
  { id: 1, label: "Chico con libro", emoji: "📚", photo: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400", bg: "nyc1",     desc: "Joven en Times Square" },
  { id: 2, label: "Café premium",    emoji: "☕", photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", bg: "mountain1", desc: "Producto en montañas" },
  { id: 3, label: "Chica bailando",  emoji: "💃", photo: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400", bg: "tokyo1",    desc: "Bailarina en Tokyo" },
  { id: 4, label: "Zapatillas",      emoji: "👟", photo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", bg: "beach1",    desc: "Sneakers en la playa" },
  { id: 5, label: "Músico",          emoji: "🎸", photo: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400", bg: "festival1", desc: "Artista en festival" },
  { id: 6, label: "Atleta",          emoji: "🏃", photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", bg: "stadium1",  desc: "Deportista en estadio" },
];

const FRAME_STYLES = {
  neon:    { border: "6px solid #00cfff",  boxShadow: "0 0 30px #00cfff, inset 0 0 30px rgba(0,207,255,0.1), 0 0 60px rgba(255,45,120,0.4)" },
  gold:    { border: "10px solid #FFD700", boxShadow: "0 0 30px #FFD700, inset 0 0 20px rgba(255,215,0,0.1)" },
  vintage: { border: "8px solid #8B4513",  boxShadow: "0 0 0 4px #D2691E, 0 0 0 8px #8B4513" },
  future:  { border: "4px solid #00ff88",  boxShadow: "0 0 40px #00ff88, inset 0 0 20px rgba(0,255,136,0.05), 0 0 80px rgba(0,136,255,0.3)" },
  minimal: { border: "2px solid rgba(255,255,255,0.8)", boxShadow: "0 0 20px rgba(255,255,255,0.1)" },
};

const SHOWCASE = [
  { bg: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200", person: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600", slogan: "BREAK THE LIMITS", accent: "#00cfff" },
  { bg: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200", person: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600", slogan: "FEEL THE CITY",   accent: "#ff2d78" },
  { bg: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", person: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", slogan: "MAKE WAVES",       accent: "#FFD700" },
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
  const [showcaseIdx, setShowcaseIdx] = useState(0);
  const [showcaseIn, setShowcaseIn] = useState(true);
  const [particles, setParticles] = useState([]);

  const fileRef = useRef(null);
  const logoRef = useRef(null);
  const billboardRef = useRef(null);
  const autoTiltTimer = useRef(null);
  const autoTiltAngle = useRef(0);
  const isMouseOver = useRef(false);

  // Auto showcase rotation
  useEffect(() => {
    const t = setInterval(() => {
      setShowcaseIn(false);
      setTimeout(() => { setShowcaseIdx(i => (i + 1) % SHOWCASE.length); setShowcaseIn(true); }, 550);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  // Auto tilt loop
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

  const handleMouseLeave = useCallback(() => {
    isMouseOver.current = false;
  }, []);

  const launchConfetti = (accent) => {
    const pieces = Array.from({ length: 90 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: [accent, "#ff2d78", "#ff9500", "#00cfff", "#fff", "#ffeb3b"][Math.floor(Math.random() * 6)],
      size: Math.random() * 12 + 4, delay: Math.random() * 2,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3500);

    // Burst particles
    const pts = Array.from({ length: 45 }, (_, i) => ({
      id: i + Date.now(), x: 35 + Math.random() * 30, y: 20 + Math.random() * 50,
      vx: (Math.random() - 0.5) * 7, vy: -(Math.random() * 6 + 2),
      color: [accent, "#ff2d78", "#ffeb3b", "#fff"][i % 4],
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

  const handleLogo = useCallback((file) => {
    if (!file) return;
    setBrandLogo(URL.createObjectURL(file));
  }, []);

  const useExample = (ex) => {
    setPhotoUrl(ex.photo); setPhotoFile(null); setPhoto(ex.photo);
    setBg(ex.bg); setPersonBlob(null); setError(null); setTab("crear");
  };

  const removeBg = async () => {
    const fd = new FormData();
    if (photoFile) fd.append("image_file", photoFile);
    else if (photoUrl) fd.append("image_url", photoUrl);
    else throw new Error("No hay imagen");
    fd.append("size", "auto");
    const res = await fetch("https://api.remove.bg/v1.0/removebg", { method: "POST", headers: { "X-Api-Key": REMOVE_BG_KEY }, body: fd });
    if (!res.ok) throw new Error("Error al quitar el fondo");
    return res.blob();
  };

  const generate = async () => {
    if (!photo) { setError("Por favor elegí una foto o ejemplo primero"); return; }
    setLoading(true); setPersonBlob(null); setError(null); setProgress(10);
    const iv = setInterval(() => setProgress(p => Math.min(p + 4, 85)), 400);
    try {
      setStatus("Quitando el fondo...");
      const blob = await removeBg();
      setProgress(100); setStatus("¡Listo!");
      setPersonBlob(URL.createObjectURL(blob));
      launchConfetti(FRAMES.find(f => f.id === frame)?.accent || "#00cfff");
    } catch (e) { setError(e.message); }
    finally { clearInterval(iv); setLoading(false); }
  };

  const selectedBgData = BACKGROUNDS.find(b => b.id === bg);
  const frameStyle = FRAME_STYLES[frame] || FRAME_STYLES.neon;
  const accentColor = FRAMES.find(f => f.id === frame)?.accent || "#00cfff";
  const slide = SHOWCASE[showcaseIdx];

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", fontFamily: "'DM Sans', sans-serif", color: "#fff", padding: "0 0 40px", position: "relative", overflow: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&display=swap');
        * { box-sizing: border-box; }

        @keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }

        @keyframes showcaseIn {
          0%   { opacity:0; transform: perspective(1000px) rotateY(-14deg) scale(0.88) translateX(-28px); }
          100% { opacity:1; transform: perspective(1000px) rotateY(0) scale(1) translateX(0); }
        }
        @keyframes showcaseOut {
          0%   { opacity:1; transform: perspective(1000px) rotateY(0) scale(1); }
          100% { opacity:0; transform: perspective(1000px) rotateY(12deg) scale(0.9) translateX(28px); }
        }

        @keyframes personFloat {
          0%,100% { transform: translateX(-50%) translateY(0px)   rotate(-0.4deg) scale(1);     }
          25%     { transform: translateX(-50%) translateY(-20px)  rotate(0.3deg)  scale(1.012); }
          50%     { transform: translateX(-50%) translateY(-30px)  rotate(-0.2deg) scale(1.018); }
          75%     { transform: translateX(-50%) translateY(-16px)  rotate(0.4deg)  scale(1.008); }
        }
        @keyframes shadowFloat {
          0%,100% { transform:translateX(-50%) scaleX(1)    scaleY(1);    opacity:.75; }
          50%     { transform:translateX(-50%) scaleX(0.65) scaleY(0.55); opacity:.28; }
        }
        @keyframes personReveal {
          0%   { opacity:0; transform:translateX(-50%) translateY(100px) scale(0.6); filter:blur(12px) brightness(2); }
          60%  { filter:blur(0) brightness(1.3); }
          100% { opacity:1; transform:translateX(-50%) translateY(0) scale(1); filter:blur(0) brightness(1); }
        }
        .person-reveal { animation: personReveal 1s cubic-bezier(.22,1,.36,1) forwards, personFloat 4s ease-in-out 1.05s infinite; }
        .person-float  { animation: personFloat 4s ease-in-out infinite; filter: drop-shadow(0 35px 25px rgba(0,0,0,.98)) drop-shadow(0 10px 12px rgba(0,0,0,.85)); }
        .shadow-blob   { animation: shadowFloat 4s ease-in-out infinite; }

        @keyframes glowNeon   { 0%,100%{box-shadow:0 0 25px #00cfff,0 0 55px rgba(255,45,120,.35),inset 0 0 20px rgba(0,207,255,.05);} 50%{box-shadow:0 0 60px #00cfff,0 0 120px rgba(255,45,120,.7),0 0 18px rgba(255,255,255,.15) inset;} }
        @keyframes glowGold   { 0%,100%{box-shadow:0 0 25px #FFD700,inset 0 0 15px rgba(255,215,0,.08);} 50%{box-shadow:0 0 75px #FFD700,0 0 22px rgba(255,248,220,.4) inset;} }
        @keyframes glowFuture { 0%,100%{box-shadow:0 0 35px #00ff88,0 0 75px rgba(0,136,255,.25);} 50%{box-shadow:0 0 85px #00ff88,0 0 170px rgba(0,136,255,.6);} }
        .glow-neon   { animation: glowNeon   2.2s ease-in-out infinite; }
        .glow-gold   { animation: glowGold   2.2s ease-in-out infinite; }
        .glow-future { animation: glowFuture 2.2s ease-in-out infinite; }

        @keyframes billboardIn {
          0%   { opacity:0; transform:perspective(900px) rotateX(20deg) rotateY(-8deg) scale(.78) translateY(50px); }
          65%  { transform:perspective(900px) rotateX(-4deg) rotateY(3deg) scale(1.04) translateY(-8px); }
          100% { opacity:1; transform:perspective(900px) rotateX(0) rotateY(0) scale(1) translateY(0); }
        }
        .billboard-enter { animation: billboardIn 1s cubic-bezier(.22,1,.36,1) forwards; }

        @keyframes lightSweep {
          0%   { transform:translateX(-150%) skewX(-22deg); opacity:0; }
          8%   { opacity:.7; }
          50%  { opacity:.25; }
          100% { transform:translateX(250%) skewX(-22deg); opacity:0; }
        }
        .light-sweep { position:absolute; top:0; left:0; width:35%; height:100%; background:linear-gradient(to right,transparent,rgba(255,255,255,.15),transparent); animation:lightSweep 5s ease-in-out infinite; pointer-events:none; z-index:6; }

        @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0) rotate(0);} 50%{opacity:1;transform:scale(1) rotate(180deg);} }
        .sparkle { position:absolute; width:9px; height:9px; border-radius:50%; animation:sparkle 2s ease-in-out infinite; pointer-events:none; z-index:11; }

        @keyframes glowRing { 0%,100%{opacity:.45;transform:translateX(-50%) scale(1);} 50%{opacity:.9;transform:translateX(-50%) scale(1.1);} }
        .glow-ring { animation:glowRing 4s ease-in-out infinite; }

        @keyframes particleUp { 0%{opacity:1;transform:translate(0,0) scale(1);} 100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0);} }

        .scanlines::after { content:''; position:absolute; inset:0; border-radius:14px; background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px); pointer-events:none; z-index:2; }

        @keyframes sloganPulse { 0%,100%{text-shadow:0 0 15px var(--ac),0 0 30px var(--ac);} 50%{text-shadow:0 0 30px var(--ac),0 0 60px var(--ac),0 0 90px var(--ac);} }
        .slogan-glow { animation:sloganPulse 2.5s ease-in-out infinite; }

        @keyframes headerShimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }

        @keyframes ambientFloat {
          0%   { transform:translateY(0)    translateX(0)    scale(1);   opacity:.6; }
          33%  { transform:translateY(-40px) translateX(15px) scale(1.1); opacity:.3; }
          66%  { transform:translateY(-20px) translateX(-10px) scale(.9); opacity:.5; }
          100% { transform:translateY(0)    translateX(0)    scale(1);   opacity:.6; }
        }

        @keyframes btnPulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,45,120,.5);} 50%{box-shadow:0 0 0 14px rgba(255,45,120,0);} }
        .btn-pulse { animation:btnPulse 2s ease-in-out infinite; }
      `}</style>

      {/* Confetti */}
      {confetti.map(p => <div key={p.id} style={{ position:"fixed", left:`${p.x}%`, top:"-20px", width:p.size, height:p.size, background:p.color, borderRadius:"50%", zIndex:9999, animation:`fall ${1.5+p.delay}s ease-in forwards` }} />)}

      {/* Burst particles */}
      {particles.map(p => <div key={p.id} style={{ position:"fixed", left:`${p.x}%`, top:`${p.y}%`, width:p.size, height:p.size, background:p.color, borderRadius:"50%", zIndex:9998, "--tx":`${p.vx*60}px`, "--ty":`${p.vy*60}px`, animation:"particleUp 1.8s ease-out forwards", boxShadow:`0 0 8px ${p.color}` }} />)}

      {/* Ambient orbs */}
      <div style={{ position:"fixed", top:"-20%", left:"-15%", width:"60%", height:"60%", background:"radial-gradient(ellipse,rgba(255,45,120,.08) 0%,transparent 70%)", pointerEvents:"none", zIndex:0, animation:"ambientFloat 8s ease-in-out infinite" }} />
      <div style={{ position:"fixed", bottom:"-20%", right:"-15%", width:"60%", height:"60%", background:"radial-gradient(ellipse,rgba(0,207,255,.08) 0%,transparent 70%)", pointerEvents:"none", zIndex:0, animation:"ambientFloat 10s ease-in-out 3s infinite" }} />
      <div style={{ position:"fixed", top:"40%", right:"-10%", width:"40%", height:"40%", background:"radial-gradient(ellipse,rgba(0,255,136,.05) 0%,transparent 70%)", pointerEvents:"none", zIndex:0, animation:"ambientFloat 12s ease-in-out 6s infinite" }} />

      <div style={{ maxWidth:520, margin:"0 auto", position:"relative", zIndex:1, padding:"0 20px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", paddingTop:24, marginBottom:18 }}>
          <h1 style={{ fontSize:34, fontWeight:900, letterSpacing:3, margin:0, background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffeb3b,#00cfff,#ff2d78)", backgroundSize:"300% 100%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"headerShimmer 4s ease infinite" }}>⚡ NEONBOARD AI</h1>
          <p style={{ color:"rgba(255,255,255,.35)", fontSize:12, marginTop:5, letterSpacing:2, textTransform:"uppercase" }}>Billboards virales · Efecto 3D · Sin edición</p>
        </div>

        {/* ── SHOWCASE ── */}
        <div style={{ marginBottom:24, cursor:"pointer" }} onClick={() => setTab("crear")}>
          <div style={{ animation: showcaseIn ? "showcaseIn .6s cubic-bezier(.22,1,.36,1) forwards" : "showcaseOut .5s ease-in forwards", position:"relative" }}>
            {/* 3D depth */}
            <div style={{ position:"absolute", top:6, right:-16, width:16, height:"calc(100% - 12px)", background:`linear-gradient(to right,${slide.accent}44,transparent)`, borderRadius:"0 4px 4px 0", zIndex:0 }} />
            <div style={{ position:"absolute", bottom:-13, left:6, width:"calc(100% - 12px)", height:13, background:`linear-gradient(to bottom,${slide.accent}33,transparent)`, borderRadius:"0 0 4px 4px", zIndex:0 }} />

            <div className="scanlines" style={{ position:"relative", borderRadius:20, overflow:"visible", aspectRatio:"3/4", maxHeight:420, border:`5px solid ${slide.accent}`, boxShadow:`0 0 40px ${slide.accent}88,0 0 80px ${slide.accent}44`, background:`url(${slide.bg}) center/cover` }}>
              <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.2)", borderRadius:14, zIndex:1 }} />
              <div className="light-sweep" />

              <div className="slogan-glow" style={{ "--ac":slide.accent, position:"absolute", bottom:"5%", left:"5%", right:"5%", zIndex:4, background:"rgba(0,0,0,.72)", backdropFilter:"blur(8px)", borderRadius:12, padding:"12px 16px", textAlign:"center", fontSize:18, fontWeight:900, color:"#fff", border:`1px solid ${slide.accent}55`, letterSpacing:2 }}>
                {slide.slogan}
              </div>

              <div style={{ position:"absolute", top:"4%", left:"5%", zIndex:5, background:"rgba(0,0,0,.6)", backdropFilter:"blur(6px)", borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:800, color:slide.accent, letterSpacing:3 }}>NEONBOARD</div>

              <div className="shadow-blob" style={{ position:"absolute", bottom:"-6%", left:"50%", width:"60%", height:"7%", background:"radial-gradient(ellipse,rgba(0,0,0,.9) 0%,transparent 70%)", zIndex:3, borderRadius:"50%", pointerEvents:"none" }} />

              <img src={slide.person} alt="showcase" className="person-float" style={{ position:"absolute", bottom:"-20%", left:"50%", height:"145%", width:"auto", maxWidth:"98%", zIndex:10, objectFit:"contain", transformOrigin:"bottom center" }} />

              <div className="glow-ring" style={{ position:"absolute", bottom:"-10%", left:"50%", width:"80%", height:"50%", background:`radial-gradient(ellipse,${slide.accent}28 0%,transparent 65%)`, zIndex:3, borderRadius:"50%", pointerEvents:"none" }} />

              {[{top:"7%",left:"8%",color:slide.accent,delay:"0s"},{top:"10%",right:"10%",color:"#ffeb3b",delay:".7s"},{top:"28%",left:"5%",color:"#ff2d78",delay:"1.3s"},{top:"18%",right:"7%",color:slide.accent,delay:"2s"}].map((s,i) => (
                <div key={i} className="sparkle" style={{ top:s.top, left:s.left, right:s.right, background:s.color, animationDelay:s.delay, boxShadow:`0 0 8px ${s.color}` }} />
              ))}
            </div>
          </div>

          {/* Dots */}
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:14 }}>
            {SHOWCASE.map((_,i) => (
              <div key={i} onClick={e=>{e.stopPropagation();setShowcaseIdx(i);}} style={{ width:i===showcaseIdx?24:8, height:8, borderRadius:4, background:i===showcaseIdx?slide.accent:"rgba(255,255,255,.2)", transition:"all .3s", cursor:"pointer" }} />
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:20 }}>
          {[["ejemplos","✨ Ejemplos"],["crear","🎨 Crear"],["galeria","🖼️ Galería"]].map(([t,label]) => (
            <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:"10px 4px", background:tab===t?"rgba(255,45,120,.2)":"rgba(255,255,255,.05)", border:tab===t?"1px solid rgba(255,45,120,.5)":"1px solid rgba(255,255,255,.1)", borderRadius:10, color:"#fff", cursor:"pointer", fontWeight:tab===t?800:400, fontSize:12, transition:"all .2s" }}>{label}</button>
          ))}
        </div>

        {/* EJEMPLOS */}
        {tab === "ejemplos" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.4)", fontSize:12, marginBottom:14 }}>Tocá un ejemplo para usarlo como base 👇</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {EXAMPLES.map(ex => (
                <div key={ex.id} onClick={()=>useExample(ex)} style={{ cursor:"pointer", borderRadius:14, overflow:"hidden", border:"1px solid rgba(255,255,255,.1)", background:"rgba(255,255,255,.03)", transition:"transform .2s,border-color .2s,box-shadow .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04) translateY(-2px)";e.currentTarget.style.borderColor="rgba(255,45,120,.5)";e.currentTarget.style.boxShadow="0 8px 30px rgba(255,45,120,.15)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";e.currentTarget.style.boxShadow="none";}}>
                  <img src={ex.photo} alt={ex.label} style={{ width:"100%", height:130, objectFit:"cover" }} />
                  <div style={{ padding:"10px 12px" }}>
                    <div style={{ fontSize:13, fontWeight:700 }}>{ex.emoji} {ex.label}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:2 }}>{ex.desc}</div>
                    <div style={{ marginTop:8, padding:"6px", background:"rgba(255,45,120,.15)", border:"1px solid rgba(255,45,120,.3)", borderRadius:6, fontSize:11, textAlign:"center", color:"#ff2d78", fontWeight:700 }}>Usar →</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREAR */}
        {tab === "crear" && (
          <div>
            <div style={{ marginBottom:18 }}>
              <p style={{ fontSize:11, letterSpacing:3, color:"#ff2d78", marginBottom:8, fontWeight:700 }}>01 · TU FOTO O PRODUCTO</p>
              <div onClick={()=>fileRef.current.click()} style={{ border:"2px dashed rgba(255,45,120,.4)", borderRadius:14, padding:photo?0:28, textAlign:"center", cursor:"pointer", overflow:"hidden", minHeight:90, display:"flex", alignItems:"center", justifyContent:"center", transition:"border-color .2s,background .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,45,120,.8)";e.currentTarget.style.background="rgba(255,45,120,.05)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,45,120,.4)";e.currentTarget.style.background="transparent";}}>
                {photo
                  ? <div style={{ position:"relative", width:"100%" }}><img src={photo} alt="preview" style={{ width:"100%", maxHeight:160, objectFit:"cover" }} /><div style={{ position:"absolute", bottom:8, right:8, background:"rgba(0,0,0,.75)", padding:"4px 10px", borderRadius:6, fontSize:11 }}>📷 Cambiar</div></div>
                  : <div><div style={{ fontSize:36 }}>🤳</div><div style={{ fontSize:13, marginTop:6, color:"rgba(255,255,255,.6)" }}>Subí tu foto o producto</div></div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
            </div>

            <div style={{ marginBottom:18 }}>
              <p style={{ fontSize:11, letterSpacing:3, color:"#ff2d78", marginBottom:8, fontWeight:700 }}>02 · SLOGAN (OPCIONAL)</p>
              <input style={{ width:"100%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:14, outline:"none", transition:"border-color .2s" }}
                onFocus={e=>e.target.style.borderColor="rgba(255,45,120,.6)"}
                onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.1)"}
                placeholder="Ej: Just Do It · Tu mejor versión" value={slogan} onChange={e=>setSlogan(e.target.value)} />
            </div>

            <div style={{ marginBottom:18 }}>
              <p style={{ fontSize:11, letterSpacing:3, color:"#ff2d78", marginBottom:8, fontWeight:700 }}>03 · TU LOGO (OPCIONAL)</p>
              <div onClick={()=>logoRef.current.click()} style={{ border:"1px dashed rgba(255,255,255,.2)", borderRadius:10, padding:"12px", cursor:"pointer", display:"flex", alignItems:"center", gap:12, transition:"border-color .2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.45)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.2)"}>
                {brandLogo?<img src={brandLogo} alt="logo" style={{ width:50, height:50, objectFit:"contain", borderRadius:8 }}/>:<div style={{ fontSize:28 }}>🏷️</div>}
                <div style={{ fontSize:12, color:"rgba(255,255,255,.5)" }}>{brandLogo?"Logo cargado ✅":"Subí tu logo para agregarlo"}</div>
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleLogo(e.target.files[0])} />
            </div>

            <div style={{ marginBottom:18 }}>
              <p style={{ fontSize:11, letterSpacing:3, color:"#ff2d78", marginBottom:8, fontWeight:700 }}>04 · MARCO</p>
              <div style={{ display:"flex", gap:8 }}>
                {FRAMES.map(f => (
                  <button key={f.id} onClick={()=>setFrame(f.id)} style={{ flex:1, padding:"10px 4px", background:frame===f.id?"rgba(255,45,120,.18)":"rgba(255,255,255,.03)", border:frame===f.id?`1px solid ${f.accent}88`:"1px solid rgba(255,255,255,.08)", borderRadius:10, cursor:"pointer", color:"#fff", fontSize:11, textAlign:"center", transition:"all .2s", boxShadow:frame===f.id?`0 0 12px ${f.accent}44`:"none" }}>
                    <div style={{ fontSize:18 }}>{f.emoji}</div>
                    <div style={{ marginTop:4 }}>{f.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:22 }}>
              <p style={{ fontSize:11, letterSpacing:3, color:"#ff2d78", marginBottom:8, fontWeight:700 }}>05 · FONDO</p>
              {bgPreview && <img src={bgPreview} alt="preview" style={{ width:"100%", height:100, objectFit:"cover", borderRadius:10, marginBottom:10, opacity:.7 }} />}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
                {BACKGROUNDS.map(b => (
                  <button key={b.id} onClick={()=>setBg(b.id)} style={{ background:bg===b.id?"rgba(255,45,120,.15)":"rgba(255,255,255,.03)", border:bg===b.id?"1px solid rgba(255,45,120,.5)":"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:"8px 4px", cursor:"pointer", color:"#fff", textAlign:"center", transition:"all .15s" }}>
                    <div style={{ fontSize:18 }}>{b.emoji}</div>
                    <div style={{ fontSize:9, marginTop:2 }}>{b.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={loading} className={!loading?"btn-pulse":""} style={{ width:"100%", padding:"18px", background:"linear-gradient(135deg,#ff2d78,#ff6b00)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:900, cursor:loading?"not-allowed":"pointer", opacity:loading?.8:1, letterSpacing:1, transition:"transform .15s" }}
              onMouseEnter={e=>{if(!loading)e.currentTarget.style.transform="scale(1.02)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}>
              {loading?`⚡ ${status} ${Math.round(progress)}%`:"⚡ CREAR BILLBOARD VIRAL"}
            </button>

            {loading && <div style={{ height:4, background:"rgba(255,255,255,.1)", borderRadius:2, marginTop:10 }}><div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffeb3b)", borderRadius:2, transition:"width .4s" }} /></div>}
            {error && <div style={{ marginTop:12, padding:"14px", background:"rgba(255,80,80,.1)", border:"1px solid rgba(255,80,80,.2)", borderRadius:10, fontSize:13, color:"#ff8080" }}>⚠️ {error}</div>}

            {/* 3D RESULT */}
            {personBlob && (
              <div style={{ marginTop:36 }}>
                <p style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,.3)", marginBottom:12, letterSpacing:2 }}>🖱️ MOVÉ EL MOUSE PARA EL EFECTO 3D</p>

                <div ref={billboardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ perspective:"900px", marginBottom:90 }}>
                  <div className="billboard-enter" style={{ transform:`perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition:"transform 0.1s ease-out", transformStyle:"preserve-3d", position:"relative" }}>

                    <div style={{ position:"absolute", top:6, right:-16, width:16, height:"calc(100% - 12px)", background:`linear-gradient(to right,${accentColor}55,transparent)`, borderRadius:"0 4px 4px 0", zIndex:0 }} />
                    <div style={{ position:"absolute", bottom:-13, left:6, width:"calc(100% - 12px)", height:13, background:`linear-gradient(to bottom,${accentColor}44,transparent)`, borderRadius:"0 0 4px 4px", zIndex:0 }} />

                    <div className={`scanlines glow-${frame==="neon"?"neon":frame==="gold"?"gold":frame==="future"?"future":"neon"}`} style={{ position:"relative", borderRadius:18, overflow:"visible", ...frameStyle, aspectRatio:"3/4", background:selectedBgData?.color?selectedBgData.color:`url(${selectedBgData?.url}) center/cover` }}>
                      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.18)", borderRadius:14, zIndex:1 }} />
                      <div className="light-sweep" />

                      <div className="glow-ring" style={{ position:"absolute", bottom:"-12%", left:"50%", width:"80%", height:"55%", background:`radial-gradient(ellipse,${accentColor}2a 0%,transparent 65%)`, zIndex:3, borderRadius:"50%", pointerEvents:"none" }} />

                      {slogan && (
                        <div className="slogan-glow" style={{ "--ac":accentColor, position:"absolute", bottom:"5%", left:"5%", right:"5%", zIndex:4, background:"rgba(0,0,0,.72)", backdropFilter:"blur(6px)", borderRadius:12, padding:"12px 16px", textAlign:"center", fontSize:15, fontWeight:900, color:"#fff", border:`1px solid ${accentColor}44`, letterSpacing:1 }}>{slogan}</div>
                      )}

                      {brandLogo && <img src={brandLogo} alt="logo" style={{ position:"absolute", top:"4%", right:"4%", width:"16%", zIndex:5, borderRadius:8, objectFit:"contain", filter:"drop-shadow(0 2px 8px rgba(0,0,0,.7))" }} />}

                      <div className="shadow-blob" style={{ position:"absolute", bottom:"-6%", left:"50%", width:"62%", height:"6%", background:"radial-gradient(ellipse,rgba(0,0,0,.92) 0%,transparent 70%)", zIndex:3, borderRadius:"50%", pointerEvents:"none" }} />

                      <img src={personBlob} alt="persona" className="person-reveal" style={{ position:"absolute", bottom:"-22%", left:"50%", height:"148%", width:"auto", maxWidth:"98%", zIndex:10, objectFit:"contain", transformOrigin:"bottom center" }} />

                      {[{top:"7%",left:"8%",color:accentColor,delay:"0s"},{top:"11%",right:"10%",color:"#ffeb3b",delay:".75s"},{top:"28%",left:"5%",color:"#ff2d78",delay:"1.4s"},{top:"20%",right:"7%",color:accentColor,delay:"2.1s"},{top:"45%",left:"4%",color:"#fff",delay:"1.8s"}].map((s,i) => (
                        <div key={i} className="sparkle" style={{ top:s.top, left:s.left, right:s.right, background:s.color, animationDelay:s.delay, boxShadow:`0 0 8px ${s.color}` }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>{const a=document.createElement("a");a.href=personBlob;a.download=`billboard-${Date.now()}.png`;a.click();}} style={{ flex:2, padding:"14px", background:"linear-gradient(135deg,#ff2d78,#ff6b00)", border:"none", borderRadius:12, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", letterSpacing:1 }}>⬇️ Descargar</button>
                  <button onClick={()=>{setPersonBlob(null);setPhoto(null);setPhotoFile(null);setPhotoUrl(null);}} style={{ flex:1, padding:"14px", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.12)", borderRadius:12, color:"#fff", fontSize:13, cursor:"pointer" }}>🔄 Nuevo</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "galeria" && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(255,255,255,.3)" }}>
            <div style={{ fontSize:48 }}>🖼️</div>
            <div style={{ marginTop:12, fontSize:14 }}>Usá descargar para guardar tus billboards</div>
            <button onClick={()=>setTab("crear")} style={{ marginTop:16, padding:"10px 24px", background:"rgba(255,45,120,.2)", border:"1px solid rgba(255,45,120,.4)", borderRadius:10, color:"#ff2d78", cursor:"pointer", fontSize:13 }}>Crear mi billboard →</button>
          </div>
        )}
      </div>
    </div>
  );
}
