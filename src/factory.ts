import { h, type JSX, render } from "preact";

type Component = (props: unknown) => JSX.Element;

/**
 * Applies attributes and styles to an element.
 * @param element - The element to apply attributes and styles to.
 * @param attributes - The attributes to apply.
 * @param styles - The styles to apply.
 */
function applyAttributesAndStyles(
  element: HTMLElement,
  attributes: Record<string, string>,
  styles: Record<string, string>
) {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  Object.entries(styles).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}

/**
 * Removes attributes and styles from an element.
 * @param element - The element to remove attributes and styles from.
 * @param attributes - The attributes to remove.
 * @param styles - The styles to remove.
 */
function removeAttributesAndStyles(
  element: HTMLElement,
  attributes: Record<string, string>,
  styles: Record<string, string>
) {
  Object.keys(attributes).forEach((key) => {
    element.removeAttribute(key);
  });
  Object.keys(styles).forEach((key) => {
    element.style.removeProperty(key);
  });
}

/**
 * Appends a component into a window object.
 * @param props - The properties.
 * @param props.target - The target object.
 * @param props.name - The name of the component.
 * @param props.Component - The component to render.
 */
export const appendComponentIntoWindowObject = (props: {
  target: string;
  name: string;
  Component: Component;
}) => {
  const { name, Component, target } = props;
  ensurePath(
    target,
    { [name]: buildComponentFunction(Component) },
    {
      root: window,
      overwrite: true,
    }
  );
};

/**
 * Builds a component function that can be used to render a component.
 * @param Component - The component to render.
 * @returns A function that can be used to render a component.
 */
export const buildComponentFunction = (Component: Component) => {
  return (options: {
    root?: string | HTMLElement;
    props: Record<string, unknown>;
    container?: {
      attributes?: Record<string, string>;
      style?: Record<string, string>;
    };
  }) => {
    const {
      root = document.body,
      props = {},
      container: { attributes = {}, style = {} } = {},
    } = options;

    const rootElement =
      typeof root === "string"
        ? (document.querySelector(root) as HTMLElement)
        : root;

    if (!rootElement) {
      throw new Error("Root element not found");
    }

    let container: HTMLElement;
    const isCreatedContainer = rootElement === document.body;

    if (isCreatedContainer) {
      container = document.createElement("div");
      applyAttributesAndStyles(container, attributes, style);
      rootElement.appendChild(container);
    } else {
      container = rootElement;
      applyAttributesAndStyles(container, attributes, style);
    }

    const unmountComponent = () => {
      render(null, container);

      if (isCreatedContainer && container.parentNode) {
        container.parentNode.removeChild(container);
      } else if (!isCreatedContainer) {
        removeAttributesAndStyles(container, attributes, style);
      }
    };

    let currentProps = { ...props, unmount: unmountComponent } as Record<
      string,
      unknown
    >;

    const renderComponent = (newProps: Record<string, unknown>) => {
      currentProps = { ...currentProps, ...newProps };
      render(h(Component, currentProps), container);
    };

    renderComponent(currentProps);

    return {
      container,
      unmount: unmountComponent,
      update: renderComponent,
    };
  };
};

/**
 * Ensures a path exists in an object.
 * @param pathStr - The path to ensure.
 * @param extendObj - The object to extend.
 * @param options - The options.
 * @param options.root - The root object.
 * @param options.overwrite - Whether to overwrite existing keys.
 * @returns The extended object.
 */
function ensurePath(
  pathStr: string,
  extendObj: Record<string, unknown>,
  options: {
    root?: Window | typeof globalThis;
    overwrite?: boolean;
  } = {}
) {
  if (typeof pathStr !== "string" || !pathStr.trim()) {
    throw new Error('pathStr должен быть непустой строкой вида "a.b.c".');
  }

  const {
    root = typeof window !== "undefined" ? window : globalThis,
    overwrite = true,
  } = options;

  const banned = new Set(["__proto__", "prototype", "constructor"]);
  const parts = pathStr.split(".").filter(Boolean);
  let current = root;

  for (const key of parts) {
    if (banned.has(key)) throw new Error(`Недопустимый ключ: ${key}`);

    const val = current[key];
    if (typeof val !== "object" || val === null) {
      current[key] = {};
    }
    current = current[key];
  }

  if (extendObj && typeof extendObj === "object") {
    for (const k of Object.keys(extendObj)) {
      if (overwrite || !Object.prototype.hasOwnProperty.call(current, k)) {
        current[k] = extendObj[k];
      }
    }
  }

  return current;
}
