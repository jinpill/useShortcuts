import { Dispatch, SetStateAction, useEffect } from "react";
import useShortcuts from "../hooks/useShortcuts";
import style from "./Modal.module.css";

interface ModalProps {
  title: string;
  onClose: () => void;
  onLog: Dispatch<SetStateAction<string[]>>;
  children: React.ReactNode;
}

const Modal = (props: ModalProps) => {
  const log = (feature: string) => {
    console.log("Feature:", feature);
    props.onLog((prev) => [...prev, feature]);
  };

  const ENTER = useShortcuts("Enter", () => {
    log("Apply");
  });

  const CTRL_A = useShortcuts("Ctrl A", "Command A", () => {
    log("Select All");
  });

  useShortcuts("Escape", () => {
    props.onClose();
    log("Close Modal");
  });

  useShortcuts("Ctrl L", "Command L", () => {
    const disabled = ENTER.disabled && CTRL_A.disabled;

    ENTER.disabled = !disabled;
    CTRL_A.disabled = !disabled;

    log(disabled ? "Enable Shortcuts" : "Disable Shortcuts");
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
        <div>{props.children}</div>
      </div>
    </div>
  );
};

export default Modal;
