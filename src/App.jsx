import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PerplexityVisualization from "./components/PerplexityVisualization.jsx";

function App() {
  return (
    <BrowserRouter basename="/llm-apps/">
      <Routes>
        <Route
          path="/perplexity-visualization"
          element={<PerplexityVisualization />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
