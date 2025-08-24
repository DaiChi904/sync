export const generateId = (prefx: "circuit" | "node" | "edge" | "pin") =>
  `${prefx}-${Math.random().toString(16).slice(2)}`;
