import { ReactNode } from "react";

export type CProps<P extends object = {}> = P & { children: ReactNode };
