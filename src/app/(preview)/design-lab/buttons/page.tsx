import type { Metadata } from "next";
import { ButtonsLab } from "./ButtonsLab";

export const metadata: Metadata = {
  title: "Button borders — lab",
  robots: { index: false, follow: false },
};

export default function ButtonsLabPage() {
  return <ButtonsLab />;
}
