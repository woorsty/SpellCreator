"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataController = void 0;
class DataController {
    static async getMonsters(req, res) {
        const germanData = await this.fetchGermanMonsterData();
        const englishData = await this.fetchEnglishMonsterData();
        res.json(await DataController.fetchGermanMonsterData());
    }
    static async fetchGermanMonsterData() {
        return this.fetchData(this.monsterApiGermanUrl);
    }
    static async fetchEnglishMonsterData() {
        return this.fetchData(this.monsterApiEnglishUrl);
    }
    static async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("HTTP Fehler " + response.status);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("Fehler beim Laden:", error);
            return null;
        }
    }
    static mergeMonsterData(germanData, englishData) {
        germanData.monsters.forEach((germanMonster) => {
            const matchingEnglishMonster = englishData.results.find((engMonster) => engMonster.name === germanMonster.Name);
            if (matchingEnglishMonster) {
                germanMonster.englishDetailsUrl =
                    this.monsterApiEnglishUrl + matchingEnglishMonster.url;
            }
        });
        return germanData;
    }
}
exports.DataController = DataController;
DataController.monsterApiGermanUrl = "https://www.dnddeutsch.de/tools/json.php?apiv=0.7&o=monster&q=MONSTER";
DataController.monsterApiEnglishUrl = "https://www.dnd5eapi.co/";
//# sourceMappingURL=dataControler.js.map