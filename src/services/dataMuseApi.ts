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

export const findMeansLikeStartsWith = async (
  meansLike: string,
  startsWith: string,
  max = 50,
  topic: string | undefined = undefined
) => {
  const response = await dataMuseApi.get(`words`, {
    params: {
      ml: meansLike,
      sp: `${startsWith}*`,
      max,
      md: "p",
      topic,
    },
  });
  return sortWordListByScoreAsc(
    excludeWordsByTags(
      excludeEmptyTags(filterWordsByLength(response.data, 2)),
      ["u", "prep"]
    )
  );
};

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
    excludeWordsByTags(
      excludeEmptyTags(filterWordsByLength(response.data, 2)),
      ["u", "prep"]
    )
  );
};

export const findNextWord = async (
  previousWord: string,
  topic: string,
  startsWith: string
) => {
  const response = await dataMuseApi.get(`words`, {
    params: {
      rel_bga: previousWord,
      topic,
      sp: `${startsWith}*`,
      max: 50,
      md: "p",
    },
  });
  return sortWordListByScoreAsc(
    excludeWordsByTags(
      excludeEmptyTags(filterWordsByLength(response.data, 2)),
      ["u", "prep"]
    )
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

export const excludeEmptyTags = (words: ResponseWord[]) => {
  return [
    ...words.filter((word) => {
      return word.tags?.length;
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
