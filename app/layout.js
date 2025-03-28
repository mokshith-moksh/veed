import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css"; // Import Mantine styles
import "@/app/globals.css";
import { NavbarMinimal } from "@/components/NavbarMinimal";

export const metadata = {
  title: "My App",
  description: "Mantine UI with Tailwind in Next.js App Router",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <main>{children}</main>
        </MantineProvider>
      </body>
    </html>
  );
}
