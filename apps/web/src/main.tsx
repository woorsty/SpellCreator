import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import CharacterCreator from "./component/character-creator/CharacterCreator";
import { CharacterSheetList } from "./component/character-show/CharacterSheetList";
import { CharacterSheetView } from "./component/character-show/CharacterSheetView";
import React from "react";
import { StartPage } from "./StartPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/creator" element={<CharacterCreator />} />
        <Route path="/show" element={<CharacterSheetList />} />
        <Route path="/show/:name" element={<CharacterSheetView />} />
        <Route path="/" element={<StartPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
