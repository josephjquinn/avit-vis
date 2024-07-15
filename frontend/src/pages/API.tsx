import React, { useState } from "react";
import { testServer } from "../lib/services";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { multiplyBySeven } from "../lib/services";

const Test: React.FC = () => {
  const [num, setNum] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputNumber, setInputNumber] = useState<number>(0);
  const [result, setResult] = useState<number | undefined>(undefined);

  const handleMultiply = async () => {
    const response = await multiplyBySeven(inputNumber);
    if (response.error) {
      setError(response.error);
      setResult(undefined);
    } else {
      setResult(response.result);
      setError(null);
    }
  };

  const getData = async () => {
    try {
      const response = await testServer();
      if (response.error) {
        setError(response.error);
        setNum(null);
      } else if (typeof response.rand === "number") {
        setNum(response.rand);
        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
      setNum(null);
    }
  };

  return (
    <div>
      <h1 style={{ color: "white" }}>This is Test Page</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h3 style={{ color: "white" }}>
        {num !== null ? num : "No number generated yet"}
      </h3>
      <Button variant="contained" onClick={getData}>
        Generate
      </Button>
      <div>
        <TextField
          sx={{ input: { color: "white" } }}
          variant="outlined"
          color="warning"
          type="number"
          value={inputNumber}
          onChange={(e) => setInputNumber(parseInt(e.target.value))}
        />
        <Button variant="contained" onClick={handleMultiply}>
          Multiply by 7
        </Button>
        {result !== undefined && (
          <p style={{ color: "white" }}>Result: {result}</p>
        )}
        {error && <p style={{ color: "white" }}>Error: {error}</p>}
      </div>
    </div>
  );
};

export default Test;
