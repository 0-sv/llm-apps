import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PerplexityVisualization from "./components/PerplexityVisualization.jsx";
import RecommendationOptimization from "./components/RecommendationOptimization.jsx";
import AppDirectory from "./components/AppDirectory.jsx";

function App() {
  return (
    <BrowserRouter basename="/llm-apps/">
      <Routes>
        <Route path="/" element={<AppDirectory />} />
        <Route
          path="/perplexity-visualization"
          element={<PerplexityVisualization />}
        />
        <Route
          path="/recommendation-optimization"
          element={<RecommendationOptimization />}
        />
        {/* Redirect any unknown routes to the directory */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
