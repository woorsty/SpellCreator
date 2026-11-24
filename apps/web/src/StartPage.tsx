import React from "react";
import { Card } from "./component/ui/Card";
import { Button } from "./component/ui/Button";
import { Link } from "react-router-dom";

export const StartPage: React.FC = () => {
  const serverUrl = import.meta.env.DEV
    ? "http://localhost:3000"
    : "http://api-rieke.duckdns.org";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="Card elevated p-8 text-center">
        <h1 className="text-4xl font-serif font-bold text-text dnd-gradient-text mb-2">
          ⚔️ D&D Combat Manager
        </h1>
        <p className="text-text-muted text-lg mb-6">
          Verwalte deine D&D-Kämpfe mit einem leistungsfähigen Event- und
          Automationssystem.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="flex-1 sm:flex-none"
          >
            <Link to="combat">Combat Manager öffnen</Link>
          </Button>
          <Button variant="secondary" asChild className="flex-1 sm:flex-none">
            <Link to="character">Charaktere</Link>
          </Button>
          <Button variant="secondary" asChild className="flex-1 sm:flex-none">
            <Link to="world">Weltkarte</Link>
          </Button>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          <a
            href={serverUrl}
            className="text-xs text-text-muted underline underline-offset-4 hover:text-primary"
          >
            API-Server: {serverUrl}
          </a>
        </div>
      </div>
    </div>
  );
}
