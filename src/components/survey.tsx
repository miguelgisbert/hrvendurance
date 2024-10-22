import { useState, FC } from 'react'
import { Button, Box, Card, Theme, Typography, Stepper, Step, StepLabel, StepContent, Paper, TextField, Grid } from '@mui/material'
// import { initializeApp } from 'firebase/app'
// import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'


// const firebaseConfig  =  {
//   apiKey: "AIzaSyCRJA0l7MlxyBo8-NMBerGFyDDKBO9dEss",
//   authDomain: "hrv-endurance-landing.firebaseapp.com",
//   projectId: "hrv-endurance-landing",
//   storageBucket: "hrv-endurance-landing.appspot.com",
//   messagingSenderId: "228357777566",
//   appId: "1:228357777566:web:9120c54e80fecf3ce3b38f",
//   measurementId: "G-80B1PFKXX5"
// }

interface SurveyProps {
  theme: Theme
  translations: { GetInvolved: String, EnterSurvey: String}
}

// const app  =  initializeApp(firebaseConfig)
// const db  =  getFirestore(app)

const Survey: FC<SurveyProps>  =  ({ theme, translations })  => {
  const cardBackground  =  theme.myBackground.cardBackground
  // const cardShadow  =  theme.palette.background.cardShadow
  const shadowColor  =  theme.myBackground.cardShadow
  // const [input, setInput]  =  useState('')

  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const steps = [
    {
      label: translations.PersonalData,
      description: (
        <Grid container spacing="20px" justifyContent={"center"}>
          <Grid item size={{xs:12, md:4}}><TextField id="name" label={translations.Name} variant="outlined" /></Grid>
          <Grid item size={{xs:12, md:4}}><TextField id="email" label={translations.Email} variant="outlined" /></Grid>
          <Grid item size={{xs:12, md:4}}><TextField id="phone" label={translations.Phone} variant="outlined" /></Grid>
        </Grid>
      ),
    },
    {
      label: 'Step 2',
      description:
        'Training data',
    },
    {
      label: 'Step 3',
      description: `Habits data`,
    },
  ]

  // const handleSubmit  =  async (event: React.FormEvent<HTMLFormElement>)  => {
  //   event.preventDefault()

  //   try {
  //     await addDoc(collection(db, 'surveys'), {
  //       response: input,
  //       timestamp: serverTimestamp(),
  //     })
  //     setInput('')
  //   } catch (error) {
  //     console.error('Error afegint la resposta a Firestore: ', error)
  //   }
  // }

  return (
      <Card sx = {{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"start", textAlign:"center", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
        <Typography component = "h1" sx = {{ marginBottom:1, fontWeight:600, fontSize:22 }}>{translations.GetInvolved}</Typography>
        <Typography>{translations.EnterSurvey}</Typography>
        <Box component="form" noValidate>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    index === steps.length - 1 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  {step.description}
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>All steps completed - you&apos;re finished</Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Reset
              </Button>
            </Paper>
          )}
        </Box>
      </Card>
    
  )
}

export default Survey