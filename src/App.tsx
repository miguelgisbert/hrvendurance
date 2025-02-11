import { useState, useContext, useMemo, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Grid } from '@mui/material'
import createMyTheme from './theme'
import { MyTheme } from './theme'
import { CustomUser } from './types'
import { PopperProvider } from './PopperContext'
import { UserContext } from './UserContext';
import Header from './components/header.js'
import HeroSection from './components/heroSection.js'
import FeaturesSection from './components/featuresSection.js'
import useMediaQuery from '@mui/material/useMediaQuery'
import SampleTable from './components/sampleTable'
import UserTable from './components/userTable'
import Survey from './components/survey.js'


function App() {

  // const { user } = useContext(UserContext) as { user: CustomUser, loading: boolean }
  // useEffect(() => {
  //   console.log("App user: ", user)
  // }, [user])
  // if (loading) {
  //   return <div>Loading...</div>; // Or some other loading indicator
  // }

  const browserLang = navigator.language
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const [language, setLanguage] = useState<string>(browserLang ? browserLang : 'en')
  const [themeMode, setThemeMode] = useState<"dark" | "light">(prefersDarkMode ? 'dark' : 'light')
  const { user, loading } = useContext(UserContext) as { user: CustomUser, loading: boolean }
  const [showPopper] = useState<boolean>(false)


  const { theme: currentTheme, translations } = useMemo(() => {
    return createMyTheme(language, themeMode);
  }, [language, themeMode]);

  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <PopperProvider>
        <Grid container sx={{ backgroundColor: (theme: MyTheme) => theme.myBackground.main, minHeight: '100vh' }}>

          {!user ? (
            <>
              <Header
                setLanguage={setLanguage}
                theme={currentTheme}
                translations={translations}
                language={language}
                themeMode={themeMode as 'light' | 'dark'}
                toggleThemeMode={toggleThemeMode}
                showPopper={showPopper}
                showLogoAnimation={true}
              />
              
              <HeroSection theme={currentTheme} translations={translations} />

              <SampleTable translations={translations} />

              <FeaturesSection theme={currentTheme} translations={translations} />

              <Grid container alignItems="stretch" justifyContent="center" padding="30px" marginBottom="100px">
                <Survey theme={currentTheme} translations={translations} />
              </Grid>
            </>
          ) : (
            <>
              <Header
                setLanguage={setLanguage}
                theme={currentTheme}
                translations={translations}
                language={language}
                themeMode={themeMode as 'light' | 'dark'}
                toggleThemeMode={toggleThemeMode}
                showPopper={showPopper}
                showLogoAnimation={false}
              />
              
              <UserTable translations={translations} />

            </>
          )}
        </Grid>
      </PopperProvider>
    </ThemeProvider>
  )
}

export default App