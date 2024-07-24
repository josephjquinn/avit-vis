import React from "react";
import { TooltipProps } from "recharts";
import "./Tooltip.css"
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="tooltip-container p-4 rounded-md"
        style={{
          background: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
          color: "white",
          backdropFilter: "blur(8px)", // Apply blur effect
          WebkitBackdropFilter: "blur(8px)", // Safari support
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // Optional shadow for better visibility
        }}
      >
        <p className="text-lg">{`Epoch: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm">
            <span style={{ color: entry.color }}>{entry.name}</span>:{" "}
            {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
