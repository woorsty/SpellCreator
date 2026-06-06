import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import CharacterCreator from "./component/character/creator/CharacterCreator";
import { CharacterSheetList } from "./component/character/show/CharacterSheetList";
import { CharacterSheetView } from "./component/character/show/CharacterSheetView";
import React from "react";
import { StartPage } from "./StartPage";
import CharacterLayout from "./feature/character/CharacterLayout";
import { WorldView } from "./component/world/WorldView";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/character" element={<CharacterLayout />}>
          <Route index element={<StartPage />} />
          <Route path="creator" element={<CharacterCreator />} />
          <Route path="show" element={<CharacterSheetList />} />
          <Route path="show/:name" element={<CharacterSheetView />} />
        </Route>
        <Route path="world" element={<WorldView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
