import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

type PageShellProps = {
  children: ReactNode;
  /** `overlay` is only used by the home page, whose hero sits under the header. */
  variant?: "overlay" | "solid";
};

export function PageShell({ children, variant = "solid" }: PageShellProps) {
  return (
    <>
      <Header variant={variant} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
