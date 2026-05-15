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
  neon:    { border: "5px solid #00cfff",  boxShadow: "0 0 28px #00cfff, 0 0 55px rgba(255,45,120,0.35)" },
  gold:    { border: "8px solid #FFD700",  boxShadow: "0 0 28px #FFD700, 0 0 55px rgba(255,215,0,0.25)" },
  vintage: { border: "7px solid #8B4513",  boxShadow: "0 0 0 3px #D2691E, 0 0 0 7px #8B4513" },
  future:  { border: "4px solid #00ff88",  boxShadow: "0 0 35px #00ff88, 0 0 70px rgba(0,136,255,0.25)" },
  minimal: { border: "2px solid rgba(255,255,255,0.7)", boxShadow: "0 4px 36px rgba(0,0,0,0.5)" },
};

// Showcase: bg (city) + person layered on top
// Person is NOT transparent — we fake depth with scale + shadow
const SHOWCASE_SCENES = [
  {
    bg: "https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=900",
    person: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500",
    slogan: "OWN THE CITY",
    brand: "URBAN EDGE",
    accent: "#00cfff",
  },
  {
    bg: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900",
    person: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=500",
    slogan: "BREAK THE FRAME",
    brand: "NOIR ÉLITE",
    accent: "#FFD700",
  },
  {
    bg: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900",
    person: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500",
    slogan: "PUSH BEYOND",
    brand: "APEX SPORT",
    accent: "#ff4500",
  },
  {
    bg: "https://images.unsplash.com/photo-1514565131-fce0801e6785?w=900",
    person: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500",
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
  const [sceneVis, setSceneVis] = useState(true);
  const [previewBg, setPreviewBg] = useState("nyc1");

  const fileRef = useRef(null);
  const logoRef = useRef(null);
  const billboardRef = useRef(null);
  const autoTiltTimer = useRef(null);
  const autoTiltAngle = useRef(0);
  const isMouseOver = useRef(false);

  useEffect(() => { if (tab === "fondos") setPreviewBg(bg); }, [tab]);

  // Rotate showcase
  useEffect(() => {
    const t = setInterval(() => {
      setSceneVis(false);
      setTimeout(() => { setSceneIdx(i => (i + 1) % SHOWCASE_SCENES.length); setSceneVis(true); }, 450);
    }, 4800);
    return () => clearInterval(t);
  }, []);

  // Auto tilt for result billboard
  const startAutoTilt = useCallback(() => {
    clearInterval(autoTiltTimer.current);
    autoTiltTimer.current = setInterval(() => {
      if (isMouseOver.current) return;
      autoTiltAngle.current += 0.014;
      setTilt({
        x: Math.sin(autoTiltAngle.current * 0.55) * 3.5,
        y: Math.sin(autoTiltAngle.current) * 5,
      });
    }, 16);
  }, []);

  useEffect(() => {
    if (personBlob) startAutoTilt();
    return () => clearInterval(autoTiltTimer.current);
  }, [personBlob, startAutoTilt]);

  const handleMouseMove = useCallback((e) => {
    if (!billboardRef.current) return;
    isMouseOver.current = true;
    const r = billboardRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * -9,
      y: ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 9,
    });
  }, []);
  const handleMouseLeave = useCallback(() => { isMouseOver.current = false; }, []);

  const launchConfetti = (accent) => {
    const c = Array.from({ length: 60 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: [accent, "#fff", "#ff9500", "#00cfff", "#ffeb3b"][i % 5],
      size: Math.random() * 9 + 4, delay: Math.random() * 1.8,
    }));
    setConfetti(c);
    setTimeout(() => setConfetti([]), 2800);
  };

  const handleFile = useCallback((file) => {
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    setPhotoFile(file); setPhotoUrl(null);
    setPersonBlob(null); setError(null);
  }, []);

  const handleLogo = useCallback((file) => { if (file) setBrandLogo(URL.createObjectURL(file)); }, []);

  const removeBg = async () => {
    const fd = new FormData();
    if (photoFile) fd.append("image_file", photoFile);
    else if (photoUrl) fd.append("image_url", photoUrl);
    else throw new Error("No hay imagen");
    fd.append("size", "auto");
    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST", headers: { "X-Api-Key": REMOVE_BG_KEY }, body: fd,
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

  const selBg     = BACKGROUNDS.find(b => b.id === bg);
  const prevBgD   = BACKGROUNDS.find(b => b.id === previewBg);
  const fStyle    = FRAME_STYLES[frame] || FRAME_STYLES.neon;
  const accent    = FRAMES.find(f => f.id === frame)?.accent || "#00cfff";
  const scene     = SHOWCASE_SCENES[sceneIdx];

  return (
    <div style={{ minHeight:"100vh", background:"#06060f", fontFamily:"'DM Sans',sans-serif", color:"#fff", paddingBottom:60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;900&display=swap');
        *{box-sizing:border-box;}

        @keyframes fall{to{transform:translateY(110vh) rotate(720deg);opacity:0;}}

        @keyframes fadeIn  {from{opacity:0;transform:scale(.96);}to{opacity:1;transform:scale(1);}}
        @keyframes fadeOut {from{opacity:1;transform:scale(1);}to{opacity:0;transform:scale(.96);}}

        /* Subtle float — 7px only */
        @keyframes float {
          0%,100%{transform:translateX(-50%) translateY(0);}
          50%    {transform:translateX(-50%) translateY(-7px);}
        }
        @keyframes shadowF{
          0%,100%{transform:translateX(-50%) scaleX(1);opacity:.55;}
          50%    {transform:translateX(-50%) scaleX(.8);opacity:.2;}
        }
        @keyframes personIn{
          from{opacity:0;transform:translateX(-50%) translateY(20px);filter:blur(3px);}
          to  {opacity:1;transform:translateX(-50%) translateY(0);filter:blur(0);}
        }
        .p-float{animation:float 6s ease-in-out infinite;}
        .p-shadow{animation:shadowF 6s ease-in-out infinite;}
        .p-entry{
          animation:
            personIn .7s cubic-bezier(.22,1,.36,1) forwards,
            float 6s ease-in-out .75s infinite;
        }

        /* Glows */
        @keyframes gneon {0%,100%{box-shadow:0 0 22px #00cfff,0 0 50px rgba(255,45,120,.3);}50%{box-shadow:0 0 50px #00cfff,0 0 90px rgba(255,45,120,.6);}}
        @keyframes ggold {0%,100%{box-shadow:0 0 20px #FFD700;}50%{box-shadow:0 0 55px #FFD700;}}
        @keyframes gfut  {0%,100%{box-shadow:0 0 26px #00ff88,0 0 55px rgba(0,136,255,.2);}50%{box-shadow:0 0 60px #00ff88,0 0 120px rgba(0,136,255,.45);}}
        .glow-neon  {animation:gneon 2.5s ease-in-out infinite;}
        .glow-gold  {animation:ggold 2.5s ease-in-out infinite;}
        .glow-future{animation:gfut  2.5s ease-in-out infinite;}

        @keyframes bbIn{
          from{opacity:0;transform:perspective(900px) rotateX(14deg) scale(.85) translateY(32px);}
          to  {opacity:1;transform:perspective(900px) rotateX(0) scale(1) translateY(0);}
        }
        .bb-enter{animation:bbIn .8s cubic-bezier(.22,1,.36,1) forwards;}

        @keyframes sweep{
          0%{transform:translateX(-140%) skewX(-18deg);opacity:0;}
          8%{opacity:.4;}50%{opacity:.14;}
          100%{transform:translateX(240%) skewX(-18deg);opacity:0;}
        }
        .sweep{position:absolute;top:0;left:0;width:28%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,.11),transparent);animation:sweep 6s ease-in-out infinite;pointer-events:none;z-index:6;}

        @keyframes sloganP{0%,100%{opacity:.9;}50%{opacity:1;text-shadow:0 0 16px var(--ac);}}
        .sp{animation:sloganP 3s ease-in-out infinite;}

        @keyframes shimmer{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
        @keyframes bpulse{0%,100%{box-shadow:0 0 0 0 rgba(255,45,120,.4);}50%{box-shadow:0 0 0 10px rgba(255,45,120,0);}}
        .bpulse{animation:bpulse 2s ease-in-out infinite;}
      `}</style>

      {confetti.map(p => (
        <div key={p.id} style={{ position:"fixed",left:`${p.x}%`,top:"-20px",width:p.size,height:p.size,background:p.color,borderRadius:"3px",zIndex:9999,animation:`fall ${1.3+p.delay}s ease-in forwards` }} />
      ))}

      <div style={{ maxWidth:460, margin:"0 auto", padding:"0 16px" }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign:"center",paddingTop:18,marginBottom:16 }}>
          <h1 style={{ fontSize:24,fontWeight:900,letterSpacing:4,margin:0,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d,#00cfff,#ff2d78)",backgroundSize:"300% 100%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 5s ease infinite" }}>
            ⚡ NEONBOARD AI
          </h1>
          <p style={{ color:"rgba(255,255,255,.22)",fontSize:9,marginTop:3,letterSpacing:3 }}>BILLBOARDS 3D VIRALES · SIN EDICIÓN</p>
        </div>

        {/* ════════════════════════════════════════
            SHOWCASE
            Layout: billboard box with bg photo inside.
            Person photo layered on top, tall, centered.
            No "transparent" tricks — honest layering.
            The RESULT (after generate) is the real deal.
        ════════════════════════════════════════ */}
        <div style={{ marginBottom:16, cursor:"pointer" }} onClick={() => setTab("crear")}>
          <div style={{ animation: sceneVis ? "fadeIn .45s ease forwards" : "fadeOut .4s ease forwards" }}>

            {/* Billboard wrapper — position relative, overflow VISIBLE */}
            <div style={{ position:"relative" }}>

              {/* 3D depth shadows */}
              <div style={{ position:"absolute",top:5,right:-12,width:12,height:"calc(100% - 10px)",background:`linear-gradient(to right,${scene.accent}40,transparent)`,borderRadius:"0 4px 4px 0",zIndex:0 }} />
              <div style={{ position:"absolute",bottom:-9,left:5,width:"calc(100% - 10px)",height:9,background:`linear-gradient(to bottom,${scene.accent}30,transparent)`,borderRadius:"0 0 4px 4px",zIndex:0 }} />

              {/* ── BILLBOARD overflow:visible → person breaks out top ── */}
              <div style={{ position:"relative", borderRadius:15, overflow:"visible", aspectRatio:"4/5", border:`5px solid ${scene.accent}`, boxShadow:`0 0 40px ${scene.accent}55,0 0 80px ${scene.accent}28` }}>
                {/* BG clipped inside its own div */}
                <div style={{ position:"absolute",inset:0,borderRadius:11,overflow:"hidden",zIndex:0 }}>
                  <img src={scene.bg} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                  <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.02) 0%,rgba(0,0,0,.18) 48%,rgba(0,0,0,.85) 100%)" }} />
                </div>
                <div className="sweep" />
                {/* Brand */}
                <div style={{ position:"absolute",top:"4%",left:"5%",zIndex:7,background:"rgba(0,0,0,.58)",backdropFilter:"blur(6px)",borderRadius:7,padding:"4px 9px",fontSize:9,fontWeight:900,color:scene.accent,letterSpacing:4 }}>{scene.brand}</div>
                {/* Slogan */}
                <div className="sp" style={{ "--ac":scene.accent,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:7,textAlign:"center" }}>
                  <p style={{ margin:0,fontSize:14,fontWeight:900,color:"#fff",letterSpacing:2,lineHeight:1.3,textShadow:"0 2px 12px rgba(0,0,0,.95)" }}>{scene.slogan}</p>
                </div>
                {/* Shadow synced with float */}
                <div className="p-shadow" style={{ position:"absolute",bottom:"-4%",left:"50%",width:"52%",height:"4%",background:"radial-gradient(ellipse,rgba(0,0,0,.82) 0%,transparent 70%)",zIndex:5,borderRadius:"50%",pointerEvents:"none" }} />
                {/* PERSON — height>100% breaks above border */}
                <img
                  src={scene.person} alt="person" className="p-float"
                  style={{ position:"absolute", bottom:"12%", left:"50%", transform:"translateX(-50%)", height:"148%", width:"auto", maxWidth:"88%", objectFit:"cover", objectPosition:"top center", zIndex:9, filter:"drop-shadow(0 22px 18px rgba(0,0,0,.95)) drop-shadow(0 5px 8px rgba(0,0,0,.7))" }}
                  onError={e=>{e.target.style.display="none";}}
                />
              </div>
            </div>
          </div>

          {/* Dots */}
          <div style={{ display:"flex",justifyContent:"center",gap:7,marginTop:11 }}>
            {SHOWCASE_SCENES.map((_,i) => (
              <div key={i} onClick={e=>{e.stopPropagation();setSceneIdx(i);}} style={{ width:i===sceneIdx?22:7,height:7,borderRadius:3,background:i===sceneIdx?scene.accent:"rgba(255,255,255,.14)",transition:"all .3s",cursor:"pointer" }} />
            ))}
          </div>
          <p style={{ textAlign:"center",fontSize:9,color:"rgba(255,255,255,.13)",marginTop:7,letterSpacing:2 }}>
            SUBÍ TU FOTO Y CREÁ TU PROPIO BILLBOARD
          </p>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex",gap:5,marginBottom:16 }}>
          {[["crear","🎨 Crear"],["fondos","🖼️ Fondos"],["marco","✨ Marco"]].map(([t,l]) => (
            <button key={t} onClick={()=>setTab(t)} style={{ flex:1,padding:"9px 4px",background:tab===t?"rgba(255,45,120,.17)":"rgba(255,255,255,.04)",border:tab===t?"1px solid rgba(255,45,120,.48)":"1px solid rgba(255,255,255,.07)",borderRadius:9,color:tab===t?"#fff":"rgba(255,255,255,.5)",cursor:"pointer",fontWeight:tab===t?800:400,fontSize:12,transition:"all .2s" }}>
              {l}
            </button>
          ))}
        </div>

        {/* ════════════ CREAR ════════════ */}
        {tab === "crear" && (
          <div>
            {/* Upload */}
            <div style={{ marginBottom:13 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.8)",marginBottom:6,fontWeight:700 }}>01 · FOTO O PRODUCTO</p>
              <div
                onClick={()=>fileRef.current.click()}
                style={{ border:"2px dashed rgba(255,45,120,.28)",borderRadius:12,padding:photo?0:26,textAlign:"center",cursor:"pointer",overflow:"hidden",minHeight:78,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,45,120,.6)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,45,120,.28)"}
              >
                {photo
                  ? <div style={{ position:"relative",width:"100%" }}>
                      <img src={photo} alt="preview" style={{ width:"100%",maxHeight:160,objectFit:"cover" }} />
                      <div style={{ position:"absolute",bottom:7,right:7,background:"rgba(0,0,0,.8)",padding:"3px 8px",borderRadius:5,fontSize:10 }}>📷 Cambiar</div>
                    </div>
                  : <div>
                      <div style={{ fontSize:34,marginBottom:5 }}>🤳</div>
                      <div style={{ fontSize:12,color:"rgba(255,255,255,.4)" }}>Subí tu foto, persona o producto</div>
                      <div style={{ fontSize:10,color:"rgba(255,255,255,.2)",marginTop:3 }}>JPG · PNG · WEBP</div>
                    </div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
            </div>

            {/* Slogan */}
            <div style={{ marginBottom:13 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.8)",marginBottom:6,fontWeight:700 }}>02 · SLOGAN (OPCIONAL)</p>
              <input
                style={{ width:"100%",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:9,padding:"10px 12px",color:"#fff",fontSize:14,outline:"none",transition:"border-color .2s",fontFamily:"inherit" }}
                onFocus={e=>e.target.style.borderColor="rgba(255,45,120,.5)"}
                onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}
                placeholder='"Break the frame · Feel the scent"'
                value={slogan} onChange={e=>setSlogan(e.target.value)}
              />
            </div>

            {/* Logo */}
            <div style={{ marginBottom:13 }}>
              <p style={{ fontSize:9,letterSpacing:3,color:"rgba(255,45,120,.8)",marginBottom:6,fontWeight:700 }}>03 · LOGO (OPCIONAL)</p>
              <div
                onClick={()=>logoRef.current.click()}
                style={{ border:"1px dashed rgba(255,255,255,.1)",borderRadius:9,padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:9,transition:"border-color .2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.28)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.1)"}
              >
                {brandLogo ? <img src={brandLogo} alt="logo" style={{ width:38,height:38,objectFit:"contain",borderRadius:7 }} /> : <span style={{ fontSize:22 }}>🏷️</span>}
                <span style={{ fontSize:12,color:"rgba(255,255,255,.35)" }}>{brandLogo?"Logo cargado ✅":"Subí tu logo de marca"}</span>
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleLogo(e.target.files[0])} />
            </div>

            {/* Current bg */}
            <div
              style={{ marginBottom:13,padding:"8px 12px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:9,display:"flex",alignItems:"center",gap:9,cursor:"pointer" }}
              onClick={()=>setTab("fondos")}
            >
              {selBg?.url
                ? <img src={selBg.url} alt="" style={{ width:36,height:36,objectFit:"cover",borderRadius:5 }} />
                : <div style={{ width:36,height:36,background:selBg?.color||"#111",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{selBg?.emoji}</div>}
              <div>
                <div style={{ fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:2 }}>FONDO</div>
                <div style={{ fontSize:12,fontWeight:700 }}>{selBg?.label}</div>
              </div>
              <div style={{ marginLeft:"auto",padding:"4px 10px",background:"rgba(255,45,120,.1)",border:"1px solid rgba(255,45,120,.28)",borderRadius:7,color:"#ff2d78",fontSize:10,fontWeight:700 }}>
                Cambiar →
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={generate} disabled={loading}
              className={!loading?"bpulse":""}
              style={{ width:"100%",padding:"16px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:12,color:"#fff",fontSize:15,fontWeight:900,cursor:loading?"not-allowed":"pointer",opacity:loading?.8:1,letterSpacing:1.5,transition:"transform .15s" }}
              onMouseEnter={e=>{if(!loading)e.currentTarget.style.transform="scale(1.012)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}
            >
              {loading?`⚡ ${status}  ${Math.round(progress)}%`:"⚡ CREAR MI BILLBOARD"}
            </button>

            {loading && (
              <div style={{ height:3,background:"rgba(255,255,255,.07)",borderRadius:2,marginTop:8 }}>
                <div style={{ height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#ff2d78,#ff9500,#ffe66d)",borderRadius:2,transition:"width .35s" }} />
              </div>
            )}
            {error && (
              <div style={{ marginTop:10,padding:"11px 14px",background:"rgba(255,55,55,.07)",border:"1px solid rgba(255,55,55,.18)",borderRadius:9,fontSize:13,color:"#ff9090" }}>
                ⚠️ {error}
              </div>
            )}

            {/* ════════ RESULTADO FINAL ════════
                Aquí SÍ funciona el efecto "salir del marco"
                porque personBlob es un PNG transparente (remove.bg)
            ════════ */}
            {personBlob && (
              <div style={{ marginTop:30 }}>
                <p style={{ textAlign:"center",fontSize:9,color:"rgba(255,255,255,.18)",marginBottom:10,letterSpacing:2 }}>
                  🖱️ MOVÉ EL MOUSE PARA EL EFECTO 3D
                </p>

                <div
                  ref={billboardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ perspective:"900px", marginBottom:80, paddingTop:50 }}
                >
                  <div
                    className="bb-enter"
                    style={{ transform:`perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,transition:"transform .1s ease-out",transformStyle:"preserve-3d",position:"relative" }}
                  >
                    {/* 3D sides */}
                    <div style={{ position:"absolute",top:5,right:-12,width:12,height:"calc(100% - 10px)",background:`linear-gradient(to right,${accent}48,transparent)`,borderRadius:"0 4px 4px 0" }} />
                    <div style={{ position:"absolute",bottom:-9,left:5,width:"calc(100% - 10px)",height:9,background:`linear-gradient(to bottom,${accent}38,transparent)`,borderRadius:"0 0 4px 4px" }} />

                    {/* Billboard — overflow VISIBLE so PNG breaks out */}
                    <div
                      className={`glow-${frame==="neon"?"neon":frame==="gold"?"gold":frame==="future"?"future":"neon"}`}
                      style={{ position:"relative",borderRadius:15,overflow:"visible",...fStyle,aspectRatio:"4/5" }}
                    >
                      {/* Bg clipped inside */}
                      <div style={{ position:"absolute",inset:0,borderRadius:11,overflow:"hidden",zIndex:0 }}>
                        {selBg?.color
                          ? <div style={{ width:"100%",height:"100%",background:selBg.color }} />
                          : <img src={selBg?.url} alt="bg" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                        }
                        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.04) 0%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.72) 100%)" }} />
                      </div>

                      <div className="sweep" />

                      {/* Slogan */}
                      {slogan && (
                        <div className="sp" style={{ "--ac":accent,position:"absolute",bottom:"5%",left:"6%",right:"6%",zIndex:7,textAlign:"center" }}>
                          <p style={{ margin:0,fontSize:12,fontWeight:900,color:"#fff",letterSpacing:1.5,lineHeight:1.35,textShadow:`0 2px 14px rgba(0,0,0,.95),0 0 25px ${accent}66` }}>
                            {slogan}
                          </p>
                        </div>
                      )}

                      {/* Logo */}
                      {brandLogo && (
                        <img src={brandLogo} alt="logo" style={{ position:"absolute",top:"4%",right:"4%",width:"13%",zIndex:8,borderRadius:7,objectFit:"contain",filter:"drop-shadow(0 2px 6px rgba(0,0,0,.8))" }} />
                      )}

                      {/* Shadow — synced with float */}
                      <div className="p-shadow" style={{ position:"absolute",bottom:"-4%",left:"50%",width:"52%",height:"4%",background:"radial-gradient(ellipse,rgba(0,0,0,.85) 0%,transparent 70%)",zIndex:4,borderRadius:"50%",pointerEvents:"none" }} />

                      {/* ── TRANSPARENT PNG — breaks out top of frame ──
                          This is the real 3D effect.
                          PNG has no background → sits on top of city photo.
                          overflow:visible on parent → pops above border.
                          Width-based so any shape (person, product, shoe) fits.
                      ── */}
                      <img
                        src={personBlob}
                        alt="persona"
                        className="p-entry"
                        style={{
                          position:"absolute",
                          /* Anchor to bottom-center of billboard */
                          bottom:"10%",
                          left:"50%",
                          /* Width fills frame; height auto = natural proportions */
                          width:"80%",
                          height:"auto",
                          /* max-height larger than billboard so tall subjects pop out */
                          maxHeight:"145%",
                          zIndex:9,
                          objectFit:"contain",
                          /* Float anchors to bottom */
                          transformOrigin:"bottom center",
                          filter:"drop-shadow(0 18px 16px rgba(0,0,0,.95)) drop-shadow(0 4px 7px rgba(0,0,0,.7))",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display:"flex",gap:7 }}>
                  <button
                    onClick={()=>{const a=document.createElement("a");a.href=personBlob;a.download=`neonboard-${Date.now()}.png`;a.click();}}
                    style={{ flex:2,padding:"13px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:11,color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer" }}
                  >
                    ⬇️ Descargar
                  </button>
                  <button
                    onClick={()=>{setPersonBlob(null);setPhoto(null);setPhotoFile(null);setPhotoUrl(null);}}
                    style={{ flex:1,padding:"13px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.09)",borderRadius:11,color:"rgba(255,255,255,.6)",fontSize:13,cursor:"pointer" }}
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
            <p style={{ color:"rgba(255,255,255,.28)",fontSize:11,marginBottom:11 }}>
              Tocá para previsualizar — después confirmá
            </p>

            {/* Large preview */}
            <div style={{ borderRadius:12,overflow:"hidden",height:135,marginBottom:12,border:"2px solid rgba(255,45,120,.38)",position:"relative" }}>
              {prevBgD?.url
                ? <img src={prevBgD.url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                : <div style={{ width:"100%",height:"100%",background:prevBgD?.color||"#111",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44 }}>{prevBgD?.emoji}</div>
              }
              <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"28px 12px 9px",background:"linear-gradient(transparent,rgba(0,0,0,.82))",fontWeight:700,fontSize:13 }}>
                {prevBgD?.emoji} {prevBgD?.label}
              </div>
            </div>

            {/* Grid — stays in tab */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:13 }}>
              {BACKGROUNDS.map(b => (
                <button
                  key={b.id}
                  onClick={()=>setPreviewBg(b.id)}
                  style={{
                    position:"relative",height:56,padding:0,borderRadius:9,cursor:"pointer",overflow:"hidden",
                    border:previewBg===b.id?"2px solid #ff2d78":"2px solid rgba(255,255,255,.06)",
                    background:b.url
                      ? `linear-gradient(rgba(0,0,0,.18),rgba(0,0,0,.48)),url(${b.url}) center/cover`
                      : b.color||"#111",
                    boxShadow:previewBg===b.id?"0 0 11px rgba(255,45,120,.48)":"none",
                    transition:"all .14s",
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,color:"#fff",
                  }}
                >
                  {previewBg===b.id && (
                    <div style={{ position:"absolute",top:2,right:2,width:13,height:13,background:"#ff2d78",borderRadius:"50%",fontSize:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900 }}>✓</div>
                  )}
                  <span style={{ fontSize:17 }}>{b.emoji}</span>
                  <span style={{ fontSize:7.5,fontWeight:600,textShadow:"0 1px 4px rgba(0,0,0,.9)",textAlign:"center",padding:"0 2px",lineHeight:1.2 }}>{b.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={()=>{setBg(previewBg);setTab("crear");}}
              style={{ width:"100%",padding:"13px",background:"linear-gradient(135deg,#ff2d78,#ff6b00)",border:"none",borderRadius:11,color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",letterSpacing:1 }}
            >
              ✅ Usar: {prevBgD?.emoji} {prevBgD?.label}
            </button>
          </div>
        )}

        {/* ════════════ MARCO ════════════ */}
        {tab === "marco" && (
          <div>
            <p style={{ color:"rgba(255,255,255,.28)",fontSize:11,marginBottom:13 }}>Elegí el estilo del borde</p>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {FRAMES.map(f => (
                <button
                  key={f.id}
                  onClick={()=>{setFrame(f.id);setTab("crear");}}
                  style={{ padding:"13px 16px",background:frame===f.id?"rgba(255,45,120,.1)":"rgba(255,255,255,.03)",border:frame===f.id?`2px solid ${f.accent}99`:"2px solid rgba(255,255,255,.06)",borderRadius:11,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",gap:11,transition:"all .2s",boxShadow:frame===f.id?`0 0 14px ${f.accent}38`:"none",textAlign:"left" }}
                >
                  <span style={{ fontSize:24 }}>{f.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:700 }}>{f.label}</div>
                    <div style={{ fontSize:10,color:"rgba(255,255,255,.28)",marginTop:1 }}>
                      {f.id==="neon"    && "Brillos cyan + destello rosa"}
                      {f.id==="gold"    && "Dorado elegante, lujo cálido"}
                      {f.id==="vintage" && "Marrón cinematográfico"}
                      {f.id==="future"  && "Verde neón + halo azul"}
                      {f.id==="minimal" && "Blanco limpio, sin efectos"}
                    </div>
                  </div>
                  {frame===f.id && <span style={{ color:f.accent,fontSize:16 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
