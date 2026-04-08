import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/admin/AdminPanel';
import AdminTopicos from './pages/admin/AdminTopico';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminPanel />} />
        <Route path="/topicos" element={<AdminTopicos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;