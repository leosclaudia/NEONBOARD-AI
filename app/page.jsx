"use client";
import { useState, useRef, useCallback, useEffect } from "react";

const REMOVE_BG_KEY = "pBzBsLfZKHNxiiTEvbX4seU2";

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

// Showcase: bg = city background, person = portrait photo
// The trick: person image is displayed LARGE, anchored to bottom-center
// overflow:visible on the wrapper lets it break outside the frame border
const SHOWCASE_SCENES = [
  {
    id: "fashion",
    bg: "https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=900&q=80",
    person: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
    slogan: "OWN THE CITY",
    brand: "URBAN EDGE",
    accent: "#00cfff",
  },
  {
    id: "luxury",
    bg: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80",
    person: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=600&q=80",
    slogan: "BREAK THE FRAME",
    brand: "NOIR ÉLITE",
    accent: "#FFD700",
  },
  {
    id: "sport",
    bg: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80",
    person: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
    slogan: "PUSH BEYOND",
    brand: "APEX SPORT",
    accent: "#ff4500",
  },
  {
    id: "night",
    bg: "https://images.unsplash.com/photo-1514565131-fce0801e6785?w=900&q=80",
    person: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
    slogan: "DEFINE YOUR WORLD",
    brand: "LUXE NOIR",
    accent: "#c084fc",
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneAnim, setSceneAnim] = useState("in");
  const [previewBg, setPreviewBg] = useState("nyc1");

  const fileRef = useRef(null);
  const logoRef = useRef(null);
  const billboardRef = useRef(null);
  const autoTiltTimer = useRef(null);
  const autoTiltAngle = useRef(0);
  const isMouseOver = useRef(false);

  // Sync preview when opening fondos tab
  useEffect(() => { if (tab === "fondos") setPreviewBg(bg); }, [tab]);

  // Rotate showcase
  useEffect(() => {
    const t = setInterval(() => {
      setSceneAnim("out");
      setTimeout(() => { setSceneIdx(i => (i + 1) % SHOWCASE_SCENES.length); setSceneAnim("in"); }, 500);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Auto tilt for result
  const startAutoTilt = useCallback(() => {
    clearInterval(autoTiltTimer.current);
    autoTiltTimer.current = setInterval(() => {
      if (isMouseOver.current) return;
      autoTiltAngle.current += 0.016;
      setTilt({ x: Math.sin(autoTiltAngle.current * 0.6) * 4, y: Math.sin(autoTiltAngle.current) * 6 });
    }, 16);
  }, []);

  useEffect(() => {
    if (personBlob) startAutoTilt();
    return () => clearInterval(autoTiltTimer.current);
  }, [personBlob, startAutoTilt]);

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
    const pieces = Array.from({ length: 70 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: [accent, "#fff", "#ff9500", "#00cfff", "#ffeb3b"][i % 5],
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
    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST", headers: { "X-Api-Key": REMOVE_BG_KEY }, body: fd
    });
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
  const previewBgData  = BACKGROUNDS.find(b => b.id === previewBg);
  const frameStyle     = FRAME_STYLES[frame] || FRAME_STYLES.neon;
  const accentColor    = FRAMES.find(f => f.id === frame)?.accent || "#00cfff";
  const scene          = SHOWCASE_SCENES[sceneIdx];

  return (
    <div style={{ minHeight:"100vh", background:"#06060f", fontFamily:"'DM Sans',sans-serif", color:"#fff", paddingBottom:60, position:"relative", overflow:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&display=swap');
        * { box-sizing:border-box; }

        @keyframes fall { to { transform:translateY(110vh) rotate(720deg); opacity:0; } }

        @keyframes sceneIn  { from{opacity:0;transform:translateY(16px) scale(.97);} to{opacity:1;transform:translateY(0) scale(1);} }
        @keyframes sceneOut { from{opacity:1;transform:translateY(0) scale(1);}       to{opacity:0;transform:translateY(-14px) scale(.97);} }

        /* Subtle float — barely moves, like breathing */
        @keyframes float {
          0%,100%{ transform:translateX(-50%) translateY(0px) scale(1); }
          50%    { transform:translateX(-50%) translateY(-8px) scale(1.008); }
        }
        @keyframes shadowSync {
          0%,100%{ transform:translateX(-50%) scaleX(1);   opacity:.55; }
          50%    { transform:translateX(-50%) scaleX(.78); opacity:.22; }
        }
        /* Entry: fade up softly */
        @keyframes personIn {
          from{ opacity:0; transform:translateX(-50%) translateY(28px); filter:blur(4px); }
          to  { opacity:1; transform:translateX(-50%) translateY(0);    filter:blur(0);   }
        }
        .person-float { animation: float     5.5s ease-in-out infinite; }
        .shadow-sync  { animation: shadowSync 5.5s ease-in-out infinite; }
        .person-entry {
          animation:
            personIn  .75s cubic-bezier(.22,1,.36,1) forwards,
            float      5.5s ease-in-out .8s infinite;
        }

        /* Glows */
        @keyframes glowCyan  { 0%,100%{box-shadow:0 0 22px #00cfff,0 0 50px rgba(255,45,120,.3);}  50%{box-shadow:0 0 50px #00cfff,0 0 100px rgba(255,45,120,.6);} }
        @keyframes glowGold  { 0%,100%{box-shadow:0 0 20px #FFD700;}                               50%{box-shadow:0 0 60px #FFD700;} }
        @keyframes glowGreen { 0%,100%{box-shadow:0 0 28px #00ff88,0 0 60px rgba(0,136,255,.2);}   50%{box-shadow:0 0 65px #00ff88,0 0 130px rgba(0,136,255,.5);} }
        .glow-neon   { animation:glowCyan  2.5s ease-in-out infinite; }
        .glow-gold   { animation:glowGold  2.5s ease-in-out infinite; }
        .glow-future { animation:glowGreen 2.5s ease-in-out infinite; }

        /* Billboard entrance */
        @keyframes bbIn {
          from{ opacity:0; transform:perspective(900px) rotateX(16deg) scale(.84) translateY(36px); }
          to  { opacity:1; transform:perspective(900px) rotateX(0)     scale(1)   translateY(0);    }
        }
        .bb-enter { animation:bbIn .85s cubic-bezier(.22,1,.36,1) forwards; }

        /* Light sweep */
        @keyframes sweep {
          0%  { transform:translateX(-140%) skewX(-18deg); opacity:0; }
          8%  { opacity:.45; }
          50% { opacity:.15; }
          100%{ transform:translateX(240%) skewX(-18deg); opacity:0; }
        }
        .sweep { position:absolute;top:0;left:0;width:28%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,.12),transparent);animation:sweep 6s ease-in-out infinite;pointer-events:none;z-index:6; }

        /* Scanlines */
        .scanlines::after { content:'';position:absolute;inset:0;border-radius:inherit;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 3px);pointer-events:none;z-index:2; }

        /* Slogan pulse */
        @keyframes sloganP { 0%,100%{opacity:.9;} 50%{opacity:1;text-shadow:0 0 18px var(--ac);} }
        .slogan-p { animation:sloganP 3s ease-in-out infinite; }

        /* Header shimmer */
        @keyframes shimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }

        /* Button pulse */
        @keyframes bpulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,45,120,.4);} 50%{box-shadow:0 0 0 10px rgba(255,45,120,0);} }
        .b-pulse { animation:bpulse 2s ease-in-out infinite; }

        /* Ambient */
        @keyframes drift { 0%,100%{transform:translate(0,0);} 50%{transform:translate(20px,-50px);} }
      `}</style>

      {confetti.map(p => (
        <div key={p.id} style={{ position:"fixed",left:`${p.x}%`,top:"-20px",width:p.size,height:p.size,background:p.color,borderRadius:"3px",zIndex:9999,animation:`fall ${1.4+p.delay}s ease-in forwards` }} />
      ))}

      {/* Ambient orbs */}
      <div style={{ position:"fixed",top:"-20%",left:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(160,80,255,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"drift 14s ease-in-out infinite" }} />
      <div style={{ position:"fixed",bottom:"-20%",right:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(0,160,255,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"drift 18s ease-in-out 5s infinite" }} />

      <div style={{ maxWidth:480, margin:"0 auto", position:"relative", zIndex:1, padding:"0 16px" }}>

        {/* Header */}
        <div style={{ textAlign:"center",paddingTop:20,marginBottom:18 }}>
          <h1 style={{ fontSize:26,fontWeight:900,letterSpacing:4,margin:0,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d,#00cfff,#ff2d78)",backgroundSize:"300% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 5s ease infinite" }}>
            ⚡ NEONBOARD AI
          </h1>
          <p style={{ color:"rgba(255,255,255,.25)",fontSize:10,marginTop:4,letterSpacing:3 }}>
            BILLBOARDS 3D VIRALES · SIN EDICIÓN
          </p>
        </div>

        {/* ════════════════════════════════════════════
            SHOWCASE — person breaks out of the frame
            Key: billboard has overflow:visible so the
            person image can extend past the border.
            The photo is TALL and anchored to bottom.
        ════════════════════════════════════════════ */}
        <div
          style={{ marginBottom:18, cursor:"pointer", paddingTop:60 /* space for person to break out above */ }}
          onClick={() => setTab("crear")}
        >
          <div style={{ animation: sceneAnim==="in" ? "sceneIn .5s ease forwards" : "sceneOut .45s ease forwards", position:"relative" }}>

            {/* 3D side depths */}
            <div style={{ position:"absolute",top:6,right:-13,width:13,height:"calc(100% - 12px)",background:`linear-gradient(to right,${scene.accent}45,transparent)`,borderRadius:"0 4px 4px 0",zIndex:0 }} />
            <div style={{ position:"absolute",bottom:-10,left:6,width:"calc(100% - 12px)",height:10,background:`linear-gradient(to bottom,${scene.accent}35,transparent)`,borderRadius:"0 0 4px 4px",zIndex:0 }} />

            {/* ── BILLBOARD — overflow:visible so person pops out ── */}
            <div
              className="scanlines"
              style={{
                position:"relative",
                borderRadius:16,
                overflow:"visible",   /* ← KEY: lets person break outside */
                aspectRatio:"4/5",
                border:`5px solid ${scene.accent}`,
                boxShadow:`0 0 45px ${scene.accent}66,0 0 90px ${scene.accent}33`,
              }}
            >
              {/* Background photo — clipped inside */}
              <div style={{ position:"absolute",inset:0,borderRadius:12,overflow:"hidden",zIndex:0 }}>
                <img src={scene.bg} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                {/* Gradient: lighter top (person area), darker bottom (text area) */}
                <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.2) 45%,rgba(0,0,0,.75) 100%)" }} />
              </div>

              <div className="sweep" style={{ zIndex:7,borderRadius:12 }} />

              {/* Brand tag */}
              <div style={{ position:"absolute",top:"4%",left:"5%",zIndex:8,background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",borderRadius:8,padding:"4px 10px",fontSize:9,fontWeight:900,color:scene.accent,letterSpacing:4 }}>
                {scene.brand}
              </div>

              {/* Slogan */}
              <div className="slogan-p" style={{ "--ac":scene.accent,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:8,textAlign:"center" }}>
                <p style={{ margin:0,fontSize:15,fontWeight:900,color:"#fff",letterSpacing:2,lineHeight:1.3,textShadow:"0 2px 14px rgba(0,0,0,.95)" }}>
                  {scene.slogan}
                </p>
              </div>

              {/* Ground shadow — synced with float */}
              <div
                className="shadow-sync"
                style={{ position:"absolute",bottom:"20%",left:"50%",width:"52%",height:"4%",background:"radial-gradient(ellipse,rgba(0,0,0,.8) 0%,transparent 70%)",zIndex:5,borderRadius:"50%",pointerEvents:"none" }}
              />

              {/* ── PERSON — tall, anchored to bottom, breaks OUT the top ──
                  bottom: positions feet inside billboard
                  height: 160% so head extends well above the border
                  left+transform: centers horizontally
                  overflow:visible on parent lets it show above the border
              ── */}
              <img
                src={scene.person}
                alt="person"
                className="person-float"
                style={{
                  position:"absolute",
                  bottom:"14%",
                  left:"50%",
                  width:"82%",
                  height:"auto",
                  maxHeight:"135%",
                  zIndex:9,
                  objectFit:"contain",
                  display:"block",
                  filter:"drop-shadow(0 22px 18px rgba(0,0,0,.95)) drop-shadow(0 5px 8px rgba(0,0,0,.65))",
                }}
                onError={e => { e.target.style.display="none"; }}
              />
            </div>
          </div>

          {/* Scene dots */}
          <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:14 }}>
            {SHOWCASE_SCENES.map((_,i) => (
              <div
                key={i}
                onClick={e => { e.stopPropagation(); setSceneIdx(i); }}
                style={{ width:i===sceneIdx?24:7,height:7,borderRadius:4,background:i===sceneIdx?scene.accent:"rgba(255,255,255,.15)",transition:"all .3s",cursor:"pointer" }}
              />
            ))}
          </div>

          <p style={{ textAlign:"center",fontSize:9,color:"rgba(255,255,255,.15)",marginTop:8,letterSpacing:2 }}>
            ASÍ QUEDA TU PRODUCTO · TOCÁ PARA CREAR
          </p>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex",gap:5,marginBottom:18 }}>
          {[["crear","🎨 Crear"],["fondos","🖼️ Fondos"],["marco","✨ Marco"]].map(([t,label]) => (
            <button
              key={t} onClick={() => setTab(t)}
              style={{ flex:1,padding:"9px 4px",background:tab===t?"rgba(255,45,120,.18)":"rgba(255,255,255,.04)",border:tab===t?"1px solid rgba(255,45,120,.5)":"1px solid rgba(255,255,255,.07)",borderRadius:10,color:tab===t?"#fff":"rgba(255,255,255,.55)",cursor:"pointer",fontWeight:tab===t?800:400,fontSize:12,transition:"all .2s" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ════════════ CREAR ════════════ */}
        {tab === "crear" && (
          <div>
            {/* Upload */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>01 · FOTO O PRODUCTO</p>
              <div
                onClick={() => fileRef.current.click()}
                style={{ border:"2px dashed rgba(255,45,120,.3)",borderRadius:13,padding:photo?0:28,textAlign:"center",cursor:"pointer",overflow:"hidden",minHeight:80,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,45,120,.65)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,45,120,.3)"}
              >
                {photo
                  ? <div style={{ position:"relative",width:"100%" }}>
                      <img src={photo} alt="preview" style={{ width:"100%",maxHeight:170,objectFit:"cover" }} />
                      <div style={{ position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.8)",padding:"3px 9px",borderRadius:6,fontSize:11 }}>📷 Cambiar</div>
                    </div>
                  : <div>
                      <div style={{ fontSize:38,marginBottom:6 }}>🤳</div>
                      <div style={{ fontSize:12,color:"rgba(255,255,255,.45)" }}>Subí tu foto, persona o producto</div>
                    </div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            {/* Slogan */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>02 · SLOGAN (OPCIONAL)</p>
              <input
                style={{ width:"100%",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:10,padding:"11px 13px",color:"#fff",fontSize:14,outline:"none",transition:"border-color .2s",fontFamily:"inherit" }}
                onFocus={e => e.target.style.borderColor="rgba(255,45,120,.55)"}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,.09)"}
                placeholder='Ej: "Break the frame · Feel the scent"'
                value={slogan} onChange={e => setSlogan(e.target.value)}
              />
            </div>

            {/* Logo */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>03 · LOGO (OPCIONAL)</p>
              <div
                onClick={() => logoRef.current.click()}
                style={{ border:"1px dashed rgba(255,255,255,.12)",borderRadius:10,padding:"11px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,.12)"}
              >
                {brandLogo ? <img src={brandLogo} alt="logo" style={{ width:40,height:40,objectFit:"contain",borderRadius:8 }} /> : <span style={{ fontSize:24 }}>🏷️</span>}
                <span style={{ fontSize:12,color:"rgba(255,255,255,.38)" }}>{brandLogo ? "Logo cargado ✅" : "Subí tu logo de marca"}</span>
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleLogo(e.target.files[0])} />
            </div>

            {/* Fondo actual */}
            <div
              style={{ marginBottom:14,padding:"9px 13px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,display:"flex",alignItems:"center",gap:10,cursor:"pointer" }}
              onClick={() => setTab("fondos")}
            >
              {selectedBgData?.url
                ? <img src={selectedBgData.url} alt={selectedBgData.label} style={{ width:38,height:38,objectFit:"cover",borderRadius:6 }} />
                : <div style={{ width:38,height:38,background:selectedBgData?.color||"#111",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{selectedBgData?.emoji}</div>
              }
              <div>
                <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:2 }}>FONDO ACTUAL</div>
                <div style={{ fontSize:13,fontWeight:700 }}>{selectedBgData?.label}</div>
              </div>
              <div style={{ marginLeft:"auto",padding:"5px 12px",background:"rgba(255,45,120,.12)",border:"1px solid rgba(255,45,120,.3)",borderRadius:8,color:"#ff2d78",fontSize:11,fontWeight:700 }}>
                Cambiar →
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={generate} disabled={loading}
              className={!loading ? "b-pulse" : ""}
              style={{ width:"100%",padding:"17px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:13,color:"#fff",fontSize:15,fontWeight:900,cursor:loading?"not-allowed":"pointer",opacity:loading?.8:1,letterSpacing:1.5,transition:"transform .15s" }}
              onMouseEnter={e => { if(!loading) e.currentTarget.style.transform="scale(1.015)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
            >
              {loading ? `⚡ ${status}  ${Math.round(progress)}%` : "⚡ CREAR MI BILLBOARD"}
            </button>

            {loading && (
              <div style={{ height:3,background:"rgba(255,255,255,.07)",borderRadius:2,marginTop:9 }}>
                <div style={{ height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d)",borderRadius:2,transition:"width .35s" }} />
              </div>
            )}

            {error && (
              <div style={{ marginTop:10,padding:"12px 15px",background:"rgba(255,60,60,.08)",border:"1px solid rgba(255,60,60,.2)",borderRadius:10,fontSize:13,color:"#ff9090" }}>
                ⚠️ {error}
              </div>
            )}

            {/* ════════ RESULTADO 3D ════════ */}
            {personBlob && (
              <div style={{ marginTop:32 }}>
                <p style={{ textAlign:"center",fontSize:9,color:"rgba(255,255,255,.2)",marginBottom:12,letterSpacing:2 }}>
                  🖱️ MOVÉ EL MOUSE PARA EL EFECTO 3D
                </p>

                {/* 3D tilt wrapper */}
                <div
                  ref={billboardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ perspective:"1000px", marginBottom:90, paddingTop:60 }}
                >
                  <div
                    className="bb-enter"
                    style={{ transform:`perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,transition:"transform .1s ease-out",transformStyle:"preserve-3d",position:"relative" }}
                  >
                    {/* 3D sides */}
                    <div style={{ position:"absolute",top:5,right:-13,width:13,height:"calc(100% - 10px)",background:`linear-gradient(to right,${accentColor}50,transparent)`,borderRadius:"0 4px 4px 0" }} />
                    <div style={{ position:"absolute",bottom:-10,left:5,width:"calc(100% - 10px)",height:10,background:`linear-gradient(to bottom,${accentColor}40,transparent)`,borderRadius:"0 0 4px 4px" }} />

                    {/* Billboard with overflow:visible so person breaks out */}
                    <div
                      className={`scanlines glow-${frame==="neon"?"neon":frame==="gold"?"gold":frame==="future"?"future":"neon"}`}
                      style={{ position:"relative",borderRadius:16,overflow:"visible",...frameStyle,aspectRatio:"4/5" }}
                    >
                      {/* Bg inside a clipped div */}
                      <div style={{ position:"absolute",inset:0,borderRadius:12,overflow:"hidden",zIndex:0 }}>
                        {selectedBgData?.color
                          ? <div style={{ width:"100%",height:"100%",background:selectedBgData.color }} />
                          : <img src={selectedBgData?.url} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                        }
                        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.7) 100%)" }} />
                      </div>

                      <div className="sweep" />

                      {/* Slogan */}
                      {slogan && (
                        <div className="slogan-p" style={{ "--ac":accentColor,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:8,textAlign:"center" }}>
                          <p style={{ margin:0,fontSize:13,fontWeight:900,color:"#fff",letterSpacing:1.5,lineHeight:1.35,textShadow:`0 2px 16px rgba(0,0,0,.95),0 0 28px ${accentColor}77` }}>
                            {slogan}
                          </p>
                        </div>
                      )}

                      {/* Logo */}
                      {brandLogo && (
                        <img src={brandLogo} alt="logo" style={{ position:"absolute",top:"4%",right:"4%",width:"14%",zIndex:8,borderRadius:8,objectFit:"contain",filter:"drop-shadow(0 2px 8px rgba(0,0,0,.8))" }} />
                      )}

                      {/* Shadow */}
                      <div
                        className="shadow-sync"
                        style={{ position:"absolute",bottom:"-4%",left:"50%",width:"55%",height:"4%",background:"radial-gradient(ellipse,rgba(0,0,0,.88) 0%,transparent 70%)",zIndex:5,borderRadius:"50%",pointerEvents:"none" }}
                      />

                      {/* ── PERSON / PRODUCT ──
                          Centered in billboard.
                          Width-based so any image (tall person OR square product) fits.
                          bottom:5% keeps it above slogan.
                          overflow:visible on parent lets it break the top border.
                      ── */}
                      <img
                        src={personBlob}
                        alt="persona"
                        className="person-entry"
                        style={{
                          position:"absolute",
                          bottom:"12%",
                          left:"50%",
                          /* Width fills most of the frame; height auto → natural proportions */
                          width:"85%",
                          height:"auto",
                          maxHeight:"130%",  /* allows breaking out the top */
                          zIndex:9,
                          objectFit:"contain",
                          transformOrigin:"bottom center",
                          filter:"drop-shadow(0 20px 18px rgba(0,0,0,.95)) drop-shadow(0 5px 8px rgba(0,0,0,.7))",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Download / Reset */}
                <div style={{ display:"flex",gap:8 }}>
                  <button
                    onClick={() => { const a=document.createElement("a"); a.href=personBlob; a.download=`neonboard-${Date.now()}.png`; a.click(); }}
                    style={{ flex:2,padding:"13px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer" }}
                  >
                    ⬇️ Descargar
                  </button>
                  <button
                    onClick={() => { setPersonBlob(null); setPhoto(null); setPhotoFile(null); setPhotoUrl(null); }}
                    style={{ flex:1,padding:"13px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,color:"rgba(255,255,255,.65)",fontSize:13,cursor:"pointer" }}
                  >
                    🔄 Nuevo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════ FONDOS ════════════ */}
        {tab === "fondos" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginBottom:12 }}>
              Tocá para previsualizar → después confirmá
            </p>

            {/* Large preview */}
            <div style={{ borderRadius:13,overflow:"hidden",height:140,marginBottom:13,border:"2px solid rgba(255,45,120,.4)",position:"relative" }}>
              {previewBgData?.url
                ? <img src={previewBgData.url} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                : <div style={{ width:"100%",height:"100%",background:previewBgData?.color||"#111",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48 }}>{previewBgData?.emoji}</div>
              }
              <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"30px 12px 10px",background:"linear-gradient(transparent,rgba(0,0,0,.8))",fontWeight:700,fontSize:14 }}>
                {previewBgData?.emoji} {previewBgData?.label}
              </div>
            </div>

            {/* Grid — only previews, does NOT close tab */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:14 }}>
              {BACKGROUNDS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setPreviewBg(b.id)}   /* ← ONLY sets preview, stays in fondos */
                  style={{
                    position:"relative",height:58,padding:0,borderRadius:10,cursor:"pointer",overflow:"hidden",
                    border: previewBg===b.id ? "2px solid #ff2d78" : "2px solid rgba(255,255,255,.07)",
                    background: b.url
                      ? `linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.5)),url(${b.url}) center/cover`
                      : b.color||"#111",
                    boxShadow: previewBg===b.id ? "0 0 12px rgba(255,45,120,.5)" : "none",
                    transition:"all .15s",
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,color:"#fff",
                  }}
                >
                  {previewBg===b.id && (
                    <div style={{ position:"absolute",top:2,right:2,width:14,height:14,background:"#ff2d78",borderRadius:"50%",fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900 }}>✓</div>
                  )}
                  <span style={{ fontSize:18 }}>{b.emoji}</span>
                  <span style={{ fontSize:8,fontWeight:600,textShadow:"0 1px 4px rgba(0,0,0,.9)",textAlign:"center",padding:"0 2px",lineHeight:1.2 }}>{b.label}</span>
                </button>
              ))}
            </div>

            {/* Confirm button — applies and goes back */}
            <button
              onClick={() => { setBg(previewBg); setTab("crear"); }}
              style={{ width:"100%",padding:"14px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",letterSpacing:1 }}
            >
              ✅ Usar: {previewBgData?.emoji} {previewBgData?.label}
            </button>
          </div>
        )}

        {/* ════════════ MARCO ════════════ */}
        {tab === "marco" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginBottom:14 }}>Elegí el estilo del borde</p>
            <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
              {FRAMES.map(f => (
                <button
                  key={f.id}
                  onClick={() => { setFrame(f.id); setTab("crear"); }}
                  style={{ padding:"14px 18px",background:frame===f.id?"rgba(255,45,120,.1)":"rgba(255,255,255,.03)",border:frame===f.id?`2px solid ${f.accent}aa`:"2px solid rgba(255,255,255,.06)",borderRadius:12,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",gap:12,transition:"all .2s",boxShadow:frame===f.id?`0 0 16px ${f.accent}40`:"none",textAlign:"left" }}
                >
                  <span style={{ fontSize:26 }}>{f.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14,fontWeight:700 }}>{f.label}</div>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,.3)",marginTop:2 }}>
                      {f.id==="neon"    && "Brillos cyan + destello rosa"}
                      {f.id==="gold"    && "Dorado elegante, lujo cálido"}
                      {f.id==="vintage" && "Marrón cinematográfico"}
                      {f.id==="future"  && "Verde neón + halo azul"}
                      {f.id==="minimal" && "Blanco limpio, sin efectos"}
                    </div>
                  </div>
                  {frame===f.id && <span style={{ color:f.accent,fontSize:18 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}"use client";
import { useState, useRef, useCallback, useEffect } from "react";

const REMOVE_BG_KEY = "pBzBsLfZKHNxiiTEvbX4seU2";

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

// Showcase: bg = city background, person = portrait photo
// The trick: person image is displayed LARGE, anchored to bottom-center
// overflow:visible on the wrapper lets it break outside the frame border
const SHOWCASE_SCENES = [
  {
    id: "fashion",
    bg: "https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=900&q=80",
    person: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
    slogan: "OWN THE CITY",
    brand: "URBAN EDGE",
    accent: "#00cfff",
  },
  {
    id: "luxury",
    bg: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80",
    person: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=600&q=80",
    slogan: "BREAK THE FRAME",
    brand: "NOIR ÉLITE",
    accent: "#FFD700",
  },
  {
    id: "sport",
    bg: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80",
    person: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
    slogan: "PUSH BEYOND",
    brand: "APEX SPORT",
    accent: "#ff4500",
  },
  {
    id: "night",
    bg: "https://images.unsplash.com/photo-1514565131-fce0801e6785?w=900&q=80",
    person: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
    slogan: "DEFINE YOUR WORLD",
    brand: "LUXE NOIR",
    accent: "#c084fc",
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneAnim, setSceneAnim] = useState("in");
  const [previewBg, setPreviewBg] = useState("nyc1");

  const fileRef = useRef(null);
  const logoRef = useRef(null);
  const billboardRef = useRef(null);
  const autoTiltTimer = useRef(null);
  const autoTiltAngle = useRef(0);
  const isMouseOver = useRef(false);

  // Sync preview when opening fondos tab
  useEffect(() => { if (tab === "fondos") setPreviewBg(bg); }, [tab]);

  // Rotate showcase
  useEffect(() => {
    const t = setInterval(() => {
      setSceneAnim("out");
      setTimeout(() => { setSceneIdx(i => (i + 1) % SHOWCASE_SCENES.length); setSceneAnim("in"); }, 500);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Auto tilt for result
  const startAutoTilt = useCallback(() => {
    clearInterval(autoTiltTimer.current);
    autoTiltTimer.current = setInterval(() => {
      if (isMouseOver.current) return;
      autoTiltAngle.current += 0.016;
      setTilt({ x: Math.sin(autoTiltAngle.current * 0.6) * 4, y: Math.sin(autoTiltAngle.current) * 6 });
    }, 16);
  }, []);

  useEffect(() => {
    if (personBlob) startAutoTilt();
    return () => clearInterval(autoTiltTimer.current);
  }, [personBlob, startAutoTilt]);

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
    const pieces = Array.from({ length: 70 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: [accent, "#fff", "#ff9500", "#00cfff", "#ffeb3b"][i % 5],
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
    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST", headers: { "X-Api-Key": REMOVE_BG_KEY }, body: fd
    });
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
  const previewBgData  = BACKGROUNDS.find(b => b.id === previewBg);
  const frameStyle     = FRAME_STYLES[frame] || FRAME_STYLES.neon;
  const accentColor    = FRAMES.find(f => f.id === frame)?.accent || "#00cfff";
  const scene          = SHOWCASE_SCENES[sceneIdx];

  return (
    <div style={{ minHeight:"100vh", background:"#06060f", fontFamily:"'DM Sans',sans-serif", color:"#fff", paddingBottom:60, position:"relative", overflow:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&display=swap');
        * { box-sizing:border-box; }

        @keyframes fall { to { transform:translateY(110vh) rotate(720deg); opacity:0; } }

        @keyframes sceneIn  { from{opacity:0;transform:translateY(16px) scale(.97);} to{opacity:1;transform:translateY(0) scale(1);} }
        @keyframes sceneOut { from{opacity:1;transform:translateY(0) scale(1);}       to{opacity:0;transform:translateY(-14px) scale(.97);} }

        /* Subtle float — barely moves, like breathing */
        @keyframes float {
          0%,100%{ transform:translateX(-50%) translateY(0px) scale(1); }
          50%    { transform:translateX(-50%) translateY(-8px) scale(1.008); }
        }
        @keyframes shadowSync {
          0%,100%{ transform:translateX(-50%) scaleX(1);   opacity:.55; }
          50%    { transform:translateX(-50%) scaleX(.78); opacity:.22; }
        }
        /* Entry: fade up softly */
        @keyframes personIn {
          from{ opacity:0; transform:translateX(-50%) translateY(28px); filter:blur(4px); }
          to  { opacity:1; transform:translateX(-50%) translateY(0);    filter:blur(0);   }
        }
        .person-float { animation: float     5.5s ease-in-out infinite; }
        .shadow-sync  { animation: shadowSync 5.5s ease-in-out infinite; }
        .person-entry {
          animation:
            personIn  .75s cubic-bezier(.22,1,.36,1) forwards,
            float      5.5s ease-in-out .8s infinite;
        }

        /* Glows */
        @keyframes glowCyan  { 0%,100%{box-shadow:0 0 22px #00cfff,0 0 50px rgba(255,45,120,.3);}  50%{box-shadow:0 0 50px #00cfff,0 0 100px rgba(255,45,120,.6);} }
        @keyframes glowGold  { 0%,100%{box-shadow:0 0 20px #FFD700;}                               50%{box-shadow:0 0 60px #FFD700;} }
        @keyframes glowGreen { 0%,100%{box-shadow:0 0 28px #00ff88,0 0 60px rgba(0,136,255,.2);}   50%{box-shadow:0 0 65px #00ff88,0 0 130px rgba(0,136,255,.5);} }
        .glow-neon   { animation:glowCyan  2.5s ease-in-out infinite; }
        .glow-gold   { animation:glowGold  2.5s ease-in-out infinite; }
        .glow-future { animation:glowGreen 2.5s ease-in-out infinite; }

        /* Billboard entrance */
        @keyframes bbIn {
          from{ opacity:0; transform:perspective(900px) rotateX(16deg) scale(.84) translateY(36px); }
          to  { opacity:1; transform:perspective(900px) rotateX(0)     scale(1)   translateY(0);    }
        }
        .bb-enter { animation:bbIn .85s cubic-bezier(.22,1,.36,1) forwards; }

        /* Light sweep */
        @keyframes sweep {
          0%  { transform:translateX(-140%) skewX(-18deg); opacity:0; }
          8%  { opacity:.45; }
          50% { opacity:.15; }
          100%{ transform:translateX(240%) skewX(-18deg); opacity:0; }
        }
        .sweep { position:absolute;top:0;left:0;width:28%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,.12),transparent);animation:sweep 6s ease-in-out infinite;pointer-events:none;z-index:6; }

        /* Scanlines */
        .scanlines::after { content:'';position:absolute;inset:0;border-radius:inherit;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 3px);pointer-events:none;z-index:2; }

        /* Slogan pulse */
        @keyframes sloganP { 0%,100%{opacity:.9;} 50%{opacity:1;text-shadow:0 0 18px var(--ac);} }
        .slogan-p { animation:sloganP 3s ease-in-out infinite; }

        /* Header shimmer */
        @keyframes shimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }

        /* Button pulse */
        @keyframes bpulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,45,120,.4);} 50%{box-shadow:0 0 0 10px rgba(255,45,120,0);} }
        .b-pulse { animation:bpulse 2s ease-in-out infinite; }

        /* Ambient */
        @keyframes drift { 0%,100%{transform:translate(0,0);} 50%{transform:translate(20px,-50px);} }
      `}</style>

      {confetti.map(p => (
        <div key={p.id} style={{ position:"fixed",left:`${p.x}%`,top:"-20px",width:p.size,height:p.size,background:p.color,borderRadius:"3px",zIndex:9999,animation:`fall ${1.4+p.delay}s ease-in forwards` }} />
      ))}

      {/* Ambient orbs */}
      <div style={{ position:"fixed",top:"-20%",left:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(160,80,255,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"drift 14s ease-in-out infinite" }} />
      <div style={{ position:"fixed",bottom:"-20%",right:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(0,160,255,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"drift 18s ease-in-out 5s infinite" }} />

      <div style={{ maxWidth:480, margin:"0 auto", position:"relative", zIndex:1, padding:"0 16px" }}>

        {/* Header */}
        <div style={{ textAlign:"center",paddingTop:20,marginBottom:18 }}>
          <h1 style={{ fontSize:26,fontWeight:900,letterSpacing:4,margin:0,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d,#00cfff,#ff2d78)",backgroundSize:"300% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 5s ease infinite" }}>
            ⚡ NEONBOARD AI
          </h1>
          <p style={{ color:"rgba(255,255,255,.25)",fontSize:10,marginTop:4,letterSpacing:3 }}>
            BILLBOARDS 3D VIRALES · SIN EDICIÓN
          </p>
        </div>

        {/* ════════════════════════════════════════════
            SHOWCASE — person breaks out of the frame
            Key: billboard has overflow:visible so the
            person image can extend past the border.
            The photo is TALL and anchored to bottom.
        ════════════════════════════════════════════ */}
        <div
          style={{ marginBottom:18, cursor:"pointer", paddingTop:60 /* space for person to break out above */ }}
          onClick={() => setTab("crear")}
        >
          <div style={{ animation: sceneAnim==="in" ? "sceneIn .5s ease forwards" : "sceneOut .45s ease forwards", position:"relative" }}>

            {/* 3D side depths */}
            <div style={{ position:"absolute",top:6,right:-13,width:13,height:"calc(100% - 12px)",background:`linear-gradient(to right,${scene.accent}45,transparent)`,borderRadius:"0 4px 4px 0",zIndex:0 }} />
            <div style={{ position:"absolute",bottom:-10,left:6,width:"calc(100% - 12px)",height:10,background:`linear-gradient(to bottom,${scene.accent}35,transparent)`,borderRadius:"0 0 4px 4px",zIndex:0 }} />

            {/* ── BILLBOARD — overflow:visible so person pops out ── */}
            <div
              className="scanlines"
              style={{
                position:"relative",
                borderRadius:16,
                overflow:"visible",   /* ← KEY: lets person break outside */
                aspectRatio:"4/5",
                border:`5px solid ${scene.accent}`,
                boxShadow:`0 0 45px ${scene.accent}66,0 0 90px ${scene.accent}33`,
              }}
            >
              {/* Background photo — clipped inside */}
              <div style={{ position:"absolute",inset:0,borderRadius:12,overflow:"hidden",zIndex:0 }}>
                <img src={scene.bg} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                {/* Gradient: lighter top (person area), darker bottom (text area) */}
                <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.2) 45%,rgba(0,0,0,.75) 100%)" }} />
              </div>

              <div className="sweep" style={{ zIndex:7,borderRadius:12 }} />

              {/* Brand tag */}
              <div style={{ position:"absolute",top:"4%",left:"5%",zIndex:8,background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",borderRadius:8,padding:"4px 10px",fontSize:9,fontWeight:900,color:scene.accent,letterSpacing:4 }}>
                {scene.brand}
              </div>

              {/* Slogan */}
              <div className="slogan-p" style={{ "--ac":scene.accent,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:8,textAlign:"center" }}>
                <p style={{ margin:0,fontSize:15,fontWeight:900,color:"#fff",letterSpacing:2,lineHeight:1.3,textShadow:"0 2px 14px rgba(0,0,0,.95)" }}>
                  {scene.slogan}
                </p>
              </div>

              {/* Ground shadow — synced with float */}
              <div
                className="shadow-sync"
                style={{ position:"absolute",bottom:"20%",left:"50%",width:"52%",height:"4%",background:"radial-gradient(ellipse,rgba(0,0,0,.8) 0%,transparent 70%)",zIndex:5,borderRadius:"50%",pointerEvents:"none" }}
              />

              {/* ── PERSON — tall, anchored to bottom, breaks OUT the top ──
                  bottom: positions feet inside billboard
                  height: 160% so head extends well above the border
                  left+transform: centers horizontally
                  overflow:visible on parent lets it show above the border
              ── */}
              <img
                src={scene.person}
                alt="person"
                className="person-float"
                style={{
                  position:"absolute",
                  bottom:"14%",
                  left:"50%",
                  width:"82%",
                  height:"auto",
                  maxHeight:"135%",
                  zIndex:9,
                  objectFit:"contain",
                  display:"block",
                  filter:"drop-shadow(0 22px 18px rgba(0,0,0,.95)) drop-shadow(0 5px 8px rgba(0,0,0,.65))",
                }}
                onError={e => { e.target.style.display="none"; }}
              />
            </div>
          </div>

          {/* Scene dots */}
          <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:14 }}>
            {SHOWCASE_SCENES.map((_,i) => (
              <div
                key={i}
                onClick={e => { e.stopPropagation(); setSceneIdx(i); }}
                style={{ width:i===sceneIdx?24:7,height:7,borderRadius:4,background:i===sceneIdx?scene.accent:"rgba(255,255,255,.15)",transition:"all .3s",cursor:"pointer" }}
              />
            ))}
          </div>

          <p style={{ textAlign:"center",fontSize:9,color:"rgba(255,255,255,.15)",marginTop:8,letterSpacing:2 }}>
            ASÍ QUEDA TU PRODUCTO · TOCÁ PARA CREAR
          </p>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex",gap:5,marginBottom:18 }}>
          {[["crear","🎨 Crear"],["fondos","🖼️ Fondos"],["marco","✨ Marco"]].map(([t,label]) => (
            <button
              key={t} onClick={() => setTab(t)}
              style={{ flex:1,padding:"9px 4px",background:tab===t?"rgba(255,45,120,.18)":"rgba(255,255,255,.04)",border:tab===t?"1px solid rgba(255,45,120,.5)":"1px solid rgba(255,255,255,.07)",borderRadius:10,color:tab===t?"#fff":"rgba(255,255,255,.55)",cursor:"pointer",fontWeight:tab===t?800:400,fontSize:12,transition:"all .2s" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ════════════ CREAR ════════════ */}
        {tab === "crear" && (
          <div>
            {/* Upload */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>01 · FOTO O PRODUCTO</p>
              <div
                onClick={() => fileRef.current.click()}
                style={{ border:"2px dashed rgba(255,45,120,.3)",borderRadius:13,padding:photo?0:28,textAlign:"center",cursor:"pointer",overflow:"hidden",minHeight:80,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,45,120,.65)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,45,120,.3)"}
              >
                {photo
                  ? <div style={{ position:"relative",width:"100%" }}>
                      <img src={photo} alt="preview" style={{ width:"100%",maxHeight:170,objectFit:"cover" }} />
                      <div style={{ position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.8)",padding:"3px 9px",borderRadius:6,fontSize:11 }}>📷 Cambiar</div>
                    </div>
                  : <div>
                      <div style={{ fontSize:38,marginBottom:6 }}>🤳</div>
                      <div style={{ fontSize:12,color:"rgba(255,255,255,.45)" }}>Subí tu foto, persona o producto</div>
                    </div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            {/* Slogan */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>02 · SLOGAN (OPCIONAL)</p>
              <input
                style={{ width:"100%",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:10,padding:"11px 13px",color:"#fff",fontSize:14,outline:"none",transition:"border-color .2s",fontFamily:"inherit" }}
                onFocus={e => e.target.style.borderColor="rgba(255,45,120,.55)"}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,.09)"}
                placeholder='Ej: "Break the frame · Feel the scent"'
                value={slogan} onChange={e => setSlogan(e.target.value)}
              />
            </div>

            {/* Logo */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>03 · LOGO (OPCIONAL)</p>
              <div
                onClick={() => logoRef.current.click()}
                style={{ border:"1px dashed rgba(255,255,255,.12)",borderRadius:10,padding:"11px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,.12)"}
              >
                {brandLogo ? <img src={brandLogo} alt="logo" style={{ width:40,height:40,objectFit:"contain",borderRadius:8 }} /> : <span style={{ fontSize:24 }}>🏷️</span>}
                <span style={{ fontSize:12,color:"rgba(255,255,255,.38)" }}>{brandLogo ? "Logo cargado ✅" : "Subí tu logo de marca"}</span>
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleLogo(e.target.files[0])} />
            </div>

            {/* Fondo actual */}
            <div
              style={{ marginBottom:14,padding:"9px 13px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,display:"flex",alignItems:"center",gap:10,cursor:"pointer" }}
              onClick={() => setTab("fondos")}
            >
              {selectedBgData?.url
                ? <img src={selectedBgData.url} alt={selectedBgData.label} style={{ width:38,height:38,objectFit:"cover",borderRadius:6 }} />
                : <div style={{ width:38,height:38,background:selectedBgData?.color||"#111",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{selectedBgData?.emoji}</div>
              }
              <div>
                <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:2 }}>FONDO ACTUAL</div>
                <div style={{ fontSize:13,fontWeight:700 }}>{selectedBgData?.label}</div>
              </div>
              <div style={{ marginLeft:"auto",padding:"5px 12px",background:"rgba(255,45,120,.12)",border:"1px solid rgba(255,45,120,.3)",borderRadius:8,color:"#ff2d78",fontSize:11,fontWeight:700 }}>
                Cambiar →
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={generate} disabled={loading}
              className={!loading ? "b-pulse" : ""}
              style={{ width:"100%",padding:"17px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:13,color:"#fff",fontSize:15,fontWeight:900,cursor:loading?"not-allowed":"pointer",opacity:loading?.8:1,letterSpacing:1.5,transition:"transform .15s" }}
              onMouseEnter={e => { if(!loading) e.currentTarget.style.transform="scale(1.015)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
            >
              {loading ? `⚡ ${status}  ${Math.round(progress)}%` : "⚡ CREAR MI BILLBOARD"}
            </button>

            {loading && (
              <div style={{ height:3,background:"rgba(255,255,255,.07)",borderRadius:2,marginTop:9 }}>
                <div style={{ height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d)",borderRadius:2,transition:"width .35s" }} />
              </div>
            )}

            {error && (
              <div style={{ marginTop:10,padding:"12px 15px",background:"rgba(255,60,60,.08)",border:"1px solid rgba(255,60,60,.2)",borderRadius:10,fontSize:13,color:"#ff9090" }}>
                ⚠️ {error}
              </div>
            )}

            {/* ════════ RESULTADO 3D ════════ */}
            {personBlob && (
              <div style={{ marginTop:32 }}>
                <p style={{ textAlign:"center",fontSize:9,color:"rgba(255,255,255,.2)",marginBottom:12,letterSpacing:2 }}>
                  🖱️ MOVÉ EL MOUSE PARA EL EFECTO 3D
                </p>

                {/* 3D tilt wrapper */}
                <div
                  ref={billboardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ perspective:"1000px", marginBottom:90, paddingTop:60 }}
                >
                  <div
                    className="bb-enter"
                    style={{ transform:`perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,transition:"transform .1s ease-out",transformStyle:"preserve-3d",position:"relative" }}
                  >
                    {/* 3D sides */}
                    <div style={{ position:"absolute",top:5,right:-13,width:13,height:"calc(100% - 10px)",background:`linear-gradient(to right,${accentColor}50,transparent)`,borderRadius:"0 4px 4px 0" }} />
                    <div style={{ position:"absolute",bottom:-10,left:5,width:"calc(100% - 10px)",height:10,background:`linear-gradient(to bottom,${accentColor}40,transparent)`,borderRadius:"0 0 4px 4px" }} />

                    {/* Billboard with overflow:visible so person breaks out */}
                    <div
                      className={`scanlines glow-${frame==="neon"?"neon":frame==="gold"?"gold":frame==="future"?"future":"neon"}`}
                      style={{ position:"relative",borderRadius:16,overflow:"visible",...frameStyle,aspectRatio:"4/5" }}
                    >
                      {/* Bg inside a clipped div */}
                      <div style={{ position:"absolute",inset:0,borderRadius:12,overflow:"hidden",zIndex:0 }}>
                        {selectedBgData?.color
                          ? <div style={{ width:"100%",height:"100%",background:selectedBgData.color }} />
                          : <img src={selectedBgData?.url} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                        }
                        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.7) 100%)" }} />
                      </div>

                      <div className="sweep" />

                      {/* Slogan */}
                      {slogan && (
                        <div className="slogan-p" style={{ "--ac":accentColor,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:8,textAlign:"center" }}>
                          <p style={{ margin:0,fontSize:13,fontWeight:900,color:"#fff",letterSpacing:1.5,lineHeight:1.35,textShadow:`0 2px 16px rgba(0,0,0,.95),0 0 28px ${accentColor}77` }}>
                            {slogan}
                          </p>
                        </div>
                      )}

                      {/* Logo */}
                      {brandLogo && (
                        <img src={brandLogo} alt="logo" style={{ position:"absolute",top:"4%",right:"4%",width:"14%",zIndex:8,borderRadius:8,objectFit:"contain",filter:"drop-shadow(0 2px 8px rgba(0,0,0,.8))" }} />
                      )}

                      {/* Shadow */}
                      <div
                        className="shadow-sync"
                        style={{ position:"absolute",bottom:"-4%",left:"50%",width:"55%",height:"4%",background:"radial-gradient(ellipse,rgba(0,0,0,.88) 0%,transparent 70%)",zIndex:5,borderRadius:"50%",pointerEvents:"none" }}
                      />

                      {/* ── PERSON / PRODUCT ──
                          Centered in billboard.
                          Width-based so any image (tall person OR square product) fits.
                          bottom:5% keeps it above slogan.
                          overflow:visible on parent lets it break the top border.
                      ── */}
                      <img
                        src={personBlob}
                        alt="persona"
                        className="person-entry"
                        style={{
                          position:"absolute",
                          bottom:"12%",
                          left:"50%",
                          /* Width fills most of the frame; height auto → natural proportions */
                          width:"85%",
                          height:"auto",
                          maxHeight:"130%",  /* allows breaking out the top */
                          zIndex:9,
                          objectFit:"contain",
                          transformOrigin:"bottom center",
                          filter:"drop-shadow(0 20px 18px rgba(0,0,0,.95)) drop-shadow(0 5px 8px rgba(0,0,0,.7))",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Download / Reset */}
                <div style={{ display:"flex",gap:8 }}>
                  <button
                    onClick={() => { const a=document.createElement("a"); a.href=personBlob; a.download=`neonboard-${Date.now()}.png`; a.click(); }}
                    style={{ flex:2,padding:"13px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer" }}
                  >
                    ⬇️ Descargar
                  </button>
                  <button
                    onClick={() => { setPersonBlob(null); setPhoto(null); setPhotoFile(null); setPhotoUrl(null); }}
                    style={{ flex:1,padding:"13px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,color:"rgba(255,255,255,.65)",fontSize:13,cursor:"pointer" }}
                  >
                    🔄 Nuevo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════ FONDOS ════════════ */}
        {tab === "fondos" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginBottom:12 }}>
              Tocá para previsualizar → después confirmá
            </p>

            {/* Large preview */}
            <div style={{ borderRadius:13,overflow:"hidden",height:140,marginBottom:13,border:"2px solid rgba(255,45,120,.4)",position:"relative" }}>
              {previewBgData?.url
                ? <img src={previewBgData.url} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                : <div style={{ width:"100%",height:"100%",background:previewBgData?.color||"#111",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48 }}>{previewBgData?.emoji}</div>
              }
              <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"30px 12px 10px",background:"linear-gradient(transparent,rgba(0,0,0,.8))",fontWeight:700,fontSize:14 }}>
                {previewBgData?.emoji} {previewBgData?.label}
              </div>
            </div>

            {/* Grid — only previews, does NOT close tab */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:14 }}>
              {BACKGROUNDS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setPreviewBg(b.id)}   /* ← ONLY sets preview, stays in fondos */
                  style={{
                    position:"relative",height:58,padding:0,borderRadius:10,cursor:"pointer",overflow:"hidden",
                    border: previewBg===b.id ? "2px solid #ff2d78" : "2px solid rgba(255,255,255,.07)",
                    background: b.url
                      ? `linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.5)),url(${b.url}) center/cover`
                      : b.color||"#111",
                    boxShadow: previewBg===b.id ? "0 0 12px rgba(255,45,120,.5)" : "none",
                    transition:"all .15s",
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,color:"#fff",
                  }}
                >
                  {previewBg===b.id && (
                    <div style={{ position:"absolute",top:2,right:2,width:14,height:14,background:"#ff2d78",borderRadius:"50%",fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900 }}>✓</div>
                  )}
                  <span style={{ fontSize:18 }}>{b.emoji}</span>
                  <span style={{ fontSize:8,fontWeight:600,textShadow:"0 1px 4px rgba(0,0,0,.9)",textAlign:"center",padding:"0 2px",lineHeight:1.2 }}>{b.label}</span>
                </button>
              ))}
            </div>

            {/* Confirm button — applies and goes back */}
            <button
              onClick={() => { setBg(previewBg); setTab("crear"); }}
              style={{ width:"100%",padding:"14px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",letterSpacing:1 }}
            >
              ✅ Usar: {previewBgData?.emoji} {previewBgData?.label}
            </button>
          </div>
        )}

        {/* ════════════ MARCO ════════════ */}
        {tab === "marco" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginBottom:14 }}>Elegí el estilo del borde</p>
            <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
              {FRAMES.map(f => (
                <button
                  key={f.id}
                  onClick={() => { setFrame(f.id); setTab("crear"); }}
                  style={{ padding:"14px 18px",background:frame===f.id?"rgba(255,45,120,.1)":"rgba(255,255,255,.03)",border:frame===f.id?`2px solid ${f.accent}aa`:"2px solid rgba(255,255,255,.06)",borderRadius:12,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",gap:12,transition:"all .2s",boxShadow:frame===f.id?`0 0 16px ${f.accent}40`:"none",textAlign:"left" }}
                >
                  <span style={{ fontSize:26 }}>{f.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14,fontWeight:700 }}>{f.label}</div>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,.3)",marginTop:2 }}>
                      {f.id==="neon"    && "Brillos cyan + destello rosa"}
                      {f.id==="gold"    && "Dorado elegante, lujo cálido"}
                      {f.id==="vintage" && "Marrón cinematográfico"}
                      {f.id==="future"  && "Verde neón + halo azul"}
                      {f.id==="minimal" && "Blanco limpio, sin efectos"}
                    </div>
                  </div>
                  {frame===f.id && <span style={{ color:f.accent,fontSize:18 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}"use client";
import { useState, useRef, useCallback, useEffect } from "react";

const REMOVE_BG_KEY = "pBzBsLfZKHNxiiTEvbX4seU2";

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

// Showcase: bg = city background, person = portrait photo
// The trick: person image is displayed LARGE, anchored to bottom-center
// overflow:visible on the wrapper lets it break outside the frame border
const SHOWCASE_SCENES = [
  {
    id: "fashion",
    bg: "https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=900&q=80",
    person: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
    slogan: "OWN THE CITY",
    brand: "URBAN EDGE",
    accent: "#00cfff",
  },
  {
    id: "luxury",
    bg: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80",
    person: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=600&q=80",
    slogan: "BREAK THE FRAME",
    brand: "NOIR ÉLITE",
    accent: "#FFD700",
  },
  {
    id: "sport",
    bg: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80",
    person: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
    slogan: "PUSH BEYOND",
    brand: "APEX SPORT",
    accent: "#ff4500",
  },
  {
    id: "night",
    bg: "https://images.unsplash.com/photo-1514565131-fce0801e6785?w=900&q=80",
    person: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
    slogan: "DEFINE YOUR WORLD",
    brand: "LUXE NOIR",
    accent: "#c084fc",
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneAnim, setSceneAnim] = useState("in");
  const [previewBg, setPreviewBg] = useState("nyc1");

  const fileRef = useRef(null);
  const logoRef = useRef(null);
  const billboardRef = useRef(null);
  const autoTiltTimer = useRef(null);
  const autoTiltAngle = useRef(0);
  const isMouseOver = useRef(false);

  // Sync preview when opening fondos tab
  useEffect(() => { if (tab === "fondos") setPreviewBg(bg); }, [tab]);

  // Rotate showcase
  useEffect(() => {
    const t = setInterval(() => {
      setSceneAnim("out");
      setTimeout(() => { setSceneIdx(i => (i + 1) % SHOWCASE_SCENES.length); setSceneAnim("in"); }, 500);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Auto tilt for result
  const startAutoTilt = useCallback(() => {
    clearInterval(autoTiltTimer.current);
    autoTiltTimer.current = setInterval(() => {
      if (isMouseOver.current) return;
      autoTiltAngle.current += 0.016;
      setTilt({ x: Math.sin(autoTiltAngle.current * 0.6) * 4, y: Math.sin(autoTiltAngle.current) * 6 });
    }, 16);
  }, []);

  useEffect(() => {
    if (personBlob) startAutoTilt();
    return () => clearInterval(autoTiltTimer.current);
  }, [personBlob, startAutoTilt]);

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
    const pieces = Array.from({ length: 70 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: [accent, "#fff", "#ff9500", "#00cfff", "#ffeb3b"][i % 5],
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
    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST", headers: { "X-Api-Key": REMOVE_BG_KEY }, body: fd
    });
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
  const previewBgData  = BACKGROUNDS.find(b => b.id === previewBg);
  const frameStyle     = FRAME_STYLES[frame] || FRAME_STYLES.neon;
  const accentColor    = FRAMES.find(f => f.id === frame)?.accent || "#00cfff";
  const scene          = SHOWCASE_SCENES[sceneIdx];

  return (
    <div style={{ minHeight:"100vh", background:"#06060f", fontFamily:"'DM Sans',sans-serif", color:"#fff", paddingBottom:60, position:"relative", overflow:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&display=swap');
        * { box-sizing:border-box; }

        @keyframes fall { to { transform:translateY(110vh) rotate(720deg); opacity:0; } }

        @keyframes sceneIn  { from{opacity:0;transform:translateY(16px) scale(.97);} to{opacity:1;transform:translateY(0) scale(1);} }
        @keyframes sceneOut { from{opacity:1;transform:translateY(0) scale(1);}       to{opacity:0;transform:translateY(-14px) scale(.97);} }

        /* Subtle float — barely moves, like breathing */
        @keyframes float {
          0%,100%{ transform:translateX(-50%) translateY(0px) scale(1); }
          50%    { transform:translateX(-50%) translateY(-8px) scale(1.008); }
        }
        @keyframes shadowSync {
          0%,100%{ transform:translateX(-50%) scaleX(1);   opacity:.55; }
          50%    { transform:translateX(-50%) scaleX(.78); opacity:.22; }
        }
        /* Entry: fade up softly */
        @keyframes personIn {
          from{ opacity:0; transform:translateX(-50%) translateY(28px); filter:blur(4px); }
          to  { opacity:1; transform:translateX(-50%) translateY(0);    filter:blur(0);   }
        }
        .person-float { animation: float     5.5s ease-in-out infinite; }
        .shadow-sync  { animation: shadowSync 5.5s ease-in-out infinite; }
        .person-entry {
          animation:
            personIn  .75s cubic-bezier(.22,1,.36,1) forwards,
            float      5.5s ease-in-out .8s infinite;
        }

        /* Glows */
        @keyframes glowCyan  { 0%,100%{box-shadow:0 0 22px #00cfff,0 0 50px rgba(255,45,120,.3);}  50%{box-shadow:0 0 50px #00cfff,0 0 100px rgba(255,45,120,.6);} }
        @keyframes glowGold  { 0%,100%{box-shadow:0 0 20px #FFD700;}                               50%{box-shadow:0 0 60px #FFD700;} }
        @keyframes glowGreen { 0%,100%{box-shadow:0 0 28px #00ff88,0 0 60px rgba(0,136,255,.2);}   50%{box-shadow:0 0 65px #00ff88,0 0 130px rgba(0,136,255,.5);} }
        .glow-neon   { animation:glowCyan  2.5s ease-in-out infinite; }
        .glow-gold   { animation:glowGold  2.5s ease-in-out infinite; }
        .glow-future { animation:glowGreen 2.5s ease-in-out infinite; }

        /* Billboard entrance */
        @keyframes bbIn {
          from{ opacity:0; transform:perspective(900px) rotateX(16deg) scale(.84) translateY(36px); }
          to  { opacity:1; transform:perspective(900px) rotateX(0)     scale(1)   translateY(0);    }
        }
        .bb-enter { animation:bbIn .85s cubic-bezier(.22,1,.36,1) forwards; }

        /* Light sweep */
        @keyframes sweep {
          0%  { transform:translateX(-140%) skewX(-18deg); opacity:0; }
          8%  { opacity:.45; }
          50% { opacity:.15; }
          100%{ transform:translateX(240%) skewX(-18deg); opacity:0; }
        }
        .sweep { position:absolute;top:0;left:0;width:28%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,.12),transparent);animation:sweep 6s ease-in-out infinite;pointer-events:none;z-index:6; }

        /* Scanlines */
        .scanlines::after { content:'';position:absolute;inset:0;border-radius:inherit;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 3px);pointer-events:none;z-index:2; }

        /* Slogan pulse */
        @keyframes sloganP { 0%,100%{opacity:.9;} 50%{opacity:1;text-shadow:0 0 18px var(--ac);} }
        .slogan-p { animation:sloganP 3s ease-in-out infinite; }

        /* Header shimmer */
        @keyframes shimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }

        /* Button pulse */
        @keyframes bpulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,45,120,.4);} 50%{box-shadow:0 0 0 10px rgba(255,45,120,0);} }
        .b-pulse { animation:bpulse 2s ease-in-out infinite; }

        /* Ambient */
        @keyframes drift { 0%,100%{transform:translate(0,0);} 50%{transform:translate(20px,-50px);} }
      `}</style>

      {confetti.map(p => (
        <div key={p.id} style={{ position:"fixed",left:`${p.x}%`,top:"-20px",width:p.size,height:p.size,background:p.color,borderRadius:"3px",zIndex:9999,animation:`fall ${1.4+p.delay}s ease-in forwards` }} />
      ))}

      {/* Ambient orbs */}
      <div style={{ position:"fixed",top:"-20%",left:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(160,80,255,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"drift 14s ease-in-out infinite" }} />
      <div style={{ position:"fixed",bottom:"-20%",right:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(0,160,255,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"drift 18s ease-in-out 5s infinite" }} />

      <div style={{ maxWidth:480, margin:"0 auto", position:"relative", zIndex:1, padding:"0 16px" }}>

        {/* Header */}
        <div style={{ textAlign:"center",paddingTop:20,marginBottom:18 }}>
          <h1 style={{ fontSize:26,fontWeight:900,letterSpacing:4,margin:0,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d,#00cfff,#ff2d78)",backgroundSize:"300% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 5s ease infinite" }}>
            ⚡ NEONBOARD AI
          </h1>
          <p style={{ color:"rgba(255,255,255,.25)",fontSize:10,marginTop:4,letterSpacing:3 }}>
            BILLBOARDS 3D VIRALES · SIN EDICIÓN
          </p>
        </div>

        {/* ════════════════════════════════════════════
            SHOWCASE — person breaks out of the frame
            Key: billboard has overflow:visible so the
            person image can extend past the border.
            The photo is TALL and anchored to bottom.
        ════════════════════════════════════════════ */}
        <div
          style={{ marginBottom:18, cursor:"pointer", paddingTop:60 /* space for person to break out above */ }}
          onClick={() => setTab("crear")}
        >
          <div style={{ animation: sceneAnim==="in" ? "sceneIn .5s ease forwards" : "sceneOut .45s ease forwards", position:"relative" }}>

            {/* 3D side depths */}
            <div style={{ position:"absolute",top:6,right:-13,width:13,height:"calc(100% - 12px)",background:`linear-gradient(to right,${scene.accent}45,transparent)`,borderRadius:"0 4px 4px 0",zIndex:0 }} />
            <div style={{ position:"absolute",bottom:-10,left:6,width:"calc(100% - 12px)",height:10,background:`linear-gradient(to bottom,${scene.accent}35,transparent)`,borderRadius:"0 0 4px 4px",zIndex:0 }} />

            {/* ── BILLBOARD — overflow:visible so person pops out ── */}
            <div
              className="scanlines"
              style={{
                position:"relative",
                borderRadius:16,
                overflow:"visible",   /* ← KEY: lets person break outside */
                aspectRatio:"4/5",
                border:`5px solid ${scene.accent}`,
                boxShadow:`0 0 45px ${scene.accent}66,0 0 90px ${scene.accent}33`,
              }}
            >
              {/* Background photo — clipped inside */}
              <div style={{ position:"absolute",inset:0,borderRadius:12,overflow:"hidden",zIndex:0 }}>
                <img src={scene.bg} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                {/* Gradient: lighter top (person area), darker bottom (text area) */}
                <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.2) 45%,rgba(0,0,0,.75) 100%)" }} />
              </div>

              <div className="sweep" style={{ zIndex:7,borderRadius:12 }} />

              {/* Brand tag */}
              <div style={{ position:"absolute",top:"4%",left:"5%",zIndex:8,background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",borderRadius:8,padding:"4px 10px",fontSize:9,fontWeight:900,color:scene.accent,letterSpacing:4 }}>
                {scene.brand}
              </div>

              {/* Slogan */}
              <div className="slogan-p" style={{ "--ac":scene.accent,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:8,textAlign:"center" }}>
                <p style={{ margin:0,fontSize:15,fontWeight:900,color:"#fff",letterSpacing:2,lineHeight:1.3,textShadow:"0 2px 14px rgba(0,0,0,.95)" }}>
                  {scene.slogan}
                </p>
              </div>

              {/* Ground shadow — synced with float */}
              <div
                className="shadow-sync"
                style={{ position:"absolute",bottom:"20%",left:"50%",width:"52%",height:"4%",background:"radial-gradient(ellipse,rgba(0,0,0,.8) 0%,transparent 70%)",zIndex:5,borderRadius:"50%",pointerEvents:"none" }}
              />

              {/* ── PERSON — tall, anchored to bottom, breaks OUT the top ──
                  bottom: positions feet inside billboard
                  height: 160% so head extends well above the border
                  left+transform: centers horizontally
                  overflow:visible on parent lets it show above the border
              ── */}
              <img
                src={scene.person}
                alt="person"
                className="person-float"
                style={{
                  position:"absolute",
                  bottom:"14%",
                  left:"50%",
                  width:"82%",
                  height:"auto",
                  maxHeight:"135%",
                  zIndex:9,
                  objectFit:"contain",
                  display:"block",
                  filter:"drop-shadow(0 22px 18px rgba(0,0,0,.95)) drop-shadow(0 5px 8px rgba(0,0,0,.65))",
                }}
                onError={e => { e.target.style.display="none"; }}
              />
            </div>
          </div>

          {/* Scene dots */}
          <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:14 }}>
            {SHOWCASE_SCENES.map((_,i) => (
              <div
                key={i}
                onClick={e => { e.stopPropagation(); setSceneIdx(i); }}
                style={{ width:i===sceneIdx?24:7,height:7,borderRadius:4,background:i===sceneIdx?scene.accent:"rgba(255,255,255,.15)",transition:"all .3s",cursor:"pointer" }}
              />
            ))}
          </div>

          <p style={{ textAlign:"center",fontSize:9,color:"rgba(255,255,255,.15)",marginTop:8,letterSpacing:2 }}>
            ASÍ QUEDA TU PRODUCTO · TOCÁ PARA CREAR
          </p>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex",gap:5,marginBottom:18 }}>
          {[["crear","🎨 Crear"],["fondos","🖼️ Fondos"],["marco","✨ Marco"]].map(([t,label]) => (
            <button
              key={t} onClick={() => setTab(t)}
              style={{ flex:1,padding:"9px 4px",background:tab===t?"rgba(255,45,120,.18)":"rgba(255,255,255,.04)",border:tab===t?"1px solid rgba(255,45,120,.5)":"1px solid rgba(255,255,255,.07)",borderRadius:10,color:tab===t?"#fff":"rgba(255,255,255,.55)",cursor:"pointer",fontWeight:tab===t?800:400,fontSize:12,transition:"all .2s" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ════════════ CREAR ════════════ */}
        {tab === "crear" && (
          <div>
            {/* Upload */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>01 · FOTO O PRODUCTO</p>
              <div
                onClick={() => fileRef.current.click()}
                style={{ border:"2px dashed rgba(255,45,120,.3)",borderRadius:13,padding:photo?0:28,textAlign:"center",cursor:"pointer",overflow:"hidden",minHeight:80,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,45,120,.65)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,45,120,.3)"}
              >
                {photo
                  ? <div style={{ position:"relative",width:"100%" }}>
                      <img src={photo} alt="preview" style={{ width:"100%",maxHeight:170,objectFit:"cover" }} />
                      <div style={{ position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.8)",padding:"3px 9px",borderRadius:6,fontSize:11 }}>📷 Cambiar</div>
                    </div>
                  : <div>
                      <div style={{ fontSize:38,marginBottom:6 }}>🤳</div>
                      <div style={{ fontSize:12,color:"rgba(255,255,255,.45)" }}>Subí tu foto, persona o producto</div>
                    </div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            {/* Slogan */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>02 · SLOGAN (OPCIONAL)</p>
              <input
                style={{ width:"100%",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:10,padding:"11px 13px",color:"#fff",fontSize:14,outline:"none",transition:"border-color .2s",fontFamily:"inherit" }}
                onFocus={e => e.target.style.borderColor="rgba(255,45,120,.55)"}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,.09)"}
                placeholder='Ej: "Break the frame · Feel the scent"'
                value={slogan} onChange={e => setSlogan(e.target.value)}
              />
            </div>

            {/* Logo */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>03 · LOGO (OPCIONAL)</p>
              <div
                onClick={() => logoRef.current.click()}
                style={{ border:"1px dashed rgba(255,255,255,.12)",borderRadius:10,padding:"11px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,.12)"}
              >
                {brandLogo ? <img src={brandLogo} alt="logo" style={{ width:40,height:40,objectFit:"contain",borderRadius:8 }} /> : <span style={{ fontSize:24 }}>🏷️</span>}
                <span style={{ fontSize:12,color:"rgba(255,255,255,.38)" }}>{brandLogo ? "Logo cargado ✅" : "Subí tu logo de marca"}</span>
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleLogo(e.target.files[0])} />
            </div>

            {/* Fondo actual */}
            <div
              style={{ marginBottom:14,padding:"9px 13px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,display:"flex",alignItems:"center",gap:10,cursor:"pointer" }}
              onClick={() => setTab("fondos")}
            >
              {selectedBgData?.url
                ? <img src={selectedBgData.url} alt={selectedBgData.label} style={{ width:38,height:38,objectFit:"cover",borderRadius:6 }} />
                : <div style={{ width:38,height:38,background:selectedBgData?.color||"#111",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{selectedBgData?.emoji}</div>
              }
              <div>
                <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:2 }}>FONDO ACTUAL</div>
                <div style={{ fontSize:13,fontWeight:700 }}>{selectedBgData?.label}</div>
              </div>
              <div style={{ marginLeft:"auto",padding:"5px 12px",background:"rgba(255,45,120,.12)",border:"1px solid rgba(255,45,120,.3)",borderRadius:8,color:"#ff2d78",fontSize:11,fontWeight:700 }}>
                Cambiar →
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={generate} disabled={loading}
              className={!loading ? "b-pulse" : ""}
              style={{ width:"100%",padding:"17px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:13,color:"#fff",fontSize:15,fontWeight:900,cursor:loading?"not-allowed":"pointer",opacity:loading?.8:1,letterSpacing:1.5,transition:"transform .15s" }}
              onMouseEnter={e => { if(!loading) e.currentTarget.style.transform="scale(1.015)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
            >
              {loading ? `⚡ ${status}  ${Math.round(progress)}%` : "⚡ CREAR MI BILLBOARD"}
            </button>

            {loading && (
              <div style={{ height:3,background:"rgba(255,255,255,.07)",borderRadius:2,marginTop:9 }}>
                <div style={{ height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d)",borderRadius:2,transition:"width .35s" }} />
              </div>
            )}

            {error && (
              <div style={{ marginTop:10,padding:"12px 15px",background:"rgba(255,60,60,.08)",border:"1px solid rgba(255,60,60,.2)",borderRadius:10,fontSize:13,color:"#ff9090" }}>
                ⚠️ {error}
              </div>
            )}

            {/* ════════ RESULTADO 3D ════════ */}
            {personBlob && (
              <div style={{ marginTop:32 }}>
                <p style={{ textAlign:"center",fontSize:9,color:"rgba(255,255,255,.2)",marginBottom:12,letterSpacing:2 }}>
                  🖱️ MOVÉ EL MOUSE PARA EL EFECTO 3D
                </p>

                {/* 3D tilt wrapper */}
                <div
                  ref={billboardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ perspective:"1000px", marginBottom:90, paddingTop:60 }}
                >
                  <div
                    className="bb-enter"
                    style={{ transform:`perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,transition:"transform .1s ease-out",transformStyle:"preserve-3d",position:"relative" }}
                  >
                    {/* 3D sides */}
                    <div style={{ position:"absolute",top:5,right:-13,width:13,height:"calc(100% - 10px)",background:`linear-gradient(to right,${accentColor}50,transparent)`,borderRadius:"0 4px 4px 0" }} />
                    <div style={{ position:"absolute",bottom:-10,left:5,width:"calc(100% - 10px)",height:10,background:`linear-gradient(to bottom,${accentColor}40,transparent)`,borderRadius:"0 0 4px 4px" }} />

                    {/* Billboard with overflow:visible so person breaks out */}
                    <div
                      className={`scanlines glow-${frame==="neon"?"neon":frame==="gold"?"gold":frame==="future"?"future":"neon"}`}
                      style={{ position:"relative",borderRadius:16,overflow:"visible",...frameStyle,aspectRatio:"4/5" }}
                    >
                      {/* Bg inside a clipped div */}
                      <div style={{ position:"absolute",inset:0,borderRadius:12,overflow:"hidden",zIndex:0 }}>
                        {selectedBgData?.color
                          ? <div style={{ width:"100%",height:"100%",background:selectedBgData.color }} />
                          : <img src={selectedBgData?.url} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                        }
                        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.7) 100%)" }} />
                      </div>

                      <div className="sweep" />

                      {/* Slogan */}
                      {slogan && (
                        <div className="slogan-p" style={{ "--ac":accentColor,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:8,textAlign:"center" }}>
                          <p style={{ margin:0,fontSize:13,fontWeight:900,color:"#fff",letterSpacing:1.5,lineHeight:1.35,textShadow:`0 2px 16px rgba(0,0,0,.95),0 0 28px ${accentColor}77` }}>
                            {slogan}
                          </p>
                        </div>
                      )}

                      {/* Logo */}
                      {brandLogo && (
                        <img src={brandLogo} alt="logo" style={{ position:"absolute",top:"4%",right:"4%",width:"14%",zIndex:8,borderRadius:8,objectFit:"contain",filter:"drop-shadow(0 2px 8px rgba(0,0,0,.8))" }} />
                      )}

                      {/* Shadow */}
                      <div
                        className="shadow-sync"
                        style={{ position:"absolute",bottom:"-4%",left:"50%",width:"55%",height:"4%",background:"radial-gradient(ellipse,rgba(0,0,0,.88) 0%,transparent 70%)",zIndex:5,borderRadius:"50%",pointerEvents:"none" }}
                      />

                      {/* ── PERSON / PRODUCT ──
                          Centered in billboard.
                          Width-based so any image (tall person OR square product) fits.
                          bottom:5% keeps it above slogan.
                          overflow:visible on parent lets it break the top border.
                      ── */}
                      <img
                        src={personBlob}
                        alt="persona"
                        className="person-entry"
                        style={{
                          position:"absolute",
                          bottom:"12%",
                          left:"50%",
                          /* Width fills most of the frame; height auto → natural proportions */
                          width:"85%",
                          height:"auto",
                          maxHeight:"130%",  /* allows breaking out the top */
                          zIndex:9,
                          objectFit:"contain",
                          transformOrigin:"bottom center",
                          filter:"drop-shadow(0 20px 18px rgba(0,0,0,.95)) drop-shadow(0 5px 8px rgba(0,0,0,.7))",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Download / Reset */}
                <div style={{ display:"flex",gap:8 }}>
                  <button
                    onClick={() => { const a=document.createElement("a"); a.href=personBlob; a.download=`neonboard-${Date.now()}.png`; a.click(); }}
                    style={{ flex:2,padding:"13px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer" }}
                  >
                    ⬇️ Descargar
                  </button>
                  <button
                    onClick={() => { setPersonBlob(null); setPhoto(null); setPhotoFile(null); setPhotoUrl(null); }}
                    style={{ flex:1,padding:"13px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,color:"rgba(255,255,255,.65)",fontSize:13,cursor:"pointer" }}
                  >
                    🔄 Nuevo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════ FONDOS ════════════ */}
        {tab === "fondos" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginBottom:12 }}>
              Tocá para previsualizar → después confirmá
            </p>

            {/* Large preview */}
            <div style={{ borderRadius:13,overflow:"hidden",height:140,marginBottom:13,border:"2px solid rgba(255,45,120,.4)",position:"relative" }}>
              {previewBgData?.url
                ? <img src={previewBgData.url} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                : <div style={{ width:"100%",height:"100%",background:previewBgData?.color||"#111",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48 }}>{previewBgData?.emoji}</div>
              }
              <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"30px 12px 10px",background:"linear-gradient(transparent,rgba(0,0,0,.8))",fontWeight:700,fontSize:14 }}>
                {previewBgData?.emoji} {previewBgData?.label}
              </div>
            </div>

            {/* Grid — only previews, does NOT close tab */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:14 }}>
              {BACKGROUNDS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setPreviewBg(b.id)}   /* ← ONLY sets preview, stays in fondos */
                  style={{
                    position:"relative",height:58,padding:0,borderRadius:10,cursor:"pointer",overflow:"hidden",
                    border: previewBg===b.id ? "2px solid #ff2d78" : "2px solid rgba(255,255,255,.07)",
                    background: b.url
                      ? `linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.5)),url(${b.url}) center/cover`
                      : b.color||"#111",
                    boxShadow: previewBg===b.id ? "0 0 12px rgba(255,45,120,.5)" : "none",
                    transition:"all .15s",
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,color:"#fff",
                  }}
                >
                  {previewBg===b.id && (
                    <div style={{ position:"absolute",top:2,right:2,width:14,height:14,background:"#ff2d78",borderRadius:"50%",fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900 }}>✓</div>
                  )}
                  <span style={{ fontSize:18 }}>{b.emoji}</span>
                  <span style={{ fontSize:8,fontWeight:600,textShadow:"0 1px 4px rgba(0,0,0,.9)",textAlign:"center",padding:"0 2px",lineHeight:1.2 }}>{b.label}</span>
                </button>
              ))}
            </div>

            {/* Confirm button — applies and goes back */}
            <button
              onClick={() => { setBg(previewBg); setTab("crear"); }}
              style={{ width:"100%",padding:"14px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",letterSpacing:1 }}
            >
              ✅ Usar: {previewBgData?.emoji} {previewBgData?.label}
            </button>
          </div>
        )}

        {/* ════════════ MARCO ════════════ */}
        {tab === "marco" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginBottom:14 }}>Elegí el estilo del borde</p>
            <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
              {FRAMES.map(f => (
                <button
                  key={f.id}
                  onClick={() => { setFrame(f.id); setTab("crear"); }}
                  style={{ padding:"14px 18px",background:frame===f.id?"rgba(255,45,120,.1)":"rgba(255,255,255,.03)",border:frame===f.id?`2px solid ${f.accent}aa`:"2px solid rgba(255,255,255,.06)",borderRadius:12,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",gap:12,transition:"all .2s",boxShadow:frame===f.id?`0 0 16px ${f.accent}40`:"none",textAlign:"left" }}
                >
                  <span style={{ fontSize:26 }}>{f.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14,fontWeight:700 }}>{f.label}</div>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,.3)",marginTop:2 }}>
                      {f.id==="neon"    && "Brillos cyan + destello rosa"}
                      {f.id==="gold"    && "Dorado elegante, lujo cálido"}
                      {f.id==="vintage" && "Marrón cinematográfico"}
                      {f.id==="future"  && "Verde neón + halo azul"}
                      {f.id==="minimal" && "Blanco limpio, sin efectos"}
                    </div>
                  </div>
                  {frame===f.id && <span style={{ color:f.accent,fontSize:18 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}"use client";
import { useState, useRef, useCallback, useEffect } from "react";

const REMOVE_BG_KEY = "pBzBsLfZKHNxiiTEvbX4seU2";

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

// Showcase: bg = city background, person = portrait photo
// The trick: person image is displayed LARGE, anchored to bottom-center
// overflow:visible on the wrapper lets it break outside the frame border
const SHOWCASE_SCENES = [
  {
    id: "fashion",
    bg: "https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=900&q=80",
    person: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
    slogan: "OWN THE CITY",
    brand: "URBAN EDGE",
    accent: "#00cfff",
  },
  {
    id: "luxury",
    bg: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80",
    person: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=600&q=80",
    slogan: "BREAK THE FRAME",
    brand: "NOIR ÉLITE",
    accent: "#FFD700",
  },
  {
    id: "sport",
    bg: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80",
    person: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
    slogan: "PUSH BEYOND",
    brand: "APEX SPORT",
    accent: "#ff4500",
  },
  {
    id: "night",
    bg: "https://images.unsplash.com/photo-1514565131-fce0801e6785?w=900&q=80",
    person: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
    slogan: "DEFINE YOUR WORLD",
    brand: "LUXE NOIR",
    accent: "#c084fc",
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneAnim, setSceneAnim] = useState("in");
  const [previewBg, setPreviewBg] = useState("nyc1");

  const fileRef = useRef(null);
  const logoRef = useRef(null);
  const billboardRef = useRef(null);
  const autoTiltTimer = useRef(null);
  const autoTiltAngle = useRef(0);
  const isMouseOver = useRef(false);

  // Sync preview when opening fondos tab
  useEffect(() => { if (tab === "fondos") setPreviewBg(bg); }, [tab]);

  // Rotate showcase
  useEffect(() => {
    const t = setInterval(() => {
      setSceneAnim("out");
      setTimeout(() => { setSceneIdx(i => (i + 1) % SHOWCASE_SCENES.length); setSceneAnim("in"); }, 500);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Auto tilt for result
  const startAutoTilt = useCallback(() => {
    clearInterval(autoTiltTimer.current);
    autoTiltTimer.current = setInterval(() => {
      if (isMouseOver.current) return;
      autoTiltAngle.current += 0.016;
      setTilt({ x: Math.sin(autoTiltAngle.current * 0.6) * 4, y: Math.sin(autoTiltAngle.current) * 6 });
    }, 16);
  }, []);

  useEffect(() => {
    if (personBlob) startAutoTilt();
    return () => clearInterval(autoTiltTimer.current);
  }, [personBlob, startAutoTilt]);

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
    const pieces = Array.from({ length: 70 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: [accent, "#fff", "#ff9500", "#00cfff", "#ffeb3b"][i % 5],
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
    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST", headers: { "X-Api-Key": REMOVE_BG_KEY }, body: fd
    });
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
  const previewBgData  = BACKGROUNDS.find(b => b.id === previewBg);
  const frameStyle     = FRAME_STYLES[frame] || FRAME_STYLES.neon;
  const accentColor    = FRAMES.find(f => f.id === frame)?.accent || "#00cfff";
  const scene          = SHOWCASE_SCENES[sceneIdx];

  return (
    <div style={{ minHeight:"100vh", background:"#06060f", fontFamily:"'DM Sans',sans-serif", color:"#fff", paddingBottom:60, position:"relative", overflow:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&display=swap');
        * { box-sizing:border-box; }

        @keyframes fall { to { transform:translateY(110vh) rotate(720deg); opacity:0; } }

        @keyframes sceneIn  { from{opacity:0;transform:translateY(16px) scale(.97);} to{opacity:1;transform:translateY(0) scale(1);} }
        @keyframes sceneOut { from{opacity:1;transform:translateY(0) scale(1);}       to{opacity:0;transform:translateY(-14px) scale(.97);} }

        /* Subtle float — barely moves, like breathing */
        @keyframes float {
          0%,100%{ transform:translateX(-50%) translateY(0px) scale(1); }
          50%    { transform:translateX(-50%) translateY(-8px) scale(1.008); }
        }
        @keyframes shadowSync {
          0%,100%{ transform:translateX(-50%) scaleX(1);   opacity:.55; }
          50%    { transform:translateX(-50%) scaleX(.78); opacity:.22; }
        }
        /* Entry: fade up softly */
        @keyframes personIn {
          from{ opacity:0; transform:translateX(-50%) translateY(28px); filter:blur(4px); }
          to  { opacity:1; transform:translateX(-50%) translateY(0);    filter:blur(0);   }
        }
        .person-float { animation: float     5.5s ease-in-out infinite; }
        .shadow-sync  { animation: shadowSync 5.5s ease-in-out infinite; }
        .person-entry {
          animation:
            personIn  .75s cubic-bezier(.22,1,.36,1) forwards,
            float      5.5s ease-in-out .8s infinite;
        }

        /* Glows */
        @keyframes glowCyan  { 0%,100%{box-shadow:0 0 22px #00cfff,0 0 50px rgba(255,45,120,.3);}  50%{box-shadow:0 0 50px #00cfff,0 0 100px rgba(255,45,120,.6);} }
        @keyframes glowGold  { 0%,100%{box-shadow:0 0 20px #FFD700;}                               50%{box-shadow:0 0 60px #FFD700;} }
        @keyframes glowGreen { 0%,100%{box-shadow:0 0 28px #00ff88,0 0 60px rgba(0,136,255,.2);}   50%{box-shadow:0 0 65px #00ff88,0 0 130px rgba(0,136,255,.5);} }
        .glow-neon   { animation:glowCyan  2.5s ease-in-out infinite; }
        .glow-gold   { animation:glowGold  2.5s ease-in-out infinite; }
        .glow-future { animation:glowGreen 2.5s ease-in-out infinite; }

        /* Billboard entrance */
        @keyframes bbIn {
          from{ opacity:0; transform:perspective(900px) rotateX(16deg) scale(.84) translateY(36px); }
          to  { opacity:1; transform:perspective(900px) rotateX(0)     scale(1)   translateY(0);    }
        }
        .bb-enter { animation:bbIn .85s cubic-bezier(.22,1,.36,1) forwards; }

        /* Light sweep */
        @keyframes sweep {
          0%  { transform:translateX(-140%) skewX(-18deg); opacity:0; }
          8%  { opacity:.45; }
          50% { opacity:.15; }
          100%{ transform:translateX(240%) skewX(-18deg); opacity:0; }
        }
        .sweep { position:absolute;top:0;left:0;width:28%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,.12),transparent);animation:sweep 6s ease-in-out infinite;pointer-events:none;z-index:6; }

        /* Scanlines */
        .scanlines::after { content:'';position:absolute;inset:0;border-radius:inherit;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 3px);pointer-events:none;z-index:2; }

        /* Slogan pulse */
        @keyframes sloganP { 0%,100%{opacity:.9;} 50%{opacity:1;text-shadow:0 0 18px var(--ac);} }
        .slogan-p { animation:sloganP 3s ease-in-out infinite; }

        /* Header shimmer */
        @keyframes shimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }

        /* Button pulse */
        @keyframes bpulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,45,120,.4);} 50%{box-shadow:0 0 0 10px rgba(255,45,120,0);} }
        .b-pulse { animation:bpulse 2s ease-in-out infinite; }

        /* Ambient */
        @keyframes drift { 0%,100%{transform:translate(0,0);} 50%{transform:translate(20px,-50px);} }
      `}</style>

      {confetti.map(p => (
        <div key={p.id} style={{ position:"fixed",left:`${p.x}%`,top:"-20px",width:p.size,height:p.size,background:p.color,borderRadius:"3px",zIndex:9999,animation:`fall ${1.4+p.delay}s ease-in forwards` }} />
      ))}

      {/* Ambient orbs */}
      <div style={{ position:"fixed",top:"-20%",left:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(160,80,255,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"drift 14s ease-in-out infinite" }} />
      <div style={{ position:"fixed",bottom:"-20%",right:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(0,160,255,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"drift 18s ease-in-out 5s infinite" }} />

      <div style={{ maxWidth:480, margin:"0 auto", position:"relative", zIndex:1, padding:"0 16px" }}>

        {/* Header */}
        <div style={{ textAlign:"center",paddingTop:20,marginBottom:18 }}>
          <h1 style={{ fontSize:26,fontWeight:900,letterSpacing:4,margin:0,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d,#00cfff,#ff2d78)",backgroundSize:"300% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 5s ease infinite" }}>
            ⚡ NEONBOARD AI
          </h1>
          <p style={{ color:"rgba(255,255,255,.25)",fontSize:10,marginTop:4,letterSpacing:3 }}>
            BILLBOARDS 3D VIRALES · SIN EDICIÓN
          </p>
        </div>

        {/* ════════════════════════════════════════════
            SHOWCASE — person breaks out of the frame
            Key: billboard has overflow:visible so the
            person image can extend past the border.
            The photo is TALL and anchored to bottom.
        ════════════════════════════════════════════ */}
        <div
          style={{ marginBottom:18, cursor:"pointer", paddingTop:60 /* space for person to break out above */ }}
          onClick={() => setTab("crear")}
        >
          <div style={{ animation: sceneAnim==="in" ? "sceneIn .5s ease forwards" : "sceneOut .45s ease forwards", position:"relative" }}>

            {/* 3D side depths */}
            <div style={{ position:"absolute",top:6,right:-13,width:13,height:"calc(100% - 12px)",background:`linear-gradient(to right,${scene.accent}45,transparent)`,borderRadius:"0 4px 4px 0",zIndex:0 }} />
            <div style={{ position:"absolute",bottom:-10,left:6,width:"calc(100% - 12px)",height:10,background:`linear-gradient(to bottom,${scene.accent}35,transparent)`,borderRadius:"0 0 4px 4px",zIndex:0 }} />

            {/* ── BILLBOARD — overflow:visible so person pops out ── */}
            <div
              className="scanlines"
              style={{
                position:"relative",
                borderRadius:16,
                overflow:"visible",   /* ← KEY: lets person break outside */
                aspectRatio:"4/5",
                border:`5px solid ${scene.accent}`,
                boxShadow:`0 0 45px ${scene.accent}66,0 0 90px ${scene.accent}33`,
              }}
            >
              {/* Background photo — clipped inside */}
              <div style={{ position:"absolute",inset:0,borderRadius:12,overflow:"hidden",zIndex:0 }}>
                <img src={scene.bg} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                {/* Gradient: lighter top (person area), darker bottom (text area) */}
                <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.2) 45%,rgba(0,0,0,.75) 100%)" }} />
              </div>

              <div className="sweep" style={{ zIndex:7,borderRadius:12 }} />

              {/* Brand tag */}
              <div style={{ position:"absolute",top:"4%",left:"5%",zIndex:8,background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",borderRadius:8,padding:"4px 10px",fontSize:9,fontWeight:900,color:scene.accent,letterSpacing:4 }}>
                {scene.brand}
              </div>

              {/* Slogan */}
              <div className="slogan-p" style={{ "--ac":scene.accent,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:8,textAlign:"center" }}>
                <p style={{ margin:0,fontSize:15,fontWeight:900,color:"#fff",letterSpacing:2,lineHeight:1.3,textShadow:"0 2px 14px rgba(0,0,0,.95)" }}>
                  {scene.slogan}
                </p>
              </div>

              {/* Ground shadow — synced with float */}
              <div
                className="shadow-sync"
                style={{ position:"absolute",bottom:"20%",left:"50%",width:"52%",height:"4%",background:"radial-gradient(ellipse,rgba(0,0,0,.8) 0%,transparent 70%)",zIndex:5,borderRadius:"50%",pointerEvents:"none" }}
              />

              {/* ── PERSON — tall, anchored to bottom, breaks OUT the top ──
                  bottom: positions feet inside billboard
                  height: 160% so head extends well above the border
                  left+transform: centers horizontally
                  overflow:visible on parent lets it show above the border
              ── */}
              <img
                src={scene.person}
                alt="person"
                className="person-float"
                style={{
                  position:"absolute",
                  bottom:"14%",
                  left:"50%",
                  width:"82%",
                  height:"auto",
                  maxHeight:"135%",
                  zIndex:9,
                  objectFit:"contain",
                  display:"block",
                  filter:"drop-shadow(0 22px 18px rgba(0,0,0,.95)) drop-shadow(0 5px 8px rgba(0,0,0,.65))",
                }}
                onError={e => { e.target.style.display="none"; }}
              />
            </div>
          </div>

          {/* Scene dots */}
          <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:14 }}>
            {SHOWCASE_SCENES.map((_,i) => (
              <div
                key={i}
                onClick={e => { e.stopPropagation(); setSceneIdx(i); }}
                style={{ width:i===sceneIdx?24:7,height:7,borderRadius:4,background:i===sceneIdx?scene.accent:"rgba(255,255,255,.15)",transition:"all .3s",cursor:"pointer" }}
              />
            ))}
          </div>

          <p style={{ textAlign:"center",fontSize:9,color:"rgba(255,255,255,.15)",marginTop:8,letterSpacing:2 }}>
            ASÍ QUEDA TU PRODUCTO · TOCÁ PARA CREAR
          </p>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex",gap:5,marginBottom:18 }}>
          {[["crear","🎨 Crear"],["fondos","🖼️ Fondos"],["marco","✨ Marco"]].map(([t,label]) => (
            <button
              key={t} onClick={() => setTab(t)}
              style={{ flex:1,padding:"9px 4px",background:tab===t?"rgba(255,45,120,.18)":"rgba(255,255,255,.04)",border:tab===t?"1px solid rgba(255,45,120,.5)":"1px solid rgba(255,255,255,.07)",borderRadius:10,color:tab===t?"#fff":"rgba(255,255,255,.55)",cursor:"pointer",fontWeight:tab===t?800:400,fontSize:12,transition:"all .2s" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ════════════ CREAR ════════════ */}
        {tab === "crear" && (
          <div>
            {/* Upload */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>01 · FOTO O PRODUCTO</p>
              <div
                onClick={() => fileRef.current.click()}
                style={{ border:"2px dashed rgba(255,45,120,.3)",borderRadius:13,padding:photo?0:28,textAlign:"center",cursor:"pointer",overflow:"hidden",minHeight:80,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,45,120,.65)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,45,120,.3)"}
              >
                {photo
                  ? <div style={{ position:"relative",width:"100%" }}>
                      <img src={photo} alt="preview" style={{ width:"100%",maxHeight:170,objectFit:"cover" }} />
                      <div style={{ position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.8)",padding:"3px 9px",borderRadius:6,fontSize:11 }}>📷 Cambiar</div>
                    </div>
                  : <div>
                      <div style={{ fontSize:38,marginBottom:6 }}>🤳</div>
                      <div style={{ fontSize:12,color:"rgba(255,255,255,.45)" }}>Subí tu foto, persona o producto</div>
                    </div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            {/* Slogan */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>02 · SLOGAN (OPCIONAL)</p>
              <input
                style={{ width:"100%",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:10,padding:"11px 13px",color:"#fff",fontSize:14,outline:"none",transition:"border-color .2s",fontFamily:"inherit" }}
                onFocus={e => e.target.style.borderColor="rgba(255,45,120,.55)"}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,.09)"}
                placeholder='Ej: "Break the frame · Feel the scent"'
                value={slogan} onChange={e => setSlogan(e.target.value)}
              />
            </div>

            {/* Logo */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>03 · LOGO (OPCIONAL)</p>
              <div
                onClick={() => logoRef.current.click()}
                style={{ border:"1px dashed rgba(255,255,255,.12)",borderRadius:10,padding:"11px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,.12)"}
              >
                {brandLogo ? <img src={brandLogo} alt="logo" style={{ width:40,height:40,objectFit:"contain",borderRadius:8 }} /> : <span style={{ fontSize:24 }}>🏷️</span>}
                <span style={{ fontSize:12,color:"rgba(255,255,255,.38)" }}>{brandLogo ? "Logo cargado ✅" : "Subí tu logo de marca"}</span>
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleLogo(e.target.files[0])} />
            </div>

            {/* Fondo actual */}
            <div
              style={{ marginBottom:14,padding:"9px 13px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,display:"flex",alignItems:"center",gap:10,cursor:"pointer" }}
              onClick={() => setTab("fondos")}
            >
              {selectedBgData?.url
                ? <img src={selectedBgData.url} alt={selectedBgData.label} style={{ width:38,height:38,objectFit:"cover",borderRadius:6 }} />
                : <div style={{ width:38,height:38,background:selectedBgData?.color||"#111",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{selectedBgData?.emoji}</div>
              }
              <div>
                <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:2 }}>FONDO ACTUAL</div>
                <div style={{ fontSize:13,fontWeight:700 }}>{selectedBgData?.label}</div>
              </div>
              <div style={{ marginLeft:"auto",padding:"5px 12px",background:"rgba(255,45,120,.12)",border:"1px solid rgba(255,45,120,.3)",borderRadius:8,color:"#ff2d78",fontSize:11,fontWeight:700 }}>
                Cambiar →
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={generate} disabled={loading}
              className={!loading ? "b-pulse" : ""}
              style={{ width:"100%",padding:"17px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:13,color:"#fff",fontSize:15,fontWeight:900,cursor:loading?"not-allowed":"pointer",opacity:loading?.8:1,letterSpacing:1.5,transition:"transform .15s" }}
              onMouseEnter={e => { if(!loading) e.currentTarget.style.transform="scale(1.015)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
            >
              {loading ? `⚡ ${status}  ${Math.round(progress)}%` : "⚡ CREAR MI BILLBOARD"}
            </button>

            {loading && (
              <div style={{ height:3,background:"rgba(255,255,255,.07)",borderRadius:2,marginTop:9 }}>
                <div style={{ height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d)",borderRadius:2,transition:"width .35s" }} />
              </div>
            )}

            {error && (
              <div style={{ marginTop:10,padding:"12px 15px",background:"rgba(255,60,60,.08)",border:"1px solid rgba(255,60,60,.2)",borderRadius:10,fontSize:13,color:"#ff9090" }}>
                ⚠️ {error}
              </div>
            )}

            {/* ════════ RESULTADO 3D ════════ */}
            {personBlob && (
              <div style={{ marginTop:32 }}>
                <p style={{ textAlign:"center",fontSize:9,color:"rgba(255,255,255,.2)",marginBottom:12,letterSpacing:2 }}>
                  🖱️ MOVÉ EL MOUSE PARA EL EFECTO 3D
                </p>

                {/* 3D tilt wrapper */}
                <div
                  ref={billboardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ perspective:"1000px", marginBottom:90, paddingTop:60 }}
                >
                  <div
                    className="bb-enter"
                    style={{ transform:`perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,transition:"transform .1s ease-out",transformStyle:"preserve-3d",position:"relative" }}
                  >
                    {/* 3D sides */}
                    <div style={{ position:"absolute",top:5,right:-13,width:13,height:"calc(100% - 10px)",background:`linear-gradient(to right,${accentColor}50,transparent)`,borderRadius:"0 4px 4px 0" }} />
                    <div style={{ position:"absolute",bottom:-10,left:5,width:"calc(100% - 10px)",height:10,background:`linear-gradient(to bottom,${accentColor}40,transparent)`,borderRadius:"0 0 4px 4px" }} />

                    {/* Billboard with overflow:visible so person breaks out */}
                    <div
                      className={`scanlines glow-${frame==="neon"?"neon":frame==="gold"?"gold":frame==="future"?"future":"neon"}`}
                      style={{ position:"relative",borderRadius:16,overflow:"visible",...frameStyle,aspectRatio:"4/5" }}
                    >
                      {/* Bg inside a clipped div */}
                      <div style={{ position:"absolute",inset:0,borderRadius:12,overflow:"hidden",zIndex:0 }}>
                        {selectedBgData?.color
                          ? <div style={{ width:"100%",height:"100%",background:selectedBgData.color }} />
                          : <img src={selectedBgData?.url} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                        }
                        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.7) 100%)" }} />
                      </div>

                      <div className="sweep" />

                      {/* Slogan */}
                      {slogan && (
                        <div className="slogan-p" style={{ "--ac":accentColor,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:8,textAlign:"center" }}>
                          <p style={{ margin:0,fontSize:13,fontWeight:900,color:"#fff",letterSpacing:1.5,lineHeight:1.35,textShadow:`0 2px 16px rgba(0,0,0,.95),0 0 28px ${accentColor}77` }}>
                            {slogan}
                          </p>
                        </div>
                      )}

                      {/* Logo */}
                      {brandLogo && (
                        <img src={brandLogo} alt="logo" style={{ position:"absolute",top:"4%",right:"4%",width:"14%",zIndex:8,borderRadius:8,objectFit:"contain",filter:"drop-shadow(0 2px 8px rgba(0,0,0,.8))" }} />
                      )}

                      {/* Shadow */}
                      <div
                        className="shadow-sync"
                        style={{ position:"absolute",bottom:"-4%",left:"50%",width:"55%",height:"4%",background:"radial-gradient(ellipse,rgba(0,0,0,.88) 0%,transparent 70%)",zIndex:5,borderRadius:"50%",pointerEvents:"none" }}
                      />

                      {/* ── PERSON / PRODUCT ──
                          Centered in billboard.
                          Width-based so any image (tall person OR square product) fits.
                          bottom:5% keeps it above slogan.
                          overflow:visible on parent lets it break the top border.
                      ── */}
                      <img
                        src={personBlob}
                        alt="persona"
                        className="person-entry"
                        style={{
                          position:"absolute",
                          bottom:"12%",
                          left:"50%",
                          /* Width fills most of the frame; height auto → natural proportions */
                          width:"85%",
                          height:"auto",
                          maxHeight:"130%",  /* allows breaking out the top */
                          zIndex:9,
                          objectFit:"contain",
                          transformOrigin:"bottom center",
                          filter:"drop-shadow(0 20px 18px rgba(0,0,0,.95)) drop-shadow(0 5px 8px rgba(0,0,0,.7))",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Download / Reset */}
                <div style={{ display:"flex",gap:8 }}>
                  <button
                    onClick={() => { const a=document.createElement("a"); a.href=personBlob; a.download=`neonboard-${Date.now()}.png`; a.click(); }}
                    style={{ flex:2,padding:"13px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer" }}
                  >
                    ⬇️ Descargar
                  </button>
                  <button
                    onClick={() => { setPersonBlob(null); setPhoto(null); setPhotoFile(null); setPhotoUrl(null); }}
                    style={{ flex:1,padding:"13px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,color:"rgba(255,255,255,.65)",fontSize:13,cursor:"pointer" }}
                  >
                    🔄 Nuevo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════ FONDOS ════════════ */}
        {tab === "fondos" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginBottom:12 }}>
              Tocá para previsualizar → después confirmá
            </p>

            {/* Large preview */}
            <div style={{ borderRadius:13,overflow:"hidden",height:140,marginBottom:13,border:"2px solid rgba(255,45,120,.4)",position:"relative" }}>
              {previewBgData?.url
                ? <img src={previewBgData.url} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                : <div style={{ width:"100%",height:"100%",background:previewBgData?.color||"#111",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48 }}>{previewBgData?.emoji}</div>
              }
              <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"30px 12px 10px",background:"linear-gradient(transparent,rgba(0,0,0,.8))",fontWeight:700,fontSize:14 }}>
                {previewBgData?.emoji} {previewBgData?.label}
              </div>
            </div>

            {/* Grid — only previews, does NOT close tab */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:14 }}>
              {BACKGROUNDS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setPreviewBg(b.id)}   /* ← ONLY sets preview, stays in fondos */
                  style={{
                    position:"relative",height:58,padding:0,borderRadius:10,cursor:"pointer",overflow:"hidden",
                    border: previewBg===b.id ? "2px solid #ff2d78" : "2px solid rgba(255,255,255,.07)",
                    background: b.url
                      ? `linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.5)),url(${b.url}) center/cover`
                      : b.color||"#111",
                    boxShadow: previewBg===b.id ? "0 0 12px rgba(255,45,120,.5)" : "none",
                    transition:"all .15s",
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,color:"#fff",
                  }}
                >
                  {previewBg===b.id && (
                    <div style={{ position:"absolute",top:2,right:2,width:14,height:14,background:"#ff2d78",borderRadius:"50%",fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900 }}>✓</div>
                  )}
                  <span style={{ fontSize:18 }}>{b.emoji}</span>
                  <span style={{ fontSize:8,fontWeight:600,textShadow:"0 1px 4px rgba(0,0,0,.9)",textAlign:"center",padding:"0 2px",lineHeight:1.2 }}>{b.label}</span>
                </button>
              ))}
            </div>

            {/* Confirm button — applies and goes back */}
            <button
              onClick={() => { setBg(previewBg); setTab("crear"); }}
              style={{ width:"100%",padding:"14px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",letterSpacing:1 }}
            >
              ✅ Usar: {previewBgData?.emoji} {previewBgData?.label}
            </button>
          </div>
        )}

        {/* ════════════ MARCO ════════════ */}
        {tab === "marco" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginBottom:14 }}>Elegí el estilo del borde</p>
            <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
              {FRAMES.map(f => (
                <button
                  key={f.id}
                  onClick={() => { setFrame(f.id); setTab("crear"); }}
                  style={{ padding:"14px 18px",background:frame===f.id?"rgba(255,45,120,.1)":"rgba(255,255,255,.03)",border:frame===f.id?`2px solid ${f.accent}aa`:"2px solid rgba(255,255,255,.06)",borderRadius:12,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",gap:12,transition:"all .2s",boxShadow:frame===f.id?`0 0 16px ${f.accent}40`:"none",textAlign:"left" }}
                >
                  <span style={{ fontSize:26 }}>{f.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14,fontWeight:700 }}>{f.label}</div>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,.3)",marginTop:2 }}>
                      {f.id==="neon"    && "Brillos cyan + destello rosa"}
                      {f.id==="gold"    && "Dorado elegante, lujo cálido"}
                      {f.id==="vintage" && "Marrón cinematográfico"}
                      {f.id==="future"  && "Verde neón + halo azul"}
                      {f.id==="minimal" && "Blanco limpio, sin efectos"}
                    </div>
                  </div>
                  {frame===f.id && <span style={{ color:f.accent,fontSize:18 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}"use client";
import { useState, useRef, useCallback, useEffect } from "react";

const REMOVE_BG_KEY = "pBzBsLfZKHNxiiTEvbX4seU2";

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

// Showcase: bg = city background, person = portrait photo
// The trick: person image is displayed LARGE, anchored to bottom-center
// overflow:visible on the wrapper lets it break outside the frame border
const SHOWCASE_SCENES = [
  {
    id: "fashion",
    bg: "https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=900&q=80",
    person: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
    slogan: "OWN THE CITY",
    brand: "URBAN EDGE",
    accent: "#00cfff",
  },
  {
    id: "luxury",
    bg: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=80",
    person: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=600&q=80",
    slogan: "BREAK THE FRAME",
    brand: "NOIR ÉLITE",
    accent: "#FFD700",
  },
  {
    id: "sport",
    bg: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80",
    person: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
    slogan: "PUSH BEYOND",
    brand: "APEX SPORT",
    accent: "#ff4500",
  },
  {
    id: "night",
    bg: "https://images.unsplash.com/photo-1514565131-fce0801e6785?w=900&q=80",
    person: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
    slogan: "DEFINE YOUR WORLD",
    brand: "LUXE NOIR",
    accent: "#c084fc",
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneAnim, setSceneAnim] = useState("in");
  const [previewBg, setPreviewBg] = useState("nyc1");

  const fileRef = useRef(null);
  const logoRef = useRef(null);
  const billboardRef = useRef(null);
  const autoTiltTimer = useRef(null);
  const autoTiltAngle = useRef(0);
  const isMouseOver = useRef(false);

  // Sync preview when opening fondos tab
  useEffect(() => { if (tab === "fondos") setPreviewBg(bg); }, [tab]);

  // Rotate showcase
  useEffect(() => {
    const t = setInterval(() => {
      setSceneAnim("out");
      setTimeout(() => { setSceneIdx(i => (i + 1) % SHOWCASE_SCENES.length); setSceneAnim("in"); }, 500);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Auto tilt for result
  const startAutoTilt = useCallback(() => {
    clearInterval(autoTiltTimer.current);
    autoTiltTimer.current = setInterval(() => {
      if (isMouseOver.current) return;
      autoTiltAngle.current += 0.016;
      setTilt({ x: Math.sin(autoTiltAngle.current * 0.6) * 4, y: Math.sin(autoTiltAngle.current) * 6 });
    }, 16);
  }, []);

  useEffect(() => {
    if (personBlob) startAutoTilt();
    return () => clearInterval(autoTiltTimer.current);
  }, [personBlob, startAutoTilt]);

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
    const pieces = Array.from({ length: 70 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: [accent, "#fff", "#ff9500", "#00cfff", "#ffeb3b"][i % 5],
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
    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST", headers: { "X-Api-Key": REMOVE_BG_KEY }, body: fd
    });
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
  const previewBgData  = BACKGROUNDS.find(b => b.id === previewBg);
  const frameStyle     = FRAME_STYLES[frame] || FRAME_STYLES.neon;
  const accentColor    = FRAMES.find(f => f.id === frame)?.accent || "#00cfff";
  const scene          = SHOWCASE_SCENES[sceneIdx];

  return (
    <div style={{ minHeight:"100vh", background:"#06060f", fontFamily:"'DM Sans',sans-serif", color:"#fff", paddingBottom:60, position:"relative", overflow:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&display=swap');
        * { box-sizing:border-box; }

        @keyframes fall { to { transform:translateY(110vh) rotate(720deg); opacity:0; } }

        @keyframes sceneIn  { from{opacity:0;transform:translateY(16px) scale(.97);} to{opacity:1;transform:translateY(0) scale(1);} }
        @keyframes sceneOut { from{opacity:1;transform:translateY(0) scale(1);}       to{opacity:0;transform:translateY(-14px) scale(.97);} }

        /* Subtle float — barely moves, like breathing */
        @keyframes float {
          0%,100%{ transform:translateX(-50%) translateY(0px) scale(1); }
          50%    { transform:translateX(-50%) translateY(-8px) scale(1.008); }
        }
        @keyframes shadowSync {
          0%,100%{ transform:translateX(-50%) scaleX(1);   opacity:.55; }
          50%    { transform:translateX(-50%) scaleX(.78); opacity:.22; }
        }
        /* Entry: fade up softly */
        @keyframes personIn {
          from{ opacity:0; transform:translateX(-50%) translateY(28px); filter:blur(4px); }
          to  { opacity:1; transform:translateX(-50%) translateY(0);    filter:blur(0);   }
        }
        .person-float { animation: float     5.5s ease-in-out infinite; }
        .shadow-sync  { animation: shadowSync 5.5s ease-in-out infinite; }
        .person-entry {
          animation:
            personIn  .75s cubic-bezier(.22,1,.36,1) forwards,
            float      5.5s ease-in-out .8s infinite;
        }

        /* Glows */
        @keyframes glowCyan  { 0%,100%{box-shadow:0 0 22px #00cfff,0 0 50px rgba(255,45,120,.3);}  50%{box-shadow:0 0 50px #00cfff,0 0 100px rgba(255,45,120,.6);} }
        @keyframes glowGold  { 0%,100%{box-shadow:0 0 20px #FFD700;}                               50%{box-shadow:0 0 60px #FFD700;} }
        @keyframes glowGreen { 0%,100%{box-shadow:0 0 28px #00ff88,0 0 60px rgba(0,136,255,.2);}   50%{box-shadow:0 0 65px #00ff88,0 0 130px rgba(0,136,255,.5);} }
        .glow-neon   { animation:glowCyan  2.5s ease-in-out infinite; }
        .glow-gold   { animation:glowGold  2.5s ease-in-out infinite; }
        .glow-future { animation:glowGreen 2.5s ease-in-out infinite; }

        /* Billboard entrance */
        @keyframes bbIn {
          from{ opacity:0; transform:perspective(900px) rotateX(16deg) scale(.84) translateY(36px); }
          to  { opacity:1; transform:perspective(900px) rotateX(0)     scale(1)   translateY(0);    }
        }
        .bb-enter { animation:bbIn .85s cubic-bezier(.22,1,.36,1) forwards; }

        /* Light sweep */
        @keyframes sweep {
          0%  { transform:translateX(-140%) skewX(-18deg); opacity:0; }
          8%  { opacity:.45; }
          50% { opacity:.15; }
          100%{ transform:translateX(240%) skewX(-18deg); opacity:0; }
        }
        .sweep { position:absolute;top:0;left:0;width:28%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,.12),transparent);animation:sweep 6s ease-in-out infinite;pointer-events:none;z-index:6; }

        /* Scanlines */
        .scanlines::after { content:'';position:absolute;inset:0;border-radius:inherit;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 3px);pointer-events:none;z-index:2; }

        /* Slogan pulse */
        @keyframes sloganP { 0%,100%{opacity:.9;} 50%{opacity:1;text-shadow:0 0 18px var(--ac);} }
        .slogan-p { animation:sloganP 3s ease-in-out infinite; }

        /* Header shimmer */
        @keyframes shimmer { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }

        /* Button pulse */
        @keyframes bpulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,45,120,.4);} 50%{box-shadow:0 0 0 10px rgba(255,45,120,0);} }
        .b-pulse { animation:bpulse 2s ease-in-out infinite; }

        /* Ambient */
        @keyframes drift { 0%,100%{transform:translate(0,0);} 50%{transform:translate(20px,-50px);} }
      `}</style>

      {confetti.map(p => (
        <div key={p.id} style={{ position:"fixed",left:`${p.x}%`,top:"-20px",width:p.size,height:p.size,background:p.color,borderRadius:"3px",zIndex:9999,animation:`fall ${1.4+p.delay}s ease-in forwards` }} />
      ))}

      {/* Ambient orbs */}
      <div style={{ position:"fixed",top:"-20%",left:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(160,80,255,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"drift 14s ease-in-out infinite" }} />
      <div style={{ position:"fixed",bottom:"-20%",right:"-15%",width:"60%",height:"60%",background:"radial-gradient(ellipse,rgba(0,160,255,.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0,animation:"drift 18s ease-in-out 5s infinite" }} />

      <div style={{ maxWidth:480, margin:"0 auto", position:"relative", zIndex:1, padding:"0 16px" }}>

        {/* Header */}
        <div style={{ textAlign:"center",paddingTop:20,marginBottom:18 }}>
          <h1 style={{ fontSize:26,fontWeight:900,letterSpacing:4,margin:0,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d,#00cfff,#ff2d78)",backgroundSize:"300% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 5s ease infinite" }}>
            ⚡ NEONBOARD AI
          </h1>
          <p style={{ color:"rgba(255,255,255,.25)",fontSize:10,marginTop:4,letterSpacing:3 }}>
            BILLBOARDS 3D VIRALES · SIN EDICIÓN
          </p>
        </div>

        {/* ════════════════════════════════════════════
            SHOWCASE — person breaks out of the frame
            Key: billboard has overflow:visible so the
            person image can extend past the border.
            The photo is TALL and anchored to bottom.
        ════════════════════════════════════════════ */}
        <div
          style={{ marginBottom:18, cursor:"pointer", paddingTop:60 /* space for person to break out above */ }}
          onClick={() => setTab("crear")}
        >
          <div style={{ animation: sceneAnim==="in" ? "sceneIn .5s ease forwards" : "sceneOut .45s ease forwards", position:"relative" }}>

            {/* 3D side depths */}
            <div style={{ position:"absolute",top:6,right:-13,width:13,height:"calc(100% - 12px)",background:`linear-gradient(to right,${scene.accent}45,transparent)`,borderRadius:"0 4px 4px 0",zIndex:0 }} />
            <div style={{ position:"absolute",bottom:-10,left:6,width:"calc(100% - 12px)",height:10,background:`linear-gradient(to bottom,${scene.accent}35,transparent)`,borderRadius:"0 0 4px 4px",zIndex:0 }} />

            {/* ── BILLBOARD — overflow:visible so person pops out ── */}
            <div
              className="scanlines"
              style={{
                position:"relative",
                borderRadius:16,
                overflow:"visible",   /* ← KEY: lets person break outside */
                aspectRatio:"4/5",
                border:`5px solid ${scene.accent}`,
                boxShadow:`0 0 45px ${scene.accent}66,0 0 90px ${scene.accent}33`,
              }}
            >
              {/* Background photo — clipped inside */}
              <div style={{ position:"absolute",inset:0,borderRadius:12,overflow:"hidden",zIndex:0 }}>
                <img src={scene.bg} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                {/* Gradient: lighter top (person area), darker bottom (text area) */}
                <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.2) 45%,rgba(0,0,0,.75) 100%)" }} />
              </div>

              <div className="sweep" style={{ zIndex:7,borderRadius:12 }} />

              {/* Brand tag */}
              <div style={{ position:"absolute",top:"4%",left:"5%",zIndex:8,background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",borderRadius:8,padding:"4px 10px",fontSize:9,fontWeight:900,color:scene.accent,letterSpacing:4 }}>
                {scene.brand}
              </div>

              {/* Slogan */}
              <div className="slogan-p" style={{ "--ac":scene.accent,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:8,textAlign:"center" }}>
                <p style={{ margin:0,fontSize:15,fontWeight:900,color:"#fff",letterSpacing:2,lineHeight:1.3,textShadow:"0 2px 14px rgba(0,0,0,.95)" }}>
                  {scene.slogan}
                </p>
              </div>

              {/* Ground shadow — synced with float */}
              <div
                className="shadow-sync"
                style={{ position:"absolute",bottom:"20%",left:"50%",width:"52%",height:"4%",background:"radial-gradient(ellipse,rgba(0,0,0,.8) 0%,transparent 70%)",zIndex:5,borderRadius:"50%",pointerEvents:"none" }}
              />

              {/* ── PERSON — tall, anchored to bottom, breaks OUT the top ──
                  bottom: positions feet inside billboard
                  height: 160% so head extends well above the border
                  left+transform: centers horizontally
                  overflow:visible on parent lets it show above the border
              ── */}
              <img
                src={scene.person}
                alt="person"
                className="person-float"
                style={{
                  position:"absolute",
                  bottom:"14%",
                  left:"50%",
                  width:"82%",
                  height:"auto",
                  maxHeight:"135%",
                  zIndex:9,
                  objectFit:"contain",
                  display:"block",
                  filter:"drop-shadow(0 22px 18px rgba(0,0,0,.95)) drop-shadow(0 5px 8px rgba(0,0,0,.65))",
                }}
                onError={e => { e.target.style.display="none"; }}
              />
            </div>
          </div>

          {/* Scene dots */}
          <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:14 }}>
            {SHOWCASE_SCENES.map((_,i) => (
              <div
                key={i}
                onClick={e => { e.stopPropagation(); setSceneIdx(i); }}
                style={{ width:i===sceneIdx?24:7,height:7,borderRadius:4,background:i===sceneIdx?scene.accent:"rgba(255,255,255,.15)",transition:"all .3s",cursor:"pointer" }}
              />
            ))}
          </div>

          <p style={{ textAlign:"center",fontSize:9,color:"rgba(255,255,255,.15)",marginTop:8,letterSpacing:2 }}>
            ASÍ QUEDA TU PRODUCTO · TOCÁ PARA CREAR
          </p>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex",gap:5,marginBottom:18 }}>
          {[["crear","🎨 Crear"],["fondos","🖼️ Fondos"],["marco","✨ Marco"]].map(([t,label]) => (
            <button
              key={t} onClick={() => setTab(t)}
              style={{ flex:1,padding:"9px 4px",background:tab===t?"rgba(255,45,120,.18)":"rgba(255,255,255,.04)",border:tab===t?"1px solid rgba(255,45,120,.5)":"1px solid rgba(255,255,255,.07)",borderRadius:10,color:tab===t?"#fff":"rgba(255,255,255,.55)",cursor:"pointer",fontWeight:tab===t?800:400,fontSize:12,transition:"all .2s" }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ════════════ CREAR ════════════ */}
        {tab === "crear" && (
          <div>
            {/* Upload */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>01 · FOTO O PRODUCTO</p>
              <div
                onClick={() => fileRef.current.click()}
                style={{ border:"2px dashed rgba(255,45,120,.3)",borderRadius:13,padding:photo?0:28,textAlign:"center",cursor:"pointer",overflow:"hidden",minHeight:80,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,45,120,.65)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,45,120,.3)"}
              >
                {photo
                  ? <div style={{ position:"relative",width:"100%" }}>
                      <img src={photo} alt="preview" style={{ width:"100%",maxHeight:170,objectFit:"cover" }} />
                      <div style={{ position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,.8)",padding:"3px 9px",borderRadius:6,fontSize:11 }}>📷 Cambiar</div>
                    </div>
                  : <div>
                      <div style={{ fontSize:38,marginBottom:6 }}>🤳</div>
                      <div style={{ fontSize:12,color:"rgba(255,255,255,.45)" }}>Subí tu foto, persona o producto</div>
                    </div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            {/* Slogan */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>02 · SLOGAN (OPCIONAL)</p>
              <input
                style={{ width:"100%",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:10,padding:"11px 13px",color:"#fff",fontSize:14,outline:"none",transition:"border-color .2s",fontFamily:"inherit" }}
                onFocus={e => e.target.style.borderColor="rgba(255,45,120,.55)"}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,.09)"}
                placeholder='Ej: "Break the frame · Feel the scent"'
                value={slogan} onChange={e => setSlogan(e.target.value)}
              />
            </div>

            {/* Logo */}
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.85)",marginBottom:7,fontWeight:700 }}>03 · LOGO (OPCIONAL)</p>
              <div
                onClick={() => logoRef.current.click()}
                style={{ border:"1px dashed rgba(255,255,255,.12)",borderRadius:10,padding:"11px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,.12)"}
              >
                {brandLogo ? <img src={brandLogo} alt="logo" style={{ width:40,height:40,objectFit:"contain",borderRadius:8 }} /> : <span style={{ fontSize:24 }}>🏷️</span>}
                <span style={{ fontSize:12,color:"rgba(255,255,255,.38)" }}>{brandLogo ? "Logo cargado ✅" : "Subí tu logo de marca"}</span>
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleLogo(e.target.files[0])} />
            </div>

            {/* Fondo actual */}
            <div
              style={{ marginBottom:14,padding:"9px 13px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,display:"flex",alignItems:"center",gap:10,cursor:"pointer" }}
              onClick={() => setTab("fondos")}
            >
              {selectedBgData?.url
                ? <img src={selectedBgData.url} alt={selectedBgData.label} style={{ width:38,height:38,objectFit:"cover",borderRadius:6 }} />
                : <div style={{ width:38,height:38,background:selectedBgData?.color||"#111",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{selectedBgData?.emoji}</div>
              }
              <div>
                <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:2 }}>FONDO ACTUAL</div>
                <div style={{ fontSize:13,fontWeight:700 }}>{selectedBgData?.label}</div>
              </div>
              <div style={{ marginLeft:"auto",padding:"5px 12px",background:"rgba(255,45,120,.12)",border:"1px solid rgba(255,45,120,.3)",borderRadius:8,color:"#ff2d78",fontSize:11,fontWeight:700 }}>
                Cambiar →
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={generate} disabled={loading}
              className={!loading ? "b-pulse" : ""}
              style={{ width:"100%",padding:"17px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:13,color:"#fff",fontSize:15,fontWeight:900,cursor:loading?"not-allowed":"pointer",opacity:loading?.8:1,letterSpacing:1.5,transition:"transform .15s" }}
              onMouseEnter={e => { if(!loading) e.currentTarget.style.transform="scale(1.015)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
            >
              {loading ? `⚡ ${status}  ${Math.round(progress)}%` : "⚡ CREAR MI BILLBOARD"}
            </button>

            {loading && (
              <div style={{ height:3,background:"rgba(255,255,255,.07)",borderRadius:2,marginTop:9 }}>
                <div style={{ height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d)",borderRadius:2,transition:"width .35s" }} />
              </div>
            )}

            {error && (
              <div style={{ marginTop:10,padding:"12px 15px",background:"rgba(255,60,60,.08)",border:"1px solid rgba(255,60,60,.2)",borderRadius:10,fontSize:13,color:"#ff9090" }}>
                ⚠️ {error}
              </div>
            )}

            {/* ════════ RESULTADO 3D ════════ */}
            {personBlob && (
              <div style={{ marginTop:32 }}>
                <p style={{ textAlign:"center",fontSize:9,color:"rgba(255,255,255,.2)",marginBottom:12,letterSpacing:2 }}>
                  🖱️ MOVÉ EL MOUSE PARA EL EFECTO 3D
                </p>

                {/* 3D tilt wrapper */}
                <div
                  ref={billboardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ perspective:"1000px", marginBottom:90, paddingTop:60 }}
                >
                  <div
                    className="bb-enter"
                    style={{ transform:`perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,transition:"transform .1s ease-out",transformStyle:"preserve-3d",position:"relative" }}
                  >
                    {/* 3D sides */}
                    <div style={{ position:"absolute",top:5,right:-13,width:13,height:"calc(100% - 10px)",background:`linear-gradient(to right,${accentColor}50,transparent)`,borderRadius:"0 4px 4px 0" }} />
                    <div style={{ position:"absolute",bottom:-10,left:5,width:"calc(100% - 10px)",height:10,background:`linear-gradient(to bottom,${accentColor}40,transparent)`,borderRadius:"0 0 4px 4px" }} />

                    {/* Billboard with overflow:visible so person breaks out */}
                    <div
                      className={`scanlines glow-${frame==="neon"?"neon":frame==="gold"?"gold":frame==="future"?"future":"neon"}`}
                      style={{ position:"relative",borderRadius:16,overflow:"visible",...frameStyle,aspectRatio:"4/5" }}
                    >
                      {/* Bg inside a clipped div */}
                      <div style={{ position:"absolute",inset:0,borderRadius:12,overflow:"hidden",zIndex:0 }}>
                        {selectedBgData?.color
                          ? <div style={{ width:"100%",height:"100%",background:selectedBgData.color }} />
                          : <img src={selectedBgData?.url} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                        }
                        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.7) 100%)" }} />
                      </div>

                      <div className="sweep" />

                      {/* Slogan */}
                      {slogan && (
                        <div className="slogan-p" style={{ "--ac":accentColor,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:8,textAlign:"center" }}>
                          <p style={{ margin:0,fontSize:13,fontWeight:900,color:"#fff",letterSpacing:1.5,lineHeight:1.35,textShadow:`0 2px 16px rgba(0,0,0,.95),0 0 28px ${accentColor}77` }}>
                            {slogan}
                          </p>
                        </div>
                      )}

                      {/* Logo */}
                      {brandLogo && (
                        <img src={brandLogo} alt="logo" style={{ position:"absolute",top:"4%",right:"4%",width:"14%",zIndex:8,borderRadius:8,objectFit:"contain",filter:"drop-shadow(0 2px 8px rgba(0,0,0,.8))" }} />
                      )}

                      {/* Shadow */}
                      <div
                        className="shadow-sync"
                        style={{ position:"absolute",bottom:"-4%",left:"50%",width:"55%",height:"4%",background:"radial-gradient(ellipse,rgba(0,0,0,.88) 0%,transparent 70%)",zIndex:5,borderRadius:"50%",pointerEvents:"none" }}
                      />

                      {/* ── PERSON / PRODUCT ──
                          Centered in billboard.
                          Width-based so any image (tall person OR square product) fits.
                          bottom:5% keeps it above slogan.
                          overflow:visible on parent lets it break the top border.
                      ── */}
                      <img
                        src={personBlob}
                        alt="persona"
                        className="person-entry"
                        style={{
                          position:"absolute",
                          bottom:"12%",
                          left:"50%",
                          /* Width fills most of the frame; height auto → natural proportions */
                          width:"85%",
                          height:"auto",
                          maxHeight:"130%",  /* allows breaking out the top */
                          zIndex:9,
                          objectFit:"contain",
                          transformOrigin:"bottom center",
                          filter:"drop-shadow(0 20px 18px rgba(0,0,0,.95)) drop-shadow(0 5px 8px rgba(0,0,0,.7))",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Download / Reset */}
                <div style={{ display:"flex",gap:8 }}>
                  <button
                    onClick={() => { const a=document.createElement("a"); a.href=personBlob; a.download=`neonboard-${Date.now()}.png`; a.click(); }}
                    style={{ flex:2,padding:"13px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer" }}
                  >
                    ⬇️ Descargar
                  </button>
                  <button
                    onClick={() => { setPersonBlob(null); setPhoto(null); setPhotoFile(null); setPhotoUrl(null); }}
                    style={{ flex:1,padding:"13px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,color:"rgba(255,255,255,.65)",fontSize:13,cursor:"pointer" }}
                  >
                    🔄 Nuevo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════ FONDOS ════════════ */}
        {tab === "fondos" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginBottom:12 }}>
              Tocá para previsualizar → después confirmá
            </p>

            {/* Large preview */}
            <div style={{ borderRadius:13,overflow:"hidden",height:140,marginBottom:13,border:"2px solid rgba(255,45,120,.4)",position:"relative" }}>
              {previewBgData?.url
                ? <img src={previewBgData.url} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                : <div style={{ width:"100%",height:"100%",background:previewBgData?.color||"#111",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48 }}>{previewBgData?.emoji}</div>
              }
              <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"30px 12px 10px",background:"linear-gradient(transparent,rgba(0,0,0,.8))",fontWeight:700,fontSize:14 }}>
                {previewBgData?.emoji} {previewBgData?.label}
              </div>
            </div>

            {/* Grid — only previews, does NOT close tab */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:14 }}>
              {BACKGROUNDS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setPreviewBg(b.id)}   /* ← ONLY sets preview, stays in fondos */
                  style={{
                    position:"relative",height:58,padding:0,borderRadius:10,cursor:"pointer",overflow:"hidden",
                    border: previewBg===b.id ? "2px solid #ff2d78" : "2px solid rgba(255,255,255,.07)",
                    background: b.url
                      ? `linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.5)),url(${b.url}) center/cover`
                      : b.color||"#111",
                    boxShadow: previewBg===b.id ? "0 0 12px rgba(255,45,120,.5)" : "none",
                    transition:"all .15s",
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,color:"#fff",
                  }}
                >
                  {previewBg===b.id && (
                    <div style={{ position:"absolute",top:2,right:2,width:14,height:14,background:"#ff2d78",borderRadius:"50%",fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900 }}>✓</div>
                  )}
                  <span style={{ fontSize:18 }}>{b.emoji}</span>
                  <span style={{ fontSize:8,fontWeight:600,textShadow:"0 1px 4px rgba(0,0,0,.9)",textAlign:"center",padding:"0 2px",lineHeight:1.2 }}>{b.label}</span>
                </button>
              ))}
            </div>

            {/* Confirm button — applies and goes back */}
            <button
              onClick={() => { setBg(previewBg); setTab("crear"); }}
              style={{ width:"100%",padding:"14px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",letterSpacing:1 }}
            >
              ✅ Usar: {previewBgData?.emoji} {previewBgData?.label}
            </button>
          </div>
        )}

        {/* ════════════ MARCO ════════════ */}
        {tab === "marco" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.3)",fontSize:11,marginBottom:14 }}>Elegí el estilo del borde</p>
            <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
              {FRAMES.map(f => (
                <button
                  key={f.id}
                  onClick={() => { setFrame(f.id); setTab("crear"); }}
                  style={{ padding:"14px 18px",background:frame===f.id?"rgba(255,45,120,.1)":"rgba(255,255,255,.03)",border:frame===f.id?`2px solid ${f.accent}aa`:"2px solid rgba(255,255,255,.06)",borderRadius:12,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",gap:12,transition:"all .2s",boxShadow:frame===f.id?`0 0 16px ${f.accent}40`:"none",textAlign:"left" }}
                >
                  <span style={{ fontSize:26 }}>{f.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14,fontWeight:700 }}>{f.label}</div>
                    <div style={{ fontSize:11,color:"rgba(255,255,255,.3)",marginTop:2 }}>
                      {f.id==="neon"    && "Brillos cyan + destello rosa"}
                      {f.id==="gold"    && "Dorado elegante, lujo cálido"}
                      {f.id==="vintage" && "Marrón cinematográfico"}
                      {f.id==="future"  && "Verde neón + halo azul"}
                      {f.id==="minimal" && "Blanco limpio, sin efectos"}
                    </div>
                  </div>
                  {frame===f.id && <span style={{ color:f.accent,fontSize:18 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
