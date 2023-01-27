import { Fragment } from "react";
import { isMacOs } from "react-device-detect";
import style from "./Shortcut.module.css";

interface IShortcutProps {
  shortcut: string;
  feature: string;
}

const Shortcut = (props: IShortcutProps) => {
  const shortcuts = props.shortcut
    .split(" ")
    .map((key) => (isMacOs ? key : key.replace("Command", "Ctrl")));

  return (
    <p className={style.shortcut}>
      {shortcuts.map((key, i) => (
        <Fragment key={`${key}-${i}`}>
          <kbd>{key}</kbd>{" "}
        </Fragment>
      ))}
      {props.feature}
    </p>
  );
};

export default Shortcut;
