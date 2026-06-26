import { useState } from "react";
import { apiRequest } from "../services/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.nombre || !form.email || !form.password || !form.confirmPassword) {
      return "Todos los campos son obligatorios";
    }
    if (form.password !== form.confirmPassword) {
      return "Las contraseñas no coinciden";
    }
    if (form.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "El email no es válido";
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
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
        }),
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
        <h2>¡Registro exitoso!</h2>
        <p>Te enviamos un correo de validación. Por favor, confirma tu cuenta para poder ingresar.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <Alert type="error">{error}</Alert>

        <button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Cargando..." : "Continuar"}
        </button>
      </form>
    </div>
  );
}

export default Register;