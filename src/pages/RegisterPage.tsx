import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const { register, loginWithGoogle, error, submitting, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (password !== confirm) {
      setLocalError("Las contraseñas no coinciden.");
      return;
    }
    await register(email, password);
  };

  const displayError = localError ?? error;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Crear cuenta</h1>

        {displayError && (
          <div className="error-banner" role="alert">
            {displayError}
            <button onClick={() => { setLocalError(null); clearError(); }} aria-label="Cerrar error">×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="tu@email.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="field">
            <label htmlFor="confirm">Repetir contraseña</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <div className="auth-divider"><span>o</span></div>

        <button
          className="btn-google"
          onClick={loginWithGoogle}
          disabled={submitting}
        >
          Continuar con Google
        </button>

        <p className="auth-switch">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login">Ingresá</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;