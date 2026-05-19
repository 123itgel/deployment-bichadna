import { useState } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Jobs from "./pages/Jobs/Jobs";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setPage("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPage("home");
  };

  return (
    <div>
      {page === "home"      && <Home      setPage={setPage} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
      {page === "signup"    && <Signup    setPage={setPage} handleLogin={handleLogin} />}
      {page === "login"     && <Login     setPage={setPage} handleLogin={handleLogin} />}
      {page === "jobs"      && <Jobs      setPage={setPage} isLoggedIn={isLoggedIn} handleLogout={handleLogout} currentUser={currentUser} />}
      {page === "dashboard" && <Dashboard setPage={setPage} handleLogout={handleLogout} currentUser={currentUser} />}
    </div>
  );
}

export default App;