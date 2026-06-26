import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

function CambiarMoneda() {
  const navigate = useNavigate();
  const [cotizacion, setCotizacion] = useState(null);
  const [loadingCotizacion, setLoadingCotizacion] = useState(true);

  const [tipoOperacion, setTipoOperacion] = useState("compra"); // compra = ARS -> USD, venta = USD -> ARS
  const [montoUsd, setMontoUsd] = useState("");

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

  // Calculamos cuántos ARS se necesitan o se reciben según el tipo de operación
  function calcularArs() {
    if (!cotizacion || !montoUsd) return 0;
    const precio = tipoOperacion === "compra" ? cotizacion.venta : cotizacion.compra;
    return (Number(montoUsd) * precio).toFixed(2);
  }

  function validate() {
    if (!montoUsd) return "Ingresá un monto en USD";
    if (Number(montoUsd) <= 0) return "El monto debe ser mayor a 0";
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
      await apiRequest("/api/operaciones/cambio-moneda", {
        method: "POST",
        body: JSON.stringify({
          tipoOperacion,
          montoUsd: Number(montoUsd),
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
        <p>
          Compra: ${cotizacion.compra} — Venta: ${cotizacion.venta}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              name="tipoOperacion"
              value="compra"
              checked={tipoOperacion === "compra"}
              onChange={(e) => setTipoOperacion(e.target.value)}
            />
            Comprar dólares
          </label>
          <label>
            <input
              type="radio"
              name="tipoOperacion"
              value="venta"
              checked={tipoOperacion === "venta"}
              onChange={(e) => setTipoOperacion(e.target.value)}
            />
            Vender dólares
          </label>
        </div>

        <input
          type="number"
          placeholder="Monto en USD"
          value={montoUsd}
          onChange={(e) => setMontoUsd(e.target.value)}
        />

        {cotizacion && montoUsd && (
          <p>
            {tipoOperacion === "compra"
              ? `Vas a necesitar $${calcularArs()} ARS`
              : `Vas a recibir $${calcularArs()} ARS`}
          </p>
        )}

        <Alert type="error">{error}</Alert>

        <button type="submit" disabled={loading || loadingCotizacion}>
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