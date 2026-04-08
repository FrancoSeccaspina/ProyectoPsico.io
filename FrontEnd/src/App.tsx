import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';

import AdminPanel from './pages/admin/AdminPanel';
import AdminTopicos from './pages/admin/AdminTopico';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Layout con Navbar */}
        <Route path="/" element={<AdminLayout />}>

          {/* Dashboard */}
          <Route index element={<AdminPanel />} />

          {/* Tópicos */}
          <Route path="topicos" element={<AdminTopicos />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;