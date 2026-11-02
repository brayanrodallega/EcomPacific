import { useState, type FormEvent } from 'react';
import { login, saveSession } from '../services/auth.service';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setError('Completa tu correo electrónico y contraseña.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Escribe un correo electrónico válido.');
      return;
    }

    setLoading(true);
    try {
      const session = await login(normalizedEmail, password);
      saveSession(session);
      window.location.assign('/dashboard');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No fue posible iniciar sesión.');
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="eyebrow"><span /> ECOMPACIFIC</p>
        <h1 id="login-title">Qué bueno tenerte <em>de vuelta.</em></h1>
        <p className="auth-intro">Inicia sesión para continuar a tu espacio de administración.</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-email">Correo electrónico</label>
          <input id="login-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required aria-invalid={Boolean(error)} />
          <label htmlFor="login-password">Contraseña</label>
          <div className="password-field">
            <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <><span className="auth-spinner" aria-hidden="true" /> Iniciando sesión…</> : 'Iniciar sesión'}
          </button>
        </form>
        <a className="auth-back" href="/">Volver al catálogo</a>
      </section>
    </main>
  );
}
