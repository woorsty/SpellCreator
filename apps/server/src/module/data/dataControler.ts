import { fetchUrl } from "@repo/domain";
import type { Request, Response } from "express";

export class DataController {
  private static readonly monsterApiGermanUrl =
    "https://www.dnddeutsch.de/tools/json.php?apiv=0.7&o=monster&q=MONSTER";
  private static readonly monsterApiEnglishUrl = "https://www.dnd5eapi.co/";

  static async getMonsters(req: Request, res: Response) {
    const germanData = await this.fetchGermanMonsterData();
    const englishData = await this.fetchEnglishMonsterData();
    res.json(await DataController.fetchGermanMonsterData());
  }

  private static async fetchGermanMonsterData() {
    return this.fetchData(this.monsterApiGermanUrl);
  }

  private static async fetchEnglishMonsterData() {
    return this.fetchData(this.monsterApiEnglishUrl);
  }

  private static async fetchData(url: string) {
    try {
      const response = await fetchUrl(url);
      if (!response.ok) {
        throw new Error("HTTP Fehler " + response.status);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fehler beim Laden:", error);
      return null;
    }
  }

  private static mergeMonsterData(germanData: any, englishData: any) {
    germanData.monsters.forEach((germanMonster: any) => {
      const matchingEnglishMonster = englishData.results.find(
        (engMonster: any) => engMonster.name === germanMonster.Name,
      );

      if (matchingEnglishMonster) {
        germanMonster.englishDetailsUrl =
          this.monsterApiEnglishUrl + matchingEnglishMonster.url;
      }
    });
    return germanData;
  }
}
