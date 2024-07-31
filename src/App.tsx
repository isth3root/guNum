import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthContext from "./context/AuthContext";
import Game from "./pages/Game";
import SignUp from "./pages/SignUp";
import LeaderBoard from "./pages/LeaderBoard";
import Duel from "./pages/Duel";
import DuelGame from "./pages/DuelGame";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import GuWord from "./pages/GuWord";
import GuNumber from "./pages/GuNumber"

const App: React.FC = () => {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
      <Route
          path="/gunumber"
          element={user ? <GuNumber /> : <Navigate to="/signup" replace />}
        />
      <Route
          path="/guword"
          element={user ? <GuWord /> : <Navigate to="/signup" replace />}
        />
      <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/signup" replace />}
        />
      <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/duel/:duelId"
          element={user ? <DuelGame /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/leaderboard"
          element={user ? <LeaderBoard /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/duel"
          element={user ? <Duel /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/single"
          element={user ? <Game /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <SignUp />}
        />
      </Routes>
    </Router>
  );
};

export default App;
