import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Clock, AlertCircle, Home, Glasses, Wifi, Battery, Volume2, StopCircle, ArrowLeft, CheckCircle2, User, Mic, MapPin, Zap, Navigation, Phone, Calendar, Activity, Crosshair } from 'lucide-react';
import './App.css';

type ScreenState = 'splash' | 'connect' | 'success' | 'main';
type TabState = 'home' | 'history' | 'sos' | 'settings';
type HomeState = 'controls' | 'live';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [currentTab, setCurrentTab] = useState<TabState>('home');
  const [homeState, setHomeState] = useState<HomeState>('controls');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Dummy GPS location
  const currentLocation = "124 Baker Street, London";
  const coordinates = "51.5238° N, 0.1584° W";

  // Progression logic
  useEffect(() => {
    let timer: number;
    if (currentScreen === 'splash') {
      playVoice('Welcome to Guide Glass. Starting up.');
      timer = setTimeout(() => setCurrentScreen('connect'), 3000);
    } else if (currentScreen === 'connect') {
      playVoice('Searching for ESP 32 camera and ultrasonic sensor.');
      timer = setTimeout(() => setCurrentScreen('success'), 4000);
    } else if (currentScreen === 'success') {
      playVoice('Connected successfully. Battery at 85 percent.');
      timer = setTimeout(() => setCurrentScreen('main'), 4000);
    }
    return () => clearTimeout(timer);
  }, [currentScreen]);

  const playVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startDetection = () => {
    setHomeState('live');
    playVoice('Live detection started. Ultrasonic sensor active. Person detected, 1.2 meters ahead.');
  };

  const stopDetection = () => {
    setHomeState('controls');
    playVoice('Live detection stopped.');
  };

  const handleSOS = () => {
    setCurrentTab('sos');
    playVoice('SOS screen open. Double tap the center of the screen to send emergency alert.');
  };

  const sendSOS = () => {
    playVoice('Emergency alert sent to your contacts with current GPS location.');
  };

  const toggleVoiceCommand = () => {
    // Simulate Voice to Text functionality
    if (isListening) {
      setIsListening(false);
      return;
    }
    
    setIsListening(true);
    setTranscript('Listening...');
    playVoice('Listening');
    
    // Mocking speech recognition delay
    setTimeout(() => {
      setTranscript('What is in front of me?');
      playVoice('You asked: What is in front of me? ... There is a person 1.2 meters ahead of you, and a parked car 3 meters to your left.');
      setTimeout(() => {
        setIsListening(false);
        setTranscript('');
      }, 8000);
    }, 2500);
  };

  const renderHomeContent = () => {
    if (homeState === 'controls') {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="header" style={{ justifyContent: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 'bold' }}>Guide Glass</span>
          </div>

          <div style={{ padding: '15px 20px', background: '#f8f9fa', margin: '15px 20px', borderRadius: 16, border: '2px solid #e0e0e0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#5E35B1', marginBottom: 5 }}>
              <MapPin size={20} /> <span style={{ fontWeight: 'bold' }}>GPS Location Active</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>{currentLocation}</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{coordinates}</div>
          </div>

          <button 
            onClick={startDetection}
            className="huge-blind-button primary-action"
            style={{ margin: '10px 20px', flex: 1, minHeight: '150px' }}
          >
            <Mic size={40} style={{ marginBottom: 10 }} />
            <span>START DETECTION</span>
          </button>

          <button 
            onClick={toggleVoiceCommand}
            className={`huge-blind-button voice-action ${isListening ? 'listening-pulse' : ''}`}
            style={{ margin: '10px 20px', flex: 1, minHeight: '120px' }}
          >
            <Volume2 size={40} style={{ marginBottom: 10 }} />
            <span>{isListening ? 'LISTENING...' : 'VOICE ASSISTANT'}</span>
          </button>
          
          {transcript && (
            <div style={{ padding: '0 20px', textAlign: 'center', fontSize: 18, color: '#5E35B1', fontWeight: 'bold', minHeight: 30 }}>
              "{transcript}"
            </div>
          )}

          <div className="status-grid" style={{ padding: '10px 20px 20px 20px' }}>
            <div className="status-item" style={{ border: '2px solid #ddd' }}>
              <Battery color="#4CAF50" size={30} style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>85%</div>
            </div>
            <div className="status-item" style={{ border: '2px solid #ddd' }}>
              <Wifi color="#4CAF50" size={30} style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>ESP32 Connected</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="header" style={{ justifyContent: 'space-between' }}>
          <ArrowLeft className="header-icon" onClick={stopDetection} />
          <span style={{ fontSize: 20 }}>Live View</span>
          <div style={{ width: 24 }}></div>
        </div>

        <div className="video-container">
          <img src="https://images.unsplash.com/photo-1517646287270-a569ca31e649?auto=format&fit=crop&q=80&w=800&h=1200" alt="Street view" className="video-placeholder" />
          {/* Animated Bounding Box */}
          <div className="bounding-box moving-box">
            <div className="box-label">PERSON</div>
          </div>
        </div>

        <div className="dark-card" style={{ cursor: 'pointer', margin: '10px 20px' }} onClick={() => playVoice('Person detected at 1.2 meters via Ultrasonic sensor.')}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(76, 175, 80, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
            <Activity size={30} color="#4CAF50" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18 }}>Person Detected</h3>
            <p style={{ margin: 0, color: '#aaa', fontSize: 14, marginTop: 4 }}>
              Ultrasonic Distance: 1.2m
            </p>
          </div>
        </div>

        <div style={{ flex: 1, padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#666', fontSize: 18 }}><Crosshair size={22} /> Sensor</div>
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>Ultrasonic (HC-SR04)</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#666', fontSize: 18 }}><MapPin size={22} /> Distance</div>
            <div style={{ fontWeight: 'bold', fontSize: 18, color: '#F44336' }}>1.2 meters (CLOSE)</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#666', fontSize: 18 }}><MapPin size={22} /> GPS</div>
            <div style={{ fontWeight: 'bold', fontSize: 16 }}>{coordinates}</div>
          </div>
        </div>

        <div className="detection-info">
          <div className="soundwave">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>

          <button className="huge-blind-button voice-action" style={{ width: '100%', marginTop: 10 }} onClick={() => playVoice('Person, 1.2 meters. Car, 3 meters.')}>
            <Volume2 size={24} style={{ marginRight: 10 }} />
            READ ALOUD
          </button>
        </div>
      </div>
    );
  };

  const renderSOSContent = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="header">
        <span style={{ fontSize: 24, fontWeight: 'bold', margin: '0 auto' }}>Emergency SOS</span>
      </div>
      
      <div className="sos-button-container" style={{ margin: '40px 0 20px 0' }}>
        <button className="sos-button" onClick={sendSOS} style={{ width: 250, height: 250, fontSize: 60 }}>
          SOS
        </button>
      </div>
      <p style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#333', padding: '0 20px' }}>
        TAP HUGE RED BUTTON TO SEND EMERGENCY ALERT WITH GPS LOCATION
      </p>
    </div>
  );

  return (
    <div className="app-container">
      {currentScreen === 'splash' && (
        <div className="screen splash-screen no-scroll" onClick={() => setCurrentScreen('connect')}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Glasses className="splash-logo" />
            <h1 className="splash-title" style={{ fontSize: 40 }}><span>Guide</span> Glass</h1>
            <p className="splash-subtitle" style={{ fontSize: 20, fontWeight: 'bold' }}>For Visually Impaired</p>
          </div>
        </div>
      )}

      {currentScreen === 'connect' && (
        <div className="screen connect-screen no-scroll" onClick={() => setCurrentScreen('success')}>
          <div className="radar-container" style={{ width: 300, height: 300, marginTop: 100 }}>
            <Wifi size={100} color="#5E35B1" />
          </div>
          <h2 style={{ marginTop: 40, fontSize: 28 }}>Connecting ESP32...</h2>
          <p style={{ color: '#333', fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Checking Wi-Fi & Ultrasonic Sensor</p>
        </div>
      )}

      {currentScreen === 'success' && (
        <div className="screen connect-screen no-scroll" onClick={() => setCurrentScreen('main')}>
          <div className="radar-container success" style={{ width: 300, height: 300, marginTop: 100 }}>
            <CheckCircle2 size={120} color="#4CAF50" />
          </div>
          <h2 style={{ marginTop: 40, fontSize: 32, color: '#4CAF50' }}>Connected!</h2>
          
          <div className="status-grid" style={{ marginTop: 40, width: '100%' }}>
            <div className="status-item" style={{ border: '2px solid #4CAF50' }}>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#666' }}>Battery</div>
              <div style={{ fontSize: 32, fontWeight: 'bold' }}>85%</div>
            </div>
          </div>
        </div>
      )}

      {currentScreen === 'main' && (
        <>
          <div className={`screen ${currentTab === 'home' && homeState === 'controls' ? 'no-scroll' : ''}`}>
            {currentTab === 'home' && renderHomeContent()}
            {currentTab === 'sos' && renderSOSContent()}
            
            {/* History and Settings remain simplified for blind-friendly mode to reduce clutter in this demo */}
            {currentTab === 'history' && (
              <div style={{ padding: 20 }}>
                <h2 style={{ marginBottom: 20 }}>Detection History</h2>
                <button className="huge-blind-button voice-action" onClick={() => playVoice('At 10:30 AM, Person detected at 1.2 meters. At 10:28 AM, Car detected at 3.4 meters.')}>
                  <Volume2 size={30} style={{ marginRight: 10 }} />
                  READ HISTORY
                </button>
              </div>
            )}
            {currentTab === 'settings' && (
              <div style={{ padding: 20 }}>
                <h2 style={{ marginBottom: 20 }}>Voice Settings</h2>
                <button className="huge-blind-button primary-action" onClick={() => playVoice('Speech speed set to normal. Volume set to high.')}>
                  <Volume2 size={30} style={{ marginRight: 10 }} />
                  CHECK SETTINGS
                </button>
              </div>
            )}
          </div>

          <div className="bottom-nav">
            <div 
              className={`nav-item ${currentTab === 'home' ? 'active' : ''}`} 
              onClick={() => { setCurrentTab('home'); setHomeState('controls'); playVoice('Home screen'); }}
            >
              <Home size={32} style={{ marginBottom: 4 }} />
              <span style={{ fontSize: 14, fontWeight: 'bold' }}>Home</span>
            </div>
            <div 
              className={`nav-item ${currentTab === 'history' ? 'active' : ''}`} 
              onClick={() => { setCurrentTab('history'); playVoice('History screen'); }}
            >
              <Clock size={32} style={{ marginBottom: 4 }} />
              <span style={{ fontSize: 14, fontWeight: 'bold' }}>History</span>
            </div>
            <div 
              className={`nav-item ${currentTab === 'sos' ? 'active' : ''}`} 
              onClick={() => { handleSOS(); }}
            >
              <AlertCircle size={32} style={{ marginBottom: 4, color: currentTab === 'sos' ? '#f44336' : '#999' }} />
              <span style={{ fontSize: 14, fontWeight: 'bold', color: currentTab === 'sos' ? '#f44336' : '#999' }}>SOS</span>
            </div>
            <div 
              className={`nav-item ${currentTab === 'settings' ? 'active' : ''}`} 
              onClick={() => { setCurrentTab('settings'); playVoice('Settings screen'); }}
            >
              <SettingsIcon size={32} style={{ marginBottom: 4 }} />
              <span style={{ fontSize: 14, fontWeight: 'bold' }}>Settings</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
