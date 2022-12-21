import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CardLayout from "../components/layout/CardLayout";
import useWordStore from "../stores/useWordStore";
import WordService from "../services/WordService";

let hasLoaded = false;
const WordPage = () => {
  const wordStore = useWordStore();
  const [searchParams] = useSearchParams();

  const loadInitialData = async () => {
    if (hasLoaded) {
      return;
    }
    hasLoaded = true;

    const acronym = searchParams.get("acronym");
    const topic = searchParams.get("topic");

    if (!acronym || !topic) {
      throw new Error("Missing search params (acronym and topic)");
    }

    const { allNouns, semiSmart, wordLists } =
      await WordService.createReverseAcronym(acronym, topic);

    wordStore.setAllNouns(allNouns);
    wordStore.setSemiSmart(semiSmart);
    wordStore.setWordLists(wordLists);
  };
  useEffect(() => {
    if (wordStore.wordLists.length === 0) {
      loadInitialData();
    }
  }, []);

  return (
    <CardLayout>
      <h1>Word Page</h1>
    </CardLayout>
  );
};

export default WordPage;
