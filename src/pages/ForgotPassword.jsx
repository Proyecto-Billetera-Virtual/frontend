import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("El email es obligatorio");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/api/auth/recuperar", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div>
        <h2>Revisá tu correo</h2>
        <p>Te enviamos un código para restablecer tu contraseña.</p>
        <Link to="/reset-password">Ya tengo mi código</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Olvidé mi contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Alert type="error">{error}</Alert>

        <button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Cargando..." : "Enviar código"}
        </button>
      </form>

      <p>
        <Link to="/">Volver al login</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;