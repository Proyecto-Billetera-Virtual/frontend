import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    codigo: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.codigo || !form.newPassword || !form.confirmPassword) {
      return "Todos los campos son obligatorios";
    }
    if (form.newPassword !== form.confirmPassword) {
      return "Las contraseñas no coinciden";
    }
    if (form.newPassword.length < 6) {
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
      await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          codigo: form.codigo,
          newPassword: form.newPassword,
        }),
      });
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
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
          name="codigo"
          placeholder="Código recibido por correo"
          value={form.codigo}
          onChange={handleChange}
        />
        <input
          name="newPassword"
          type="password"
          placeholder="Nueva contraseña"
          value={form.newPassword}
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
          {loading ? "Cargando..." : "Continuar"}
        </button>
      </form>

      <p>
        <Link to="/">Volver al login</Link>
      </p>
    </div>
  );
}

export default ResetPassword;