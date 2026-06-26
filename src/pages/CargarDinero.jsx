import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

function CargarDinero() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ moneda: "ARS", monto: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.monto) {
      return "El monto es obligatorio";
    }
    if (Number(form.monto) <= 0) {
      return "El monto debe ser mayor a 0";
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
      await apiRequest("/api/cuenta/ingreso", {
        method: "POST",
        body: JSON.stringify({
          moneda: form.moneda,
          monto: Number(form.monto),
        }),
      });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div>
        <h2>¡Carga exitosa!</h2>
        <p>Te redirigimos al Dashboard para ver tu saldo actualizado...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Cargar dinero</h2>
      <form onSubmit={handleSubmit}>
        <select name="moneda" value={form.moneda} onChange={handleChange}>
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
        </select>
        <input
          name="monto"
          type="number"
          placeholder="Monto"
          value={form.monto}
          onChange={handleChange}
        />

        <Alert type="error">{error}</Alert>

        <button type="submit" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Cargando..." : "Continuar"}
        </button>
      </form>

      <p>
        <Link to="/dashboard">Cancelar</Link>
      </p>
    </div>
  );
}

export default CargarDinero;