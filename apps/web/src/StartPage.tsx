import React from "react";
import { Link } from "react-router-dom";
import { Card } from "./component/ui/Card";
import { A } from "./component/ui/A";

export const StartPage: React.FC = () => {
  const baseUrl = import.meta.env.DEV
    ? "http://localhost:3000"
    : "http://rieke.duckdns.org:3000";

  return (
    <Card>
      <Link to="character">Charaktere</Link>
      <br />
      <Link to="world">Welt</Link>
      <br />
      <A href={baseUrl}>Daten</A>
    </Card>
  );
};
