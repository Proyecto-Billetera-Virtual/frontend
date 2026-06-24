import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Transferir from "./pages/Transferir";
import CargarDinero from "./pages/CargarDinero";
import PagarServicios from "./pages/PagarServicios";
import CambiarMoneda from "./pages/CambiarMoneda";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/transferir" element={<Transferir />} />
        <Route path="/cargar-dinero" element={<CargarDinero />} />
        <Route path="/pagar-servicios" element={<PagarServicios />} />
        <Route path="/cambiar-moneda" element={<CambiarMoneda />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;