import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import './index.css'

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
            100: "#181818", // this one is side bar background
            200: "#262626", // this one is default background
            300: "#4A4A4A",
            400: "#5D5D5D",
            500: "#6E6E6E",
            600: "#767676",
            700: "#8F8F8F",
            800: "#A0A0A0",
            900: "#B3B3B3",
        },
        blueAccent: {
            100: "#7B6F98",
            200: "#178CE4",
            300: "#072A40"
          },
        yellowAccent: {
            100: "#F3D849",
        }
      }
      // light theme 
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#FFFFFE",
          200: "#FFFFFD", // background colour 
          300: "#DEDEDE",
          400: "#CECECE",
          500: "#BFBFBF",
          600: "#B3B3B3",
          700: "#A0A0A0",
          800: "#8F8F8F",
          900: "#767676",
        },
        blueAccent: {
          100: "#A680FE",
          200: "#178CE4",
          300: "#072A40"
        },
        yellowAccent: {
            100: "#F3D849"
        }
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.blueAccent[100],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[200],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.blueAccent[100],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[100],
            },
          }),
    },
    typography: {
        fontFamily: ["Quicksand", "sans-serif"].join(","),
        fontSize: 12,
        h1: {
          fontFamily: ["Quicksand", "sans-serif"].join(","),
          fontSize: 40,
        },
        h2: {
          fontFamily: ["Quicksand", "sans-serif"].join(","),
          fontSize: 32,
        },
        h3: {
          fontFamily: ["Quicksand", "sans-serif"].join(","),
          fontSize: 24,
        },
        h4: {
          fontFamily: ["Quicksand", "sans-serif"].join(","),
          fontSize: 20,
        },
        h5: {
          fontFamily: ["Quicksand", "sans-serif"].join(","),
          fontSize: 16,
        },
        h6: {
          fontFamily: ["Quicksand", "sans-serif"].join(","),
          fontSize: 14,
        },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};