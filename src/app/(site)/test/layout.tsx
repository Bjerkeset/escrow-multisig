import {BGGrid} from "@/components/BGGrid";
// import {ThemeProvider} from "@/components/theme/theme-provider";
// import {Toaster} from "@/components/ui/toaster";
import "../globals.css";
import {Metadata} from "next";
import {Inter} from "next/font/google";
import LocalFont from "next/font/local";
import {ThemeProvider} from "@/context/providers/theme-provider";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className}dark ${inter}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <BGGrid>{children}</BGGrid>
        </ThemeProvider>
        {/* <Toaster /> */}
      </body>
    </html>
  );
}
