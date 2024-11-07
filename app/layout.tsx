import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Header from "@/components/header";
import Providers from "@/app/providers";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config";
import colors from "tailwindcss/colors";

export const tailwind = resolveConfig(tailwindConfig);

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "noos",
  description: "The marketplace for samplemakers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        layout: {
          shimmer: false,
        },
        variables: {
          colorText: colors.neutral[50],
          colorBackground: colors.neutral[900],
          fontFamily: tailwind.theme.fontFamily.sans.join(", "),
          fontFamilyButtons: tailwind.theme.fontFamily.sans.join(", "),
          fontSize: tailwind.theme.fontSize.sm[0],
          fontWeight: {
            bold: tailwind.theme.fontWeight.bold,
            normal: tailwind.theme.fontWeight.normal,
            medium: tailwind.theme.fontWeight.medium,
          },
          spacingUnit: tailwind.theme.spacing[4],
          borderRadius: tailwind.theme.borderRadius.xl,
          colorTextSecondary: colors.neutral[400],
          colorPrimary: colors.neutral[50],
          colorInputBackground: colors.neutral[900],
          colorDanger: colors.red[500],
          colorSuccess: colors.emerald[500],
          colorWarning: colors.amber[500],
        },
        elements: {
          dividerLine: "bg-neutral-700",
          socialButtonsIconButton: "bg-neutral-700",
          navbarButton: "text-neutral-50",
          organizationSwitcherTrigger__open: "bg-neutral-950",
          organizationPreviewMainIdentifier: "text-neutral-50",
          organizationSwitcherTriggerIcon: "text-neutral-400",
          organizationPreview__organizationSwitcherTrigger: "gap-2",
          organizationPreviewAvatarContainer: "shrink-0",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-6xl px-6 mx-auto bg-neutral-950 text-neutral-50 dark`}
        >
          <Providers>
            <Header />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
