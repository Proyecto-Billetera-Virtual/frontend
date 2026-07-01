import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import Alert from "../components/Alert";

function Dashboard() {
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSaldo() {
      try {
        const data = await apiRequest("/api/cuenta/saldo", {
          method: "GET",
        });
        setSaldo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSaldo();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Mi Billetera</h2>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <Alert type="error">{error}</Alert>

      {saldo && (
        <>
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ border: "1px solid #ccc", padding: "16px" }}>
              <h3>Saldo ARS</h3>
              <p>${saldo.ars}</p>
            </div>
            <div style={{ border: "1px solid #ccc", padding: "16px" }}>
              <h3>Saldo USD</h3>
              <p>US${saldo.usd}</p>
            </div>
          </div>
        </>
      )}

      <nav style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <Link to="/transferir">Transferir</Link>
        <Link to="/cambiar-moneda">Cambiar Moneda</Link>
        <Link to="/cargar-dinero">Cargar Dinero</Link>
        <Link to="/pagar-servicios">Pagar Servicios</Link>
      </nav>
    </div>
  );
}

export default Dashboard;