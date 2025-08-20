import { useEffect, useState } from 'react';

const SESSION_ID_KEY = 'cart-session-id';

// Générer un ID de session unique
function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
}

// Hook pour gérer l'ID de session
export function useSessionId() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Récupérer ou créer un session ID
    let storedSessionId = localStorage.getItem(SESSION_ID_KEY);
    
    if (!storedSessionId) {
      storedSessionId = generateSessionId();
      localStorage.setItem(SESSION_ID_KEY, storedSessionId);
    }
    
    setSessionId(storedSessionId);
  }, []);

  // Fonction pour créer un nouveau session ID (utile lors de la déconnexion)
  const renewSessionId = () => {
    const newSessionId = generateSessionId();
    localStorage.setItem(SESSION_ID_KEY, newSessionId);
    setSessionId(newSessionId);
    return newSessionId;
  };

  // Fonction pour supprimer le session ID
  const clearSessionId = () => {
    localStorage.removeItem(SESSION_ID_KEY);
    setSessionId('');
  };

  return {
    sessionId,
    renewSessionId,
    clearSessionId,
  };
}
