import { useState, useEffect } from 'react';

export default function PerplexityVisualization() {
  const [inputText, setInputText] = useState("the cat sat on the mat");
  const [currentChar, setCurrentChar] = useState(3);
  const [unigramPerplexity, setUnigramPerplexity] = useState(0);
  const [llmPerplexity, setLlmPerplexity] = useState(0);
  
  // Simple unigram model (character frequencies)
  const unigramModel = {
    'a': 0.08, 'b': 0.02, 'c': 0.03, 'd': 0.04, 'e': 0.12, 
    'f': 0.02, 'g': 0.02, 'h': 0.06, 'i': 0.07, 'j': 0.01,
    'k': 0.01, 'l': 0.04, 'm': 0.03, 'n': 0.07, 'o': 0.08,
    'p': 0.02, 'q': 0.01, 'r': 0.06, 's': 0.06, 't': 0.09,
    'u': 0.03, 'v': 0.01, 'w': 0.02, 'x': 0.01, 'y': 0.02,
    'z': 0.01, ' ': 0.19, '.': 0.01
  };
  
  // Default probability for unknown characters
  const UNKNOWN_PROB = 0.001;
  
  // Fake contextual LLM probabilities for common sequences
  const fakeLLMContexts = {
    'th': { 'e': 0.70, 'i': 0.10, 'a': 0.08, 'o': 0.05, 'r': 0.04 },
    'he': { ' ': 0.60, 'r': 0.15, 'n': 0.08, 'a': 0.05, 'l': 0.04 },
    'e ': { 'c': 0.12, 's': 0.11, 'm': 0.10, 'b': 0.09, 't': 0.08 },
    ' c': { 'a': 0.30, 'o': 0.25, 'h': 0.15, 'l': 0.10, 'r': 0.05 },
    'ca': { 't': 0.40, 'r': 0.20, 'n': 0.15, 'l': 0.10, 's': 0.05 },
    'at': { ' ': 0.50, 'e': 0.15, 'i': 0.10, 'h': 0.05, 'c': 0.05 },
    't ': { 's': 0.25, 'i': 0.20, 'o': 0.15, 'a': 0.10, 't': 0.08 },
    ' s': { 'a': 0.20, 'o': 0.15, 'h': 0.15, 't': 0.10, 'e': 0.10 },
    'sa': { 't': 0.25, 'y': 0.15, 'n': 0.10, 'l': 0.10, 'v': 0.05 },
    'at': { ' ': 0.50, 'e': 0.15, 'i': 0.10, 'h': 0.05, 'c': 0.05 },
    't ': { 's': 0.25, 'i': 0.20, 'o': 0.15, 'a': 0.10, 't': 0.08 },
    ' o': { 'n': 0.35, 'f': 0.20, 'r': 0.15, 'u': 0.10, 'v': 0.05 },
    'on': { ' ': 0.50, 'e': 0.20, 'l': 0.10, 'g': 0.05, 's': 0.05 },
    'n ': { 't': 0.30, 'a': 0.20, 's': 0.15, 'o': 0.10, 'i': 0.05 },
    ' t': { 'h': 0.40, 'o': 0.20, 'r': 0.10, 'i': 0.05, 'a': 0.05 },
    'th': { 'e': 0.70, 'i': 0.10, 'a': 0.08, 'o': 0.05, 'r': 0.04 },
    'he': { ' ': 0.60, 'r': 0.15, 'n': 0.08, 'a': 0.05, 'l': 0.04 },
    'e ': { 'c': 0.12, 's': 0.11, 'm': 0.10, 'b': 0.09, 't': 0.08 },
    ' m': { 'a': 0.25, 'o': 0.20, 'e': 0.15, 'i': 0.10, 'u': 0.05 },
    'ma': { 't': 0.25, 'n': 0.20, 'r': 0.15, 'k': 0.10, 'y': 0.05 },
    'at': { ' ': 0.50, 'e': 0.15, 'i': 0.10, 'h': 0.05, 'c': 0.05 },
    't.': { ' ': 0.80, '\n': 0.10, 'A': 0.05, 'T': 0.03, 'I': 0.02 }
  };
 
  // Get LLM probability for a character given context
  const getLLMProbability = (context, char) => {
    if (!context || !char) return unigramModel[char.toLowerCase()] || UNKNOWN_PROB;
    
    // Use the last 2 characters as context
    const shortContext = context.slice(-2).toLowerCase();
    
    // If we have this context in our model
    if (fakeLLMContexts[shortContext]) {
      // Return the probability if available, otherwise a small value
      return fakeLLMContexts[shortContext][char.toLowerCase()] || UNKNOWN_PROB;
    }
    
    // Fallback to unigram
    return unigramModel[char.toLowerCase()] || UNKNOWN_PROB;
  };
  
  // Calculate perplexity for both models
  useEffect(() => {
    if (!inputText) {
      setUnigramPerplexity(0);
      setLlmPerplexity(0);
      return;
    }
    
    const chars = inputText.toLowerCase().split('');
    
    // Unigram model perplexity calculation
    const unigramLogProbs = chars.map(char => {
      const prob = unigramModel[char] || UNKNOWN_PROB;
      return Math.log2(prob);
    });
    const unigramAvgNegLogProb = -(unigramLogProbs.reduce((sum, val) => sum + val, 0) / chars.length);
    const unigramPerp = Math.pow(2, unigramAvgNegLogProb);
    setUnigramPerplexity(unigramPerp);
    
    // LLM model perplexity calculation
    const llmLogProbs = chars.map((char, index) => {
      const context = index >= 1 ? inputText.substring(0, index) : '';
      const prob = getLLMProbability(context, char);
      return Math.log2(prob);
    });
    const llmAvgNegLogProb = -(llmLogProbs.reduce((sum, val) => sum + val, 0) / chars.length);
    const llmPerp = Math.pow(2, llmAvgNegLogProb);
    setLlmPerplexity(llmPerp);
    
  }, [inputText]);
  
  // Set character being analyzed
  const movePosition = (direction) => {
    const newPos = currentChar + direction;
    if (newPos >= 0 && newPos < inputText.length) {
      setCurrentChar(newPos);
    }
  };
  
  // Get character probabilities for current position
  const getCurrentUnigramProb = () => {
    if (currentChar >= 0 && currentChar < inputText.length) {
      const char = inputText[currentChar].toLowerCase();
      return unigramModel[char] || UNKNOWN_PROB;
    }
    return 0;
  };
  
  const getCurrentLLMProb = () => {
    if (currentChar >= 0 && currentChar < inputText.length) {
      const char = inputText[currentChar].toLowerCase();
      const context = currentChar >= 1 ? inputText.substring(0, currentChar) : '';
      return getLLMProbability(context, char);
    }
    return 0;
  };
  
  // Get the context (previous characters)
  const getContext = () => {
    if (currentChar <= 0) return '';
    return inputText.substring(0, currentChar);
  };
  
  // Get contextual predictions for LLM
  const getLLMPredictions = () => {
    const context = getContext();
    if (!context) return [];
    
    const shortContext = context.slice(-2).toLowerCase();
    if (fakeLLMContexts[shortContext]) {
      return Object.entries(fakeLLMContexts[shortContext])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    }
    
    return Object.entries(unigramModel)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };
  
  // Get top unigram characters
  const getTopUnigramChars = () => {
    return Object.entries(unigramModel)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };
  
  // Generate perplexity gauge
  const PerplexityGauge = ({ label, value, min, max, color }) => {
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm font-medium">{value.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full ${color}`} 
            style={{ width: `${100 - percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>Better (Lower Perplexity)</span>
          <span>Worse (Higher Perplexity)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Understanding Perplexity: Unigram vs LLM</h1>

      <div className="mb-6">
        <p className="mb-2 text-gray-700">
          Perplexity measures how "surprised" a model is by text. Lower perplexity means the model
          predicts the text with higher confidence. This visualization shows why LLMs typically achieve
          lower perplexity than simple unigram models.
        </p>
      </div>

      {/* Text input */}
      <div className="mb-6">
        <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
          Sample text:
        </label>
        <input
          type="text"
          id="text-input"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (currentChar >= e.target.value.length) {
              setCurrentChar(Math.max(0, e.target.value.length - 1));
            }
          }}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Perplexity comparison */}
      <div className="p-4 bg-white rounded-md border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold mb-4">Perplexity Comparison</h2>
        
        <PerplexityGauge 
          label="Unigram Model Perplexity" 
          value={unigramPerplexity} 
          min={1} 
          max={30} 
          color="bg-blue-500" 
        />
        
        <PerplexityGauge 
          label="LLM Perplexity" 
          value={llmPerplexity} 
          min={1} 
          max={30} 
          color="bg-purple-500" 
        />
        
        <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200 text-sm">
          <strong>What this means:</strong> The LLM achieves lower perplexity (better prediction) because
          it uses context to make more informed predictions. The unigram model has higher perplexity because
          it treats each character independently without considering context.
        </div>
      </div>

      {/* Text visualization */}
      <div className="mb-6 p-4 bg-white rounded-md border border-gray-200">
        <div className="flex justify-between mb-2">
          <button 
            onClick={() => movePosition(-1)} 
            disabled={currentChar <= 0}
            className="px-2 py-1 bg-blue-100 rounded disabled:opacity-50"
          >
            ← Prev
          </button>
          <button 
            onClick={() => movePosition(1)} 
            disabled={currentChar >= inputText.length - 1}
            className="px-2 py-1 bg-blue-100 rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>

        <div className="font-mono text-xl p-2 tracking-wider text-center">
          {inputText.split('').map((char, index) => (
            <span 
              key={index} 
              className={`
                ${index === currentChar ? 'bg-yellow-300 px-1 py-0.5 rounded' : ''}
                ${index < currentChar ? 'text-gray-500' : ''}
              `}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Models comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unigram model */}
        <div className="p-4 bg-white rounded-md border border-gray-200">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">Unigram Character Model</h2>
          
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">Current character: 
              <strong>{currentChar >= 0 && currentChar < inputText.length ? 
                ` "${inputText[currentChar]}"` : ' none'}
              </strong>
            </div>
            <div className="flex items-center">
              <div className="text-sm text-gray-600 mr-2">Probability:</div>
              <div className="bg-blue-100 px-2 py-0.5 rounded text-sm font-medium">
                {(getCurrentUnigramProb() * 100).toFixed(2)}%
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Contribution to perplexity: -{Math.log2(getCurrentUnigramProb()).toFixed(2)} bits
            </div>
          </div>
          
          <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-100 text-sm">
            <p><strong>Key Point:</strong> The unigram model treats each character independently,
            assigning the same probability regardless of what characters came before it.</p>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Top 5 character probabilities (always the same):</h3>
            <div>
              {getTopUnigramChars().map(([char, prob]) => (
                <div key={char} className="flex items-center mb-1">
                  <div className="w-8 text-center">{char === ' ' ? '␣' : char}</div>
                  <div 
                    className="h-5 bg-blue-500 rounded-sm"
                    style={{ width: `${prob * 400}px` }}
                  ></div>
                  <div className="ml-2 text-xs">{(prob * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LLM */}
        <div className="p-4 bg-white rounded-md border border-gray-200">
          <h2 className="text-lg font-semibold mb-2 text-purple-600">Large Language Model</h2>
          
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">
              Context: <strong>"{getContext()}"</strong>
            </div>
            <div className="flex items-center">
              <div className="text-sm text-gray-600 mr-2">Probability given context:</div>
              <div className="bg-purple-100 px-2 py-0.5 rounded text-sm font-medium">
                {(getCurrentLLMProb() * 100).toFixed(2)}%
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Contribution to perplexity: -{Math.log2(getCurrentLLMProb()).toFixed(2)} bits
            </div>
          </div>
          
          <div className="mb-3 p-3 bg-purple-50 rounded border border-purple-100 text-sm">
            <p><strong>Key Point:</strong> The LLM uses prior context to assign probabilities,
            often resulting in much higher probability for the correct next character.</p>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Top predictions after "{getContext().slice(-2)}":</h3>
            <div>
              {getLLMPredictions().map(([char, prob]) => (
                <div key={char} className="flex items-center mb-1">
                  <div className="w-8 text-center">{char === ' ' ? '␣' : char}</div>
                  <div 
                    className="h-5 bg-purple-500 rounded-sm"
                    style={{ width: `${prob * 400}px` }}
                  ></div>
                  <div className="ml-2 text-xs">{(prob * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Perplexity explanation */}
      <div className="mt-6 p-4 bg-white rounded-md border border-gray-200">
        <h2 className="text-lg font-semibold mb-3">Understanding Perplexity</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <h3 className="font-medium mb-2">How Perplexity Works</h3>
            <ol className="list-decimal pl-5 text-sm space-y-1">
              <li>Calculate probability of each character in the sequence</li>
              <li>Take the negative log2 of each probability</li>
              <li>Average these values (cross-entropy)</li>
              <li>Perplexity = 2^(cross-entropy)</li>
            </ol>
            <div className="mt-2 text-xs text-gray-600">
              Think of perplexity as the average number of guesses the model would need to make to predict each character.
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <h3 className="font-medium mb-2">Why LLMs Have Lower Perplexity</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Uses context to make more accurate predictions</li>
              <li>Assigns higher probabilities to the correct next characters</li>
              <li>Recognizes patterns and linguistic structures</li>
              <li>Can model dependencies between distant characters</li>
            </ul>
            <div className="mt-2 text-xs text-gray-600">
              With context, LLMs assign much higher probabilities to the actual next characters, reducing surprisal.
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-700">
          <p className="mb-3">
            <strong>Real-world example:</strong> After "the cat s", an LLM might assign a 30% probability to "a" (forming "sat"),
            while a unigram model would only give it 8% regardless of context. This leads to significant differences in perplexity.
          </p>
          
          <p className="mb-3">
            <strong>Practical implications:</strong> Lower perplexity generally correlates with better language models that produce
            more coherent, human-like text. It's one of many metrics used to evaluate language model quality.
          </p>
          
          <p>
            <strong>Note:</strong> This visualization uses simplified models. Real LLMs are vastly more complex and context-aware,
            typically achieving much lower perplexity than shown here.
          </p>
        </div>
      </div>
    </div>
  );
}