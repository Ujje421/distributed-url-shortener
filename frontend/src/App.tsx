import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/features" element={<Placeholder title="Features" />} />
          <Route path="/about" element={<Placeholder title="About Us" />} />
          <Route path="/contacts" element={<Placeholder title="Contact Us" />} />
          <Route path="/contact" element={<Placeholder title="Contact Us" />} />
          <Route path="/privacy" element={<Placeholder title="Privacy Policy" />} />
          <Route path="*" element={<div>Not Found - Catch All Route</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
