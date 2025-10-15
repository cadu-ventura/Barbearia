import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0f172a', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          💈 Barbearia Hoshirara
        </h1>
        <p>Sistema funcionando!</p>
        <button 
          style={{ 
            marginTop: '1rem', 
            padding: '0.5rem 1rem', 
            background: '#1e40af', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => alert('Funcionando!')}
        >
          Testar
        </button>
      </div>
    </div>
  );
};

export default TestApp;