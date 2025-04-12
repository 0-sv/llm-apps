import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PerplexityVisualization from "./components/PerplexityVisualization.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/apps/perplexity-visualization" element={<PerplexityVisualization />} />
        <Route path="/" element={<Navigate to="/apps/perplexity-visualization" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
