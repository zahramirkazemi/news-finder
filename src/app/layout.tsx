import type { Metadata } from "next";
import { Provider } from "react-redux";
import { store } from "@/store";
import "./globals.scss";

export const metadata: Metadata = {
  title: "News Feed",
  description: "News Feed app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
