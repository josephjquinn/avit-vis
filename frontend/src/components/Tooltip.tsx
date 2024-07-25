import React from "react";
import { TooltipProps } from "recharts";
import "./Tooltip.css";

interface CustomTooltipProps extends TooltipProps<number, string> {
  title?: string;
  round?: number;
  sortBy?: "value" | "name";
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  title,
  round = 4,
  sortBy = "value",
}) => {
  if (active && payload && payload.length) {
    const sortedPayload = [...payload].sort((a, b) => {
      if (sortBy === "value") {
        return (b.value || 0) - (a.value || 0); 
      } else {
        return (a.name || "").localeCompare(b.name || ""); 
      }
    });

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
        <p className="text-lg">{title ? `${title}: ${label}` : label}</p>
        {sortedPayload.map((entry, index) => (
          <p key={index} className="text-sm">
            <span style={{ color: entry.color }}>{entry.name}</span>:{" "}
            {entry.value !== undefined ? entry.value.toFixed(round) : "N/A"}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
