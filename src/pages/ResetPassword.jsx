import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

function ResetPassword() {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const [form, setForm] = useState({
    token_correo: "",
    nueva_password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.token_correo || !form.nueva_password || !form.confirmPassword) {
      return "Todos los campos son obligatorios";
    }
    if (form.nueva_password !== form.confirmPassword) {
      return "Las contraseñas no coinciden";
    }
    if (form.nueva_password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/api/auth/resetear", {
        method: "POST",
        body: JSON.stringify({
          token_correo: form.token_correo,
          nueva_password: form.nueva_password,
        }),
      });
      setSuccess(true);
      timerRef.current = setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div>
        <h2>¡Contraseña actualizada!</h2>
        <p>Ya podés ingresar con tu nueva contraseña. Te redirigimos al login...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Restablecer contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="token_correo"
          placeholder="Código recibido por correo"
          value={form.token_correo}
          onChange={handleChange}
        />
        <input
          name="nueva_password"
          type="password"
          placeholder="Nueva contraseña"
          value={form.nueva_password}
          onChange={handleChange}
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <Alert type="error">{error}</Alert>

        <button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Cargando..." : "Cambiar contraseña"}
        </button>
      </form>

      <p>
        <Link to="/">Volver al login</Link>
      </p>
    </div>
  );
}

export default ResetPassword;