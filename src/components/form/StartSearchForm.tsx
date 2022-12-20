import { useFormik } from "formik";
export type StartSearchFormState = {
  acronym: string;
  topic: string;
};

const StartSearchForm = ({
  onSubmit,
}: {
  onSubmit: (values: StartSearchFormState) => Promise<void>;
}) => {
  const formik = useFormik({
    initialValues: {
      acronym: "",
      topic: "",
    },
    validate: (values) => {
      const errors: Partial<StartSearchFormState> = {};
      if (!values.acronym) {
        errors.acronym = "Please pick an acronym";
      }
      if (values.acronym.length < 2) {
        errors.acronym = "Acronym must be at least 2 chars";
      }
      if (!values.topic) {
        errors.topic = "Please enter a topic";
      }
      return errors;
    },
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="acronym">Acronym</label>
          <input
            id="acronym"
            name="acronym"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.acronym}
            placeholder="e.g. NASA, LGTM, etc."
          />
          {formik.errors.acronym && (
            <p className="text-red-700">{formik.errors.acronym}</p>
          )}
        </div>
        <div>
          <label htmlFor="topic">Topic</label>
          <input
            id="topic"
            name="topic"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.topic}
            placeholder="e.g. christmas, space, etc."
          />
          {formik.errors.topic && (
            <p className="text-red-700">{formik.errors.topic}</p>
          )}
        </div>
      </div>
      <div></div>

      <button type="submit" disabled={formik.isSubmitting || !formik.isValid}>
        {formik.isSubmitting ? "Loading..." : "Submit"}
      </button>
    </form>
  );
};

export default StartSearchForm;
