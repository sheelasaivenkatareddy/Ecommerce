import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { CartHydrator } from "@/components/cart-hydrator";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Storefront: everyday essentials, delivered", template: "%s · Storefront" },
  description:
    "An online store built with Next.js: browse products, fill your cart and check out with Cash on Delivery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <CartHydrator />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
