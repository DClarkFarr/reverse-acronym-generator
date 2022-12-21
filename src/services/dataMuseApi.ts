import axios from "axios";

export type WordTag = "adj" | "adv" | "n" | "v" | "u" | "prop";

export type ResponseWord = {
  score: number;
  word: string;
  tags: WordTag[];
};
const dataMuseApi = axios.create({
  baseURL: "https://api.datamuse.com",
});

export const findRelatedStartsWith = async (
  word: string,
  topic = "",
  max = 50
): Promise<ResponseWord[]> => {
  const response = await dataMuseApi.get(`words`, {
    params: {
      sp: `${word.slice(0, 1)}*`,
      topic,
      max,
      md: "p",
    },
  });
  return sortWordListByScoreAsc(
    excludeWordsByTags(filterWordsByLength(response.data, 2), ["u", "prep"])
  );
};

export const filterWordsByTags = (words: ResponseWord[], tags: string[]) => {
  return [
    ...words.filter((word) => {
      return word.tags?.some((tag) => tags.includes(tag));
    }),
  ];
};

export const excludeWordsByTags = (words: ResponseWord[], tags: string[]) => {
  return [
    ...words.filter((word) => {
      return !word.tags?.some((tag) => tags.includes(tag));
    }),
  ];
};

export const filterWordsByLength = (
  words: ResponseWord[],
  minLength: number
) => {
  return [
    ...words.filter((word) => {
      return word.word.length >= minLength;
    }),
  ];
};

export const sortWordListByScoreAsc = (words: ResponseWord[]) => {
  return [...words].sort((a, b) => a.score - b.score);
};

export default dataMuseApi;
