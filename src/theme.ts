import { createTheme } from "@mui/material/styles";

// Color palette inspired by https://nextjs.org (Geist design system)
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0070f3", // Vercel blue
      light: "#3291ff",
      dark: "#0061d5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7928ca", // Purple accent
      light: "#8a63d2",
      dark: "#4c2889",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ee0000",
      light: "#ff1a1a",
      dark: "#cc0000",
    },
    warning: {
      main: "#f5a623",
      light: "#f7b955",
      dark: "#c68519",
    },
    success: {
      main: "#50e3c2",
      light: "#79ebd3",
      dark: "#29bc9b",
    },
    info: {
      main: "#0070f3",
    },
    background: {
      default: "#000000",
      paper: "#111111",
    },
    text: {
      primary: "#ededed",
      secondary: "#a1a1a1",
      disabled: "#666666",
    },
    divider: "#333333",
    action: {
      hover: "rgba(255, 255, 255, 0.06)",
      selected: "rgba(255, 255, 255, 0.09)",
      disabled: "#666666",
      disabledBackground: "rgba(255, 255, 255, 0.06)",
    },
  },
  typography: {
    fontFamily:
      '"Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
        "html, body, #root": {
          height: "100%",
          width: "100%",
        },
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        a: {
          textDecoration: "none",
          color: "inherit",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: "8px 16px",
          fontSize: "0.875rem",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlined: {
          borderColor: "#333333",
          "&:hover": {
            borderColor: "#555555",
            backgroundColor: "rgba(255, 255, 255, 0.06)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #333333",
          transition: "border-color 0.2s ease, transform 0.2s ease",
          "&:hover": {
            borderColor: "#555555",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "1px solid #333333",
          boxShadow: "none",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#333333",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
        outlined: {
          borderColor: "#333333",
        },
      },
    },
  },
});

export default theme;
