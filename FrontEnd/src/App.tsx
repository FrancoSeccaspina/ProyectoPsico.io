import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import AdminPanel from './pages/admin/AdminPanel';
import AdminTopicos from './pages/admin/AdminTopico';
import OwnerRoute from './guards/OwnerRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Ruta protegida — solo entra con token */}
        <Route
          path="/"
          element={
            <OwnerRoute>
              <AdminLayout />
            </OwnerRoute>
          }
        >
          <Route index element={<AdminPanel />} />
          <Route path="topicos" element={<AdminTopicos />} />
        </Route>

        {/* Página de acceso denegado */}
        <Route
          path="/no-autorizado"
          element={
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <h1>🚫 Acceso denegado</h1>
              <p>No tenés permiso para ver esta página.</p>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;