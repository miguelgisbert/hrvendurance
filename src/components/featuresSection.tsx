import React from 'react';
import { Grid, Card, Typography, Theme } from '@mui/material';
import { Translations } from '../types';
import heart1 from '../assets/heart1.svg'
import runners from '../assets/runners.svg'
import improve from '../assets/improve.svg'
import { Language } from '../types';

interface FeaturesSectionProps {
    theme: Theme
    translations: Translations[Language]
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ theme, translations }) => {

    const cardBackground  =  theme.myBackground.cardBackground
    const shadowColor  =  theme.myBackground.cardShadow

    return (
        <Grid container alignItems = "stretch" justifyContent = "center" padding = "30px" marginBottom = "100px" spacing = {"30px"} sx = {{ color: theme  => theme.palette.primary.main }}>
            <Grid item xs = {12} md = {4} maxWidth = "350px!important" sx = {{ display:"flex" }}>
              <Card sx = {{ flex:1, maxWidth:"300px", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
                <img src = {heart1} height = "70px" style = {{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "20px" }} />
                <Typography component = "h1" sx = {{ marginBottom:1, fontWeight:600, fontSize:22 }}>{translations.Measure}</Typography>
                <Typography>{translations.MeasureParagraph}</Typography>
              </Card>
            </Grid>
            <Grid item xs = {12} md = {4} maxWidth = "350px!important" sx = {{ display:"flex" }}>
              <Card sx = {{ flex:1, maxWidth:"300px", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
                  <img src = {runners} height = "70px" style = {{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "20px" }} />
                  <Typography component = "h1" sx = {{ marginBottom:1, fontWeight:600, fontSize:22 }}>{translations.Train}</Typography>
                <Typography>{translations.TrainParagraph}</Typography>
              </Card> 
            </Grid>
            <Grid item xs = {12} md = {4} maxWidth = "350px!important" sx = {{ display:"flex" }}>
              <Card sx = {{ flex:1, maxWidth:"300px", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
                <img src = {improve} height = "70px" style = {{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "20px" }} />
                <Typography component = "h1" sx = {{ marginBottom:1, fontWeight:600, fontSize:22 }}>{translations.Improve}</Typography>
                <Typography>{translations.ImproveParagraph}</Typography>
              </Card>
            </Grid>
          </Grid>
    )
}

export default FeaturesSection;