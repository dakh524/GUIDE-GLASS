import { useState, useEffect } from 'react';
import { Settings as Cog, Clock, AlertCircle, Home, Glasses, Wifi, Battery, Volume2, StopCircle, ArrowLeft, CheckCircle2, User, Mic, MapPin, Zap, Phone, Eye, BookOpen, Navigation, Thermometer, AlertTriangle, Info } from 'lucide-react';
import './App.css';

type Screen = 'splash'|'connect'|'success'|'main';
type Tab = 'home'|'history'|'sos'|'settings';
type Mode = 'controls'|'live'|'ocr'|'voice'|'distance';

const speak = (t: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }
};

export default function App() {
  const [scr, setScr] = useState<Screen>('splash');
  const [tab, setTab] = useState<Tab>('home');
  const [mode, setMode] = useState<Mode>('controls');
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [ocrScanning, setOcrScanning] = useState(false);

  // Settings state
  const [lang, setLang] = useState('en-IN');
  const [speed, setSpeed] = useState(75);
  const [volume, setVolume] = useState(80);
  const [detailed, setDetailed] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Auto progression
  useEffect(() => {
    let t: number;
    if (scr === 'splash') { speak('Welcome to Guide Glass'); t = setTimeout(() => setScr('connect'), 2500); }
    else if (scr === 'connect') { speak('Searching for ESP 32 camera'); t = setTimeout(() => setScr('success'), 3500); }
    else if (scr === 'success') { speak('Connected. Battery 85 percent'); t = setTimeout(() => setScr('main'), 3000); }
    return () => clearTimeout(t);
  }, [scr]);

  const goHome = () => { setMode('controls'); setTab('home'); };

  const startOCR = () => {
    setMode('ocr');
    setOcrScanning(true);
    setOcrText('');
    speak('Scanning text from document');
    setTimeout(() => {
      setOcrScanning(false);
      const txt = 'The quick brown fox jumps over the lazy dog. Education is the most powerful weapon which you can use to change the world. — Nelson Mandela';
      setOcrText(txt);
      speak(txt);
    }, 3500);
  };

  const startVoice = () => {
    setMode('voice');
    setListening(true);
    setTranscript('Listening...');
    speak('Listening');
    setTimeout(() => {
      setTranscript('"What is in front of me?"');
      setTimeout(() => {
        speak('There is a person 1.2 meters ahead and a parked car 3 meters to your left');
        setTranscript('"Person 1.2m ahead, Car 3m left"');
        setTimeout(() => setListening(false), 5000);
      }, 1500);
    }, 2500);
  };

  // ====== SPLASH ======
  if (scr === 'splash') return (
    <div className="app-container">
      <div className="screen splash-screen no-pad-bottom" onClick={() => setScr('connect')}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="splash-logo-wrap"><Glasses size={80} color="#fff" /></div>
          <h1 className="splash-title">Guide Glass</h1>
          <p className="splash-subtitle">Smart Vision. Safe Navigation.</p>
          <div className="splash-tag">👁️ For Visually Impaired</div>
        </div>
      </div>
    </div>
  );

  // ====== CONNECT ======
  if (scr === 'connect') return (
    <div className="app-container">
      <div className="screen connect-screen no-pad-bottom" onClick={() => setScr('success')}>
        <div className="radar-wrap scanning"><Wifi size={90} color="#B388FF" /></div>
        <h2 style={{ fontSize: 24 }}>Connecting ESP32-CAM...</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Checking Wi-Fi & Ultrasonic Sensor</p>
        <div className="device-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Glasses size={24} color="#B388FF" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700 }}>GuideGlass_ESP32</div>
              <div style={{ fontSize: 12, color: '#00E676' }}>● Signal Strong</div>
            </div>
          </div>
          <Wifi color="#00E676" size={22} />
        </div>
      </div>
    </div>
  );

  // ====== SUCCESS ======
  if (scr === 'success') return (
    <div className="app-container">
      <div className="screen connect-screen no-pad-bottom" onClick={() => setScr('main')}>
        <div className="radar-wrap connected"><CheckCircle2 size={100} color="#00E676" /></div>
        <h2 style={{ fontSize: 28, color: '#00E676' }}>Connected!</h2>
        <div className="battery-bar" style={{ marginTop: 40 }}>
          <div className="battery-circle"><div className="battery-circle-inner">85%</div></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Battery: 85%</div>
            <div style={{ color: '#00E676', fontSize: 13 }}>● Charging</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '15px 20px', width: '100%' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 14, borderRadius: 14, textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Thermometer size={22} color="#FF80AB" style={{ marginBottom: 6 }} /><br />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Temp</span><br />
            <span style={{ fontWeight: 700 }}>32°C</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 14, borderRadius: 14, textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Wifi size={22} color="#448AFF" style={{ marginBottom: 6 }} /><br />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Signal</span><br />
            <span style={{ fontWeight: 700 }}>Strong</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ====== MAIN APP ======
  return (
    <div className="app-container">
      <div className="screen">

        {/* ===== HOME TAB ===== */}
        {tab === 'home' && mode === 'controls' && <>
          <div className="header" style={{ justifyContent: 'center' }}>
            <span style={{ fontSize: 22, background: 'linear-gradient(90deg,#B388FF,#E040FB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Guide Glass</span>
          </div>

          {/* Battery */}
          <div className="battery-bar">
            <div className="battery-circle"><div className="battery-circle-inner">85%</div></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>ESP32 Battery: 85%</div>
              <div style={{ color: '#00E676', fontSize: 12 }}>● Connected • Firmware v1.0.3</div>
            </div>
            <Battery color="#00E676" size={28} />
          </div>

          {/* GPS */}
          <div className="gps-bar">
            <MapPin size={22} color="#448AFF" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>GPS Active</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>12.9716° N, 77.5946° E</div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="feature-grid">
            <div className="feature-card" onClick={() => { setMode('live'); speak('Starting live detection'); }}>
              <div className="feature-icon icon-green"><Eye size={28} color="#000" /></div>
              <span className="feature-label">Live Detection</span>
            </div>
            <div className="feature-card" onClick={startOCR}>
              <div className="feature-icon icon-orange"><BookOpen size={28} color="#000" /></div>
              <span className="feature-label">Read Text</span>
            </div>
            <div className="feature-card" onClick={startVoice}>
              <div className="feature-icon icon-purple"><Mic size={28} /></div>
              <span className="feature-label">Voice Ask</span>
            </div>
            <div className="feature-card" onClick={() => { setMode('distance'); speak('Distance alerts'); }}>
              <div className="feature-icon icon-pink"><Navigation size={28} /></div>
              <span className="feature-label">Distance Alerts</span>
            </div>
          </div>

          <button className="btn-gradient" style={{ marginTop: 'auto' }} onClick={() => { setMode('live'); speak('Starting live detection'); }}>
            <Eye size={22} /> START DETECTION
          </button>
        </>}

        {/* ===== LIVE VIEW ===== */}
        {tab === 'home' && mode === 'live' && <>
          <div className="header">
            <ArrowLeft className="header-back" size={28} onClick={goHome} />
            <span>Live View</span>
            <Cog size={22} style={{ marginLeft: 'auto', color: '#B388FF', cursor: 'pointer' }} onClick={() => setTab('settings')} />
          </div>
          <div className="video-container">
            <img src="https://images.unsplash.com/photo-1517646287270-a569ca31e649?auto=format&fit=crop&q=80&w=800&h=600" alt="Camera" className="video-placeholder" />
            <div className="bounding-box box-1"><div className="box-label label-green">PERSON 1.2m</div></div>
            <div className="bounding-box box-2"><div className="box-label label-orange">CAR 4.2m</div></div>
            <div className="live-badge"><span style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%' }}></span>LIVE</div>
            <div className="fps-badge">FPS 12</div>
          </div>
          <div className="det-card det-green" onClick={() => speak('Person detected at 1.2 meters ahead')}>
            <div className="det-icon icon-green"><User size={24} color="#000" /></div>
            <div><div style={{ fontWeight: 700 }}>Person Detected</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Ultrasonic: 1.2m • Front</div></div>
          </div>
          <div className="det-card det-orange" onClick={() => speak('Car detected at 4.2 meters to the left')}>
            <div className="det-icon icon-orange"><AlertTriangle size={24} color="#000" /></div>
            <div><div style={{ fontWeight: 700 }}>Car Detected</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Ultrasonic: 4.2m • Left</div></div>
          </div>
          <div className="soundwave">
            {[...Array(15)].map((_, i) => <div key={i} className="bar bar-purple" style={{ animationDelay: `${i * 0.08}s` }}></div>)}
          </div>
          <button className="btn-gradient btn-red" onClick={() => { goHome(); speak('Detection stopped'); }}>
            <StopCircle size={20} /> STOP DETECTION
          </button>
          <button className="btn-gradient btn-blue" onClick={() => speak('Person 1.2 meters ahead. Car 4.2 meters left.')}>
            <Volume2 size={20} /> SPEAK ALL
          </button>
        </>}

        {/* ===== OCR TEXT READER ===== */}
        {tab === 'home' && mode === 'ocr' && <>
          <div className="header">
            <ArrowLeft className="header-back" size={28} onClick={goHome} />
            <span>📖 Text Reader</span>
          </div>
          <div className="ocr-screen">
            <div className="ocr-image-container">
              <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800&h=500" alt="Book" />
              {ocrScanning && <div className="ocr-highlight" style={{ left: '5%', width: '90%' }}></div>}
            </div>
            {ocrScanning && <p style={{ textAlign: 'center', color: '#FFD740', fontWeight: 700, margin: '15px 0' }}>🔍 Scanning text...</p>}
            {ocrText && <>
              <div className="ocr-text-result">
                <div style={{ fontSize: 12, color: '#FFD740', fontWeight: 700, marginBottom: 8 }}>📝 DETECTED TEXT:</div>
                {ocrText}
              </div>
              <button className="btn-gradient btn-orange" onClick={() => speak(ocrText)}>
                <Volume2 size={20} /> READ ALOUD
              </button>
            </>}
            {!ocrScanning && !ocrText && <button className="btn-gradient btn-orange" onClick={startOCR}>
              <BookOpen size={20} /> SCAN DOCUMENT
            </button>}
          </div>
        </>}

        {/* ===== VOICE ASSISTANT ===== */}
        {tab === 'home' && mode === 'voice' && <>
          <div className="header">
            <ArrowLeft className="header-back" size={28} onClick={goHome} />
            <span>🎙️ Voice Assistant</span>
          </div>
          <button className={`voice-ring ${listening ? 'listening' : 'idle'}`} onClick={startVoice}>
            <Mic size={60} color="#fff" />
          </button>
          <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 18 }}>{listening ? 'Listening...' : 'Tap to Ask'}</p>
          {transcript && <div className="transcript-bubble">{transcript}</div>}
          <div className="soundwave" style={{ margin: '15px 0' }}>
            {listening && [...Array(15)].map((_, i) => <div key={i} className="bar bar-green" style={{ animationDelay: `${i * 0.08}s` }}></div>)}
          </div>
        </>}

        {/* ===== DISTANCE ALERTS ===== */}
        {tab === 'home' && mode === 'distance' && <>
          <div className="header">
            <ArrowLeft className="header-back" size={28} onClick={goHome} />
            <span>📏 Distance Alerts</span>
          </div>
          <div className="distance-card dist-red" onClick={() => speak('Very close. 0 to 1 meter')}>
            <AlertCircle size={28} color="#FF5252" />
            <div><div style={{ fontWeight: 800, color: '#FF5252' }}>Very Close</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>0 – 1 meter</div></div>
          </div>
          <div className="distance-card dist-orange" onClick={() => speak('Medium distance. 1 to 3 meters')}>
            <AlertTriangle size={28} color="#FFAB00" />
            <div><div style={{ fontWeight: 800, color: '#FFAB00' }}>Medium</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>1 – 3 meters</div></div>
          </div>
          <div className="distance-card dist-green" onClick={() => speak('Far distance. More than 3 meters')}>
            <Info size={28} color="#00E676" />
            <div><div style={{ fontWeight: 800, color: '#00E676' }}>Far</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>3+ meters</div></div>
          </div>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, padding: 20 }}>You will be notified based on distance range</p>
        </>}

        {/* ===== HISTORY TAB ===== */}
        {tab === 'history' && <>
          <div className="header">
            <ArrowLeft className="header-back" size={28} onClick={goHome} />
            <span>History Log</span>
          </div>
          <div style={{ padding: '10px 20px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>TODAY</div>
          {[
            { time: '10:30 AM', obj: 'Person detected', dist: '1.2m ahead', dot: 'dot-green' },
            { time: '10:28 AM', obj: 'Car detected', dist: '3.4m left', dot: 'dot-orange' },
            { time: '10:25 AM', obj: 'Pole detected', dist: '2.1m right', dot: 'dot-red' },
            { time: '10:22 AM', obj: 'Text scanned', dist: 'Newspaper article', dot: 'dot-blue' },
            { time: '10:20 AM', obj: 'No objects', dist: 'Path is clear', dot: 'dot-green' },
          ].map((h, i) => (
            <div key={i} className="history-item" onClick={() => speak(`${h.obj}, ${h.dist}`)}>
              <div className={`history-dot ${h.dot}`}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{h.obj}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{h.dist}</div>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{h.time}</div>
            </div>
          ))}
          <button className="btn-gradient btn-blue" onClick={() => speak('At 10:30, Person detected 1.2 meters ahead. At 10:28, Car detected 3.4 meters left. At 10:25, Pole detected 2.1 meters right.')}>
            <Volume2 size={20} /> READ ALL HISTORY
          </button>
        </>}

        {/* ===== SOS TAB ===== */}
        {tab === 'sos' && <>
          <div className="header" style={{ justifyContent: 'center' }}>
            <span style={{ color: '#FF5252' }}>🆘 Emergency SOS</span>
          </div>
          <button className="sos-btn" onClick={() => speak('Emergency alert sent to all contacts with your GPS location')}>
            SOS
          </button>
          <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 16, padding: '0 30px' }}>Press to send emergency alert with GPS location</p>
          <div style={{ padding: '20px 0' }}>
            <div style={{ padding: '0 20px', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>EMERGENCY CONTACTS</div>
            <div className="contact-card" onClick={() => speak('Calling Ankit')}>
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100" alt="Contact" className="contact-avatar" />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>Ankit (Brother)</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>+91 98765 43210</div></div>
              <Phone color="#00E676" size={22} />
            </div>
            <div className="contact-card" onClick={() => speak('Calling Mom')}>
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" alt="Contact" className="contact-avatar" />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>Mom</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>+91 98765 12345</div></div>
              <Phone color="#00E676" size={22} />
            </div>
          </div>
        </>}

        {/* ===== SETTINGS TAB ===== */}
        {tab === 'settings' && <>
          <div className="header">
            <ArrowLeft className="header-back" size={28} onClick={goHome} />
            <span>⚙️ Settings</span>
          </div>

          <div style={{ padding: '5px 20px 0', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>VOICE SETTINGS</div>
          <div className="settings-section">
            <div className="settings-row"><span className="settings-row-label">Language</span></div>
            <select value={lang} onChange={e => setLang(e.target.value)}>
              <option value="en-IN">English (India)</option><option value="en-US">English (US)</option><option value="hi-IN">Hindi</option><option value="ta-IN">Tamil</option><option value="te-IN">Telugu</option>
            </select>
            <div className="settings-row"><span className="settings-row-label">Speech Speed</span><span className="settings-row-value">{speed}%</span></div>
            <input type="range" min={10} max={100} value={speed} onChange={e => setSpeed(+e.target.value)} />
            <div className="settings-row"><span className="settings-row-label">Voice Volume</span><span className="settings-row-value">{volume}%</span></div>
            <input type="range" min={10} max={100} value={volume} onChange={e => setVolume(+e.target.value)} />
          </div>

          <div style={{ padding: '15px 20px 0', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>DETECTION SETTINGS</div>
          <div className="settings-section">
            <div className="settings-row">
              <span className="settings-row-label">Detailed Descriptions</span>
              <div className={`toggle ${detailed ? 'on' : 'off'}`} onClick={() => setDetailed(!detailed)}></div>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Vibration Feedback</span>
              <div className={`toggle ${vibration ? 'on' : 'off'}`} onClick={() => setVibration(!vibration)}></div>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Auto Speak Detections</span>
              <div className={`toggle ${autoSpeak ? 'on' : 'off'}`} onClick={() => setAutoSpeak(!autoSpeak)}></div>
            </div>
            <div className="settings-row"><span className="settings-row-label">Alert Mode</span></div>
            <select defaultValue="voice"><option value="voice">Voice + Vibration</option><option value="vibrate">Vibration Only</option><option value="beep">Beep Only</option><option value="silent">Silent</option></select>
          </div>

          <div style={{ padding: '15px 20px 0', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>DEVICE INFO</div>
          <div className="settings-section">
            <div className="settings-row"><span className="settings-row-label">Device</span><span className="settings-row-value">GuideGlass_ESP32</span></div>
            <div className="settings-row"><span className="settings-row-label">Firmware</span><span className="settings-row-value">v1.0.3</span></div>
            <div className="settings-row"><span className="settings-row-label">Battery</span><span className="settings-row-value" style={{ color: '#00E676' }}>85%</span></div>
            <div className="settings-row"><span className="settings-row-label">Temperature</span><span className="settings-row-value">32°C</span></div>
            <div className="settings-row"><span className="settings-row-label">Wi-Fi Signal</span><span className="settings-row-value" style={{ color: '#00E676' }}>Strong</span></div>
          </div>

          <button className="btn-gradient" onClick={() => { speak('Settings saved'); goHome(); }}>
            <CheckCircle2 size={20} /> SAVE SETTINGS
          </button>

          <button className="btn-gradient btn-red" style={{ marginBottom: 20 }} onClick={() => speak('Device disconnected')}>
            <Wifi size={20} /> DISCONNECT
          </button>
        </>}
      </div>

      {/* ===== BOTTOM NAV ===== */}
      <div className="bottom-nav">
        <div className={`nav-item ${tab === 'home' ? 'active' : ''}`} onClick={() => { setTab('home'); setMode('controls'); speak('Home'); }}>
          <Home size={24} /><span>Home</span>
        </div>
        <div className={`nav-item ${tab === 'history' ? 'active' : ''}`} onClick={() => { setTab('history'); speak('History'); }}>
          <Clock size={24} /><span>History</span>
        </div>
        <div className={`nav-item ${tab === 'sos' ? 'active' : ''}`} onClick={() => { setTab('sos'); speak('SOS'); }}>
          <AlertCircle size={24} style={{ color: tab === 'sos' ? '#FF5252' : undefined }} /><span style={{ color: tab === 'sos' ? '#FF5252' : undefined }}>SOS</span>
        </div>
        <div className={`nav-item ${tab === 'settings' ? 'active' : ''}`} onClick={() => { setTab('settings'); speak('Settings'); }}>
          <Cog size={24} /><span>Settings</span>
        </div>
      </div>
    </div>
  );
}
