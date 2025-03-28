import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css"; // Import Mantine styles
import "@/app/globals.css";
import { Notifications } from "@mantine/notifications";

export const metadata = {
  title: "My App",
  description: "Mantine UI with Tailwind in Next.js App Router",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Notifications position="top-right" />
          <main>{children}</main>
        </MantineProvider>
      </body>
    </html>
  );
}
