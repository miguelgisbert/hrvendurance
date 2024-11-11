import { useState, FC, useEffect } from 'react'
import { Button, Box, Card, Theme, Typography, Stepper, Step, StepLabel, StepContent, Paper, TextField, Grid, Radio, RadioGroup, FormControl, FormControlLabel, FormGroup, Checkbox, FormLabel } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs';
import { Translations, Language } from '../types'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'


const firebaseConfig  =  {
  apiKey: "AIzaSyCRJA0l7MlxyBo8-NMBerGFyDDKBO9dEss",
  authDomain: "hrv-endurance-landing.firebaseapp.com",
  projectId: "hrv-endurance-landing",
  storageBucket: "hrv-endurance-landing.appspot.com",
  messagingSenderId: "228357777566",
  appId: "1:228357777566:web:9120c54e80fecf3ce3b38f",
  measurementId: "G-80B1PFKXX5"
}

const app  =  initializeApp(firebaseConfig)
const db  =  getFirestore(app)

interface SurveyProps {
  theme: Theme
  translations: Translations[Language]
}

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

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [birthday, setBirthday] = useState<Date | null>(null)
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null)
  const [emailError, setEmailError] = useState<boolean>(false)
  const [phoneError, setPhoneError] = useState<boolean>(false)
  const [dateError, setDateError] = useState(false);

  const validateEmail = (value: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(value)) {
      setEmailError(true)
    } else {
      setEmailError(false)
    }
  }

  const validatePhone = (value: string) => {
    const phonePattern = /^[+()\-0-9\s]{9,24}$/
    if (!phonePattern.test(value)) {
      setPhoneError(true)
    } else {
      setPhoneError(false)
    }
  }

  useEffect(()=>{
    validateEmail(email)
  },[email])

  useEffect(()=>{
    validatePhone(phone)
  },[phone])

  const isStep1Invalid = () => {
    return (
      name === '' ||
      email === '' ||
      phone === '' ||
      birthday === null ||
      gender === null ||
      emailError ||
      phoneError ||
      dateError
    );
  };

  const steps = [
    {
      label: translations.PersonalData,
      description: (
        <Grid container spacing="20px" marginTop="10px" justifyContent={"center"}>
          <Grid item xs={12} md={5}><TextField id="name" value={name} onChange={(e)=>setName(e.target.value)} label={translations.Name} variant="outlined" sx={{ width:"100%" }} /></Grid>
          <Grid item xs={12} md={7}><TextField id="email" value={email} onChange={(e)=>setEmail(e.target.value)} error={emailError && email!=''} label={translations.Email} variant="outlined" sx={{ width:"100%" }} /></Grid>
          <Grid item xs={12} md={4}><TextField id="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} error={phoneError && phone!=''} label={translations.Phone} variant="outlined" sx={{ width:"100%" }} /></Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={translations.Birthday}
              sx={{ width: "100%" }}
              value={birthday ? dayjs(birthday) : null}
              onChange={(newValue) => setBirthday(newValue ? newValue.toDate() : null)}
              onError={(error) => setDateError(!!error)}
            />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl sx={{ width:"100%" }}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={gender}
                sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
              >
                <FormControlLabel value="female" control={<Radio />} label={translations.Female} />
                <FormControlLabel value="male" control={<Radio />} label={translations.Male} />
                <FormControlLabel value="other" control={<Radio />} label={translations.Other} />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Step 2',
      description: (
        <Grid container spacing="20px" marginTop="10px" justifyContent={"center"}>
          <Grid item xs={12} md={4}>
            <FormGroup sx={{ width: "100%" }}>
              <FormLabel component="legend">Lo mío es más...</FormLabel>
              <FormControlLabel control={<Checkbox />} label="La montaña" />
              <FormControlLabel control={<Checkbox />} label="El asfalto" />
              <FormControlLabel control={<Checkbox />} label="Sólo corro para estar en forma o perder peso" />
              <FormControlLabel control={<Checkbox />} label="Ciclismo" />
              <FormControlLabel control={<Checkbox />} label="Triatlón" />
            </FormGroup>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Step 3',
      description: `Habits data`,
    },
  ]

  const handleSubmit  =  async (event: React.MouseEvent<HTMLButtonElement>)  => {
    event.preventDefault()

    try {
      await addDoc(collection(db, 'surveys'), {
        name,
        email,
        phone,
        birthday,
        gender,
        timestamp: serverTimestamp()
      })
      handleNext()
      setName('')
      setEmail('')
      setPhone('')
      setBirthday(null)
      setGender(null)
      setEmailError(false)
      setPhoneError(false)
      setDateError(false)
    } catch (error) {
      console.error('Firestore error: ', error)
    }
  }

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
                      onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                      disabled={isStep1Invalid()} 
                      sx={{ mt: 3, mr: 1 }}
                    >
                      {index === steps.length - 1 ? translations.Send : translations.Continue}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 3, ml: 3 }}
                    >
                      {translations.Back}
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