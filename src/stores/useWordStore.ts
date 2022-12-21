import { createContext, useContext } from "react";
import create, { useStore, StoreApi } from "zustand";
import { devtools } from "zustand/middleware";
import { ResponseWord } from "../services/dataMuseApi";

export interface WordStore {
  wordLists: ResponseWord[][];
  semiSmart: string[];
  allNouns: string[];

  smartWords: string[];
  smartLists: ResponseWord[][];

  setWordLists: (wordLists: ResponseWord[][]) => void;
  setSemiSmart: (semiSmart: string[]) => void;
  setAllNouns: (allNouns: string[]) => void;

  setSmartWords: (smartWords: string[]) => void;
  setSmartLists: (smartLists: ResponseWord[][]) => void;
}

export const createWordStore = () =>
  create<WordStore>()(
    devtools((set, get) => ({
      wordLists: [],
      semiSmart: [],
      allNouns: [],

      smartWords: [],
      smartLists: [],

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

      setSmartWords: (smartWords: string[]) =>
        set((draft) => {
          return { ...draft, smartWords };
        }),

      setSmartLists: (smartLists: ResponseWord[][]) =>
        set((draft) => {
          return { ...draft, smartLists };
        }),
    }))
  );

export const WordStoreContext = createContext<StoreApi<WordStore>>(
  createWordStore()
);

const useWordStore = () => useStore(useContext(WordStoreContext));

export default useWordStore;
