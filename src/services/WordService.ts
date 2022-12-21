import { findRelatedStartsWith } from "./dataMuseApi";

export default class WordService {
  static async createReverseAcronym(acronym: string, topic: string) {
    const lists = await Promise.all(
      acronym.split("").map((c) => {
        return findRelatedStartsWith(c, topic);
      })
    );

    console.log("got lists", lists);
  }
}
