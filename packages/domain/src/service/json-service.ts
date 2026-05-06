import * as fs from "fs/promises";

export class JsonService {
  public static async readJsonFile<TYPE>(
    jsonFilePath: string,
  ): Promise<TYPE[]> {
    try {
      const fileContent = await fs.readFile(jsonFilePath, "utf-8");
      return JSON.parse(fileContent) as TYPE[];
    } catch (error) {
      console.error("Fehler beim Lesen der JSON-Datei:", error);
      return [];
    }
  }

  public static async writeJsonFile(
    data: Object[],
    jsonFilePath: string,
  ): Promise<void> {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(jsonFilePath, jsonData, "utf-8");
      console.log("JSON-Datei erfolgreich aktualisiert.");
    } catch (error) {
      console.error("Fehler beim Schreiben der JSON-Datei:", error);
    }
  }

  public static async readJsonFilesInDirectory<TYPE>(
    directoryPath: string,
  ): Promise<TYPE[]> {
    try {
      const files = await fs.readdir(directoryPath);
      const jsonFiles = files.filter((file: string) => file.endsWith(".json"));
      const allData: TYPE[] = [];
      for (const jsonFile of jsonFiles) {
        const filePath = `${directoryPath}/${jsonFile}`;
        const fileContent = await fs.readFile(filePath, "utf-8");
        const jsonData = JSON.parse(fileContent) as TYPE;
        allData.push(jsonData);
      }
      return allData;
    } catch (error) {
      console.error(
        "Fehler beim Lesen der JSON-Dateien im Verzeichnis:",
        error,
      );
      return [];
    }
  }
}
