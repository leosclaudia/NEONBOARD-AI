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

const FRAMES = [
  { id: "cyan",  label: "Neón",   color: "#22d3ee", glow: "0 0 30px #22d3ee88, 0 0 60px #22d3ee33" },
  { id: "gold",  label: "Dorado", color: "#f59e0b", glow: "0 0 30px #f59e0b88, 0 0 60px #f59e0b33" },
  { id: "pink",  label: "Rosa",   color: "#ec4899", glow: "0 0 30px #ec489988, 0 0 60px #ec489933" },
  { id: "green", label: "Verde",  color: "#10b981", glow: "0 0 30px #10b98188, 0 0 60px #10b98133" },
  { id: "white", label: "Blanco", color: "#ffffff", glow: "0 0 20px #ffffff44" },
];

const EXAMPLES = [
  { label: "Perfume",  bg: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600", accent: "#f59e0b", slogan: "FEEL THE SCENT" },
  { label: "Moda",     bg: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600", accent: "#22d3ee", slogan: "OWN THE CITY"   },
  { label: "Sport",    bg: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600", accent: "#ec4899", slogan: "PUSH BEYOND"    },
];

export default function BillboardApp() {
  const [step, setStep] = useState(1);
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
  const [exIdx, setExIdx] = useState(0);
  const [confetti, setConfetti] = useState([]);
  const [showBgGrid, setShowBgGrid] = useState(false);

  const fileRef  = useRef(null);
  const logoRef  = useRef(null);
  const boardRef = useRef(null);
  const tiltTimer = useRef(null);
  const tiltAngle = useRef(0);
  const mouseOver = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setExIdx(i => (i + 1) % EXAMPLES.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!personBlob) return;
    tiltTimer.current = setInterval(() => {
      if (mouseOver.current) return;
      tiltAngle.current += 0.012;
      setTilt({ x: Math.sin(tiltAngle.current * 0.5) * 2.5, y: Math.sin(tiltAngle.current) * 4 });
    }, 16);
    return () => clearInterval(tiltTimer.current);
  }, [personBlob]);

  const onMouseMove = useCallback((e) => {
    if (!boardRef.current) return;
    mouseOver.current = true;
    const r = boardRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -7,
      y: ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  7,
    });
  }, []);
  const onMouseLeave = useCallback(() => { mouseOver.current = false; }, []);

  const handleFile = (file) => {
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    setPhotoFile(file);
    setPersonBlob(null);
    setError(null);
    setStep(2);
  };

  const generate = async () => {
    if (!photoFile) { setError("Subí una foto primero"); return; }
    setLoading(true); setError(null); setProgress(5);
    const iv = setInterval(() => setProgress(p => Math.min(p + 6, 88)), 350);
    try {
      const fd = new FormData();
      fd.append("image_file", photoFile);
      fd.append("size", "auto");
      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST", headers: { "X-Api-Key": REMOVE_BG_KEY }, body: fd,
      });
      if (!res.ok) throw new Error("Error al procesar");
      const blob = await res.blob();
      setPersonBlob(URL.createObjectURL(blob));
      setProgress(100);
      setStep(3);
      const c = Array.from({ length: 55 }, (_, i) => ({
        id: i, x: Math.random() * 100,
        color: ["#22d3ee","#ec4899","#f59e0b","#fff","#10b981"][i % 5],
        size: Math.random() * 8 + 4, delay: Math.random() * 1.5,
      }));
      setConfetti(c);
      setTimeout(() => setConfetti([]), 2800);
    } catch (e) { setError(e.message); }
    finally { clearInterval(iv); setLoading(false); }
  };

  const selBg    = BACKGROUNDS.find(b => b.id === bg);
  const selFrame = FRAMES.find(f => f.id === frameId);
  const ex       = EXAMPLES[exIdx];

  return (
    <div style={{ minHeight:"100vh", background:"#08080f", color:"#fff", fontFamily:"'Inter',system-ui,sans-serif", paddingBottom:60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}

        @keyframes fall{to{transform:translateY(105vh) rotate(540deg);opacity:0;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes hg{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
        @keyframes exIn{from{opacity:0;transform:scale(.97);}to{opacity:1;transform:scale(1);}}
        @keyframes sp{0%,100%{opacity:.88;}50%{opacity:1;}}
        .sp{animation:sp 3s ease-in-out infinite;}
        @keyframes sw{0%{transform:translateX(-130%) skewX(-15deg);opacity:0;}8%{opacity:.3;}45%{opacity:.1;}100%{transform:translateX(230%) skewX(-15deg);opacity:0;}}
        .sw{position:absolute;top:0;left:0;width:25%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,.09),transparent);animation:sw 7s ease-in-out infinite;pointer-events:none;z-index:5;}
        @keyframes cp{0%,100%{box-shadow:0 4px 24px rgba(236,72,153,.3);}50%{box-shadow:0 4px 40px rgba(236,72,153,.6);}}
        .cp{animation:cp 2.5s ease-in-out infinite;}

        /*
          ══════════════════════════════════════════════
          THE CINEMATIC OUT-OF-FRAME ANIMATION
          
          The person is positioned with bottom:-15% so
          their feet are BELOW the billboard border.
          height:160% makes them taller than the frame.
          The animation pushes them UP (negative translateY)
          so they pop further above the top border,
          then returns them back.

          overflow:visible on the billboard div is what
          allows the image to render outside the box.
          ══════════════════════════════════════════════
        */
        @keyframes outOfFrame {
          /*  In billboard — resting position  */
          0%   {
            transform: translateX(-50%) translateY(0%) scale(1);
            filter: drop-shadow(0 20px 16px rgba(0,0,0,.95)) brightness(1);
          }
          /*  Starting to move forward/up  */
          15%  {
            transform: translateX(-50%) translateY(-8%) scale(1.06);
            filter: drop-shadow(0 26px 22px rgba(0,0,0,.9)) brightness(1.05);
          }
          /*  Breaking out of the frame — head fully above border  */
          35%  {
            transform: translateX(-50%) translateY(-22%) scale(1.18);
            filter: drop-shadow(0 36px 30px rgba(0,0,0,.85)) brightness(1.1);
          }
          /*  PEAK — maximum out-of-frame, holds for a beat  */
          48%  {
            transform: translateX(-50%) translateY(-28%) scale(1.22);
            filter: drop-shadow(0 42px 35px rgba(0,0,0,.8)) brightness(1.12);
          }
          60%  {
            transform: translateX(-50%) translateY(-28%) scale(1.22);
            filter: drop-shadow(0 42px 35px rgba(0,0,0,.8)) brightness(1.12);
          }
          /*  Returning back into the billboard  */
          78%  {
            transform: translateX(-50%) translateY(-10%) scale(1.08);
            filter: drop-shadow(0 28px 22px rgba(0,0,0,.9)) brightness(1.04);
          }
          /*  Back inside  */
          100% {
            transform: translateX(-50%) translateY(0%) scale(1);
            filter: drop-shadow(0 20px 16px rgba(0,0,0,.95)) brightness(1);
          }
        }

        @keyframes shadowOOF {
          0%,100%{ transform:translateX(-50%) scaleX(1)    scaleY(1);    opacity:.55; }
          15%    { transform:translateX(-50%) scaleX(.82)  scaleY(.78);  opacity:.4;  }
          35%    { transform:translateX(-50%) scaleX(.6)   scaleY(.52);  opacity:.24; }
          48%,60%{ transform:translateX(-50%) scaleX(.5)   scaleY(.42);  opacity:.16; }
          78%    { transform:translateX(-50%) scaleX(.75)  scaleY(.68);  opacity:.36; }
        }

        .person-oof {
          animation: outOfFrame 5s cubic-bezier(.4, 0, .2, 1) infinite;
        }
        .shadow-oof {
          animation: shadowOOF 5s cubic-bezier(.4, 0, .2, 1) infinite;
        }

        @keyframes personReveal {
          from { opacity:0; transform:translateX(-50%) translateY(15px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        .person-entry {
          animation:
            personReveal .55s cubic-bezier(.22,1,.36,1) forwards,
            outOfFrame   5s  cubic-bezier(.4,0,.2,1)   .6s infinite;
        }

        @keyframes bbIn{
          from{opacity:0;transform:perspective(800px) rotateX(10deg) scale(.9) translateY(24px);}
          to  {opacity:1;transform:perspective(800px) rotateX(0) scale(1) translateY(0);}
        }
        .bbe{animation:bbIn .7s cubic-bezier(.22,1,.36,1) forwards;}

        .sdot{height:6px;border-radius:3px;transition:all .35s;background:rgba(255,255,255,.18);}
        .sdot.on{background:#ec4899;}

        .inp{width:100%;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:12px;padding:13px 15px;color:#fff;font-size:15px;font-family:inherit;outline:none;transition:border-color .2s;}
        .inp:focus{border-color:rgba(236,72,153,.5);}
        .inp::placeholder{color:rgba(255,255,255,.25);}

        .btn{width:100%;padding:16px;background:linear-gradient(135deg,#ec4899,#f97316);border:none;border-radius:13px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .15s,opacity .2s;}
        .btn:hover:not(:disabled){transform:scale(1.012);}
        .btn:disabled{opacity:.65;cursor:not-allowed;}
        .btn2{padding:13px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:12px;color:rgba(255,255,255,.65);font-size:14px;cursor:pointer;font-family:inherit;transition:all .2s;}
        .btn2:hover{background:rgba(255,255,255,.09);color:#fff;}

        .pb{height:3px;background:rgba(255,255,255,.07);border-radius:2px;margin-top:9px;overflow:hidden;}
        .pbf{height:100%;background:linear-gradient(90deg,#ec4899,#f97316,#facc15);border-radius:2px;transition:width .35s;}

        .fd{width:32px;height:32px;border-radius:50%;cursor:pointer;transition:all .2s;border:2.5px solid transparent;flex-shrink:0;}
        .fd.on{border-color:#fff;transform:scale(1.15);}

        .bgt{border-radius:9px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .15s;position:relative;}
        .bgt:hover{border-color:rgba(255,255,255,.25);}
        .bgt.on{border-color:#ec4899;}

        .lbl{font-size:10px;letter-spacing:2.5px;color:rgba(255,255,255,.35);font-weight:600;margin-bottom:9px;}
      `}</style>

      {confetti.map(p => (
        <div key={p.id} style={{ position:"fixed",left:`${p.x}%`,top:"-16px",width:p.size,height:p.size,background:p.color,borderRadius:"3px",zIndex:9999,animation:`fall ${1.3+p.delay}s ease-in forwards` }} />
      ))}

      <div style={{ maxWidth:420, margin:"0 auto", padding:"0 18px" }}>

        {/* HEADER */}
        <div style={{ textAlign:"center", paddingTop:20, marginBottom:20 }}>
          <p style={{ fontSize:10, letterSpacing:4, color:"rgba(255,255,255,.25)", marginBottom:6 }}>NEONBOARD</p>
          <h1 style={{ fontSize:26, fontWeight:900, background:"linear-gradient(90deg,#ec4899,#f97316,#facc15,#22d3ee,#ec4899)", backgroundSize:"250%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"hg 5s ease infinite" }}>
            Billboard AI
          </h1>
          <p style={{ fontSize:11, color:"rgba(255,255,255,.22)", marginTop:5 }}>
            Tu foto en un billboard 3D viral
          </p>
        </div>

        {/* STEP DOTS */}
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:22 }}>
          {[1,2,3].map(s => (
            <div key={s} className={`sdot ${step===s?"on":""}`} style={{ width:step===s?20:6 }} />
          ))}
        </div>

        {/* ═══════ STEP 1 — LANDING ═══════ */}
        {step === 1 && (
          <div style={{ animation:"fadeUp .4s ease" }}>

            {/* Showcase card */}
            <div
              key={exIdx}
              style={{ marginBottom:22, borderRadius:20, overflow:"hidden", position:"relative", aspectRatio:"3/4", border:`4px solid ${ex.accent}`, boxShadow:`0 0 40px ${ex.accent}44, 0 0 80px ${ex.accent}22`, animation:"exIn .5s ease" }}
            >
              <img src={ex.bg} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.3) 55%,rgba(0,0,0,.92) 100%)" }} />
              <div className="sw" />

              <div style={{ position:"absolute", top:14, left:14, zIndex:6, background:"rgba(0,0,0,.65)", backdropFilter:"blur(10px)", borderRadius:100, padding:"5px 12px", fontSize:9, fontWeight:800, color:ex.accent, letterSpacing:4 }}>
                {ex.label.toUpperCase()}
              </div>

              {/* Placeholder showing where photo goes */}
              <div style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", width:"68%", aspectRatio:"2/3", borderRadius:14, border:`2px dashed rgba(255,255,255,.3)`, background:"rgba(255,255,255,.07)", backdropFilter:"blur(4px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, zIndex:5 }}>
                <div style={{ fontSize:30 }}>🤳</div>
                <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,.75)", textAlign:"center", lineHeight:1.5, padding:"0 10px" }}>
                  Tu foto aquí<br/>
                  <span style={{ fontSize:9, color:"rgba(255,255,255,.4)", fontWeight:400 }}>sale del marco automáticamente</span>
                </div>
              </div>

              <div className="sp" style={{ position:"absolute", bottom:"6%", left:"6%", right:"6%", zIndex:6, textAlign:"center" }}>
                <p style={{ fontSize:17, fontWeight:900, color:"#fff", letterSpacing:3, textShadow:"0 2px 16px rgba(0,0,0,.9)" }}>{ex.slogan}</p>
              </div>

              <div style={{ position:"absolute", bottom:"2%", left:"50%", transform:"translateX(-50%)", display:"flex", gap:5, zIndex:7 }}>
                {EXAMPLES.map((_,i) => (
                  <div key={i} style={{ width:i===exIdx?18:5, height:5, borderRadius:3, background:i===exIdx?ex.accent:"rgba(255,255,255,.3)", transition:"all .3s" }} />
                ))}
              </div>
            </div>

            <button className="btn cp" onClick={() => fileRef.current.click()}>
              ⚡ Subí tu foto y creá el tuyo
            </button>
            <p style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,.2)", marginTop:10 }}>
              Sin registro · Resultado en segundos
            </p>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
          </div>
        )}

        {/* ═══════ STEP 2 — CUSTOMIZE ═══════ */}
        {step === 2 && (
          <div style={{ animation:"fadeUp .4s ease" }}>
            <div style={{ marginBottom:18, borderRadius:14, overflow:"hidden", position:"relative", cursor:"pointer" }} onClick={() => fileRef.current.click()}>
              <img src={photo} alt="" style={{ width:"100%", maxHeight:185, objectFit:"cover", display:"block" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(transparent 55%,rgba(0,0,0,.6))", display:"flex", alignItems:"flex-end", padding:"12px 14px" }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,.7)", background:"rgba(0,0,0,.5)", padding:"4px 9px", borderRadius:6 }}>Tocá para cambiar</span>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />

            <div style={{ marginBottom:15 }}>
              <div className="lbl">SLOGAN</div>
              <input className="inp" placeholder='"Break the frame · Feel the scent"' value={slogan} onChange={e => setSlogan(e.target.value)} />
            </div>

            <div style={{ marginBottom:15 }}>
              <div className="lbl">MARCO</div>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                {FRAMES.map(f => (
                  <div key={f.id} className={`fd ${frameId===f.id?"on":""}`} onClick={() => setFrameId(f.id)} style={{ background:f.color, boxShadow:frameId===f.id?f.glow:"none" }} />
                ))}
                <span style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginLeft:4 }}>{selFrame?.label}</span>
              </div>
            </div>

            <div style={{ marginBottom:15 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:9 }}>
                <div className="lbl" style={{ margin:0 }}>FONDO</div>
                <button onClick={() => setShowBgGrid(!showBgGrid)} style={{ fontSize:11, color:"#ec4899", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                  {showBgGrid ? "Cerrar ↑" : "Cambiar →"}
                </button>
              </div>
              {!showBgGrid && (
                <div style={{ borderRadius:11, overflow:"hidden", height:70, position:"relative", cursor:"pointer", border:"1.5px solid rgba(255,255,255,.1)" }} onClick={() => setShowBgGrid(true)}>
                  {selBg?.url ? <img src={selBg.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <div style={{ width:"100%", height:"100%", background:selBg?.color }} />}
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.35)", display:"flex", alignItems:"center", padding:"0 14px" }}>
                    <span style={{ fontSize:12, fontWeight:600 }}>{selBg?.label}</span>
                  </div>
                </div>
              )}
              {showBgGrid && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7 }}>
                  {BACKGROUNDS.map(b => (
                    <div key={b.id} className={`bgt ${bg===b.id?"on":""}`} onClick={() => { setBg(b.id); setShowBgGrid(false); }}>
                      {b.url
                        ? <img src={b.url} alt={b.label} style={{ width:"100%", aspectRatio:"16/9", objectFit:"cover", display:"block" }} />
                        : <div style={{ width:"100%", aspectRatio:"16/9", background:b.color||"#111", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"rgba(255,255,255,.4)" }}>{b.label}</div>
                      }
                      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(0,0,0,.75))", padding:"14px 5px 4px", fontSize:9, fontWeight:600, textAlign:"center" }}>{b.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom:20 }}>
              <div className="lbl">LOGO (OPCIONAL)</div>
              <div onClick={() => logoRef.current.click()} style={{ display:"flex", alignItems:"center", gap:11, padding:"11px 14px", background:"rgba(255,255,255,.04)", border:"1.5px dashed rgba(255,255,255,.1)", borderRadius:12, cursor:"pointer", transition:"border-color .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,.24)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,.1)"}>
                {logo ? <img src={logo} alt="" style={{ width:36, height:36, objectFit:"contain", borderRadius:7 }} /> : <span style={{ fontSize:22 }}>🏷️</span>}
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{logo ? "Logo cargado ✅" : "Subí tu logo"}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.28)", marginTop:1 }}>PNG transparente recomendado</div>
                </div>
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => { if(e.target.files[0]) setLogo(URL.createObjectURL(e.target.files[0])); }} />
            </div>

            {error && <div style={{ marginBottom:12, padding:"10px 14px", background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.18)", borderRadius:10, fontSize:13, color:"#fca5a5" }}>⚠️ {error}</div>}

            <button className="btn" onClick={generate} disabled={loading}>
              {loading ? `Procesando… ${Math.round(progress)}%` : "⚡ Generar mi billboard"}
            </button>
            {loading && <div className="pb"><div className="pbf" style={{ width:`${progress}%` }} /></div>}
            <div style={{ display:"flex", gap:8, marginTop:9 }}>
              <button className="btn2" style={{ flex:1 }} onClick={() => setStep(1)}>← Volver</button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 3 — RESULTADO ═══════ */}
        {step === 3 && personBlob && (
          <div style={{ animation:"fadeUp .4s ease" }}>

            <div style={{ textAlign:"center", marginBottom:14 }}>
              <p style={{ fontSize:17, fontWeight:800 }}>¡Listo! 🎉</p>
              <p style={{ fontSize:11, color:"rgba(255,255,255,.28)", marginTop:3 }}>
                Tu foto sale y vuelve al billboard automáticamente
              </p>
            </div>

            {/*
              ═══════════════════════════════════════════════════
              BILLBOARD STRUCTURE — KEY POINTS:

              1. Outer wrapper: perspective for 3D tilt on mouse
              2. paddingTop:120px → space for person to pop above
              3. Billboard div: overflow:VISIBLE → person can render
                 outside the box boundaries
              4. Inner bg div: overflow:HIDDEN → background stays clipped
              5. Person img: positioned with bottom so feet anchor inside
                 height > billboard height → head breaks above top border
                 animation pushes it further up then back
              ═══════════════════════════════════════════════════
            */}
            <div
              ref={boardRef}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              style={{ perspective:"900px", paddingTop:120, marginBottom:100 }}
            >
              <div
                className="bbe"
                style={{
                  transform:`perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition:"transform .1s ease-out",
                  transformStyle:"preserve-3d",
                  position:"relative",
                }}
              >
                {/* 3D depth sides */}
                <div style={{ position:"absolute", top:4, right:-11, width:11, height:"calc(100% - 8px)", background:`linear-gradient(to right,${selFrame?.color}44,transparent)`, borderRadius:"0 4px 4px 0" }} />
                <div style={{ position:"absolute", bottom:-9, left:4, width:"calc(100% - 8px)", height:9, background:`linear-gradient(to bottom,${selFrame?.color}33,transparent)`, borderRadius:"0 0 4px 4px" }} />

                {/* ── BILLBOARD ──
                    overflow:visible is CRITICAL — without it
                    the person image gets cut at the border
                */}
                <div
                  style={{
                    position:"relative",
                    borderRadius:16,
                    overflow:"visible",   /* ← MUST be visible */
                    aspectRatio:"3/4",
                    border:`4px solid ${selFrame?.color}`,
                    boxShadow:selFrame?.glow,
                  }}
                >
                  {/* Background — clipped inside its own container */}
                  <div style={{ position:"absolute", inset:0, borderRadius:13, overflow:"hidden", zIndex:0 }}>
                    {selBg?.color
                      ? <div style={{ width:"100%", height:"100%", background:selBg.color }} />
                      : <img src={selBg?.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    }
                    {/* Gradient: top lighter (person area), bottom dark (slogan) */}
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,.04) 0%,rgba(0,0,0,.08) 50%,rgba(0,0,0,.75) 100%)" }} />
                  </div>

                  <div className="sw" />

                  {/* Logo */}
                  {logo && (
                    <img src={logo} alt="" style={{ position:"absolute", top:"4%", right:"4%", width:"13%", zIndex:6, borderRadius:7, objectFit:"contain", filter:"drop-shadow(0 2px 6px rgba(0,0,0,.8))" }} />
                  )}

                  {/* Slogan */}
                  {slogan && (
                    <div className="sp" style={{ position:"absolute", bottom:"5%", left:"6%", right:"6%", zIndex:6, textAlign:"center" }}>
                      <p style={{ fontSize:13, fontWeight:900, color:"#fff", letterSpacing:1.5, lineHeight:1.35, textShadow:"0 2px 14px rgba(0,0,0,.95)" }}>
                        {slogan}
                      </p>
                    </div>
                  )}

                  {/*
                    GROUND SHADOW
                    Synced with animation — shrinks when person is "out"
                    stays at bottom of billboard
                  */}
                  <div
                    className="shadow-oof"
                    style={{
                      position:"absolute",
                      bottom:"-3%",
                      left:"50%",
                      width:"55%",
                      height:"4%",
                      background:"radial-gradient(ellipse,rgba(0,0,0,.85) 0%,transparent 70%)",
                      zIndex:4,
                      borderRadius:"50%",
                      pointerEvents:"none",
                    }}
                  />

                  {/*
                    ══════════════════════════════════════
                    PERSON — THE OUT-OF-FRAME ELEMENT

                    bottom: -10% → feet are 10% below the top of the
                      billboard's bottom edge (anchors them inside)

                    height: 140% → person is 1.4x taller than the billboard
                      so even at rest, their head is above the top border

                    The outOfFrame animation then pushes them UP by
                    an additional -28% translateY at peak, making them
                    visually "burst" further above the frame.

                    transformOrigin: bottom center → scaling/movement
                      anchors from the feet, not the center
                    ══════════════════════════════════════
                  */}
                  <img
                    src={personBlob}
                    alt="persona"
                    className="person-entry"
                    style={{
                      position:"absolute",
                      bottom:"-10%",
                      left:"50%",
                      height:"140%",
                      width:"auto",
                      maxWidth:"95%",
                      zIndex:9,
                      objectFit:"contain",
                      objectPosition:"bottom center",
                      transformOrigin:"bottom center",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:8, marginBottom:9 }}>
              <button
                className="btn"
                style={{ flex:2, padding:"14px" }}
                onClick={() => { const a=document.createElement("a"); a.href=personBlob; a.download=`billboard-${Date.now()}.png`; a.click(); }}
              >
                ⬇️ Descargar
              </button>
              <button className="btn2" style={{ flex:1 }} onClick={() => { setStep(2); setPersonBlob(null); }}>
                ✏️ Editar
              </button>
            </div>
            <button className="btn2" style={{ width:"100%" }} onClick={() => { setStep(1); setPersonBlob(null); setPhoto(null); setPhotoFile(null); setSlogan(""); setLogo(null); }}>
              + Crear otro
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
