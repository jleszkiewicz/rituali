import { ReactNode } from "react";

const ConditionalRenderer = ({
  condition,
  children,
}: {
  condition: boolean;
  children: ReactNode;
}) => {
  return condition ? children : null;
};

export default ConditionalRenderer;
