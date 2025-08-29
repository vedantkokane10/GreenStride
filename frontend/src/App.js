import './App.css';

import Register from './pages/RegisterPage/Register';
import Login from './pages/LoginPage/Login';
import UserHome from './pages/UserHomePage/UserHome';
import AddActivity from './pages/AddActivityPage/AddActivity';
import AllActivities from './pages/AllActivitesPage/AllActivities';
import ActivitiesDateWise from './pages/ActivitesDateWisePage/ActivitiesDateWise';
import Dashboard from './pages/DashboardPage/Dashboard';
import GetSuggestions from './pages/GetSuggestionPage/GetSuggestions';
import Navbar from './components/Navbar';
import GreetPage from './pages/GreetPage/GreetPage';
import  Leaderboard  from './pages/LeaderboardPage/Leaderboard';

import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route exact path="/" element={<GreetPage />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/userHome" element={<UserHome />} />
            <Route exact path="/addActivity" element={<AddActivity />} />
            <Route exact path="/getActivity" element={<AllActivities />} />
            <Route exact path="/getActivityByDate" element={<ActivitiesDateWise />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/suggestion" element={<GetSuggestions />} />
            <Route exact path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
