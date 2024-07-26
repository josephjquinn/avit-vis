import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/Navbar/Navbar";
import Metrics from "./pages/Metrics";
import Compare from "./pages/Compare";
import Visualize from "./pages/Visualize";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/visualize" element={<Visualize />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
