import { ReactNode } from "react";
import "simplebar-react/dist/simplebar.min.css";

import { SnackbarProvider } from "@/libs/components/Snackbar";
import ThemeProvider from "@/libs/theme";

import { AuthProvider } from "@/auth/auth-provider";
import { APP_NAME } from "@/config";

export const metadata = {
  title: APP_NAME,
  description: `${APP_NAME} Dashboard`,
  keywords: APP_NAME,
  // manifest: "/manifest.json",
  // icons: [
  //   {
  //     rel: "icon",
  //     url: "/favicon/favicon.ico",
  //   },
  //   {
  //     rel: "icon",
  //     type: "image/png",
  //     sizes: "16x16",
  //     url: "/favicon/favicon-16x16.png",
  //   },
  //   {
  //     rel: "icon",
  //     type: "image/png",
  //     sizes: "32x32",
  //     url: "/favicon/favicon-32x32.png",
  //   },
  // ],
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-3WFFSB91FD"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-3WFFSB91FD');`,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
