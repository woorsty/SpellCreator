import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import CharacterCreator from "./component/character/creator/CharacterCreator";
import { CharacterSheetList } from "./component/character/show/CharacterSheetList";
import { CharacterSheetView } from "./component/character/show/CharacterSheetView";
import React from "react";
import { CharacterStartPage } from "./feature/character/StartPage";
import CharacterLayout from "./feature/character/CharacterLayout";
import { WorldMap } from "./feature/world/component/MapView";
import { StartPage } from "./StartPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/character" element={<CharacterLayout />}>
          <Route index element={<CharacterStartPage />} />
          <Route path="creator" element={<CharacterCreator />} />
          <Route path="show" element={<CharacterSheetList />} />
          <Route path="show/:name" element={<CharacterSheetView />} />
        </Route>
        <Route path="world" element={<WorldMap />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
