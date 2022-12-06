import { Fragment } from "react";
import style from "./Shortcut.module.css";

interface IShortcutProps {
  shortcut: string;
  feature: string;
}

const Shortcut = (props: IShortcutProps) => (
  <p className={style.shortcut}>
    {props.shortcut.split(" ").map((key, i) => (
      <Fragment key={`${key}-${i}`}>
        <kbd>{key}</kbd>{" "}
      </Fragment>
    ))}
    {props.feature}
  </p>
);

export default Shortcut;
