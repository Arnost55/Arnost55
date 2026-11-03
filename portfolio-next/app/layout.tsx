import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arnost — Developer",
  description: "Developer building ambitious software, intelligent systems, and digital products.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
