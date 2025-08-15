export const generateId = (prefx: "node" | "edge" | "pin") => `${prefx}-${Math.random().toString(16).slice(2)}`;
