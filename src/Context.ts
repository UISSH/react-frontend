import { createContext } from "react";

export const PureFunctionContext = createContext<() => void>(() => {});
