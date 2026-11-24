/// <reference lib="dom" />
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
import { WorldMap } from "./feature/world/map/component/MapView";
import { StartPage } from "./StartPage";
import { ShowArticle } from "./feature/world/article/pages/ShowArticle";
import { CombatManager } from "./feature/combat/CombatManager";
import { AutomationEditor } from "./feature/combat/automation/AutomationEditor";
import { AutomationListPage } from "./feature/combat/automation/AutomationListPage";
import { audioClient } from "./feature/combat/audio/AudioService";

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
        <Route path="article/:vaultId/*" element={<ShowArticle />} />
        <Route path="world" element={<WorldMap />} />
        <Route path="combat/automations" element={<AutomationListPage />} />
        <Route path="combat/automations/new" element={<AutomationEditor />} />
        <Route path="combat/automations/:id" element={<AutomationEditor />} />
        <Route path="combat" element={<CombatManager />} />
        <Route path="combat/:id" element={<CombatManager />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

// SSE-Verbindung für clientseitige Automation-Befehle (z. B. Audio)
audioClient.connectSSE(() => {
  // Nachrichten werden über EventListener im AudioService verarbeitet
});
