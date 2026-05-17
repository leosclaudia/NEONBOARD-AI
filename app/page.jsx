"use client";
import { useState, useRef, useCallback, useEffect } from "react";

const REMOVE_BG_KEY = "pBzBsLfZKHNxiiTEvbX4seU2";

const BACKGROUNDS = [
  { id: "nyc",      label: "Times Square", url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800" },
  { id: "tokyo",    label: "Tokyo",        url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800" },
  { id: "night",    label: "NYC Noche",    url: "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800" },
  { id: "city",     label: "Ciudad",       url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800" },
  { id: "beach",    label: "Playa",        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
  { id: "mountain", label: "Montañas",     url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800" },
  { id: "sunset",   label: "Atardecer",    url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800" },
  { id: "stadium",  label: "Estadio",      url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800" },
  { id: "festival", label: "Festival",     url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800" },
  { id: "mall",     label: "Shopping",     url: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800" },
  { id: "black",    label: "Negro",        url: null, color: "#000" },
  { id: "white",    label: "Blanco",       url: null, color: "#fff" },
];

const FRAME_OPTIONS = [
  { id: "cyan",   label: "Neón",     color: "#22d3ee", shadow: "0 0 30px #22d3ee88, 0 0 60px #22d3ee33" },
  { id: "gold",   label: "Dorado",   color: "#f59e0b", shadow: "0 0 30px #f59e0b88, 0 0 60px #f59e0b33" },
  { id: "pink",   label: "Rosa",     color: "#ec4899", shadow: "0 0 30px #ec489988, 0 0 60px #ec489933" },
  { id: "green",  label: "Verde",    color: "#10b981", shadow: "0 0 30px #10b98188, 0 0 60px #10b98133" },
  { id: "white",  label: "Blanco",   color: "#ffffff", shadow: "0 0 20px #ffffff44" },
];

// Showcase: each scene has a real bg + a person photo
// Person breaks out of frame using overflow:visible trick
const SCENES = [
  {
    bg: "https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=900",
    person: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600",
    slogan: "OWN THE CITY",
    brand: "URBAN EDGE",
    frame: "#22d3ee",
  },
  {
    bg: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900",
    person: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=600",
    slogan: "BREAK THE FRAME",
    brand: "NOIR ÉLITE",
    frame: "#f59e0b",
  },
  {
    bg: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900",
    person: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600",
    slogan: "PUSH BEYOND",
    brand: "APEX SPORT",
    frame: "#ec4899",
  },
];

export default function BillboardApp() {
  const [step, setStep] = useState(1); // 1=upload 2=customize 3=result
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [bg, setBg] = useState("nyc");
  const [frameId, setFrameId] = useState("cyan");
  const [slogan, setSlogan] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [personBlob, setPersonBlob] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneVis, setSceneVis] = useState(true);
  const [confetti, setConfetti] = useState([]);
  const [showBgPicker, setShowBgPicker] = useState(false);

  const fileRef = useRef(null);
  const logoRef = useRef(null);
  const boardRef = useRef(null);
  const tiltTimer = useRef(null);
  const tiltAngle = useRef(0);
  const mouseOver = useRef(false);

  // Rotate showcase every 5s
  useEffect(() => {
    const t = setInterval(() => {
      setSceneVis(false);
      setTimeout(() => { setSceneIdx(i => (i + 1) % SCENES.length); setSceneVis(true); }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Auto tilt billboard
  useEffect(() => {
    if (!personBlob) return;
    tiltTimer.current = setInterval(() => {
      if (mouseOver.current) return;
      tiltAngle.current += 0.015;
      setTilt({ x: Math.sin(tiltAngle.current * 0.6) * 3.5, y: Math.sin(tiltAngle.current) * 5 });
    }, 16);
    return () => clearInterval(tiltTimer.current);
  }, [personBlob]);

  const handleMouseMove = useCallback((e) => {
    if (!boardRef.current) return;
    mouseOver.current = true;
    const r = boardRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -8,
      y: ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 8,
    });
  }, []);
  const handleMouseLeave = useCallback(() => { mouseOver.current = false; }, []);

  const handleFile = (file) => {
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    setPhotoFile(file);
    setPersonBlob(null);
    setError(null);
    setStep(2);
  };

  const generate = async () => {
    if (!photoFile && !photo) { setError("Subí una foto primero"); return; }
    setLoading(true); setError(null); setProgress(5);
    const iv = setInterval(() => setProgress(p => Math.min(p + 6, 88)), 400);
    try {
      const fd = new FormData();
      if (photoFile) fd.append("image_file", photoFile);
      fd.append("size", "auto");
      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST", headers: { "X-Api-Key": REMOVE_BG_KEY }, body: fd,
      });
      if (!res.ok) throw new Error("Error al procesar la imagen");
      const blob = await res.blob();
      setPersonBlob(URL.createObjectURL(blob));
      setProgress(100);
      setStep(3);
      // Confetti
      setConfetti(Array.from({ length: 60 }, (_, i) => ({
        id: i, x: Math.random() * 100,
        color: ["#22d3ee","#ec4899","#f59e0b","#fff","#10b981"][i % 5],
        size: Math.random() * 8 + 4, delay: Math.random() * 1.5,
      })));
      setTimeout(() => setConfetti([]), 3000);
    } catch (e) { setError(e.message); }
    finally { clearInterval(iv); setLoading(false); }
  };

  const selBg    = BACKGROUNDS.find(b => b.id === bg);
  const selFrame = FRAME_OPTIONS.find(f => f.id === frameId);
  const scene    = SCENES[sceneIdx];

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", color:"#fff", fontFamily:"'Inter',system-ui,sans-serif", paddingBottom:80 }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}

        @keyframes fall{to{transform:translateY(105vh) rotate(540deg);opacity:0;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes scIn{from{opacity:0;transform:scale(.97);}to{opacity:1;transform:scale(1);}}
        @keyframes scOut{from{opacity:1;}to{opacity:0;transform:scale(.97);}}

        /* Person float */
        @keyframes floatY{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-10px);}}
        @keyframes shadowS{0%,100%{transform:translateX(-50%) scaleX(1);opacity:.5;}50%{transform:translateX(-50%) scaleX(.75);opacity:.18;}}
        @keyframes personIn{from{opacity:0;transform:translateX(-50%) translateY(24px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
        .pfloat{animation:floatY 6s ease-in-out infinite;}
        .pshadow{animation:shadowS 6s ease-in-out infinite;}
        .pentry{animation:personIn .65s cubic-bezier(.22,1,.36,1) forwards,floatY 6s ease-in-out .7s infinite;}

        /* Billboard entrance */
        @keyframes bbIn{from{opacity:0;transform:perspective(800px) rotateX(12deg) scale(.88) translateY(28px);}to{opacity:1;transform:perspective(800px) rotateX(0) scale(1) translateY(0);}}
        .bbenter{animation:bbIn .75s cubic-bezier(.22,1,.36,1) forwards;}

        /* Sweep */
        @keyframes sweep{0%{transform:translateX(-130%) skewX(-16deg);opacity:0;}8%{opacity:.35;}50%{opacity:.12;}100%{transform:translateX(230%) skewX(-16deg);opacity:0;}}
        .sweep{position:absolute;top:0;left:0;width:26%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,.1),transparent);animation:sweep 7s ease-in-out infinite;pointer-events:none;z-index:5;}

        /* Slogan pulse */
        @keyframes sp{0%,100%{opacity:.88;}50%{opacity:1;}}
        .slogp{animation:sp 3s ease-in-out infinite;}

        /* Header */
        @keyframes hsh{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}

        /* CTA pulse */
        @keyframes ctap{0%,100%{box-shadow:0 0 0 0 rgba(236,72,153,.35);}50%{box-shadow:0 0 0 10px rgba(236,72,153,0);}}
        .ctapulse{animation:ctap 2s ease-in-out infinite;}

        /* Step indicator */
        .step-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.2);transition:all .3s;}
        .step-dot.active{background:#ec4899;width:22px;border-radius:4px;}

        /* Upload zone */
        .upload-zone{border:2px dashed rgba(255,255,255,.15);border-radius:16px;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;padding:36px 20px;}
        .upload-zone:hover{border-color:rgba(236,72,153,.5);background:rgba(236,72,153,.04);}

        /* Pills */
        .pill{padding:7px 14px;border-radius:100px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);cursor:pointer;font-size:12px;font-weight:500;color:rgba(255,255,255,.6);transition:all .2s;white-space:nowrap;}
        .pill.active{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.3);color:#fff;}
        .pill:hover{border-color:rgba(255,255,255,.25);color:rgba(255,255,255,.85);}

        /* Frame dot */
        .fdot{width:36px;height:36px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:all .2s;position:relative;}
        .fdot.active::after{content:'';position:absolute;inset:-5px;border-radius:50%;border:2px solid #fff;}

        /* Bg thumb */
        .bgt{border-radius:10px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .15s;aspect-ratio:16/9;position:relative;}
        .bgt.active{border-color:#ec4899;box-shadow:0 0 12px rgba(236,72,153,.4);}
        .bgt:hover{border-color:rgba(255,255,255,.3);}

        /* Input */
        .txt-input{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:13px 16px;color:#fff;font-size:15px;font-family:inherit;outline:none;transition:border-color .2s;}
        .txt-input:focus{border-color:rgba(236,72,153,.5);}
        .txt-input::placeholder{color:rgba(255,255,255,.3);}

        /* Primary button */
        .btn-primary{width:100%;padding:17px;background:linear-gradient(135deg,#ec4899,#f97316);border:none;border-radius:14px;color:#fff;font-size:16px;font-weight:700;cursor:pointer;letter-spacing:.5px;transition:transform .15s,opacity .15s;font-family:inherit;}
        .btn-primary:hover:not(:disabled){transform:scale(1.015);}
        .btn-primary:disabled{opacity:.7;cursor:not-allowed;}

        /* Secondary button */
        .btn-sec{padding:13px 20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:rgba(255,255,255,.7);font-size:14px;cursor:pointer;font-family:inherit;transition:all .2s;}
        .btn-sec:hover{background:rgba(255,255,255,.1);color:#fff;}

        /* Progress bar */
        .pbar{height:3px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden;margin-top:10px;}
        .pbar-fill{height:100%;background:linear-gradient(90deg,#ec4899,#f97316,#facc15);border-radius:2px;transition:width .35s;}

        /* Section label */
        .sec-label{font-size:10px;letter-spacing:3px;color:rgba(236,72,153,.8);font-weight:700;margin-bottom:10px;}

        /* Card */
        .card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:16px;}
      `}</style>

      {/* Confetti */}
      {confetti.map(p => (
        <div key={p.id} style={{ position:"fixed",left:`${p.x}%`,top:"-20px",width:p.size,height:p.size,background:p.color,borderRadius:"3px",zIndex:9999,animation:`fall ${1.3+p.delay}s ease-in forwards` }} />
      ))}

      <div style={{ maxWidth:440, margin:"0 auto", padding:"0 18px" }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign:"center", paddingTop:22, marginBottom:22 }}>
          <div style={{ fontSize:11, letterSpacing:4, color:"rgba(255,255,255,.3)", marginBottom:8 }}>NEONBOARD</div>
          <h1 style={{ fontSize:28, fontWeight:900, letterSpacing:1, background:"linear-gradient(90deg,#ec4899,#f97316,#facc15,#22d3ee,#ec4899)", backgroundSize:"300%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"hsh 5s ease infinite", lineHeight:1 }}>
            Billboard AI
          </h1>
          <p style={{ fontSize:12, color:"rgba(255,255,255,.25)", marginTop:6, letterSpacing:1 }}>
            Tu foto en un billboard 3D viral
          </p>
        </div>

        {/* ── STEP INDICATOR ── */}
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:24 }}>
          {[1,2,3].map(s => (
            <div key={s} className={`step-dot ${step>=s?"active":""}`} style={{ background: step>=s ? "#ec4899" : "rgba(255,255,255,.15)" }} />
          ))}
        </div>

        {/* ════════════════════════════════════
            SHOWCASE — rotates automatically
            Person breaks above the frame border
        ════════════════════════════════════ */}
        {step === 1 && (
          <div style={{ marginBottom:28, animation:"fadeUp .5s ease" }}>
            <div style={{ animation: sceneVis ? "scIn .4s ease forwards" : "scOut .35s ease forwards", position:"relative" }}>

              {/* 3D depth */}
              <div style={{ position:"absolute", top:5, right:-11, width:11, height:"calc(100% - 10px)", background:`linear-gradient(to right,${scene.frame}44,transparent)`, borderRadius:"0 4px 4px 0", zIndex:0 }} />
              <div style={{ position:"absolute", bottom:-9, left:5, width:"calc(100% - 10px)", height:9, background:`linear-gradient(to bottom,${scene.frame}33,transparent)`, borderRadius:"0 0 4px 4px", zIndex:0 }} />

              {/* Billboard — overflow VISIBLE */}
              <div style={{ position:"relative", borderRadius:18, overflow:"visible", aspectRatio:"3/4", border:`4px solid ${scene.frame}`, boxShadow:`0 0 40px ${scene.frame}55, 0 0 80px ${scene.frame}22` }}>

                {/* BG clipped */}
                <div style={{ position:"absolute", inset:0, borderRadius:15, overflow:"hidden", zIndex:0 }}>
                  <img src={scene.bg} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,0) 30%,rgba(0,0,0,.85) 100%)" }} />
                </div>
                <div className="sweep" />

                {/* Brand */}
                <div style={{ position:"absolute", top:"4%", left:"5%", zIndex:6, background:"rgba(0,0,0,.6)", backdropFilter:"blur(8px)", borderRadius:8, padding:"4px 10px", fontSize:9, fontWeight:800, color:scene.frame, letterSpacing:4 }}>
                  {scene.brand}
                </div>

                {/* Slogan */}
                <div className="slogp" style={{ position:"absolute", bottom:"5%", left:"6%", right:"6%", zIndex:6, textAlign:"center" }}>
                  <p style={{ fontSize:16, fontWeight:900, color:"#fff", letterSpacing:3, textShadow:"0 2px 14px rgba(0,0,0,.9)", lineHeight:1.2 }}>
                    {scene.slogan}
                  </p>
                </div>

                {/* Shadow */}
                <div className="pshadow" style={{ position:"absolute", bottom:"-3%", left:"50%", width:"50%", height:"4%", background:"radial-gradient(ellipse,rgba(0,0,0,.8) 0%,transparent 70%)", zIndex:4, borderRadius:"50%", pointerEvents:"none" }} />

                {/* PERSON — height > 100% → breaks out top */}
                <img
                  src={scene.person}
                  alt="person"
                  className="pfloat"
                  style={{
                    position:"absolute",
                    bottom:"12%",
                    left:"50%",
                    transform:"translateX(-50%)",
                    height:"150%",
                    width:"auto",
                    maxWidth:"90%",
                    objectFit:"cover",
                    objectPosition:"top center",
                    zIndex:9,
                    filter:"drop-shadow(0 20px 16px rgba(0,0,0,.95))",
                  }}
                  onError={e => { e.target.style.display="none"; }}
                />
              </div>
            </div>

            {/* Dots */}
            <div style={{ display:"flex", justifyContent:"center", gap:7, marginTop:14 }}>
              {SCENES.map((_,i) => (
                <div key={i} onClick={() => setSceneIdx(i)} style={{ width:i===sceneIdx?22:7, height:7, borderRadius:4, background:i===sceneIdx?scene.frame:"rgba(255,255,255,.15)", transition:"all .3s", cursor:"pointer" }} />
              ))}
            </div>

            {/* CTA */}
            <div style={{ marginTop:22 }}>
              <button
                className="btn-primary ctapulse"
                onClick={() => fileRef.current.click()}
              >
                ⚡ Crear mi billboard gratis
              </button>
              <p style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,.2)", marginTop:10, letterSpacing:1 }}>
                Sin registro · Sin edición · Resultado en segundos
              </p>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 2 — CUSTOMIZE
        ════════════════════════════════════ */}
        {step === 2 && (
          <div style={{ animation:"fadeUp .4s ease" }}>

            {/* Photo preview */}
            {photo && (
              <div style={{ marginBottom:18, position:"relative" }}>
                <img src={photo} alt="preview" style={{ width:"100%", maxHeight:180, objectFit:"cover", borderRadius:14, display:"block" }} />
                <button
                  onClick={() => fileRef.current.click()}
                  style={{ position:"absolute", bottom:10, right:10, background:"rgba(0,0,0,.75)", border:"1px solid rgba(255,255,255,.2)", borderRadius:8, color:"#fff", fontSize:11, padding:"5px 10px", cursor:"pointer", fontFamily:"inherit" }}
                >
                  Cambiar foto
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
              </div>
            )}

            {/* Slogan */}
            <div style={{ marginBottom:16 }}>
              <div className="sec-label">SLOGAN</div>
              <input
                className="txt-input"
                placeholder='Ej: "Break the frame · Feel the scent"'
                value={slogan}
                onChange={e => setSlogan(e.target.value)}
              />
            </div>

            {/* Frame color */}
            <div style={{ marginBottom:18 }}>
              <div className="sec-label">COLOR DEL MARCO</div>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                {FRAME_OPTIONS.map(f => (
                  <div
                    key={f.id}
                    className={`fdot ${frameId===f.id?"active":""}`}
                    onClick={() => setFrameId(f.id)}
                    style={{ background:f.color, boxShadow:frameId===f.id?f.shadow:"none" }}
                  />
                ))}
                <span style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginLeft:4 }}>
                  {FRAME_OPTIONS.find(f=>f.id===frameId)?.label}
                </span>
              </div>
            </div>

            {/* Background */}
            <div style={{ marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <div className="sec-label" style={{ margin:0 }}>FONDO</div>
                <button
                  onClick={() => setShowBgPicker(!showBgPicker)}
                  style={{ fontSize:11, color:"#ec4899", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", padding:0 }}
                >
                  {showBgPicker ? "Cerrar ↑" : "Ver todos →"}
                </button>
              </div>

              {/* Current bg preview */}
              {!showBgPicker && (
                <div style={{ borderRadius:12, overflow:"hidden", height:80, border:"2px solid rgba(236,72,153,.4)", cursor:"pointer", position:"relative" }} onClick={() => setShowBgPicker(true)}>
                  {selBg?.url
                    ? <img src={selBg.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : <div style={{ width:"100%", height:"100%", background:selBg?.color||"#000" }} />
                  }
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(0,0,0,.4),transparent)", display:"flex", alignItems:"center", padding:"0 14px" }}>
                    <span style={{ fontSize:13, fontWeight:600 }}>{selBg?.label}</span>
                  </div>
                </div>
              )}

              {/* Bg grid */}
              {showBgPicker && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  {BACKGROUNDS.map(b => (
                    <div
                      key={b.id}
                      className={`bgt ${bg===b.id?"active":""}`}
                      onClick={() => { setBg(b.id); setShowBgPicker(false); }}
                    >
                      {b.url
                        ? <img src={b.url} alt={b.label} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", aspectRatio:"16/9" }} />
                        : <div style={{ width:"100%", aspectRatio:"16/9", background:b.color||"#111", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"rgba(255,255,255,.5)" }}>{b.label}</div>
                      }
                      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(0,0,0,.7))", padding:"16px 6px 5px", fontSize:9, fontWeight:600, textAlign:"center" }}>{b.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logo */}
            <div style={{ marginBottom:22 }}>
              <div className="sec-label">LOGO (OPCIONAL)</div>
              <div
                className="card"
                onClick={() => logoRef.current.click()}
                style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer", transition:"border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,.22)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,.08)"}
              >
                {logo
                  ? <img src={logo} alt="" style={{ width:40, height:40, objectFit:"contain", borderRadius:8 }} />
                  : <div style={{ width:40, height:40, background:"rgba(255,255,255,.06)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏷️</div>
                }
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{logo ? "Logo cargado ✅" : "Subí tu logo"}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginTop:2 }}>PNG transparente recomendado</div>
                </div>
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => { if(e.target.files[0]) setLogo(URL.createObjectURL(e.target.files[0])); }} />
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom:14, padding:"11px 14px", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:10, fontSize:13, color:"#fca5a5" }}>
                ⚠️ {error}
              </div>
            )}

            {/* Generate */}
            <button className="btn-primary" onClick={generate} disabled={loading}>
              {loading ? `Procesando... ${Math.round(progress)}%` : "⚡ Generar billboard"}
            </button>
            {loading && <div className="pbar"><div className="pbar-fill" style={{ width:`${progress}%` }} /></div>}

            <button className="btn-sec" onClick={() => setStep(1)} style={{ width:"100%", marginTop:10 }}>
              ← Volver
            </button>
          </div>
        )}

        {/* ════════════════════════════════════
            STEP 3 — RESULT
        ════════════════════════════════════ */}
        {step === 3 && personBlob && (
          <div style={{ animation:"fadeUp .4s ease" }}>

            <div style={{ textAlign:"center", marginBottom:16 }}>
              <div style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>¡Tu billboard está listo! 🎉</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,.3)" }}>Mové el mouse para el efecto 3D</div>
            </div>

            {/* 3D Billboard */}
            <div
              ref={boardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ perspective:"900px", marginBottom:90, paddingTop:55 }}
            >
              <div
                className="bbenter"
                style={{ transform:`perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition:"transform .1s ease-out", transformStyle:"preserve-3d", position:"relative" }}
              >
                {/* 3D depth sides */}
                <div style={{ position:"absolute", top:5, right:-12, width:12, height:"calc(100% - 10px)", background:`linear-gradient(to right,${selFrame?.color}44,transparent)`, borderRadius:"0 4px 4px 0" }} />
                <div style={{ position:"absolute", bottom:-10, left:5, width:"calc(100% - 10px)", height:10, background:`linear-gradient(to bottom,${selFrame?.color}33,transparent)`, borderRadius:"0 0 4px 4px" }} />

                {/* Billboard — overflow VISIBLE */}
                <div
                  style={{ position:"relative", borderRadius:18, overflow:"visible", aspectRatio:"3/4", border:`4px solid ${selFrame?.color}`, boxShadow:selFrame?.shadow }}
                >
                  {/* BG clipped */}
                  <div style={{ position:"absolute", inset:0, borderRadius:15, overflow:"hidden", zIndex:0 }}>
                    {selBg?.color
                      ? <div style={{ width:"100%", height:"100%", background:selBg.color }} />
                      : <img src={selBg?.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    }
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,.04) 0%,rgba(0,0,0,.12) 50%,rgba(0,0,0,.75) 100%)" }} />
                  </div>
                  <div className="sweep" />

                  {/* Logo */}
                  {logo && <img src={logo} alt="logo" style={{ position:"absolute", top:"4%", right:"4%", width:"14%", zIndex:6, borderRadius:8, objectFit:"contain", filter:"drop-shadow(0 2px 6px rgba(0,0,0,.8))" }} />}

                  {/* Slogan */}
                  {slogan && (
                    <div className="slogp" style={{ position:"absolute", bottom:"5%", left:"6%", right:"6%", zIndex:6, textAlign:"center" }}>
                      <p style={{ fontSize:13, fontWeight:900, color:"#fff", letterSpacing:1.5, lineHeight:1.35, textShadow:"0 2px 14px rgba(0,0,0,.95)" }}>
                        {slogan}
                      </p>
                    </div>
                  )}

                  {/* Shadow */}
                  <div className="pshadow" style={{ position:"absolute", bottom:"-4%", left:"50%", width:"52%", height:"4%", background:"radial-gradient(ellipse,rgba(0,0,0,.85) 0%,transparent 70%)", zIndex:4, borderRadius:"50%", pointerEvents:"none" }} />

                  {/* PERSON — PNG transparente, rompe el marco arriba */}
                  <img
                    src={personBlob}
                    alt="persona"
                    className="pentry"
                    style={{
                      position:"absolute",
                      bottom:"10%",
                      left:"50%",
                      width:"82%",
                      height:"auto",
                      maxHeight:"150%",
                      zIndex:9,
                      objectFit:"contain",
                      objectPosition:"bottom center",
                      transformOrigin:"bottom center",
                      filter:"drop-shadow(0 20px 16px rgba(0,0,0,.97)) drop-shadow(0 4px 8px rgba(0,0,0,.7))",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              <button
                className="btn-primary"
                style={{ flex:2, padding:"14px" }}
                onClick={() => { const a=document.createElement("a"); a.href=personBlob; a.download=`billboard-${Date.now()}.png`; a.click(); }}
              >
                ⬇️ Descargar
              </button>
              <button
                className="btn-sec"
                style={{ flex:1 }}
                onClick={() => { setStep(2); setPersonBlob(null); }}
              >
                ✏️ Editar
              </button>
            </div>
            <button
              className="btn-sec"
              style={{ width:"100%" }}
              onClick={() => { setStep(1); setPersonBlob(null); setPhoto(null); setPhotoFile(null); setSlogan(""); setLogo(null); }}
            >
              + Crear otro
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
