import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./global/NavBar";
import LandingPage from './components/Landingpage';
import OfficeSurvey from './components/OfficeSurvey';
import AdminLogin from './components/AdminLogin';
function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/clientsurvey" element={<LandingPage />} />
        <Route path="/office/:officeId/survey/:surveyId" element={<OfficeSurvey />} />
      </Routes>
    </Router>
  );
}

export default App;
