import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Billetera Virtual</h1>} />
        {/* Acá van a ir /login, /register, /dashboard, etc */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;