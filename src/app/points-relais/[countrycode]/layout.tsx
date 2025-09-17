import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
