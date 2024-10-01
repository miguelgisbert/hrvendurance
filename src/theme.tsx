import { createTheme } from "@mui/material/styles"
import { caES, esES, enUS } from "@mui/material/locale"
import translations from "./translations"
import type { MyTheme, Language, MyThemeOptions } from "./types"
import './index.css'

function createMyTheme(language: Language, mode: 'light' | 'dark'): MyTheme {

    const locales: Record<Language, typeof enUS | typeof esES | typeof caES> = { en: enUS, es: esES, ca: caES, }
    const currentLocale = locales[language]

    const primaryColor        = "#fefce6";
    const secondaryColor      = "#18a7ad";
    const backgroundColor     = mode === "dark" ? "#33332d" : "#e1e1e1";
    const headerColor         = mode === "dark" ? "#33332d" : "linear-gradient(to right, #18a7ad, #33332d)";
    const cardBackgroundColor = mode === "dark" ? "#3E3E38" : "#18a7ad";
    const cardShadowColor = mode === "dark" ? "#1A1A1A" : "#4D4D4D";

    const themeOptions: MyThemeOptions = {
      palette: {
        mode: mode,
        primary: { main: primaryColor },
        secondary: { main: secondaryColor }
      },
      myBackground: {
        main: backgroundColor, 
        header: headerColor,
        cardBackground: cardBackgroundColor,
        cardShadow: cardShadowColor, 
      },
        typography: {
          fontFamily: "'Montserrat', sans-serif",
        },
        components: {
          MuiTypography: {
            defaultProps: {
              variant: "body1",
            },
            styleOverrides: {
              root: {
                marginBottom: "1rem",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                color: primaryColor,
              },
            },
          },
          MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent', 
                },
                columnHeaders: {
                    backgroundColor: 'transparent', 
                },
                cell: {
                    backgroundColor: 'transparent', 
                }
            }
          }
        },
      }
      const theme = createTheme(themeOptions, currentLocale);

      return {
        ...theme,
        theme: theme,
        translations: translations[language],
      }
  }
  
  export default createMyTheme as (language: string, mode: 'light' | 'dark') => MyTheme
  export type { MyTheme }