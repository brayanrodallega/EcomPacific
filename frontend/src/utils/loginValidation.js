const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(values) {
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
