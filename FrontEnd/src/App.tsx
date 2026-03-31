import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
/*import AdminPanel from './pages/admin/AdminPanel';*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;