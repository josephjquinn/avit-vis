import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Graph from "./pages/Graph";
import NavBar from "./components/Navbar/Navbar";
import Visualize from "./pages/Visualize";
import Vis from "./pages/TimeVis";
import Metrics from "./pages/Metrics";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/tvis" element={<Vis />} />
        <Route path="/visualize" element={<Visualize />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
