import { createContext, useContext } from "react";
import create, { useStore, StoreApi } from "zustand";
import { devtools } from "zustand/middleware";
import { ResponseWord } from "../services/dataMuseApi";

export interface WordStore {
  wordLists: ResponseWord[][];
  semiSmart: string[];
  allNouns: string[];

  setWordLists: (wordLists: ResponseWord[][]) => void;
  setSemiSmart: (semiSmart: string[]) => void;
  setAllNouns: (allNouns: string[]) => void;
}

export const createWordStore = () =>
  create<WordStore>()(
    devtools((set, get) => ({
      wordLists: [],
      semiSmart: [],
      allNouns: [],

      setWordLists: (wordLists: ResponseWord[][]) =>
        set((draft) => {
          return { ...draft, wordLists };
        }),

      setSemiSmart: (semiSmart: string[]) =>
        set((draft) => {
          return { ...draft, semiSmart };
        }),

      setAllNouns: (allNouns: string[]) =>
        set((draft) => {
          return { ...draft, allNouns };
        }),
    }))
  );

export const WordStoreContext = createContext<StoreApi<WordStore>>(
  createWordStore()
);

const useWordStore = () => useStore(useContext(WordStoreContext));

export default useWordStore;
