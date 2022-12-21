import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { upperFirst, words } from "lodash";
import CardLayout from "../components/layout/CardLayout";
import useWordStore from "../stores/useWordStore";
import WordService, {
  allNounWords,
  semiSmartWords,
} from "../services/WordService";

let hasLoaded = false;
const WordPage = () => {
  const [topic, setTopic] = useState("");
  const [acronym, setAcronym] = useState("");

  const wordStore = useWordStore();
  const [searchParams] = useSearchParams();

  const loadInitialData = async () => {
    if (hasLoaded) {
      return;
    }
    hasLoaded = true;

    const a = searchParams.get("acronym");
    const t = searchParams.get("topic");

    if (!a || !t) {
      throw new Error("Missing search params (acronym and topic)");
    }

    setAcronym(a);
    setTopic(t);

    const { allNouns, semiSmart, wordLists, smartLists, smartWords } =
      await WordService.createReverseAcronym(a, t);

    wordStore.setAllNouns(allNouns);
    wordStore.setSemiSmart(semiSmart);
    wordStore.setWordLists(wordLists);
    wordStore.setSmartWords(smartWords);
    wordStore.setSmartLists(smartLists);
  };
  useEffect(() => {
    if (wordStore.wordLists.length === 0) {
      loadInitialData();
    }
  }, []);

  const onRefreshAllNouns = () => {
    const newSet = allNounWords(wordStore.wordLists).map((w) => w.word);

    wordStore.setAllNouns(newSet);
  };

  const onRefreshSemiSmart = () => {
    const newSet = semiSmartWords(wordStore.wordLists).map((w) => w.word);

    wordStore.setSemiSmart(newSet);
  };

  return (
    <CardLayout>
      <h1 className="text-2xl mb-4">
        <span className="font-thin pr-1">Let's get the perfect</span>
        <br />
        <span className="font-bold">REVERSE ACRONYM</span>
      </h1>

      <div className="flex gap-x-4 items-center mb-8">
        <div className="flex">
          <div className="font-light">Acronym: </div>
          <div className="font-bold">{acronym}</div>
        </div>
        <div className="flex">
          <div className="font-light">Topic: </div>
          <div className="font-bold">{topic}</div>
        </div>
      </div>
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">All nouns</h3>
          <div className="flex gap-2">
            {wordStore.allNouns.map((word) => (
              <div key={word} className="text-gray-700">
                {upperFirst(word)}
              </div>
            ))}
            <div className="ml-auto">
              <button
                className="btn btn-sm bg-red-700 hover:bg-red-900"
                onClick={onRefreshAllNouns}
              >
                Redo
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Semi Smart</h3>
          <div className="flex gap-2">
            {wordStore.semiSmart.map((word) => (
              <div key={word} className="text-gray-700">
                {upperFirst(word)}
              </div>
            ))}
            <div className="ml-auto">
              <button
                className="btn btn-sm bg-red-700 hover:bg-red-900"
                onClick={onRefreshSemiSmart}
              >
                Redo
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Smart V2</h3>
          <div className="flex gap-2">
            {wordStore.smartWords.map((word) => (
              <div key={word} className="text-gray-700">
                {upperFirst(word)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

export default WordPage;
