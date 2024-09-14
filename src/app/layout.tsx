import type { Metadata } from "next";
// store
import ReduxProvider from "@/store-provider";
// styles
import "@/app/globals.scss";

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
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
