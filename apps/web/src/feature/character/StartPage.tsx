import React from "react";
import { A } from "../../component/ui/A";
import { Card } from "../../component/ui/Card";
import { Link } from "react-router";

export const CharacterStartPage: React.FC = () => {
  return (
    <Card>
      <Link to="creator">Erstellen</Link>
      <br />
      <Link to="show">Zeigen</Link>
    </Card>
  );
};
