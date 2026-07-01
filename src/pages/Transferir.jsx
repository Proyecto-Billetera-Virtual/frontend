import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

function Transferir() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    destino_cvu: "",
    monto: "",
    moneda: "ARS",
  });
  const [codigo_correo, setCodigoCorreo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateStep1() {
    if (!form.destino_cvu || !form.monto) {
      return "Todos los campos son obligatorios";
    }
    if (Number(form.monto) <= 0) {
      return "El monto debe ser mayor a 0";
    }
    return "";
  }

  async function handleSubmitStep1(e) {
    e.preventDefault();
    setError("");

    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/pasarela/operaciones/transferir", {
        method: "POST",
        body: JSON.stringify({
          destino_cvu: form.destino_cvu,
          monto: Number(form.monto),
          moneda: form.moneda,
        }),
      });
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitStep2(e) {
    e.preventDefault();
    setError("");

    if (!codigo_correo) {
      setError("Ingresá el código de confirmación");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/pasarela/operaciones/confirmar", {
        method: "POST",
        body: JSON.stringify({ codigo_correo }),
      });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div>
        <h2>¡Transferencia exitosa!</h2>
        <p>Te redirigimos al Dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Transferir dinero</h2>

      {step === 1 && (
        <form onSubmit={handleSubmitStep1}>
          <input
            name="destino_cvu"
            placeholder="CVU destino"
            value={form.destino_cvu}
            onChange={handleChange}
          />
          <input
            name="monto"
            type="number"
            placeholder="Monto"
            value={form.monto}
            onChange={handleChange}
          />
          <select name="moneda" value={form.moneda} onChange={handleChange}>
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
          </select>

          <Alert type="error">{error}</Alert>

          <button type="submit" disabled={loading}>
            {loading && <Spinner />}
            {loading ? "Procesando..." : "Continuar"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmitStep2}>
          <p>Te enviamos un código de confirmación a tu correo.</p>
          <input
            placeholder="Código de confirmación"
            value={codigo_correo}
            onChange={(e) => setCodigoCorreo(e.target.value)}
          />

          <Alert type="error">{error}</Alert>

          <button type="submit" disabled={loading}>
            {loading && <Spinner />}
            {loading ? "Confirmando..." : "Confirmar transferencia"}
          </button>
        </form>
      )}

      <p>
        <Link to="/dashboard">Cancelar</Link>
      </p>
    </div>
  );
}

export default Transferir;