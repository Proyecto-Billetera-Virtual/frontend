import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

function PagarServicios() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    servicio: "Edesur",
    monto: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comprobante, setComprobante] = useState(null);

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
      const data = await apiRequest("/pasarela/operaciones/pagar", {
        method: "POST",
        body: JSON.stringify({
          servicio: form.servicio,
          monto: Number(form.monto),
        }),
      });
      setComprobante(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (comprobante) {
    return (
      <div>
        <h2>Comprobante de pago</h2>
        <p>Servicio: {form.servicio}</p>
        <p>Monto pagado: ${form.monto}</p>
        <p>N° de comprobante: {comprobante.comprobante}</p>
        <Link to="/dashboard">Volver al Dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Pagar servicios</h2>
      <form onSubmit={handleSubmit}>
        <select name="servicio" value={form.servicio} onChange={handleChange}>
          <option value="Edesur">Edesur</option>
          <option value="Gas">Gas</option>
          <option value="Internet">Internet</option>
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
          {loading ? "Procesando..." : "Pagar"}
        </button>
      </form>

      <p>
        <Link to="/dashboard">Cancelar</Link>
      </p>
    </div>
  );
}

export default PagarServicios;