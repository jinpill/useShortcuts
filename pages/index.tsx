import { useEffect, useState, useRef } from "react";
import Modal from "../components/Modal";
import style from "./index.module.css";

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<HTMLDivElement>(null);

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
        <button className={style.button} onClick={setVisible.bind(null, true)}>
          Open Modal
        </button>
        <button className={style.button} onClick={setLogs.bind(null, [])}>
          Clear
        </button>
      </header>

      <div className={style.logs} ref={logsRef}>
        {logs.map((log, index) => (
          <p key={index}>
            {index + 1} - {log}
          </p>
        ))}
      </div>

      {visible && <Modal title="Modal" onClose={setVisible.bind(null, false)} onLog={setLogs} />}
    </>
  );
};

export default Home;
