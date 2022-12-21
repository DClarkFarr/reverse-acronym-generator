import StartSearchForm, {
  StartSearchFormState,
} from "../components/form/StartSearchForm";
import CardLayout from "../components/layout/CardLayout";
import WordService from "../services/WordService";

const HomePage = () => {
  const onSubmitSearch = async ({ acronym, topic }: StartSearchFormState) => {
    await WordService.createReverseAcronym(acronym, topic);
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
