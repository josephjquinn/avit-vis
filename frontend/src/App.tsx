import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./pages/API";
import Graph from "./pages/Graph";
import NavBar from "./components/Navbar/Navbar";
import API from "./pages/API";
import Visualize from "./pages/Visualize";
import Metrics from "./pages/Metrics";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/api" element={<API />} />
        <Route path="/visualize" element={<Visualize />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
