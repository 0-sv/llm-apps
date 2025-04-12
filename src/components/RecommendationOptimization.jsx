import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const RecommendationOptimization = () => {
  const [userPreference, setUserPreference] = useState(4);
  const [modelPrediction, setModelPrediction] = useState(2);
  const [iterations, setIterations] = useState(10);
  const [optimizationSteps, setOptimizationSteps] = useState([]);

  const optimizeModel = () => {
    const learningRate = 0.2;
    let currentPrediction = modelPrediction;
    const steps = [];

    for (let i = 0; i < iterations; i++) {
      // Calculate error
      const error = userPreference - currentPrediction;

      // Gradient descent step: Move prediction towards user preference
      currentPrediction += learningRate * error;

      steps.push({
        iteration: i,
        prediction: currentPrediction,
        error: Math.abs(error),
        userPreference,
      });
    }

    setOptimizationSteps(steps);
    setModelPrediction(steps[steps.length - 1].prediction);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Recommendation Model Optimization
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-xl font-bold mb-3">🎬 Model Parameters</h2>

          <div className="mb-4">
            <label className="block mb-2">User's Actual Preference</label>
            <input
              type="range"
              min="1"
              max="5"
              value={userPreference}
              onChange={(e) => setUserPreference(Number(e.target.value))}
              className="w-full"
            />
            <span>Current Preference: {userPreference}/5</span>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Initial Model Prediction</label>
            <input
              type="range"
              min="1"
              max="5"
              value={modelPrediction}
              onChange={(e) => setModelPrediction(Number(e.target.value))}
              className="w-full"
            />
            <span>Current Prediction: {modelPrediction}/5</span>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Optimization Iterations</label>
            <input
              type="number"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={optimizeModel}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Optimize Recommendation
          </button>

          {optimizationSteps.length > 0 && (
            <div className="mt-4 bg-green-100 p-3 rounded">
              <h3 className="font-bold">Final Prediction</h3>
              <p>Improved to: {modelPrediction.toFixed(2)}/5</p>
              <p>Closer to User Preference: {userPreference}/5</p>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded">
          <h2 className="text-xl font-bold mb-3">🧠 Optimization Process</h2>

          {optimizationSteps.length > 0 && (
            <LineChart width={500} height={300} data={optimizationSteps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="iteration" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="prediction"
                stroke="#8884d8"
                name="Model Prediction"
              />
              <Line
                type="monotone"
                dataKey="userPreference"
                stroke="#82ca9d"
                name="User Preference"
              />
              <Line
                type="monotone"
                dataKey="error"
                stroke="#ff7300"
                name="Prediction Error"
              />
            </LineChart>
          )}
        </div>
      </div>

      <div className="mt-4 bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">🔍 How Gradient Descent Works Here</h2>
        <ul className="list-disc pl-5">
          <li>
            Calculate the difference between user preference and current
            prediction
          </li>
          <li>Use this error to make small, intelligent adjustments</li>
          <li>Gradually move the prediction closer to the actual preference</li>
          <li>
            Repeat until the prediction is very close to the user's preference
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RecommendationOptimization;
