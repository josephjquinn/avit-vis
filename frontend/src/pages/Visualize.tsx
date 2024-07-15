import React from "react";
import Heatmap from "../components/Heatmap";

// Mock data: replace this with your actual data
const densityData = new Array(1001)
  .fill(0)
  .map(() =>
    new Array(256)
      .fill(0)
      .map(() => new Array(256).fill(0).map(() => Math.random())),
  );

const App: React.FC = () => {
  return (
    <div>
      <h1>Heatmap Example</h1>
      <Heatmap />
    </div>
  );
};

export default App;
