import { random } from "lodash";
import {
  ResponseWord,
  WordTag,
  filterWordsByTags,
  findMeansLikeStartsWith,
  findNextWord,
  findRelatedStartsWith,
} from "./dataMuseApi";

const chooseNextWord = (wordList: ResponseWord[], targetWord: ResponseWord) => {
  const acceptableTags = targetWord.tags?.reduce((acc, t) => {
    switch (t) {
      case "n":
        return [...acc, "adv", "v", "n"];
      case "adj":
        return [...acc, "adv", "n", "v"];
      case "adv":
        return [...acc, "v", "n", "adv"];
      case "v":
        return [...acc, "adv", "n", "adj"];
      default:
        return acc;
    }
  }, [] as string[]) as WordTag[];

  const filteredList = filterWordsByTags(wordList, acceptableTags);

  const index = random(0, filteredList.length - 1);

  return filteredList[index];
};
const choosePreviousWord = (
  wordList: ResponseWord[],
  targetWord: ResponseWord
) => {
  const acceptableTags = targetWord.tags?.reduce((acc, t) => {
    switch (t) {
      case "n":
        return [...acc, "adj", "v", "n"];
      case "adj":
        return [...acc, "adv", "n"];
      case "adv":
        return [...acc, "v", "n"];
      case "v":
        return [...acc, "adv", "n"];
      default:
        return acc;
    }
  }, [] as string[]) as WordTag[];

  const filteredList = filterWordsByTags(wordList, acceptableTags);

  const index = random(
    Math.floor(filteredList.length / 4),
    Math.ceil(filteredList.length - filteredList.length / 4)
  );

  return filteredList[index];
};

export const allNounWords = (wordLists: ResponseWord[][]) => {
  const picked: ResponseWord[] = [];

  for (let i = 0; i < wordLists.length; i++) {
    const wordList = wordLists[i];
    const nounWords = filterWordsByTags(wordList, ["n"]);
    if (nounWords.length) {
      const index = random(0, nounWords.length - 1);
      picked.push(nounWords[index]);
    }
  }

  return picked;
};

export const semiSmartWords = (wordLists: ResponseWord[][]) => {
  const picked: ResponseWord[] = [];

  const firstList = wordLists[0];
  const secondList = filterWordsByTags(wordLists[1], ["v", "n"]);

  const secondIndex = random(0, secondList.length - 1);

  picked.push(secondList[secondIndex]);
  picked.splice(0, 0, choosePreviousWord(firstList, picked[0]));

  for (let i = 2; i < wordLists.length; i++) {
    const wordList = wordLists[i];
    const previousWord = picked[i - 1];
    picked.push(chooseNextWord(wordList, previousWord));
  }

  return picked;
};

export default class WordService {
  static async createReverseAcronym(acronym: string, topic: string) {
    const wordLists = await Promise.all(
      acronym.split("").map((c) => {
        return findRelatedStartsWith(c, topic);
      })
    );

    const allNouns = allNounWords(wordLists);
    const semiSmart = semiSmartWords(wordLists);

    const { words: smartWords, lists: smartLists } = await this.chainSmartWord(
      acronym,
      topic
    );

    return {
      allNouns: allNouns.map((w) => w.word),
      semiSmart: semiSmart.map((w) => w.word),
      wordLists,
      smartWords: smartWords.map((w) => w.word),
      smartLists,
    };
  }

  static async chainSmartWord(acronym: string, topic: string) {
    const chars = acronym.split("");

    const first = chars[0] || "";

    const words: ResponseWord[] = [];
    const lists: ResponseWord[][] = [];

    const firstList = await findMeansLikeStartsWith(topic, first);

    lists.push(firstList);

    words.push(firstList[random(0, firstList.length - 1)]);

    for (let i = 1; i < chars.length; i++) {
      const char = chars[i];

      const previousWord = words[i - 1].word;
      let nextList = await findNextWord(previousWord, topic, char);
      if (!nextList.length) {
        nextList = await findMeansLikeStartsWith(previousWord, char, 50, topic);
      }

      lists.push(nextList);
      words.push(nextList[random(0, nextList.length - 1)]);
    }

    return {
      lists,
      words,
    };
  }
}
