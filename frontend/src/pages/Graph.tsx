import { useState } from "react";
import RChart from "../components/RChart";
import Slider from "@mui/material/Slider";
import data1 from "../data/0.01train.json";
import data2 from "../data/0.11train.json";
import data3 from "../data/0.21000000000000002train.json";
import data4 from "../data/0.31000000000000005train.json";
import data5 from "../data/0.41000000000000003train.json";
import data6 from "../data/0.51train.json";
import data7 from "../data/0.6100000000000001train.json";
import data8 from "../data/0.7100000000000001train.json";
import data9 from "../data/0.81train.json";
import data10 from "../data/0.91train.json";

const App = () => {
  const [sliderValue, setSliderValue] = useState<number>(30);
  const [data, setData] = useState<modelData>(data1);

  interface modelData {
    Train_Loss: number[];
    Val_Loss: number[];
    Step_Loss: number[];
    Accuracy: number[];
  }

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setSliderValue(newValue);

      switch (newValue) {
        case 0.1:
          setData(data2);
          break;
        case 0.2:
          setData(data3);
          break;
        case 0.3:
          setData(data4);
          break;

        case 0.4:
          setData(data5);
          break;
        case 0.5:
          setData(data6);
          break;
        case 0.6:
          setData(data7);
          break;
        case 0.7:
          setData(data8);
          break;
        case 0.8:
          setData(data9);
          break;
        case 0.9:
          setData(data10);
          break;
        default:
          setData(data1);
          break;
      }
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ width: "30%" }}>
        <Slider
          defaultValue={sliderValue}
          valueLabelDisplay="auto"
          step={0.1}
          min={0.1}
          max={0.9}
          onChange={handleSliderChange}
        />
      </div>
      <h2 style={{ color: "white" }}>Training and Validation Loss</h2>
      <h2 style={{ color: "white" }}>Accuracy</h2>
      <RChart />
      <RChart />
    </div>
  );
};

export default App;
