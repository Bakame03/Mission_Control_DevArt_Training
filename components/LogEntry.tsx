import React from "react";

type LogEntryProps = {
  date: string;
  title: string;
  message: string;
  type: "alert" | "info";
};

const LogEntry: React.FC<LogEntryProps> = ({ date, title, message, type }) => {
  return (
    <div className={`border-l-4 pl-4 mb-6 ${type === "alert" ? "border-red-500" : "border-blue-500"}`}>
      <div className="flex items-center mb-1">
        <span className="text-xs text-gray-400 mr-2 font-mono">{date}</span>
        <span className={`uppercase tracking-wider text-xs font-bold ${type === "alert" ? "text-red-500" : "text-blue-500"}`}>{type}</span>
      </div>
      <h3 className="text-lg font-semibold font-serif mb-1">{title}</h3>
      <p className="text-gray-200 font-mono text-sm">{message}</p>
    </div>
  );
};

export default LogEntry;
