import { useState } from 'react';
import { login } from './services/authService.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = 'Ingresa tu correo electrónico.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (!values.password) {
    errors.password = 'Ingresa tu contraseña.';
  } else if (values.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  return errors;
}

function EyeIcon({ hidden }) {
  return hidden ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 3 18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.2 0 9.5 6 9.5 6a16 16 0 0 1-3.1 3.7M6.2 6.3C3.8 7.8 2.5 12 2.5 12s3.3 6 9.5 6c1.4 0 2.6-.3 3.7-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export default function App() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [session, setSession] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setFormError('');

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const auth = await login({ email: values.email.trim(), password: values.password });
      // La sesión se conserva solo en memoria; nunca se escribe en localStorage.
      setSession(auth);
    } catch (error) {
      setFormError(error.message || 'No fue posible iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSignOut() {
    setSession(null);
    setValues({ email: '', password: '' });
  }

  return (
    <main className="page-shell">
      <section className="login-layout" aria-labelledby="page-title">
        <aside className="brand-panel" aria-label="EcomPacific, muebles para tu hogar">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-mark__sun" />
            <span className="brand-mark__horizon" />
            <span className="brand-mark__chair" />
          </div>
          <div className="wordmark" aria-label="EcomPacific">
            <span className="wordmark__icon" aria-hidden="true">E</span>
            <span>EcomPacific</span>
          </div>
          <div className="brand-copy">
            <p className="eyebrow">Un hogar que se siente tuyo</p>
            <h1>Diseño para vivirlo todos los días.</h1>
            <p>Encuentra piezas que hacen de cada espacio un lugar especial.</p>
          </div>
          <p className="brand-caption">Muebles hechos para quedarse.</p>
        </aside>

        <div className="form-panel">
          <div className="mobile-wordmark" aria-hidden="true">
            <span className="wordmark__icon">E</span>
            <span>EcomPacific</span>
          </div>

          {session ? (
            <section className="success-state" aria-live="polite">
              <div className="success-icon" aria-hidden="true">✓</div>
              <p className="eyebrow">Sesión iniciada</p>
              <h2 id="page-title">¡Qué bueno verte, {session.user.nombre}!</h2>
              <p className="form-intro">Has iniciado sesión con {session.user.email}.</p>
              <button className="secondary-button" onClick={handleSignOut} type="button">
                Cerrar sesión
              </button>
            </section>
          ) : (
            <div className="form-content">
              <div className="form-heading">
                <p className="eyebrow">Bienvenido de vuelta</p>
                <h2 id="page-title">Inicia sesión</h2>
                <p className="form-intro">Ingresa tus datos para continuar a tu cuenta.</p>
              </div>

              <form className="login-form" onSubmit={handleSubmit} noValidate>
                <div className="field-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    autoComplete="email"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={Boolean(errors.email)}
                    id="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="nombre@correo.com"
                    type="email"
                    value={values.email}
                  />
                  {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
                </div>

                <div className="field-group">
                  <label htmlFor="password">Contraseña</label>
                  <div className={`password-field${errors.password ? ' password-field--invalid' : ''}`}>
                    <input
                      autoComplete="current-password"
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      aria-invalid={Boolean(errors.password)}
                      id="password"
                      name="password"
                      onChange={handleChange}
                      placeholder="Ingresa tu contraseña"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                    />
                    <button
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      aria-pressed={showPassword}
                      className="visibility-button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      type="button"
                    >
                      <EyeIcon hidden={showPassword} />
                    </button>
                  </div>
                  {errors.password && <p className="field-error" id="password-error">{errors.password}</p>}
                </div>

                {formError && (
                  <p className="form-error" role="alert">{formError}</p>
                )}

                <button className="submit-button" disabled={isSubmitting} type="submit">
                  {isSubmitting ? (
                    <><span className="spinner" aria-hidden="true" /> Verificando...</>
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>
              </form>

              <p className="form-footnote">Acceso seguro a tu cuenta EcomPacific.</p>
            </div>
          )}
          <footer className="form-footer">© {new Date().getFullYear()} EcomPacific</footer>
        </div>
      </section>
    </main>
  );
}
