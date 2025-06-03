import { COMPONENTS_OBJECT_NAME } from "@/constants";
import { Cookie } from "./Cookie";
import { appendComponentIntoWindowObject } from "@/factory";

appendComponentIntoWindowObject({
  nameObject: COMPONENTS_OBJECT_NAME,
  name: "Cookie",
  Component: Cookie,
});
