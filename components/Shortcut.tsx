import { Fragment } from "react";
import { isMacOs } from "react-device-detect";
import classNames from "classnames";
import style from "./Shortcut.module.css";

interface IShortcutProps {
  shortcut: string;
  feature: string;
  disabled?: boolean;
}

const Shortcut = (props: IShortcutProps) => {
  const shortcuts = props.shortcut
    .split(" ")
    .map((key) => (isMacOs ? key : key.replace("Command", "Ctrl")));

  return (
    <p
      className={classNames(style.shortcut, {
        [style.disabled]: props.disabled,
      })}
    >
      {shortcuts.map((key, i) => (
        <Fragment key={`${key}-${i}`}>
          <kbd>{key}</kbd>{" "}
        </Fragment>
      ))}
      <span className={style.feature}>{props.feature}</span>
    </p>
  );
};

export default Shortcut;
