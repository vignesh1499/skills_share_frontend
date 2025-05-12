"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

interface LayoutProps {
  children: React.ReactNode;
}

const theme = createTheme({
  cssVariables:true,
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
});

const RootLayout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ key: "css", enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
          {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
