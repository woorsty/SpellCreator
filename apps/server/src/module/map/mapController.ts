import path from "path";
import type { Request, Response } from "express";
import fs from "fs";
import { randomUUID } from "crypto";

type MapEntityType = "point" | "line" | "polygon";
export class MapController {
  private static getPath(type: MapEntityType) {
    return path.resolve(process.cwd(), "data", "map", `${type}s.json`);
  }

  public static async getAll(req: Request, res: Response) {
    const points = JSON.parse(
      fs.readFileSync(MapController.getPath("point"), "utf-8"),
    );
    const lines = JSON.parse(
      fs.readFileSync(MapController.getPath("line"), "utf-8"),
    );
    const polygons = JSON.parse(
      fs.readFileSync(MapController.getPath("polygon"), "utf-8"),
    );
    res.json({
      points,
      lines,
      polygons,
    });
  }

  public static async get(req: Request, res: Response, type: MapEntityType) {
    const data = JSON.parse(
      fs.readFileSync(MapController.getPath(type), "utf-8"),
    );
    res.json(data);
  }

  public static async add(req: Request, res: Response, type: MapEntityType) {
    const newEntity = req.body;
    const data = JSON.parse(
      fs.readFileSync(MapController.getPath(type), "utf-8"),
    );
    data.push(newEntity);
    newEntity.id = randomUUID();

    fs.writeFileSync(
      MapController.getPath(type),
      JSON.stringify(data, null, 2),
    );
    res.status(201).json(newEntity);
  }

  public static async remove(req: Request, res: Response, type: MapEntityType) {
    const pointId = req.params.id;
    const data = JSON.parse(
      fs.readFileSync(MapController.getPath(type), "utf-8"),
    );
    const updatedData = data.filter((point: any) => point.id !== pointId);
    fs.writeFileSync(
      MapController.getPath(type),
      JSON.stringify(updatedData, null, 2),
    );
    res.status(204).send();
  }

  public static async update(req: Request, res: Response, type: MapEntityType) {
    const pointId = req.params.id;
    const updatedPoint = req.body;
    const data = JSON.parse(
      fs.readFileSync(MapController.getPath(type), "utf-8"),
    );
    const index = data.findIndex((point: any) => point.id === pointId);
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedPoint };
      fs.writeFileSync(
        MapController.getPath(type),
        JSON.stringify(data, null, 2),
      );
      res.json(data[index]);
    } else {
      res.status(404).json({ message: "Point not found" });
    }
  }
}
