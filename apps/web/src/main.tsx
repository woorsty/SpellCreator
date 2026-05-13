import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import CharacterCreator from "./component/character/CharacterCreator";
import React from "react";
import { CharacterSheetView } from "./feature/character-sheet/CharacterSheetView";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/creator" element={<CharacterCreator />} />
        <Route path="/show" element={<CharacterSheetView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
