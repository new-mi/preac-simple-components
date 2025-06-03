import { h, render } from "preact";

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

export const appendComponentIntoWindowObject = (props: {
  nameObject: string;
  name: string;
  Component: any;
}) => {
  const { name, Component, nameObject } = props;
  window[nameObject] = {
    ...window[nameObject],
    [name]: buildComponentFunction(Component),
  };
};

export const buildComponentFunction = (Component: any) => {
  return function (options: {
    root?: string | HTMLElement;
    props: Record<string, any>;
    container?: {
      attributes?: Record<string, string>;
      style?: Record<string, string>;
    };
  }) {
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

    let currentProps = { ...props, unmount: unmountComponent };

    const renderComponent = (newProps: Record<string, any>) => {
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
