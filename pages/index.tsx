import { useState } from "react";
import useShortcuts from "../hooks/useShortcuts";
import Shortcut from "../components/Shortcut";

const Home = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const ENTER = useShortcuts("Enter", () => {
    setLogs((prev) => [...prev, "Apply"]);
  });

  const CTRL_A = useShortcuts("Ctrl A", "Command A", () => {
    setLogs((prev) => [...prev, "Select All"]);
  });

  useShortcuts("Escape", () => {
    const disabled = ENTER.getDisabled() && CTRL_A.getDisabled();

    ENTER.setDisabled(!disabled);
    CTRL_A.setDisabled(!disabled);

    setLogs((prev) => [
      ...prev,
      disabled ? "Enable Shortcuts" : "Disable Shortcuts",
    ]);
  });

  return (
    <>
      <h1>Logs</h1>
      <div>
        <Shortcut shortcut="Command A" feature="Select All" />
        <Shortcut shortcut="Enter" feature="Apply" />
        <Shortcut shortcut="ESC" feature="Enable / Disable Shortcuts" />
      </div>
      {logs.map((log, index) => (
        <p key={index}>{log}</p>
      ))}
    </>
  );
};

export default Home;
