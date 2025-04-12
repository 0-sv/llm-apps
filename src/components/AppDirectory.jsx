import { Link } from "react-router-dom";

export default function AppDirectory() {
  // List of all available applications
  const apps = [
    {
      id: "perplexity-visualization",
      name: "Perplexity Visualization",
      description: "Visualize and explore text perplexity metrics",
    },
    {
      id: "recommendation-optimization",
      name: "Recommendation Optimization",
      description: "Visualize how recommendation systems learn from user preferences",
    },
    // Add more apps here as they are developed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">LLM Applications Directory</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div 
            key={app.id} 
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{app.name}</h2>
            <p className="text-gray-600 mb-4">{app.description}</p>
            <Link 
              to={`/${app.id}`} 
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Open App
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
