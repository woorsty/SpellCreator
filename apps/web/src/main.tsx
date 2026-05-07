import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import CharacterCreator from "./component/character/CharacterCreator";
import React from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/creator" element={<CharacterCreator />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
