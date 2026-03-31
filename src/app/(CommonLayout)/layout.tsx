import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import type { ReactNode } from "react";

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
