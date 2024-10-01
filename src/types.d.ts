import '@mui/material/styles';

export type MyTheme = Theme & {
    myBackground: {
      main: string;
      header: string;
      cardBackground: string;
      cardShadow: string;
    };
};
  
export type MyThemeOptions = ThemeOptions & {
    myBackground?: {
      main?: string;
      header?: string;
      cardBackground?: string;
      cardShadow?: string;
    };
};
  
export type Language = 'en' | 'es' | 'ca';

declare module '@mui/material/styles' {
    export interface Theme {
        myBackground: {
            main: string;
            header: string;
            cardBackground: string;
            cardShadow: string;
        };
        palette: {
            mode: 'light' | 'dark';
            primary: { main: string };
            secondary: { main: string };
        };
        typography: {
            fontFamily: string;
        };
        components?: {
            MuiTypography?: {
                styleOverrides?: {
                    root?: {
                        // Defineix aquí els teus estils personalitzats per a MuiTypography
                    };
                };
            };
            // Afegeix aquí més components si és necessari
        };
    }

    export interface MyTheme {
      theme: Theme;
      translations: typeof translations[string];
    }

    export interface MyBackgroundOptions {
      main?: string;
      header?: string;
      cardBackground?: string;
      cardShadow?: string;
    }

    export interface MyPaletteOptions extends PaletteOptions {
      myBackground?: MyBackgroundOptions;
    }

    export interface MyThemeOptions extends ThemeOptions {
      palette?: MyPaletteOptions;
      myBackground?: MyBackgroundOptions;
    }

    export interface ThemeOptions {
        myBackground?: {
            main?: string;
            header?: string;
            cardBackground?: string;
            cardShadow?: string;
        };
        palette?: {
            mode?: 'light' | 'dark';
            primary?: { main: string };
            secondary?: { main: string };
        };
        typography?: {
            fontFamily?: string;
        };
        components?: {
            MuiTypography?: {
                styleOverrides?: {
                    root?: {
                        // Defineix aquí els teus estils personalitzats per a MuiTypography
                    };
                };
            };
            // Afegeix aquí més components si és necessari
        };
    }

    export type Language = 'en' | 'es' | 'ca';
}   