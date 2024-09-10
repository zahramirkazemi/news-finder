import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}
