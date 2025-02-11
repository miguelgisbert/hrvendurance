import { useState, useRef, useEffect } from 'react';
import { useTransition } from 'react-spring'
import ReactCardFlip from 'react-card-flip';
import { Box, Card, Grid, Typography, Theme } from '@mui/material';
import { animated } from 'react-spring';
import { Translations, Language } from '../types';
import heart1 from '../assets/heart1.svg'
import runners from '../assets/runners.svg'
import improve from '../assets/improve.svg'

interface HeroSectionProps {
    theme: Theme
    translations: Translations[Language]
}

const HeroSection:React.FC<HeroSectionProps> = ({ theme, translations }) => {
    const cardBackground  =  theme.myBackground.cardBackground
    const shadowColor  =  theme.myBackground.cardShadow
    const primaryColor  =  theme.palette.primary.main
    const [isFlipped, setIsFlipped]  =  useState<boolean>(false)
    const titleBoxRef  =  useRef<HTMLDivElement>(null)

    // Words animation
    const words  =  [translations.Measure, translations.Train, translations.Improve];
    const [index, setIndex]  =  useState(0);
    const transitions  =  useTransition([words[index]], {
      from:   { transform: 'translate3d(0,40px,0)',   opacity: 0 },
      enter:  { transform: 'translate3d(0,0px,0)',    opacity: 1 },
      leave:  { transform: 'translate3d(0,-40px,0)',  opacity: 0 },
      keys: item  => item,
    });
    useEffect(()  => {
      const interval  =  setInterval(()  => {
        setIndex(state  => (state + 1) % words.length);
      }, 1300);
      return ()  => clearInterval(interval);
    }, []);
  
    // Icons animation
    const images  =  [heart1, runners, improve];
    const [imageIndex, setImageIndex]  =  useState(0);
    const imageTransitions  =  useTransition([images[imageIndex]], {
      from:   { transform: 'translate3d(0,40px,0)',   opacity: 0 },
      enter:  { transform: 'translate3d(0,0px,0)',    opacity: 1 },
      leave:  { transform: 'translate3d(0,-40px,0)',  opacity: 0 },
      keys: item  => item,
    });
    useEffect(()  => {
      const interval  =  setInterval(()  => {
        setImageIndex(state  => (state + 1) % images.length);
      }, 1300);
      return ()  => clearInterval(interval);
    }, []); 
    return (
        <Grid container height = "calc(100vh - 120px)" marginTop = {window.innerWidth < 650 ? "none" : "120px"} alignItems = "center" justifyContent = "center" padding = "30px">

            {/* Void space for the logo */}
            {window.innerWidth > 1000 && (
              <Grid container item xs = {12} md = {6} alignItems = "center" justifyContent = "center"></Grid>
            )}
            {/* Flipping over card */}
            <Grid container item xs = {12} md = {window.innerWidth > 1000 ? 6 : false} alignItems = "center" justifyContent = "center" sx = {{ color: 'red', paddingRight: window.innerWidth < 1000 ? "none" : "10%" }}>
                <ReactCardFlip isFlipped = {isFlipped} flipDirection = "horizontal">
                    <Card onMouseOver = {()  => setIsFlipped(true)} sx = {{ width:"300px", height:"300px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"start", textAlign:"center", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
                        <Box ref = {titleBoxRef} sx = {{ height:"100px", width:"100%", position: 'relative', left: 20 }} >
                        {transitions((style, item)  => (
                        <animated.div style = {{ ...style, position: 'absolute' }}>
                            <Typography component = "span" textAlign = "left" style = {{ color: primaryColor, fontWeight:600, fontSize:42, marginBottom:"15px" }}>
                            {item}
                            </Typography>
                        </animated.div>
                        ))}
                        </Box>
                        
                        <Box sx = {{ position: 'relative', height: '100px', width: '100%' }}>
                        {imageTransitions((style, item)  => (
                            <animated.div style = {{ ...style, position: 'absolute', left:"50%", transform:"translateX(-50%)" }}>
                            <Box component = "img" src = {item} alt = "Measure Train Improve" />
                            </animated.div>
                        ))}
                        </Box>
                    </Card>

                    <Card onMouseOut = {()  => setIsFlipped(false)} sx = {{ width:"300px", height:"300px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
                    <Typography sx = {{ color: theme  => theme.palette.primary.main, maxWidth: "230px", marginBottom:0, fontWeight:600 }}>{translations.FlipCardBack1}</Typography>
                    <Typography sx = {{ color: theme  => theme.palette.primary.main, maxWidth: "230px", marginBottom:0, marginTop:3 }}>{translations.FlipCardBack2}</Typography>
                    </Card>
                </ReactCardFlip>             
            </Grid>
        </Grid>
    )
}

export default HeroSection