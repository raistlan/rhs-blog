import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raistlan H Schade",
  description: "This is a blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
