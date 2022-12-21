import StartSearchForm, {
  StartSearchFormState,
} from "../components/form/StartSearchForm";
import CardLayout from "../components/layout/CardLayout";
import WordService from "../services/WordService";
import useWordStore from "../stores/useWordStore";

import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const wordStore = useWordStore();
  const navigate = useNavigate();

  const onSubmitSearch = async ({ acronym, topic }: StartSearchFormState) => {
    const { allNouns, semiSmart, wordLists } =
      await WordService.createReverseAcronym(acronym, topic);

    wordStore.setAllNouns(allNouns);
    wordStore.setSemiSmart(semiSmart);
    wordStore.setWordLists(wordLists);

    navigate({
      pathname: "/word",
      search: `?acronym=${acronym}&topic=${topic}`,
    });
  };
  return (
    <CardLayout>
      <h1 className="font-bold mb-10 text-4xl text-gray-700">
        Reverse Acronym Generator
      </h1>

      <h3 className="text-lg font-medium mb-2">Get started</h3>
      <StartSearchForm onSubmit={onSubmitSearch} />
    </CardLayout>
  );
};

export default HomePage;
