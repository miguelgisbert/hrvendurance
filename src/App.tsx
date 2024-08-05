import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Grid, Typography, Card, Box } from '@mui/material'
import createMyTheme from './theme'
import { MyTheme } from './theme'

import Header from './components/header.js'
import useMediaQuery from '@mui/material/useMediaQuery'
import ReactCardFlip from 'react-card-flip'
import { useTransition, animated } from 'react-spring'
import heart1 from './assets/heart1.svg'
import runners from './assets/runners.svg'
import improve from './assets/improve.svg'
import TrainingTable from './components/trainingTable'
import Survey from './components/survey.js'
import Prueba from './prueba'

function App() {
  const browserLang = navigator.language
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  
  const [language, setLanguage]   = useState<string>(browserLang ? browserLang : 'en')
  const [themeMode, setThemeMode] = useState<"dark" | "light">(prefersDarkMode ? 'dark' : 'light')
  const [isFlipped, setIsFlipped] = useState<boolean>(false)

  
  const { theme: currentTheme, translations } = useMemo(() => {
    return createMyTheme(language, themeMode);
  }, [language, themeMode]);

  const primaryColor = currentTheme.palette.primary.main
  const secondaryColor = currentTheme.palette.secondary.main
  const cardBackground = currentTheme.myBackground.cardBackground
  const cardShadow = currentTheme.palette.background.cardShadow
  const shadowColor = currentTheme.myBackground.cardShadow

  console.log(cardBackground)
  
  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }
  
  const titleBoxRef = useRef()

  // Words animation
  const words = [translations.Measure, translations.Train, translations.Improve];
  const [index, setIndex] = useState(0);
  const transitions = useTransition([words[index]], {
    from:   { transform: 'translate3d(0,40px,0)',   opacity: 0 },
    enter:  { transform: 'translate3d(0,0px,0)',    opacity: 1 },
    leave:  { transform: 'translate3d(0,-40px,0)',  opacity: 0 },
    keys: item => item,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(state => (state + 1) % words.length);
    }, 1300);
    return () => clearInterval(interval);
  }, []);

  // Icons animation
  const images = [heart1, runners, improve];
  const [imageIndex, setImageIndex] = useState(0);
  const imageTransitions = useTransition([images[imageIndex]], {
    from:   { transform: 'translate3d(0,40px,0)',   opacity: 0 },
    enter:  { transform: 'translate3d(0,0px,0)',    opacity: 1 },
    leave:  { transform: 'translate3d(0,-40px,0)',  opacity: 0 },
    keys: item => item,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex(state => (state + 1) % images.length);
    }, 1300);
    return () => clearInterval(interval);
  }, []);  
  
  return (
    <ThemeProvider theme={currentTheme}>
        <Grid container sx={{ backgroundColor: (theme: MyTheme) => theme.myBackground.main }}>
          <Header setLanguage={setLanguage} theme={currentTheme} translations={translations} language={language} themeMode={themeMode as 'light' | 'dark'} toggleThemeMode={toggleThemeMode} />
          <Grid container height="calc(100vh - 120px)" marginTop="120px" alignItems="center" justifyContent="center" padding="30px">

            {/* Void space for the logo */}
            <Grid container item xs={12} md={6} alignItems="center" justifyContent="center"></Grid>

            {/* Flipping over card */}
            <Grid container item xs={12} md={6} alignItems="center" justifyContent="center" sx={{ color: 'red', paddingRight: "10%" }}>
              <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                <Card onMouseOver={() => setIsFlipped(true)} sx={{ width:"300px", height:"300px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"start", textAlign:"center", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
                    <Box ref={titleBoxRef} sx={{ height:"100px", width:"100%", position: 'relative', left: 20 }} >
                    {transitions((style, item) => (
                      <animated.div style={{ ...style, position: 'absolute' }}>
                        <Typography component="span" textAlign="left" style={{ color: primaryColor, fontWeight:600, fontSize:42, marginBottom:"15px" }}>
                          {item}
                        </Typography>
                      </animated.div>
                    ))}
                    </Box>
                    
                    <Box sx={{ position: 'relative', height: '100px', width: '100%' }}>
                      {imageTransitions((style, item) => (
                        <animated.div style={{ ...style, position: 'absolute', left:"50%", transform:"translateX(-50%)" }}>
                          <Box component="img" src={item} alt="Measure Train Improve" />
                        </animated.div>
                      ))}
                    </Box>
                </Card>

                <Card onMouseOut={() => setIsFlipped(false)} sx={{ width:"300px", height:"300px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
                  <Typography sx={{ color: theme => theme.palette.primary.main, maxWidth: "230px", marginBottom:0, fontWeight:600 }}>{translations.FlipCardBack1}</Typography>
                  <Typography sx={{ color: theme => theme.palette.primary.main, maxWidth: "230px", marginBottom:0, marginTop:3 }}>{translations.FlipCardBack2}</Typography>
                </Card>
              </ReactCardFlip>             
            </Grid>
          </Grid>

          <Grid container alignItems="center" justifyContent="center" padding="70px 20px 130px">
            <TrainingTable translations={translations} />
          </Grid>

          <Grid container alignItems="stretch" justifyContent="center" padding="30px" marginBottom="700px" spacing={"30px"} sx={{ color: theme => theme.palette.primary.main }}>
            <Grid item xs={4} maxWidth="350px!important" sx={{ display:"flex" }}>
              <Card sx={{ flex:1, maxWidth:"300px", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
                <Typography component="h1" sx={{ marginBottom:1, fontWeight:600, fontSize:22 }}>{translations.Measure}</Typography>
                <Typography>{translations.MeasureParagraph}</Typography>
              </Card>
            </Grid>
            <Grid item xs={4} maxWidth="350px!important" sx={{ display:"flex" }}>
              <Card sx={{ flex:1, maxWidth:"300px", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
                <Typography component="h1" sx={{ marginBottom:1, fontWeight:600, fontSize:22 }}>{translations.Train}</Typography>
                <Typography>{translations.TrainParagraph}</Typography>
              </Card> 
            </Grid>
            <Grid item xs={4} maxWidth="350px!important" sx={{ display:"flex" }}>
              <Card sx={{ flex:1, maxWidth:"300px", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
                <Typography component="h1" sx={{ marginBottom:1, fontWeight:600, fontSize:22 }}>{translations.Improve}</Typography>
                <Typography>{translations.ImproveParagraph}</Typography>
              </Card>
            </Grid>
          </Grid>

          <Grid container>
            {/* <Survey /> */}
            {/* <Prueba /> */}
          </Grid>
          
        </Grid>    
    </ThemeProvider>
  )
}

export default App