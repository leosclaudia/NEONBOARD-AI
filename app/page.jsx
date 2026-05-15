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
  { id: "neon", label: "Neón", emoji: "💜" },
  { id: "gold", label: "Dorado", emoji: "✨" },
  { id: "vintage", label: "Vintage", emoji: "🎞️" },
  { id: "future", label: "Futurista", emoji: "🤖" },
  { id: "minimal", label: "Minimal", emoji: "◻️" },
];

const EXAMPLES = [
  { id: 1, label: "Chico con libro", emoji: "📚", photo: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400", bg: "nyc1", desc: "Joven en Times Square" },
  { id: 2, label: "Café premium", emoji: "☕", photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", bg: "mountain1", desc: "Producto en montañas" },
  { id: 3, label: "Chica bailando", emoji: "💃", photo: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400", bg: "tokyo1", desc: "Bailarina en Tokyo" },
  { id: 4, label: "Zapatillas", emoji: "👟", photo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", bg: "beach1", desc: "Sneakers en la playa" },
  { id: 5, label: "Músico", emoji: "🎸", photo: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400", bg: "festival1", desc: "Artista en festival" },
  { id: 6, label: "Atleta", emoji: "🏃", photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", bg: "stadium1", desc: "Deportista en estadio" },
];

const FRAME_STYLES = {
  neon: {
    border: "6px solid #00cfff",
    boxShadow: "0 0 30px #00cfff, inset 0 0 30px rgba(0,207,255,0.1), 0 0 60px rgba(255,45,120,0.4)",
  },
  gold: {
    border: "10px solid #FFD700",
    boxShadow: "0 0 30px #FFD700, inset 0 0 20px rgba(255,215,0,0.1)",
  },
  vintage: {
    border: "8px solid #8B4513",
    boxShadow: "0 0 0 4px #D2691E, 0 0 0 8px #8B4513",
  },
  future: {
    border: "4px solid #00ff88",
    boxShadow: "0 0 40px #00ff88, inset 0 0 20px rgba(0,255,136,0.05), 0 0 80px rgba(0,136,255,0.3)",
  },
  minimal: {
    border: "2px solid rgba(255,255,255,0.8)",
    boxShadow: "0 0 20px rgba(255,255,255,0.1)",
  },
};

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
  const fileRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const selected = BACKGROUNDS.find(b => b.id === bg);
    if (selected && selected.url) setBgPreview(selected.url);
    else setBgPreview(null);
  }, [bg]);

  const launchConfetti = () => {
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ["#ff2d78", "#ff9500", "#00cfff", "#fff", "#ffeb3b"][Math.floor(Math.random() * 5)],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 1.5,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 3000);
  };

  const handleFile = useCallback((file) => {
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    setPhotoFile(file);
    setPhotoUrl(null);
    setPersonBlob(null);
    setError(null);
    setTab("crear");
  }, []);

  const handleLogo = useCallback((file) => {
    if (!file) return;
    setBrandLogo(URL.createObjectURL(file));
  }, []);

  const useExample = (example) => {
    setPhotoUrl(example.photo);
    setPhotoFile(null);
    setPhoto(example.photo);
    setBg(example.bg);
    setPersonBlob(null);
    setError(null);
    setTab("crear");
  };

  const removeBg = async () => {
    const formData = new FormData();
    if (photoFile) formData.append("image_file", photoFile);
    else if (photoUrl) formData.append("image_url", photoUrl);
    else throw new Error("No hay imagen");
    formData.append("size", "auto");
    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": REMOVE_BG_KEY },
      body: formData,
    });
    if (!res.ok) throw new Error("Error al quitar el fondo");
    return await res.blob();
  };

  const generate = async () => {
    if (!photo) { setError("Por favor elegí una foto o ejemplo primero"); return; }
    setLoading(true); setPersonBlob(null); setError(null); setProgress(10);
    const interval = setInterval(() => setProgress(p => Math.min(p + 4, 85)), 400);
    try {
      setStatus("Quitando el fondo...");
      const blob = await removeBg();
      setProgress(100); setStatus("¡Listo!");
      setPersonBlob(URL.createObjectURL(blob));
      launchConfetti();
    } catch (e) {
      setError(e.message);
    } finally {
      clearInterval(interval); setLoading(false);
    }
  };

  const selectedBgData = BACKGROUNDS.find(b => b.id === bg);
  const frameStyle = FRAME_STYLES[frame] || FRAME_STYLES.neon;

  return (
    <div style={{ minHeight: "100vh", background: "#050508", fontFamily: "sans-serif", color: "#fff", padding: "20px", position: "relative", overflow: "hidden" }}>
      {confetti.map(p => (
        <div key={p.id} style={{ position: "fixed", left: `${p.x}%`, top: "-20px", width: p.size, height: p.size, background: p.color, borderRadius: "2px", zIndex: 9999, animation: `fall ${1.5 + p.delay}s ease-in forwards` }} />
      ))}
      <style>{`
        @keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
        @keyframes personSway {
          0%   { transform: translateX(-50%) translateY(0px) rotate(-0.5deg); }
          25%  { transform: translateX(-50%) translateY(-14px) rotate(0.5deg); }
          50%  { transform: translateX(-50%) translateY(-20px) rotate(-0.3deg); }
          75%  { transform: translateX(-50%) translateY(-10px) rotate(0.4deg); }
          100% { transform: translateX(-50%) translateY(0px) rotate(-0.5deg); }
        }
        @keyframes shadowPulse {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scaleX(1); }
          50% { opacity: 0.25; transform: translateX(-50%) scaleX(0.8); }
        }
        @keyframes glowNeon {
          0%, 100% { box-shadow: 0 0 30px #00cfff, 0 0 60px rgba(255,45,120,0.4); }
          50% { box-shadow: 0 0 60px #00cfff, 0 0 120px rgba(255,45,120,0.7), 0 0 20px #fff; }
        }
        @keyframes glowGold {
          0%, 100% { box-shadow: 0 0 30px #FFD700; }
          50% { box-shadow: 0 0 70px #FFD700, 0 0 20px #fff8dc; }
        }
        @keyframes glowFuture {
          0%, 100% { box-shadow: 0 0 40px #00ff88, 0 0 80px rgba(0,136,255,0.3); }
          50% { box-shadow: 0 0 80px #00ff88, 0 0 160px rgba(0,136,255,0.6); }
        }
        .glow-neon { animation: glowNeon 2s ease-in-out infinite; }
        .glow-gold { animation: glowGold 2s ease-in-out infinite; }
        .glow-future { animation: glowFuture 2s ease-in-out infinite; }
        .person-float {
          animation: personSway 3.5s ease-in-out infinite;
          filter: drop-shadow(0px 25px 20px rgba(0,0,0,0.95)) drop-shadow(0px 8px 8px rgba(0,0,0,0.8));
        }
        .shadow-blob {
          animation: shadowPulse 3.5s ease-in-out infinite;
        }
      `}</style>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 30, background: "linear-gradient(90deg,#ff2d78,#ff9500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 900, letterSpacing: 2 }}>⚡ NEONBOARD AI</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Poné tu foto en un billboard viral</p>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[["ejemplos", "✨ Ejemplos"], ["crear", "🎨 Crear"], ["galeria", "🖼️ Galería"]].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "9px 4px", background: tab === t ? "rgba(255,45,120,0.2)" : "rgba(255,255,255,0.05)", border: tab === t ? "1px solid rgba(255,45,120,0.5)" : "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", cursor: "pointer", fontWeight: tab === t ? 700 : 400, fontSize: 12 }}>{label}</button>
          ))}
        </div>

        {tab === "ejemplos" && (
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 14 }}>Tocá un ejemplo para usarlo como base 👇</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {EXAMPLES.map(ex => (
                <div key={ex.id} onClick={() => useExample(ex)} style={{ cursor: "pointer", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                  <img src={ex.photo} alt={ex.label} style={{ width: "100%", height: 130, objectFit: "cover" }} />
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{ex.emoji} {ex.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{ex.desc}</div>
                    <div style={{ marginTop: 8, padding: "5px", background: "rgba(255,45,120,0.15)", border: "1px solid rgba(255,45,120,0.3)", borderRadius: 6, fontSize: 11, textAlign: "center", color: "#ff2d78", fontWeight: 600 }}>Usar →</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "crear" && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 11, letterSpacing: 3, color: "#ff2d78", marginBottom: 8 }}>01 · TU FOTO O PRODUCTO</p>
              <div onClick={() => fileRef.current.click()} style={{ border: "2px dashed rgba(255,45,120,0.4)", borderRadius: 14, padding: photo ? 0 : 28, textAlign: "center", cursor: "pointer", overflow: "hidden", minHeight: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {photo ? <div style={{ position: "relative", width: "100%" }}><img src={photo} alt="preview" style={{ width: "100%", maxHeight: 160, objectFit: "cover" }} /><div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", padding: "4px 10px", borderRadius: 6, fontSize: 11 }}>📷 Cambiar</div></div>
                : <div><div style={{ fontSize: 32 }}>🤳</div><div style={{ fontSize: 13, marginTop: 6 }}>Subí tu foto o producto</div></div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 11, letterSpacing: 3, color: "#ff2d78", marginBottom: 8 }}>02 · SLOGAN (OPCIONAL)</p>
              <input style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, boxSizing: "border-box" }} placeholder="Ej: Just Do It · Tu mejor versión" value={slogan} onChange={e => setSlogan(e.target.value)} />
            </div>

            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 11, letterSpacing: 3, color: "#ff2d78", marginBottom: 8 }}>03 · TU LOGO (OPCIONAL)</p>
              <div onClick={() => logoRef.current.click()} style={{ border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 10, padding: "12px", textAlign: "center", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                {brandLogo ? <img src={brandLogo} alt="logo" style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 8 }} /> : <div style={{ fontSize: 28 }}>🏷️</div>}
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{brandLogo ? "Logo cargado ✅" : "Subí tu logo para agregarlo"}</div>
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleLogo(e.target.files[0])} />
            </div>

            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 11, letterSpacing: 3, color: "#ff2d78", marginBottom: 8 }}>04 · MARCO</p>
              <div style={{ display: "flex", gap: 8 }}>
                {FRAMES.map(f => (
                  <button key={f.id} onClick={() => setFrame(f.id)} style={{ flex: 1, padding: "10px 4px", background: frame === f.id ? "rgba(255,45,120,0.15)" : "rgba(255,255,255,0.03)", border: frame === f.id ? "1px solid rgba(255,45,120,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 10, cursor: "pointer", color: "#fff", fontSize: 11, textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>{f.emoji}</div>
                    <div style={{ marginTop: 4 }}>{f.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, letterSpacing: 3, color: "#ff2d78", marginBottom: 8 }}>05 · FONDO</p>
              {bgPreview && <img src={bgPreview} alt="preview" style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 10, marginBottom: 10, opacity: 0.7 }} />}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {BACKGROUNDS.map(b => (
                  <button key={b.id} onClick={() => setBg(b.id)} style={{ background: bg === b.id ? "rgba(255,45,120,0.15)" : "rgba(255,255,255,0.03)", border: bg === b.id ? "1px solid rgba(255,45,120,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 4px", cursor: "pointer", color: "#fff", textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>{b.emoji}</div>
                    <div style={{ fontSize: 9, marginTop: 2 }}>{b.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={loading} style={{ width: "100%", padding: "18px", background: "linear-gradient(135deg,#ff2d78,#ff6b00)", border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1 }}>
              {loading ? `⚡ ${status} ${Math.round(progress)}%` : "⚡ CREAR BILLBOARD VIRAL"}
            </button>

            {loading && <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginTop: 10 }}><div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#ff2d78,#ff9500)", borderRadius: 2, transition: "width .4s" }} /></div>}

            {error && <div style={{ marginTop: 12, padding: "14px", background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 10, fontSize: 13, color: "#ff8080" }}>⚠️ {error}</div>}

            {personBlob && (
              <div style={{ marginTop: 28 }}>
                {/* BILLBOARD con persona flotando ENCIMA */}
                <div
                  className={`glow-${frame === "neon" ? "neon" : frame === "gold" ? "gold" : frame === "future" ? "future" : "neon"}`}
                  style={{
                    position: "relative",
                    borderRadius: 18,
                    overflow: "visible",
                    ...frameStyle,
                    aspectRatio: "3/4",
                    background: selectedBgData?.color
                      ? selectedBgData.color
                      : `url(${selectedBgData?.url}) center/cover`,
                    marginBottom: 60,
                  }}
                >
                  {/* Overlay */}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", borderRadius: 14, zIndex: 1 }} />

                  {/* Slogan */}
                  {slogan && (
                    <div style={{ position: "absolute", bottom: "6%", left: "5%", right: "5%", zIndex: 3, background: "rgba(0,0,0,0.7)", borderRadius: 10, padding: "10px", textAlign: "center", fontSize: 16, fontWeight: 700, color: "#fff", textShadow: "0 0 15px #ff2d78" }}>
                      {slogan}
                    </div>
                  )}

                  {/* Logo */}
                  {brandLogo && (
                    <img src={brandLogo} alt="logo" style={{ position: "absolute", top: "4%", right: "4%", width: "16%", zIndex: 4, borderRadius: 8, objectFit: "contain" }} />
                  )}

                  {/* Sombra de la persona */}
                  <div className="shadow-blob" style={{ position: "absolute", bottom: "-5%", left: "50%", width: "55%", height: "5%", background: "radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)", zIndex: 2, borderRadius: "50%" }} />

                  {/* PERSONA — sobresale arriba y abajo del marco */}
                  <img
                    src={personBlob}
                    alt="persona"
                    className="person-float"
                    style={{
                      position: "absolute",
                      bottom: "-20%",
                      left: "50%",
                      height: "140%",
                      width: "auto",
                      maxWidth: "95%",
                      zIndex: 5,
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { const a = document.createElement("a"); a.href = personBlob; a.download = `billboard-${Date.now()}.png`; a.click(); }} style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg,#ff2d78,#ff6b00)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>⬇️ Descargar</button>
                  <button onClick={() => { setPersonBlob(null); setPhoto(null); setPhotoFile(null); setPhotoUrl(null); }} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 13, cursor: "pointer" }}>🔄 Nuevo</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "galeria" && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: 48 }}>🖼️</div>
            <div style={{ marginTop: 12, fontSize: 14 }}>Usá descargar para guardar tus billboards</div>
            <button onClick={() => setTab("crear")} style={{ marginTop: 16, padding: "10px 24px", background: "rgba(255,45,120,0.2)", border: "1px solid rgba(255,45,120,0.4)", borderRadius: 10, color: "#ff2d78", cursor: "pointer", fontSize: 13 }}>Crear mi billboard →</button>
          </div>
        )}
      </div>
    </div>
  );
}