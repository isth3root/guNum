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

const App: React.FC = () => {
  console.log("hello")
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route
          path="/leaderboard"
          element={user ? <LeaderBoard /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/"
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
