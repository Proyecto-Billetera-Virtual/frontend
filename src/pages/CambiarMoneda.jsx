import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

function CambiarMoneda() {
  const navigate = useNavigate();
  const [cotizacion, setCotizacion] = useState(null);
  const [loadingCotizacion, setLoadingCotizacion] = useState(true);

  const [tipo, setTipo] = useState("COMPRA");
  const [monto_usd, setMontoUsd] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchCotizacion() {
      try {
        const data = await apiRequest("/api/cuenta/cotizacion", {
          method: "GET",
        });
        setCotizacion(data);
      } catch (err) {
        setError("No se pudo obtener la cotización");
      } finally {
        setLoadingCotizacion(false);
      }
    }

    fetchCotizacion();
  }, []);

  function calcularArs() {
    if (!cotizacion || !monto_usd) return 0;
    const precio = tipo === "COMPRA" ? cotizacion.venta : cotizacion.compra;
    return (Number(monto_usd) * precio).toFixed(2);
  }

  function validate() {
    if (!monto_usd) return "Ingresá un monto en USD";
    if (Number(monto_usd) <= 0) return "El monto debe ser mayor a 0";
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
      await apiRequest("/api/operaciones/cambio", {
        method: "POST",
        body: JSON.stringify({
          tipo,
          monto_usd: Number(monto_usd),
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
        <h2>¡Operación exitosa!</h2>
        <p>Te redirigimos al Dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Cambiar moneda</h2>

      {loadingCotizacion && <p>Cargando cotización...</p>}

      {cotizacion && (
        <p>Compra: ${cotizacion.compra} — Venta: ${cotizacion.venta}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              name="tipo"
              value="COMPRA"
              checked={tipo === "COMPRA"}
              onChange={(e) => setTipo(e.target.value)}
            />
            Comprar dólares
          </label>
          <label>
            <input
              type="radio"
              name="tipo"
              value="VENTA"
              checked={tipo === "VENTA"}
              onChange={(e) => setTipo(e.target.value)}
            />
            Vender dólares
          </label>
        </div>

        <input
          type="number"
          placeholder="Monto en USD"
          value={monto_usd}
          onChange={(e) => setMontoUsd(e.target.value)}
        />

        {cotizacion && monto_usd && (
          <p>
            {tipo === "COMPRA"
              ? `Vas a necesitar $${calcularArs()} ARS`
              : `Vas a recibir $${calcularArs()} ARS`}
          </p>
        )}

        <Alert type="error">{error}</Alert>

        <button type="submit" disabled={loading || loadingCotizacion}>
          {loading && <Spinner />}
          {loading ? "Procesando..." : "Confirmar operación"}
        </button>
      </form>

      <p>
        <Link to="/dashboard">Cancelar</Link>
      </p>
    </div>
  );
}

export default CambiarMoneda;