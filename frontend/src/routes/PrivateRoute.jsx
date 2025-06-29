import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const isAuthenticated = // Adapte isso conforme sua lógica de autenticação
    true//localStorage.getItem('isAuthenticated') === 'true'; // Exemplo simples

  if (!isAuthenticated) {
    // Redireciona para o login caso não esteja autenticado
    return <Navigate to="/" replace />;
  }

  return children; // Renderiza os filhos (componentes da rota)
}

export default PrivateRoute;
