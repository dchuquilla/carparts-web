import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RequestList from './pages/RequestList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/requests" element={<RequestList />} />
      </Routes>
    </Router>
  )
}

export default App
