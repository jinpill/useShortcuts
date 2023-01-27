import { Dispatch, SetStateAction, useEffect } from "react";
import useShortcuts from "../hooks/useShortcuts";
import Shortcut from "../components/Shortcut";
import style from "./Modal.module.css";

interface ModalProps {
  title: string;
  onClose: () => void;
  onLog: Dispatch<SetStateAction<string[]>>;
}

const Modal = (props: ModalProps) => {
  const addLog = (feature: string) => {
    console.log("Feature:", feature);
    props.onLog((prev) => [...prev, feature]);
  };

  const ENTER = useShortcuts({
    keys: "Enter",
    disabled: true,
    callback: () => {
      addLog("Apply");
    },
  });

  const CTRL_A = useShortcuts({
    keys: ["Ctrl A", "Command A"],
    disabled: true,
    callback: () => {
      addLog("Select All");
    },
  });

  const ESCAPE = useShortcuts({
    keys: "Escape",
    callback: () => {
      props.onClose();
      addLog("Close Modal");
    },
  });

  const CTRL_L = useShortcuts({
    keys: ["Ctrl L", "Command L"],
    callback: () => {
      const disabled = ENTER.disabled && CTRL_A.disabled;
      ENTER.disabled = !disabled;
      CTRL_A.disabled = !disabled;
      addLog(disabled ? "Enable Shortcuts" : "Disable Shortcuts");
    },
  });

  const handleStopPropagation = (ev: React.MouseEvent) => {
    ev.stopPropagation();
  };

  useEffect(() => {
    const $focus = document.querySelector(":focus") as HTMLElement;
    $focus?.blur();
  }, []);

  return (
    <div className={style.cover} onClick={props.onClose}>
      <div className={style.container} onClick={handleStopPropagation}>
        <h2 className={style.title}>{props.title}</h2>
        <div>
          <Shortcut shortcut="ESC" feature="Close the Modal" disabled={ESCAPE.disabled} />
          <Shortcut
            shortcut="Command L"
            feature="Enable / Disable Shortcuts"
            disabled={CTRL_L.disabled}
          />
          <Shortcut shortcut="Command A" feature="Select All" disabled={CTRL_A.disabled} />
          <Shortcut shortcut="Enter" feature="Apply" disabled={ENTER.disabled} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
