import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <h1>Study AI Assistant</h1>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/signup" element={<div>Signup Page</div>} />
          <Route path="/profile" element={<div>Profile Page</div>} />
          <Route path="/study" element={<div>Study Page</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;