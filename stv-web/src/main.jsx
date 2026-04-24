/**
 * ============================================================================
 * 🚀 MAIN.JSX - Entry Point de la Aplicación Web
 * ============================================================================
 * 
 * QUÉ HACE:
 * - Punto de entrada de React
 * - Renderiza App en el DOM
 * - Importa estilos globales
 * 
 * CONEXIONES:
 * - index.html: Renderiza en #root
 * - App.jsx: Componente raíz
 * 
 * ============================================================================
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
