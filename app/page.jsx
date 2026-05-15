"use client";
import { useState, useRef, useCallback, useEffect } from "react";

const REMOVE_BG_KEY = "pBzBsLfZKHNxiiTEvbX4seU2";

// ─── Backgrounds ───────────────────────────────────────────
const BACKGROUNDS = [
  { id: "nyc1",        label: "Times Square", emoji: "🗽", url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800" },
  { id: "tokyo1",      label: "Tokyo",        emoji: "🌸", url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800" },
  { id: "nyc2",        label: "NYC Noche",    emoji: "🌃", url: "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800" },
  { id: "city1",       label: "Ciudad",       emoji: "🏙️", url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800" },
  { id: "beach1",      label: "Playa",        emoji: "🏖️", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
  { id: "mountain1",   label: "Montañas",     emoji: "🏔️", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800" },
  { id: "forest1",     label: "Bosque",       emoji: "🌲", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800" },
  { id: "sunset1",     label: "Atardecer",    emoji: "🌅", url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800" },
  { id: "stadium1",    label: "Estadio",      emoji: "🏟️", url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800" },
  { id: "festival1",   label: "Festival",     emoji: "🎪", url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800" },
  { id: "mall1",       label: "Shopping",     emoji: "🛍️", url: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800" },
  { id: "snow1",       label: "Nieve",        emoji: "❄️", url: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800" },
  { id: "desert1",     label: "Desierto",     emoji: "🌵", url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800" },
  { id: "solid_black", label: "Negro",        emoji: "⬛", url: null, color: "#000000" },
  { id: "solid_white", label: "Blanco",       emoji: "⬜", url: null, color: "#ffffff" },
  { id: "solid_pink",  label: "Rosa",         emoji: "🩷", url: null, color: "#ff2d78" },
];

const FRAMES = [
  { id: "neon",    label: "Neón",      emoji: "💜", accent: "#00cfff" },
  { id: "gold",    label: "Dorado",    emoji: "✨", accent: "#FFD700" },
  { id: "vintage", label: "Vintage",   emoji: "🎞️", accent: "#D2691E" },
  { id: "future",  label: "Futurista", emoji: "🤖", accent: "#00ff88" },
  { id: "minimal", label: "Minimal",   emoji: "◻️", accent: "rgba(255,255,255,0.8)" },
];

const FRAME_STYLES = {
  neon:    { border: "6px solid #00cfff",  boxShadow: "0 0 30px #00cfff, 0 0 60px rgba(255,45,120,0.4)" },
  gold:    { border: "10px solid #FFD700", boxShadow: "0 0 30px #FFD700, 0 0 60px rgba(255,215,0,0.3)" },
  vintage: { border: "8px solid #8B4513",  boxShadow: "0 0 0 4px #D2691E, 0 0 0 8px #8B4513" },
  future:  { border: "4px solid #00ff88",  boxShadow: "0 0 40px #00ff88, 0 0 80px rgba(0,136,255,0.3)" },
  minimal: { border: "2px solid rgba(255,255,255,0.8)", boxShadow: "0 4px 40px rgba(0,0,0,0.6)" },
};

// ─── Showcase scenes — real photos breaking out of frame ───
// Person images use remove.bg-friendly portraits; bg is the billboard background
// The "person" is shown with CSS clip so bottom half is inside frame, top half breaks out
const SHOWCASE_SCENES = [
  {
    id: "perfume",
    bg: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80",
    // Elegant woman with product — portrait
    person: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=500&q=80",
    slogan: "BREAK THE FRAME · FEEL THE SCENT",
    brand: "LUXE PARFUM",
    accent: "#c9a96e",
    personScale: 1.5,
    personBottom: "-28%",
  },
  {
    id: "fashion",
    bg: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
    person: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80",
    slogan: "OWN THE CITY",
    brand: "URBAN EDGE",
    accent: "#00cfff",
    personScale: 1.55,
    personBottom: "-25%",
  },
  {
    id: "sport",
    bg: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=80",
    person: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500&q=80",
    slogan: "PUSH BEYOND LIMITS",
    brand: "APEX SPORT",
    accent: "#ff4500",
    personScale: 1.6,
    personBottom: "-30%",
  },
  {
    id: "luxury",
    bg: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80",
    person: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&q=80",
    slogan: "DEFINE YOUR WORLD",
    brand: "NOIR ÉLITE",
    accent: "#FFD700",
    personScale: 1.5,
    personBottom: "-26%",
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
  const [tab, setTab] = useState("crear");
  const [confetti, setConfetti] = useState([]);
  const [bgPreview, setBgPreview] = useState(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneVisible, setSceneVisible] = useState(true);

  const fileRef = useRef(null);
  const logoRef = useRef(null);
  const billboardRef = useRef(null);
  const autoTiltTimer = useRef(null);
  const autoTiltAngle = useRef(0);
  const isMouseOver = useRef(false);

  // Rotate showcase every 4.5s
  useEffect(() => {
    const t = setInterval(() => {
      setSceneVisible(false);
      setTimeout(() => {
        setSceneIdx(i => (i + 1) % SHOWCASE_SCENES.length);
        setSceneVisible(true);
      }, 500);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  // Auto tilt for result billboard
  const startAutoTilt = useCallback(() => {
    clearInterval(autoTiltTimer.current);
    autoTiltTimer.current = setInterval(() => {
      if (isMouseOver.current) return;
      autoTiltAngle.current += 0.016;
      setTilt({
        x: Math.sin(autoTiltAngle.current * 0.6) * 4,
        y: Math.sin(autoTiltAngle.current) * 6,
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
    const pieces = Array.from({ length: 80 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: [accent, "#fff", "#ff9500", "#00cfff", "#ffeb3b"][Math.floor(Math.random() * 5)],
      size: Math.random() * 10 + 4, delay: Math.random() * 2,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3000);
  };

  const handleFile = useCallback((file) => {
    if (!file) return;
    setPhoto(URL.createObjectURL(file)); setPhotoFile(file);
    setPhotoUrl(null); setPersonBlob(null); setError(null);
  }, []);

  const handleLogo = useCallback((file) => { if (file) setBrandLogo(URL.createObjectURL(file)); }, []);

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
    if (!photo) { setError("Subí tu foto o producto primero"); return; }
    setLoading(true); setPersonBlob(null); setError(null); setProgress(10);
    const iv = setInterval(() => setProgress(p => Math.min(p + 5, 85)), 350);
    try {
      setStatus("Removiendo fondo...");
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
  const scene = SHOWCASE_SCENES[sceneIdx];

  return (
    <div style={{ minHeight: "100vh", background: "#06060f", fontFamily: "'DM Sans', sans-serif", color: "#fff", paddingBottom: 60, position: "relative", overflow: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600;700;900&display=swap');
        * { box-sizing: border-box; }

        /* ── CONFETTI ── */
        @keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }

        /* ── SHOWCASE TRANSITIONS ── */
        @keyframes slideIn {
          0%   { opacity: 0; transform: scale(0.94) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideOut {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.03) translateY(-10px); }
        }

        /* ── PERSON FLOAT (smooth, cinematic) ── */
        @keyframes personFloat {
          0%,100% { transform: translateX(-50%) translateY(0px); }
          50%     { transform: translateX(-50%) translateY(-16px); }
        }
        @keyframes shadowPulse {
          0%,100% { transform: translateX(-50%) scaleX(1);   opacity: .6; }
          50%     { transform: translateX(-50%) scaleX(.72); opacity: .25; }
        }

        /* ── PERSON REVEAL on generate ── */
        @keyframes personReveal {
          0%   { opacity: 0; transform: translateX(-50%) translateY(60px) scale(.85); filter: blur(8px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1);      filter: blur(0); }
        }
        .person-reveal {
          animation:
            personReveal 0.9s cubic-bezier(.22,1,.36,1) forwards,
            personFloat 5s ease-in-out 0.95s infinite;
        }
        .person-float  { animation: personFloat  5s ease-in-out infinite; }
        .shadow-pulse  { animation: shadowPulse  5s ease-in-out infinite; }

        /* ── FRAME GLOWS ── */
        @keyframes glowNeon   { 0%,100%{box-shadow:0 0 25px #00cfff,0 0 55px rgba(255,45,120,.3);}  50%{box-shadow:0 0 55px #00cfff,0 0 110px rgba(255,45,120,.65);} }
        @keyframes glowGold   { 0%,100%{box-shadow:0 0 22px #FFD700;}                                50%{box-shadow:0 0 65px #FFD700,0 0 20px rgba(255,248,220,.4);} }
        @keyframes glowFuture { 0%,100%{box-shadow:0 0 30px #00ff88,0 0 70px rgba(0,136,255,.2);}   50%{box-shadow:0 0 75px #00ff88,0 0 150px rgba(0,136,255,.5);} }
        @keyframes glowGold2  { 0%,100%{box-shadow:0 0 22px #c9a96e;} 50%{box-shadow:0 0 60px #c9a96e,0 0 18px rgba(255,240,200,.3);} }
        .glow-neon    { animation: glowNeon   2.5s ease-in-out infinite; }
        .glow-gold    { animation: glowGold   2.5s ease-in-out infinite; }
        .glow-future  { animation: glowFuture 2.5s ease-in-out infinite; }
        .glow-gold2   { animation: glowGold2  2.5s ease-in-out infinite; }

        /* ── BILLBOARD ENTRANCE ── */
        @keyframes billboardIn {
          0%   { opacity:0; transform:perspective(900px) rotateX(18deg) rotateY(-6deg) scale(.82) translateY(40px); }
          60%  { transform:perspective(900px) rotateX(-2deg) rotateY(2deg) scale(1.02) translateY(-5px); }
          100% { opacity:1; transform:perspective(900px) rotateX(0) rotateY(0) scale(1) translateY(0); }
        }
        .billboard-enter { animation: billboardIn .9s cubic-bezier(.22,1,.36,1) forwards; }

        /* ── LIGHT SWEEP ── */
        @keyframes lightSweep {
          0%   { transform: translateX(-140%) skewX(-20deg); opacity: 0; }
          6%   { opacity: .55; }
          45%  { opacity: .2; }
          100% { transform: translateX(240%) skewX(-20deg); opacity: 0; }
        }
        .light-sweep {
          position: absolute; top: 0; left: 0; width: 30%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,.12), transparent);
          animation: lightSweep 6s ease-in-out infinite;
          pointer-events: none; z-index: 4;
        }

        /* ── SCANLINES ── */
        .scanlines::after {
          content:''; position:absolute; inset:0; border-radius:inherit;
          background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 3px);
          pointer-events:none; z-index:3;
        }

        /* ── SLOGAN GLOW ── */
        @keyframes sloganPulse {
          0%,100% { opacity:.92; }
          50%     { opacity:1; text-shadow:0 0 20px var(--ac),0 0 40px var(--ac); }
        }
        .slogan-glow { animation: sloganPulse 3s ease-in-out infinite; }

        /* ── HEADER ── */
        @keyframes headerShimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }

        /* ── AMBIENT ── */
        @keyframes ambientDrift {
          0%,100% { transform: translateY(0) translateX(0); opacity: .5; }
          50%     { transform: translateY(-50px) translateX(20px); opacity: .2; }
        }

        /* ── BUTTON PULSE ── */
        @keyframes btnPulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,45,120,.45);} 50%{box-shadow:0 0 0 12px rgba(255,45,120,0);} }
        .btn-pulse { animation: btnPulse 2s ease-in-out infinite; }

        /* ── SHOWCASE PERSON: subtle breathing ── */
        @keyframes breathe {
          0%,100% { transform: translateX(-50%) translateY(0) scale(1); }
          50%     { transform: translateX(-50%) translateY(-12px) scale(1.012); }
        }
        .showcase-person { animation: breathe 4.5s ease-in-out infinite; }
        .showcase-shadow { animation: shadowPulse 4.5s ease-in-out infinite; }

        /* ── DOT INDICATOR ── */
        @keyframes dotActive { 0%,100%{transform:scaleX(1);} 50%{transform:scaleX(1.15);} }
      `}</style>

      {/* Confetti */}
      {confetti.map(p => (
        <div key={p.id} style={{ position:"fixed",left:`${p.x}%`,top:"-20px",width:p.size,height:p.size,background:p.color,borderRadius:"3px",zIndex:9999,animation:`fall ${1.4+p.delay}s ease-in forwards` }} />
      ))}

      {/* Ambient background orbs */}
      <div style={{ position:"fixed",top:"-25%",left:"-20%",width:"65%",height:"65%",background:"radial-gradient(ellipse,rgba(180,100,255,.06) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"ambientDrift 12s ease-in-out infinite" }} />
      <div style={{ position:"fixed",bottom:"-25%",right:"-20%",width:"65%",height:"65%",background:"radial-gradient(ellipse,rgba(0,180,255,.06) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"ambientDrift 15s ease-in-out 4s infinite" }} />

      <div style={{ maxWidth:500, margin:"0 auto", position:"relative", zIndex:1, padding:"0 18px" }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign:"center", paddingTop:22, marginBottom:20 }}>
          <h1 style={{ fontSize:28,fontWeight:900,letterSpacing:4,margin:0,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d,#00cfff,#ff2d78)",backgroundSize:"300% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"headerShimmer 5s ease infinite" }}>
            ⚡ NEONBOARD AI
          </h1>
          <p style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginTop:4,letterSpacing:3,textTransform:"uppercase" }}>
            Crea billboards 3D virales para tu marca
          </p>
        </div>

        {/* ════════════════════════════════════════
            SHOWCASE — CINEMATIC 3D BILLBOARD
            Real photo breaking out of the frame
        ════════════════════════════════════════ */}
        <div
          style={{ marginBottom:22, cursor:"pointer", position:"relative" }}
          onClick={() => setTab("crear")}
        >
          {/* Transition wrapper */}
          <div style={{ animation: sceneVisible ? "slideIn .55s cubic-bezier(.22,1,.36,1) forwards" : "slideOut .45s ease-in forwards" }}>

            {/* ── 3D depth sides ── */}
            <div style={{ position:"absolute",top:8,right:-14,width:14,height:"calc(100% - 16px)",background:`linear-gradient(to right,${scene.accent}50,transparent)`,borderRadius:"0 4px 4px 0",zIndex:0 }} />
            <div style={{ position:"absolute",bottom:-11,left:8,width:"calc(100% - 16px)",height:11,background:`linear-gradient(to bottom,${scene.accent}40,transparent)`,borderRadius:"0 0 4px 4px",zIndex:0 }} />

            {/* ── Billboard body ── */}
            <div
              className="scanlines"
              style={{
                position:"relative",
                borderRadius:18,
                overflow:"hidden",
                aspectRatio:"3/4",
                maxHeight:480,
                border:`5px solid ${scene.accent}`,
                boxShadow:`0 0 50px ${scene.accent}66,0 0 100px ${scene.accent}33`,
                background:`url(${scene.bg}) center/cover no-repeat`,
              }}
            >
              {/* Dark gradient overlay — heavier at bottom for text legibility */}
              <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.1) 0%,rgba(0,0,0,.15) 40%,rgba(0,0,0,.65) 100%)",zIndex:1 }} />

              {/* Light sweep */}
              <div className="light-sweep" />

              {/* Brand name — top left */}
              <div style={{ position:"absolute",top:"4%",left:"5%",zIndex:6,background:"rgba(0,0,0,.55)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",borderRadius:8,padding:"5px 12px",fontSize:10,fontWeight:900,color:scene.accent,letterSpacing:4,textTransform:"uppercase" }}>
                {scene.brand}
              </div>

              {/* Slogan — bottom */}
              <div
                className="slogan-glow"
                style={{ "--ac":scene.accent,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:6,textAlign:"center" }}
              >
                <div style={{ fontSize:17,fontWeight:900,color:"#fff",letterSpacing:2,lineHeight:1.3,textShadow:"0 2px 12px rgba(0,0,0,.8)" }}>
                  {scene.slogan}
                </div>
              </div>

              {/* Shadow under person */}
              <div
                className="showcase-shadow"
                style={{ position:"absolute",bottom:"18%",left:"50%",width:"55%",height:"5%",background:"radial-gradient(ellipse,rgba(0,0,0,.85) 0%,transparent 70%)",zIndex:5,borderRadius:"50%",pointerEvents:"none" }}
              />

              {/* ── PERSON breaks out of frame ── */}
              {/* Uses overflow:visible trick via wrapper outside billboard */}
            </div>

            {/* Person rendered OUTSIDE the overflow:hidden billboard div
                so it visually breaks through the top border */}
            <div
              className="showcase-person"
              style={{
                position:"absolute",
                bottom:"16%",    /* sits inside frame */
                left:"50%",
                height:`${scene.personScale * 100}%`,
                width:"auto",
                maxWidth:"95%",
                zIndex:10,
                pointerEvents:"none",
                transformOrigin:"bottom center",
              }}
            >
              <img
                src={scene.person}
                alt="showcase person"
                style={{
                  height:"100%",
                  width:"auto",
                  maxWidth:"100%",
                  objectFit:"contain",
                  objectPosition:"top",
                  display:"block",
                  filter:"drop-shadow(0px 30px 25px rgba(0,0,0,.95)) drop-shadow(0px 10px 15px rgba(0,0,0,.8))",
                }}
                onError={e => { e.target.style.display="none"; }}
              />
            </div>
          </div>

          {/* Dots */}
          <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:14 }}>
            {SHOWCASE_SCENES.map((_,i) => (
              <div
                key={i}
                onClick={e => { e.stopPropagation(); setSceneIdx(i); }}
                style={{ width:i===sceneIdx?26:8,height:8,borderRadius:4,background:i===sceneIdx?scene.accent:"rgba(255,255,255,.18)",transition:"all .35s",cursor:"pointer",animation:i===sceneIdx?"dotActive 1.5s ease-in-out infinite":"none" }}
              />
            ))}
          </div>

          {/* Scene labels */}
          <div style={{ display:"flex",justifyContent:"center",gap:6,marginTop:10,flexWrap:"wrap" }}>
            {SHOWCASE_SCENES.map((s,i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setSceneIdx(i); }}
                style={{ padding:"4px 12px",background:i===sceneIdx?`${s.accent}18`:"rgba(255,255,255,.04)",border:i===sceneIdx?`1px solid ${s.accent}66`:"1px solid rgba(255,255,255,.1)",borderRadius:20,fontSize:10,color:i===sceneIdx?s.accent:"rgba(255,255,255,.35)",cursor:"pointer",transition:"all .2s",fontWeight:i===sceneIdx?700:400,letterSpacing:1 }}
              >
                {s.brand}
              </button>
            ))}
          </div>

          {/* CTA hint */}
          <p style={{ textAlign:"center",fontSize:11,color:"rgba(255,255,255,.2)",marginTop:10,letterSpacing:2 }}>
            ↑ ASÍ SE VE TU PRODUCTO · TOCÁ PARA CREAR
          </p>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex",gap:6,marginBottom:20 }}>
          {[["crear","🎨 Crear"],["fondos","🖼️ Fondos"],["ajustes","⚙️ Ajustes"]].map(([t,label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ flex:1,padding:"10px 4px",background:tab===t?"rgba(255,45,120,.2)":"rgba(255,255,255,.04)",border:tab===t?"1px solid rgba(255,45,120,.55)":"1px solid rgba(255,255,255,.08)",borderRadius:10,color:"#fff",cursor:"pointer",fontWeight:tab===t?800:400,fontSize:12,transition:"all .2s",letterSpacing:.5 }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════
            TAB: CREAR
        ════════════════════════════════════ */}
        {tab === "crear" && (
          <div>
            {/* Upload */}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:10,letterSpacing:3,color:"rgba(255,45,120,.9)",display:"block",marginBottom:8,fontWeight:700 }}>
                01 · TU FOTO O PRODUCTO
              </label>
              <div
                onClick={() => fileRef.current.click()}
                style={{ border:"2px dashed rgba(255,45,120,.35)",borderRadius:14,padding:photo?0:32,textAlign:"center",cursor:"pointer",overflow:"hidden",minHeight:90,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",background:"rgba(255,45,120,.03)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,45,120,.7)"; e.currentTarget.style.background="rgba(255,45,120,.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,45,120,.35)"; e.currentTarget.style.background="rgba(255,45,120,.03)"; }}
              >
                {photo
                  ? <div style={{ position:"relative",width:"100%" }}>
                      <img src={photo} alt="preview" style={{ width:"100%",maxHeight:180,objectFit:"cover" }} />
                      <div style={{ position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.75)",padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600 }}>📷 Cambiar</div>
                    </div>
                  : <div>
                      <div style={{ fontSize:40,marginBottom:8 }}>🤳</div>
                      <div style={{ fontSize:13,color:"rgba(255,255,255,.5)",fontWeight:500 }}>Subí tu foto, producto o persona</div>
                      <div style={{ fontSize:11,color:"rgba(255,255,255,.25)",marginTop:4 }}>JPG, PNG, WEBP</div>
                    </div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            {/* Slogan */}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:10,letterSpacing:3,color:"rgba(255,45,120,.9)",display:"block",marginBottom:8,fontWeight:700 }}>
                02 · SLOGAN (OPCIONAL)
              </label>
              <input
                style={{ width:"100%",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,padding:"12px 14px",color:"#fff",fontSize:14,outline:"none",transition:"border-color .2s",fontFamily:"inherit" }}
                onFocus={e => e.target.style.borderColor="rgba(255,45,120,.6)"}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,.1)"}
                placeholder="Ej: Break the frame · Feel the scent"
                value={slogan}
                onChange={e => setSlogan(e.target.value)}
              />
            </div>

            {/* Logo */}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:10,letterSpacing:3,color:"rgba(255,45,120,.9)",display:"block",marginBottom:8,fontWeight:700 }}>
                03 · TU LOGO (OPCIONAL)
              </label>
              <div
                onClick={() => logoRef.current.click()}
                style={{ border:"1px dashed rgba(255,255,255,.15)",borderRadius:10,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"border-color .2s",background:"rgba(255,255,255,.02)" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,.35)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,.15)"}
              >
                {brandLogo
                  ? <img src={brandLogo} alt="logo" style={{ width:44,height:44,objectFit:"contain",borderRadius:8 }} />
                  : <div style={{ fontSize:26 }}>🏷️</div>}
                <div style={{ fontSize:12,color:"rgba(255,255,255,.4)" }}>
                  {brandLogo ? "Logo cargado ✅" : "Subí tu logo de marca"}
                </div>
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleLogo(e.target.files[0])} />
            </div>

            {/* Frame selector */}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:10,letterSpacing:3,color:"rgba(255,45,120,.9)",display:"block",marginBottom:8,fontWeight:700 }}>
                04 · ESTILO DE MARCO
              </label>
              <div style={{ display:"flex",gap:7 }}>
                {FRAMES.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFrame(f.id)}
                    style={{ flex:1,padding:"10px 4px",background:frame===f.id?"rgba(255,45,120,.15)":"rgba(255,255,255,.03)",border:frame===f.id?`1px solid ${f.accent}99`:"1px solid rgba(255,255,255,.07)",borderRadius:10,cursor:"pointer",color:frame===f.id?"#fff":"rgba(255,255,255,.6)",fontSize:10,textAlign:"center",transition:"all .2s",boxShadow:frame===f.id?`0 0 14px ${f.accent}44`:"none" }}
                  >
                    <div style={{ fontSize:20,marginBottom:4 }}>{f.emoji}</div>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={loading}
              className={!loading ? "btn-pulse" : ""}
              style={{ width:"100%",padding:"18px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:14,color:"#fff",fontSize:15,fontWeight:900,cursor:loading?"not-allowed":"pointer",opacity:loading?.82:1,letterSpacing:1.5,transition:"transform .15s",marginTop:4 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform="scale(1.015)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
            >
              {loading ? `⚡ ${status}  ${Math.round(progress)}%` : "⚡ CREAR MI BILLBOARD"}
            </button>

            {loading && (
              <div style={{ height:3,background:"rgba(255,255,255,.08)",borderRadius:2,marginTop:10 }}>
                <div style={{ height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d)",borderRadius:2,transition:"width .35s" }} />
              </div>
            )}

            {error && (
              <div style={{ marginTop:12,padding:"13px 16px",background:"rgba(255,70,70,.08)",border:"1px solid rgba(255,70,70,.2)",borderRadius:10,fontSize:13,color:"#ff9090" }}>
                ⚠️ {error}
              </div>
            )}

            {/* ════════════════════════════════════
                RESULT — 3D BILLBOARD
            ════════════════════════════════════ */}
            {personBlob && (
              <div style={{ marginTop:36 }}>

                <div style={{ textAlign:"center",marginBottom:14 }}>
                  <span style={{ fontSize:10,color:"rgba(255,255,255,.25)",letterSpacing:3 }}>
                    🖱️ MOVÉ EL MOUSE · EL BILLBOARD SE INCLINA EN 3D
                  </span>
                </div>

                {/* 3D tilt wrapper */}
                <div
                  ref={billboardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ perspective:"1000px", marginBottom:100, position:"relative" }}
                >
                  <div
                    className="billboard-enter"
                    style={{ transform:`perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition:"transform .1s ease-out", transformStyle:"preserve-3d", position:"relative" }}
                  >
                    {/* 3D depth sides */}
                    <div style={{ position:"absolute",top:6,right:-14,width:14,height:"calc(100% - 12px)",background:`linear-gradient(to right,${accentColor}55,transparent)`,borderRadius:"0 4px 4px 0",zIndex:0 }} />
                    <div style={{ position:"absolute",bottom:-11,left:6,width:"calc(100% - 12px)",height:11,background:`linear-gradient(to bottom,${accentColor}44,transparent)`,borderRadius:"0 0 4px 4px",zIndex:0 }} />

                    {/* Billboard */}
                    <div
                      className={`scanlines glow-${frame==="neon"?"neon":frame==="gold"?"gold":frame==="future"?"future":"neon"}`}
                      style={{
                        position:"relative",
                        borderRadius:18,
                        overflow:"visible",
                        ...frameStyle,
                        aspectRatio:"3/4",
                        background: selectedBgData?.color
                          ? selectedBgData.color
                          : `url(${selectedBgData?.url}) center/cover no-repeat`,
                      }}
                    >
                      {/* Clip mask so bottom of person stays inside frame */}
                      <div style={{ position:"absolute",inset:0,borderRadius:14,overflow:"hidden",zIndex:1 }}>
                        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.6) 100%)" }} />
                      </div>

                      {/* Light sweep */}
                      <div className="light-sweep" />

                      {/* Slogan */}
                      {slogan && (
                        <div
                          className="slogan-glow"
                          style={{ "--ac":accentColor,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:5,textAlign:"center" }}
                        >
                          <div style={{ fontSize:14,fontWeight:900,color:"#fff",letterSpacing:1.5,lineHeight:1.35,textShadow:`0 2px 16px rgba(0,0,0,.9),0 0 30px ${accentColor}88` }}>
                            {slogan}
                          </div>
                        </div>
                      )}

                      {/* Logo */}
                      {brandLogo && (
                        <img
                          src={brandLogo}
                          alt="logo"
                          style={{ position:"absolute",top:"4%",right:"4%",width:"15%",zIndex:6,borderRadius:8,objectFit:"contain",filter:"drop-shadow(0 2px 8px rgba(0,0,0,.7))" }}
                        />
                      )}

                      {/* Shadow under person */}
                      <div
                        className="shadow-pulse"
                        style={{ position:"absolute",bottom:"-5%",left:"50%",width:"58%",height:"5%",background:"radial-gradient(ellipse,rgba(0,0,0,.9) 0%,transparent 70%)",zIndex:4,borderRadius:"50%",pointerEvents:"none" }}
                      />

                      {/* ── PERSON — breaks top of frame ── */}
                      <img
                        src={personBlob}
                        alt="persona"
                        className="person-reveal"
                        style={{
                          position:"absolute",
                          bottom:"-22%",
                          left:"50%",
                          height:"148%",
                          width:"auto",
                          maxWidth:"96%",
                          zIndex:10,
                          objectFit:"contain",
                          objectPosition:"top",
                          transformOrigin:"bottom center",
                          filter:"drop-shadow(0px 30px 22px rgba(0,0,0,.95)) drop-shadow(0px 8px 12px rgba(0,0,0,.8))",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display:"flex",gap:8 }}>
                  <button
                    onClick={() => { const a=document.createElement("a"); a.href=personBlob; a.download=`neonboard-${Date.now()}.png`; a.click(); }}
                    style={{ flex:2,padding:"14px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",letterSpacing:.5 }}
                  >
                    ⬇️ Descargar
                  </button>
                  <button
                    onClick={() => { setPersonBlob(null); setPhoto(null); setPhotoFile(null); setPhotoUrl(null); }}
                    style={{ flex:1,padding:"14px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,color:"rgba(255,255,255,.7)",fontSize:13,cursor:"pointer" }}
                  >
                    🔄 Nuevo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════
            TAB: FONDOS
        ════════════════════════════════════ */}
        {tab === "fondos" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.35)",fontSize:12,marginBottom:16,letterSpacing:.5 }}>
              Elegí el fondo para tu billboard
            </p>
            {bgPreview && (
              <img src={bgPreview} alt="preview" style={{ width:"100%",height:120,objectFit:"cover",borderRadius:12,marginBottom:14,opacity:.8 }} />
            )}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7 }}>
              {BACKGROUNDS.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setBg(b.id); setTab("crear"); }}
                  style={{ background:bg===b.id?"rgba(255,45,120,.15)":"rgba(255,255,255,.03)",border:bg===b.id?"1px solid rgba(255,45,120,.55)":"1px solid rgba(255,255,255,.07)",borderRadius:9,padding:"9px 4px",cursor:"pointer",color:"#fff",textAlign:"center",transition:"all .15s" }}
                >
                  <div style={{ fontSize:20 }}>{b.emoji}</div>
                  <div style={{ fontSize:9,marginTop:3,color:"rgba(255,255,255,.55)" }}>{b.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            TAB: AJUSTES
        ════════════════════════════════════ */}
        {tab === "ajustes" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.35)",fontSize:12,marginBottom:16 }}>Estilo del marco</p>
            <div style={{ display:"flex",gap:8,marginBottom:24 }}>
              {FRAMES.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFrame(f.id)}
                  style={{ flex:1,padding:"14px 4px",background:frame===f.id?"rgba(255,45,120,.15)":"rgba(255,255,255,.03)",border:frame===f.id?`1px solid ${f.accent}99`:"1px solid rgba(255,255,255,.07)",borderRadius:12,cursor:"pointer",color:"#fff",fontSize:11,textAlign:"center",transition:"all .2s",boxShadow:frame===f.id?`0 0 16px ${f.accent}44`:"none" }}
                >
                  <div style={{ fontSize:24,marginBottom:6 }}>{f.emoji}</div>
                  {f.label}
                </button>
              ))}
            </div>

            <p style={{ color:"rgba(255,255,255,.35)",fontSize:12,marginBottom:12 }}>Fondo actual</p>
            <div style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"rgba(255,255,255,.04)",borderRadius:12,border:"1px solid rgba(255,255,255,.08)" }}>
              <span style={{ fontSize:24 }}>{BACKGROUNDS.find(b=>b.id===bg)?.emoji}</span>
              <span style={{ fontSize:13 }}>{BACKGROUNDS.find(b=>b.id===bg)?.label}</span>
              <button onClick={()=>setTab("fondos")} style={{ marginLeft:"auto",padding:"6px 14px",background:"rgba(255,45,120,.15)",border:"1px solid rgba(255,45,120,.35)",borderRadius:8,color:"#ff2d78",fontSize:12,cursor:"pointer",fontWeight:600 }}>Cambiar</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
