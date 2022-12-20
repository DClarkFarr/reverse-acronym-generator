import StartSearchForm, {
  StartSearchFormState,
} from "../components/form/StartSearchForm";
import CardLayout from "../components/layout/CardLayout";

const HomePage = () => {
  const onSubmitSearch = async (values: StartSearchFormState) => {
    console.log("check it!", values);
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
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
