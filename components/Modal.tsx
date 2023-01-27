import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import useShortcuts from "../hooks/useShortcuts";
import Shortcut from "../components/Shortcut";
import style from "./Modal.module.css";

interface ModalProps {
  title: string;
  onClose: () => void;
  onLog: Dispatch<SetStateAction<string[]>>;
}

const Modal = (props: ModalProps) => {
  const [inputMessage, setInputMessage] = useState("Input: Disallow 'arrow up' shortcut");
  const [textareaMessage, setTextareaMessage] = useState(
    "Textarea: Disallow 'arrow down' shortcut"
  );
  const [select, setSelect] = useState("1");
  const selectMessage = "Select: Disallow 'arrow left' shortcut";
  const buttonMessage = "Button: Disallow 'arrow right' shortcut";

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

  useShortcuts({
    keys: "Escape",
    callback: () => {
      props.onClose();
      addLog("Close Modal");
    },
  });

  useShortcuts({
    keys: ["Ctrl L", "Command L"],
    callback: () => {
      const disabled = ENTER.disabled && CTRL_A.disabled;
      ENTER.disabled = !disabled;
      CTRL_A.disabled = !disabled;
      addLog(disabled ? "Enable Shortcuts" : "Disable Shortcuts");
    },
  });

  useShortcuts({
    keys: "ArrowUp",
    disallowFocusing: {
      input: true,
    },
    callback: () => {
      addLog("Arrow Up");
    },
  });

  useShortcuts({
    keys: "ArrowDown",
    disallowFocusing: {
      textarea: true,
    },
    callback: () => {
      addLog("Arrow Down");
    },
  });

  useShortcuts({
    keys: "ArrowLeft",
    disallowFocusing: {
      select: true,
    },
    callback: () => {
      addLog("Arrow Left");
    },
  });

  useShortcuts({
    keys: "ArrowRight",
    disallowFocusing: {
      button: true,
    },
    callback: () => {
      addLog("Arrow Right");
    },
  });

  const handleStopPropagation = (ev: React.MouseEvent) => {
    ev.stopPropagation();
  };

  const handleChangeInputMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  const handleChangeTextareaMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaMessage(event.target.value);
  };

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelect(event.target.value);
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
          <section className={style.section}>
            <h3>Shortcuts</h3>
            <Shortcut shortcut="ESC" feature="Close the Modal" />
            <Shortcut shortcut="Command L" feature="Enable / Disable Shortcuts" />

            <Shortcut shortcut="Command A" feature="Select All" disabled={CTRL_A.disabled} />
            <Shortcut shortcut="Enter" feature="Apply" disabled={ENTER.disabled} />

            <Shortcut shortcut="↑" feature="Up" disallowed={{ input: true }} />
            <Shortcut shortcut="↓" feature="Down" disallowed={{ textarea: true }} />
            <Shortcut shortcut="←" feature="Left" disallowed={{ select: true }} />
            <Shortcut shortcut="→" feature="Right" disallowed={{ button: true }} />
          </section>

          <section className={style.section}>
            <h3>Focusable Elements</h3>

            <input
              className={style.input}
              type="text"
              value={inputMessage}
              onChange={handleChangeInputMessage}
            />

            <textarea
              className={style.textarea}
              value={textareaMessage}
              onChange={handleChangeTextareaMessage}
            />

            <select value={select} className={style.select} onChange={handleChangeSelect}>
              <option value="1">{selectMessage}</option>
              <option value="2">{selectMessage}</option>
              <option value="3">{selectMessage}</option>
            </select>

            <button className={style.button}>{buttonMessage}</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Modal;
