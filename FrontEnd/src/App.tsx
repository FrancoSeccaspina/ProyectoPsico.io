import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/admin/AdminPanel';
/*import AdminPanel from './pages/admin/AdminPanel';*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;