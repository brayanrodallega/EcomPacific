import { useEffect, useState } from 'react';
import { logout, readSession } from '../services/auth.service';
import type { AuthSession } from '../types/auth';

export function DashboardPage() {
  const [session] = useState<AuthSession | null>(() => readSession());

  useEffect(() => {
    if (!session) window.location.replace('/login');
  }, [session]);

  const authenticatedSession = session;
  if (!authenticatedSession) return <div className="detail-loading" aria-live="polite">Verificando sesión…</div>;
  const accessToken = authenticatedSession.accessToken;

  async function handleLogout() {
    await logout(accessToken);
    window.location.replace('/login');
  }

  return (
    <main className="dashboard-page">
      <p className="eyebrow"><span /> ESPACIO DE ADMINISTRACIÓN</p>
      <h1>Hola, <em>{session.usuario.nombre}</em></h1>
      <p>Sesión iniciada como {session.usuario.email} · {session.usuario.rol}</p>
      <button className="detail-cta" type="button" onClick={handleLogout}>Cerrar sesión</button>
    </main>
  );
}
