import { useState } from 'react';
import './index.css';

const initialFormState = {
  perimeter_worst: '',
  perimeter_mean: '',
  radius_worst: '',
  concave_points_mean: '',
  concave_points_worst: '',
  radius_mean: '',
  texture_worst: '',
  area_worst: '',
  area_mean: '',
  concavity_worst: '',
  compactness_worst: '',
  smoothness_worst: '',
  compactness_se: '',
  area_se: '',
  texture_mean: ''
};

const sampleData = {
  perimeter_worst: 184.6,
  perimeter_mean: 122.8,
  radius_worst: 25.38,
  concave_points_mean: 0.1471,
  concave_points_worst: 0.2654,
  radius_mean: 17.99,
  texture_worst: 17.33,
  area_worst: 2019.0,
  area_mean: 1001.0,
  concavity_worst: 0.7119,
  compactness_worst: 0.6656,
  smoothness_worst: 0.1622,
  compactness_se: 0.04904,
  area_se: 153.4,
  texture_mean: 10.38
};

const featureRanges = {
  perimeter_worst: { min: 50.41, max: 251.2 },
  perimeter_mean: { min: 43.79, max: 188.5 },
  radius_worst: { min: 7.93, max: 36.04 },
  concave_points_mean: { min: 0.0, max: 0.2012 },
  concave_points_worst: { min: 0.0, max: 0.291 },
  radius_mean: { min: 6.981, max: 28.11 },
  texture_worst: { min: 12.02, max: 49.54 },
  area_worst: { min: 185.2, max: 4254.0 },
  area_mean: { min: 143.5, max: 2501.0 },
  concavity_worst: { min: 0.0, max: 1.252 },
  compactness_worst: { min: 0.0273, max: 1.058 },
  smoothness_worst: { min: 0.0712, max: 0.2226 },
  compactness_se: { min: 0.0023, max: 0.1354 },
  area_se: { min: 6.802, max: 542.2 },
  texture_mean: { min: 9.71, max: 39.28 }
};

function App() {
  const [formData, setFormData] = useState(initialFormState);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoadSample = () => {
    setFormData(sampleData);
    setResult(null);
    setError('');
  };

  const handleClear = () => {
    setFormData(initialFormState);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    // Convert strings to floats
    const payload = {};
    for (const key in formData) {
      if (formData[key] === '') {
        setError(`Please fill in ${key.replace(/_/g, ' ')}`);
        setLoading(false);
        return;
      }
      payload[key] = parseFloat(formData[key]);
    }

    try {
      const response = await fetch(
        '${API_URL}/predict',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error('Prediction failed. Please check your backend connection.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatLabel = (key) => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <div className="header">
          <h1>Cancer Deduction AI</h1>
          <p>Powered by XGBoost • Predicts using 15 core features</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {Object.keys(initialFormState).map(key => (
              <div className="input-group" key={key}>
                <label htmlFor={key}>
                  {formatLabel(key)}
                  <span style={{display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 'normal'}}>
                    ({featureRanges[key].min} - {featureRanges[key].max})
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  min={featureRanges[key].min}
                  max={featureRanges[key].max}
                  placeholder={`Enter ${formatLabel(key)}`}
                />
              </div>
            ))}
          </div>

          {error && <div style={{color: 'var(--error)', textAlign: 'center', marginBottom: '1rem'}}>{error}</div>}

          <div className="actions">
            <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
            <button type="button" className="btn btn-secondary" onClick={handleLoadSample}>Load Sample</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Analyzing...' : 'Predict'}
            </button>
          </div>
        </form>

        {result && (
          <div className={`result-container ${result.prediction === 'Malignant' ? 'result-malignant' : 'result-benign'}`}>
            <h2>{result.prediction}</h2>
            <p>Confidence Probability: {result.probability ? (result.probability * 100).toFixed(2) + '%' : 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
