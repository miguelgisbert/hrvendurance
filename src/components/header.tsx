import React, {useRef, useEffect, useState, FC} from 'react'
import { Grid, Box, FormGroup, FormControlLabel, Card, Theme } from '@mui/material'
import {LanguageSwitch} from './languageSwitch'
import {ThemeModeSwitch} from './themeModeSwitch'
import { Login } from './login'
import logoPart1 from '../assets/logoPart1.svg'
import logoPart2 from '../assets/logoPart2.svg'

interface HeaderProps {
  setLanguage: (language: string) => void;
  theme: Theme;
  translations: { greeting: string };
  language: string;
  themeMode: string;
  toggleThemeMode: () => void;
  showPopper: boolean;
}

const Header: FC<HeaderProps> = ({setLanguage, theme, language, themeMode, toggleThemeMode, showPopper}) => {

    const en = useRef<HTMLButtonElement>(null)
    const es = useRef<HTMLButtonElement>(null)
    const ca = useRef<HTMLButtonElement>(null)
    
    const handleChangeLanguage = (event: React.ChangeEvent<HTMLInputElement>) => {
        let language = event.target.value
        setLanguage(language)
        event.target.checked = true
    }

    const [mainLogoBGopacity, setMainLogoBGopacity] = useState<number>(1)
    
    const group1Ref = useRef<HTMLImageElement>(null)
    const group2Ref = useRef<HTMLImageElement>(null)
    
    useEffect(() => {
        const handleScroll = () => {  
          const scrollY = window.scrollY
          const maxScroll = 500
          const initialTop = (window.innerHeight * 0.5 + 100)
          const initialLeft1 = window.innerWidth * 0.2
          const initialLeft2 = window.innerWidth * 0.2
          const finalTop1 = 30
          const finalTop2 = 25
          const finalLeft1 = 50
          const finalLeft2 = 190
          const initialSize = 235
          const finalSize1 = initialSize / 2
          const finalSize2 = initialSize / 1.7
          const size1 = Math.max(finalSize1, initialSize - (scrollY / maxScroll) * initialSize)
          const size2 = Math.max(finalSize2, initialSize - (scrollY / maxScroll) * initialSize)
          const top1 = scrollY >= maxScroll ? finalTop1 : initialTop - (scrollY / maxScroll) * (initialTop - finalTop1)
          const top2 = scrollY >= maxScroll ? finalTop2 : initialTop - (scrollY / maxScroll) * (initialTop - finalTop2)
          const left1 = scrollY >= maxScroll ? finalLeft1 : initialLeft1 - (scrollY / maxScroll) * (initialLeft1 - finalLeft1)
          const left2 = scrollY >= maxScroll ? finalLeft2 : initialLeft2 - (scrollY / maxScroll) * (initialLeft2 - finalLeft2)
          const transformValue = Math.max(0, 100 - (scrollY / maxScroll) * 100)
          const BGopacity = Math.max(0, 1 -(scrollY / maxScroll))
          if(group1Ref.current && group2Ref.current) {
            group1Ref.current.style.top = `${top1}px`
            group1Ref.current.style.left = `${left1}px`
            group1Ref.current.style.width = `${size1}px`
            group1Ref.current.style.transform = `translate(0, calc(-${transformValue}% - 14px))`
            group2Ref.current.style.top = `${top2}px`
            group2Ref.current.style.left = `${left2}px`
            group2Ref.current.style.width = `${size2}px`
          }
          setMainLogoBGopacity(BGopacity)
        }
        if ( window.innerWidth >= 1000 ) {
          window.addEventListener('scroll', handleScroll)
        }
        return () => window.removeEventListener('scroll', handleScroll)
      }, [])

    return (
        <Grid container component="header" zIndex="1000" height="120px" padding={window.innerWidth > 650 ? "20px 50px" : window.innerWidth < 365 ? "20px 0 20px 20px" : "20px"} position={window.innerWidth > 650 ? "fixed" : "relative"} sx={{ background: (theme: Theme) => theme.myBackground.header }}>
            <Grid container item xs={5} md={6} alignItems="center" justifyContent="start">
                {window.innerWidth > 650 && (
                  <Box component="img" src={logoPart2} ref={group2Ref} 
                  sx={{ 
                    width: window.innerWidth >= 1000 ? "235px" : 235/1.7,
                    position:"fixed",
                    zIndex:"10",
                    top: window.innerWidth < 1000 ? 25 : "calc(50% + 100px)",
                    left: window.innerWidth < 1000 ? 190 : "20%"
                  }} />
                )}
                <Box component="img" src={logoPart1} ref={group1Ref} 
                  sx={{ 
                    width: window.innerWidth >= 1000 ? "235px" : 235/2,
                    position: window.innerWidth > 650 ? "fixed" : "relative",
                    zIndex:"10",
                    top: window.innerWidth < 1000 ? window.innerWidth < 650 ? 0 : 16 : "calc(50% + 100px)",
                    left: window.innerWidth < 1000 ? window.innerWidth < 650 ? 0 : 50 : "20%",
                    transform: window.innerWidth >= 1000 ? "translate(0, calc(-100% - 14px))" : ""
                  }} />
                {theme.palette.mode !== "dark" && window.innerWidth >= 1000 && (
                <Card sx={{ opacity: mainLogoBGopacity, width:"350px", height:"350px", position:"fixed", top: "calc(50% + 100px)", left: "20%", zIndex: 1, transform: "translate(-18%, -58%)", backgroundColor: theme => theme.palette.secondary.main}}></Card>
                )}
            </Grid>
            <Grid container item xs={7} md={6} >
              <Grid container item xs={12} alignItems="end" justifyContent="end">
                <ThemeModeSwitch
                  checked={themeMode === 'dark'}
                  onChange={toggleThemeMode}
                  themeMode={themeMode}
                  sx={{ marginRight: "80px" }}
                  classes={{ root: 'my-root' }} 
                  inputProps={{ 'aria-label': 'toggle theme' }}
                />
              </Grid>
              <Grid container item xs={12} alignItems="end" justifyContent="end">
                <FormGroup sx={{ display:"flex", flexDirection:"row" }}>
                  <FormControlLabel 
                    label="" control={<LanguageSwitch ref={ca} checked={language === "ca"} language="ca" value="ca" onChange={handleChangeLanguage} />}
                    />
                  <FormControlLabel
                    label="" control={<LanguageSwitch ref={es} checked={language === "es"} language="es" value="es" onChange={handleChangeLanguage} />}
                    />
                  <FormControlLabel
                    label="" control={<LanguageSwitch ref={en} checked={language === "en"} language="en" value="en" onChange={handleChangeLanguage} />}
                    />
                </FormGroup>
              </Grid>
            </Grid>
            {/* <Login showPopper={showPopper} /> */}
        </Grid>
    )
}

export default Header