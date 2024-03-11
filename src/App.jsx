import Login from "./components/Login";
import { Routes, Route, Navigate } from "react-router-dom"
import Usuario from "./pages/Usuario";
import ProductsDemo from "./pages/ProductsDemo";
function App() {

  return (
  <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/usuarios" element={<ProductsDemo />} />
      <Route path="/usuarios/:id" element={<Usuario />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>  
  );
}
export default App;
