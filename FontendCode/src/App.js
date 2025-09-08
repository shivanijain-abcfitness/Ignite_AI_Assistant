import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CancelMembershipPage from "./components/CancelMembershipPage/CancelMembershipPage";
import HelpLandingPage from "./components/HelperLandingPage/HelpLandingPage";
import FreezePage from "./components/FreezePage/Freeze";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HelpLandingPage />} />
                    <Route path="/cancel-membership" element={<CancelMembershipPage />} />
                    <Route path="/freeze" element={<FreezePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
