import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Море Minsk — аренда яхт на Минском море",
  description:
    "Парусные и моторные яхты в аренду на Минском водохранилище. Прогулки, мероприятия, пакеты под ключ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
