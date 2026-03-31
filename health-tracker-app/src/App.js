import React, { useState, useEffect } from 'react';
import { Activity, Heart, Moon, Utensils, MessageSquare, Send, User } from 'lucide-react';

const App = () => {
  // State for Health Data
  const [healthData, setHealthData] = useState({
    steps: 4500,
    heartRate: 72,
    calories: 1250,
    sleep: "7h 20m"
  });

  // State for AI Chat
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Health Agent. How are you feeling today?", sender: "agent" }
  ]);
  const [input, setInput] = useState("");

  // Simulate Agent Response
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    // Simple AI Simulation logic
    setTimeout(() => {
      let response = "I've logged that for you. Keep up the good work!";
      if (input.toLowerCase().includes("step")) {
        response = `You've done ${healthData.steps} steps so far. You're 55% of the way to your goal!`;
      } else if (input.toLowerCase().includes("tired")) {
        response = "I noticed your sleep was a bit low last night. Maybe try a 10-minute meditation?";
      }
      setMessages(prev => [...prev, { text: response, sender: "agent" }]);
    }, 1000);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>HealthAssist <span style={{fontWeight: 'normal', fontSize: '0.6em', color: '#666'}}>v1.0</span></h1>
        <div style={styles.userProfile}><User size={20} /> User Account</div>
      </header>

      <div style={styles.mainLayout}>
        {/* Dashboard Grid */}
        <section style={styles.dashboard}>
          <div style={{...styles.card, borderLeft: '5px solid #4CAF50'}}>
            <Activity color="#4CAF50" />
            <h3>Steps</h3>
            <p style={styles.stat}>{healthData.steps.toLocaleString()}</p>
            <small>Goal: 10,000</small>
          </div>
          <div style={{...styles.card, borderLeft: '5px solid #f44336'}}>
            <Heart color="#f44336" />
            <h3>Heart Rate</h3>
            <p style={styles.stat}>{healthData.heartRate} <span style={{fontSize: '0.5em'}}>BPM</span></p>
            <small>Resting: Normal</small>
          </div>
          <div style={{...styles.card, borderLeft: '5px solid #2196F3'}}>
            <Utensils color="#2196F3" />
            <h3>Nutrition</h3>
            <p style={styles.stat}>{healthData.calories}</p>
            <small>kcal consumed</small>
          </div>
          <div style={{...styles.card, borderLeft: '5px solid #9c27b0'}}>
            <Moon color="#9c27b0" />
            <h3>Sleep</h3>
            <p style={styles.stat}>{healthData.sleep}</p>
            <small>Quality: Good</small>
          </div>
        </section>

        {/* AI Agent Chat Sidebar */}
        <aside style={styles.chatSection}>
          <div style={styles.chatHeader}>
            <MessageSquare size={20} style={{marginRight: '10px'}} />
            Health Agent
          </div>
          <div style={styles.chatWindow}>
            {messages.map((m, i) => (
              <div key={i} style={m.sender === 'agent' ? styles.agentBubble : styles.userBubble}>
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} style={styles.inputArea}>
            <input 
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI agent..."
            />
            <button type="submit" style={styles.sendBtn}><Send size={18} /></button>
          </form>
        </aside>
      </div>
    </div>
  );
};

// Simple inline styles for a clean UI
const styles = {
  container: { backgroundColor: '#f5f7f9', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  userProfile: { display: 'flex', alignItems: 'center', gap: '8px', color: '#555' },
  mainLayout: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px', padding: '30px 40px' },
  dashboard: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  stat: { fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0', color: '#333' },
  chatSection: { backgroundColor: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', height: '80vh', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  chatHeader: { padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', display: 'flex', alignItems: 'center' },
  chatWindow: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  agentBubble: { backgroundColor: '#e9ecef', padding: '10px', borderRadius: '12px 12px 12px 0', maxWidth: '85%', fontSize: '0.9rem', alignSelf: 'flex-start' },
  userBubble: { backgroundColor: '#2196F3', color: '#fff', padding: '10px', borderRadius: '12px 12px 0 12px', maxWidth: '85%', fontSize: '0.9rem', alignSelf: 'flex-end' },
  inputArea: { padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' },
  sendBtn: { backgroundColor: '#2196F3', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }
};

export default App;