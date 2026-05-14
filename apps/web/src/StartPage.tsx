import React from "react";
import { A } from "./component/ui/A";
import { Card } from "./component/ui/Card";

export const StartPage: React.FC = () => {
  return (
    <Card>
      <A href="creator">Erstellen</A>
      <br />
      <A href="show">Zeigen</A>
    </Card>
  );
};
