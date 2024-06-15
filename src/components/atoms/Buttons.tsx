import { ButtonHTMLAttributes, FC } from "react";
import s from "./Buttons.module.scss";

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button className={`${s.button} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const BlackBtn: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button className={`${s.button} ${s.blackBtn} ${className}`} {...props}>
      {children}
    </button>
  );
};
