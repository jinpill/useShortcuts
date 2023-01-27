import { useEffect, useState, useRef } from "react";
import Shortcut from "../components/Shortcut";
import Modal from "../components/Modal";
import style from "./index.module.css";

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<HTMLDivElement>(null);

  const toggleModal = (_visible: boolean) => {
    setVisible(_visible);
  };

  useEffect(() => {
    if (logsRef.current === null) return;

    const $logs = logsRef.current.children;
    const $lastLog = $logs[$logs.length - 1];

    $lastLog?.scrollIntoView();
  }, [logs]);

  return (
    <>
      <header className={style.header}>
        <h1 className={style.title}>Logs</h1>
        <button className={style.button} onClick={toggleModal.bind(null, true)}>
          Open Modal
        </button>
      </header>

      <div ref={logsRef}>
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>

      {visible && (
        <Modal title="Modal" onClose={toggleModal.bind(null, false)} onLog={setLogs}>
          <Shortcut shortcut="Cmmand L" feature="Enable / Disable Shortcuts" />
          <Shortcut shortcut="Command A" feature="Select All" />
          <Shortcut shortcut="Enter" feature="Apply" />
          <Shortcut shortcut="ESC" feature="Close the Modal" />
        </Modal>
      )}
    </>
  );
};

export default Home;
