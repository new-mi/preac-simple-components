import { type ICoreComponentProps } from "@/types";
import classes from "./Cookie.module.css";
import CookieIcon from "./cookie.svg?react";
import { useLayoutEffect } from "preact/hooks";

interface ICookieProps extends ICoreComponentProps {
  sessionStorageKey: string;
  text?: string;
  linkHref?: string;
  linkText?: string;
  buttonText?: string;
}

export const Cookie = (props: ICookieProps) => {
  const {
    sessionStorageKey,
    unmount,
    text = "We use cookies for essential website functions and to better understand how you use our site, so we can create the best possible experience for you ❤️",
    linkHref = "",
    linkText = "Privacy Policy",
    buttonText = "Got it",
  } = props;

  useLayoutEffect(() => {
    const isShown =
      !sessionStorageKey || sessionStorage.getItem(sessionStorageKey);
    if (isShown) {
      unmount();
    }
  }, []);

  const handleClick = () => {
    sessionStorage.setItem(sessionStorageKey, "true");
    unmount();
  };

  return (
    <div class={classes.root}>
      <CookieIcon class={classes.icon} />
      <p class={classes.text} dangerouslySetInnerHTML={{ __html: text }} />
      <div class={classes.actions}>
        <a
          class={classes.link}
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkText}
        </a>
        <button class={classes.button} onClick={handleClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};
