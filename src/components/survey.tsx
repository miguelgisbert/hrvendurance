import { useState, FC, useEffect } from 'react'
import { Button, Box, Card, Theme, Typography, Stepper, Step, StepLabel, StepContent, Paper, TextField, Grid, Radio, RadioGroup, FormControl, FormControlLabel, FormGroup, Checkbox, FormLabel, Rating } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, {Dayjs} from 'dayjs';
import { Translations, Language } from '../types'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import { db } from '../firebaseConfig'

interface SurveyProps {
  theme: Theme
  translations: Translations[Language]
}

const Survey: FC<SurveyProps>  =  ({ theme, translations })  => {
  const cardBackground  =  theme.myBackground.cardBackground
  // const cardShadow  =  theme.palette.background.cardShadow
  const shadowColor  =  theme.myBackground.cardShadow

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

  // Survay data
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [birthday, setBirthday] = useState<Date | null>(null)
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null)
  const [selectedOptionsGroup1, setSelectedOptionsGroup1] = useState<string[]>([])
  const [selectedOptionsGroup2, setSelectedOptionsGroup2] = useState<string[]>([])
  const [trainingProblems, setTrainingProblems] = useState<string>('')
  const [performanceInterest, setPerformanceInterest] = useState<number | null>(null)
  const [riskInterest, setRiskInterest] = useState<number | null>(null)
  const [performanceInterest_Hover, setPerformanceInterest_Hover] = useState(-1);
  const [riskInterest_Hover, setRiskInterest_Hover] = useState(-1);
  const [havePaidApp, setHavePaidApp] = useState<"yes" | "no" | null>(null)
  const [whichApp, setWhichApp] = useState<string>('')
  const [thinkAboutPayApp, setThinkAboutPayApp] = useState<"yes" | "no" | null>(null)
  const [knowHRV, setKnowHRV] = useState<"yes" | "no" | null>(null)
  const [hrvAppInterest, setHrvAppInterest] = useState<number | null>(null)
  const [hrvAppInterest_Hover, setHrvAppInterest_Hover] = useState(-1);
  const [payHrvAppInterest, setPayHrvAppInterest] = useState<number | null>(null)
  const [payHrvAppInterest_Hover, setPayHrvAppInterest_Hover] = useState(-1);
  const [whyHrvAppInterest, setWhyHrvAppInterest] = useState<string>('')
  const [whyPayHrvAppInterest, setWhyPayHrvAppInterest] = useState<string>('')

  const interest_Labels: { [index: string]: string } = {
    1: translations.nothing,
    2: translations.low,
    3: translations.some,
    4: translations.quiteLot,
    5: translations.aLot,
  };
  
  const handleCheckboxChangeGroup1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedOptionsGroup1(prev =>
      prev.includes(value) ? prev.filter(option => option !== value) : [...prev, value]
    );
  };
  
  const handleCheckboxChangeGroup2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedOptionsGroup2(prev =>
      prev.includes(value) ? prev.filter(option => option !== value) : [...prev, value]
    );
  };

  // Data validation
  const [emailError, setEmailError] = useState<boolean>(false)
  const [emailExists, setEmailExists] = useState<boolean>(false)
  const [phoneError, setPhoneError] = useState<boolean>(false)
  const [dateError, setDateError] = useState(false)
  const [dateErrorMessage, setDateErrorMessage] = useState('');

  const validateEmail = async (value: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(value)) {
      setEmailError(true)
      setEmailExists(false)
    } else {
      try {
        // Check if email already exists
        const q = query(collection(db, 'surveys'), where('email', '==', value))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          setEmailError(true)
          setEmailExists(true)
        } else {
          setEmailError(false)
          setEmailExists(false)
        }
      } catch (error) {
        console.error("Error checking email existence: ", error)
        setEmailError(true)
        setEmailExists(false)
      }
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

  const [showOtherOption, setShowOtherOption] = useState(false)
  const [otherOptionText, setOtherOptionText] = useState('')

  const handleOtherOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowOtherOption(event.target.checked);
    if (!event.target.checked) {
      setOtherOptionText('');
    }
  };

  useEffect(()=>{
    validateEmail(email)
  },[email])

  useEffect(()=>{
    validatePhone(phone)
  },[phone])

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const today = dayjs();
      const birthDate = dayjs(newValue);
      const age = today.diff(birthDate, 'year');

      if (age < 18) {
        setDateError(true);
        setDateErrorMessage(translations.mustBe18);
      } else {
        setDateError(false);
        setDateErrorMessage('');
      }

      setBirthday(newValue.toDate());
    } else {
      setBirthday(null);
      setDateError(false);
      setDateErrorMessage('');
    }
  };

  const isStepInvalid = (step: number): boolean => {
    switch (step) {
      case 0:
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
      case 1:
        return (
          selectedOptionsGroup1.length === 0 ||
          (selectedOptionsGroup2.length === 0 && !showOtherOption) ||
          (showOtherOption && otherOptionText === '') ||
          trainingProblems === ''
        );
      case 2:
        return (
          performanceInterest === null ||
          riskInterest === null ||
          havePaidApp === null ||
          (havePaidApp === "yes" && whichApp === '') ||
          (havePaidApp === "no" && thinkAboutPayApp === null) ||
          (thinkAboutPayApp === "yes" && whichApp === '')
        );
      case 3:
        return (
          knowHRV === null ||
          hrvAppInterest === null ||
          payHrvAppInterest === null ||
          (hrvAppInterest !== null && whyHrvAppInterest === '') ||
          (payHrvAppInterest !== null && whyPayHrvAppInterest === '')
        );
      default:
        return false;
    }
  };
  
  const handleSubmit  =  async (event: React.MouseEvent<HTMLButtonElement>)  => {
    event.preventDefault()

    try {
      await addDoc(collection(db, 'surveys'), {
        name,
        email,
        phone,
        birthday,
        gender,
        selectedOptionsGroup1,
        selectedOptionsGroup2,
        trainingProblems,
        performanceInterest,
        riskInterest,
        havePaidApp,
        whichApp,
        thinkAboutPayApp,
        knowHRV,
        hrvAppInterest,
        payHrvAppInterest,
        whyHrvAppInterest,
        whyPayHrvAppInterest,
        timestamp: serverTimestamp()
      })
      handleNext()
      setName('')
      setEmail('')
      setPhone('')
      setBirthday(null)
      setGender(null)
      setSelectedOptionsGroup1([])
      setSelectedOptionsGroup2([])
      setTrainingProblems('')
      setPerformanceInterest(null)
      setRiskInterest(null)
      setHavePaidApp(null)
      setWhichApp('')
      setThinkAboutPayApp(null)
      setKnowHRV(null)
      setHrvAppInterest(null)
      setPayHrvAppInterest(null)
      setWhyHrvAppInterest('')
      setWhyPayHrvAppInterest('')

      setEmailError(false)
      setEmailExists(false)
      setPhoneError(false)
      setDateError(false)
    } catch (error) {
      console.error('Firestore error: ', error)
    }
  }

  const steps = [
    {
      label: translations.PersonalData,
      description: (
        <Grid container spacing="20px" marginTop="10px" justifyContent={"center"}>
          <Grid item xs={12} md={5}><TextField id="name" value={name} onChange={(e)=>setName(e.target.value)} label={translations.Name} variant="outlined" sx={{ width:"100%" }} /></Grid>
          <Grid item xs={12} md={7}><TextField id="email" value={email} onChange={(e)=>setEmail(e.target.value)} error={emailError && email!=''} label={translations.Email} helperText={emailExists ? "Email already exists" : ""} variant="outlined" sx={{ width:"100%" }} /></Grid>
          <Grid item xs={12} md={4}><TextField id="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} error={phoneError && phone!=''} label={translations.Phone} variant="outlined" sx={{ width:"100%" }} /></Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={translations.Birthday}
              value={birthday ? dayjs(birthday) : null}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  error: dateError,
                  helperText: dateError ? dateErrorMessage : '',
                  sx: { width: "100%" }
                }
              }}
            />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl sx={{ width:"100%" }}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={gender}
                sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
              >
                <FormControlLabel value="female" 
                  componentsProps={{
                    typography: {
                      style: { fontSize: '12px', margin: 0 }
                    }
                  }} control={<Radio />} label={translations.Female} />
                <FormControlLabel value="male" 
                  componentsProps={{
                    typography: {
                      style: { fontSize: '12px', margin: 0 }
                    }
                  }} 
                  control={<Radio />} label={translations.Male} />
                <FormControlLabel value="other" 
                  componentsProps={{
                    typography: {
                      style: { fontSize: '12px', margin: 0 }
                    }
                  }} control={<Radio />} label={translations.Other} />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      ),
    },
    {
      label: translations.Training,
      description: (
        <>
          <Grid container spacing="20px" marginTop="10px" justifyContent={"center"} textAlign={"start"} alignContent={"start"}>
            <Grid item xs={12} md={6}>
              <FormGroup sx={{ width: "auto" }}>
                <FormLabel component="legend" style={{marginBottom: "10px"}}>{translations.habitsTitle}</FormLabel>
                <FormControlLabel control={<Checkbox value="mountain" checked={selectedOptionsGroup1.includes("mountain")} onChange={handleCheckboxChangeGroup1}/>} label={translations.trailRunning} sx={{ '& .MuiFormControlLabel-label': { marginBottom: 0 } }}/>
                <FormControlLabel control={<Checkbox value="road" checked={selectedOptionsGroup1.includes("road")} onChange={handleCheckboxChangeGroup1}/>} label={translations.roadRunning} sx={{ '& .MuiFormControlLabel-label': { marginBottom: 0 } }}/>
                <FormControlLabel control={<Checkbox value="health" checked={selectedOptionsGroup1.includes("health")} onChange={handleCheckboxChangeGroup1}/>} label={translations.beFit} sx={{ '& .MuiFormControlLabel-label': { marginBottom: 0 } }}/>
                <FormControlLabel control={<Checkbox value="cycling" checked={selectedOptionsGroup1.includes("cycling")} onChange={handleCheckboxChangeGroup1}/>} label={translations.cycling} sx={{ '& .MuiFormControlLabel-label': { marginBottom: 0 } }}/>
                <FormControlLabel control={<Checkbox value="triathlon" checked={selectedOptionsGroup1.includes("triathlon")} onChange={handleCheckboxChangeGroup1}/>} label={translations.triathlon} sx={{ '& .MuiFormControlLabel-label': { marginBottom: 0 } }}/>
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormGroup sx={{ width: "auto" }}>
                <FormLabel component="legend" style={{marginBottom: "10px"}}>{translations.havePlanTraining}</FormLabel>
                <FormControlLabel control={<Checkbox value="my_own" checked={selectedOptionsGroup2.includes("my_own")} onChange={handleCheckboxChangeGroup2} />} label={translations.yesMyself} sx={{ '& .MuiFormControlLabel-label': { marginBottom: 0 } }}/>
                <FormControlLabel control={<Checkbox value="personal_trainer" checked={selectedOptionsGroup2.includes("personal_trainer")} onChange={handleCheckboxChangeGroup2} />} label={translations.yesCoach} sx={{ '& .MuiFormControlLabel-label': { marginBottom: 0 } }}/>
                <FormControlLabel control={<Checkbox value="club_trainer" checked={selectedOptionsGroup2.includes("club_trainer")} onChange={handleCheckboxChangeGroup2} />} label={translations.yesClub} sx={{ '& .MuiFormControlLabel-label': { marginBottom: 0 } }}/>
                <FormControlLabel control={<Checkbox value="digital_trainer" checked={selectedOptionsGroup2.includes("digital_trainer")} onChange={handleCheckboxChangeGroup2} />} label={translations.yesDigital} sx={{ '& .MuiFormControlLabel-label': { marginBottom: 0 } }}/>
                <FormControlLabel control={<Checkbox value="feelings" checked={selectedOptionsGroup2.includes("feelings")} onChange={handleCheckboxChangeGroup2} />} label={translations.noFeelings} sx={{ '& .MuiFormControlLabel-label': { marginBottom: 0 } }}/>
                <FormControlLabel control={<Checkbox value="no_planning" checked={selectedOptionsGroup2.includes("no_planning")} onChange={handleCheckboxChangeGroup2} />} label={translations.noPlanning} sx={{ '& .MuiFormControlLabel-label': { marginBottom: 0 } }}/>
                <FormControlLabel
                  control={<Checkbox checked={showOtherOption} onChange={handleOtherOptionChange} />}
                  label={translations.otherOption} sx={{ '& .MuiFormControlLabel-label': { marginBottom: 0 } }}
                />
                {showOtherOption && (
                  <TextField
                    value={otherOptionText}
                    onChange={(e) => setOtherOptionText(e.target.value)}
                    label={translations.otherOption}
                    variant="outlined"
                    sx={{ marginTop: 2 }}
                  />
                )}
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
            <TextField
              multiline
              rows={4}
              value={trainingProblems}
              onChange={(e) => setTrainingProblems(e.target.value)}
              sx={{
                width: "100%",
                '& .MuiInputLabel-root': {
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  marginBottom: '8px',                 },
                '@media (max-width:1024px)': {
                  '& .MuiInputLabel-root': {
                    position: 'relative',
                    transform: 'none',
                  },
                },
                marginBottom: 2
              }}
              label={translations.foundProblems}
              InputLabelProps={{
                sx: {
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                },
              }}
            />
            </Grid>
          </Grid>
        </>
      )
    },
    {
      label: translations.Interests,
      description: (
        <>
          <Grid container spacing="20px" marginTop="10px" justifyContent={"center"} textAlign={"start"} alignContent={"start"}>
            <Grid item xs={12} md={6}>
              <Typography component="legend">{translations.performanceInterest}</Typography>
              <Grid container direction={"row"} gap={2}>
                <Rating
                  name="performanceInterest"
                  value={performanceInterest}
                  onChange={(_event, newValue) => {
                    setPerformanceInterest(newValue);
                  }}
                  onChangeActive={(_event, newHover) => {
                    setPerformanceInterest_Hover(newHover);
                  }}
                  icon={<RadioButtonCheckedIcon fontSize="inherit" />}
                  emptyIcon={<RadioButtonUncheckedIcon fontSize="inherit" />}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiRating-iconHover': {
                      color: theme.palette.primary.main,
                    },
                    marginBottom: 2
                  }}
                />
                <Typography>
                  {
                    performanceInterest_Hover !== null && performanceInterest_Hover !== -1 ? 
                      interest_Labels[performanceInterest_Hover]
                    : performanceInterest !== null ? 
                      interest_Labels[performanceInterest]
                    : ""
                  }
              </Typography>
              </Grid>
              <Typography component="legend">{translations.riskInterest}</Typography>
              <Grid container direction={"row"} gap={2}>
                <Rating
                  name="performanceInterest"
                  value={riskInterest}
                  onChange={(_event, newValue) => {
                    setRiskInterest(newValue);
                  }}
                  onChangeActive={(_event, newHover) => {
                    setRiskInterest_Hover(newHover);
                  }}
                  
                  icon={<RadioButtonCheckedIcon fontSize="inherit" />}
                  emptyIcon={<RadioButtonUncheckedIcon fontSize="inherit" />}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiRating-iconHover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
                <Typography>
                  {
                    riskInterest_Hover !== null && riskInterest_Hover !== -1 ? 
                      interest_Labels[riskInterest_Hover]
                    : riskInterest !== null ? 
                      interest_Labels[riskInterest]
                    : ""
                  }
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography component="legend">{translations.payForApp}</Typography>
              <RadioGroup
                name="havePaidApp"
                value={havePaidApp}
                onChange={(event) => {
                  setHavePaidApp(event.target.value as "yes" | "no");
                }}
              >
                <FormControlLabel value="yes" control={<Radio />} label={translations.yes} />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
              {havePaidApp === "no" && (
                <>
                  <Typography component="legend">{translations.considerPayApp}</Typography>
                  <RadioGroup
                    name="thinkAboutPayApp"
                    value={thinkAboutPayApp}
                    onChange={(event) => {
                      setThinkAboutPayApp(event.target.value as "yes" | "no");
                    }}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label={translations.yes} />
                    <FormControlLabel value="no" control={<Radio />} label={translations.no} />
                  </RadioGroup>
                </>
              )}
              {(havePaidApp === "yes" || thinkAboutPayApp === "yes") && (
                <TextField
                  value={whichApp}
                  onChange={(e) => setWhichApp(e.target.value)}
                  label={translations.whichOne}
                  variant="outlined"
                  sx={{ marginTop: 2, width: "100%" }}
                />
              )}
            </Grid>
          </Grid>
        </>
      ),
    },
    {
      label: 'HRV',
      description: (
        <>
          <Grid container spacing="80px" marginTop="10px" justifyContent={"center"} textAlign={"start"} alignContent={"start"}>
            <Grid item xs={12} md={6} display={"flex"} flexDirection={"column"} gap={2}>

              <Typography component="legend">{translations.heardAboutHRV}</Typography>
              <RadioGroup
                name="knowHRV"
                value={knowHRV}
                onChange={(event) => {
                  setKnowHRV(event.target.value as "yes" | "no");
                }}
                >
                <FormControlLabel value="yes" control={<Radio />} label={translations.yes} />
                <FormControlLabel value="no" control={<Radio />} label={translations.no} />
              </RadioGroup>

              {/* Video for mobile view */}
              <Grid item xs={12} sx={{display: {xs:'block', md:'none'}}}>
                <Typography component="legend">{translations.HRVexplanation}</Typography>
                <iframe 
                  src="https://www.youtube.com/embed/5_hMPLcfIy0?si=lOvv-YG5P9cd9zWJ" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 9', 
                    maxWidth: '560px',
                    maxHeight: '315px',
                    display: 'block',
                    margin: '0 auto'
                  }} 
                ></iframe>
              </Grid>
              
              <Grid container direction={"row"} gap={2}>
                <Typography component="legend">{translations.HRVappInterest}</Typography>
                <Rating
                  name="hrvAppInterest"
                  value={hrvAppInterest}
                  onChange={(_event, newValue) => {
                    setHrvAppInterest(newValue);
                  }}
                  onChangeActive={(_event, newHover) => {
                    setHrvAppInterest_Hover(newHover);
                  }}
                  icon={<RadioButtonCheckedIcon fontSize="inherit" />}
                  emptyIcon={<RadioButtonUncheckedIcon fontSize="inherit" />}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiRating-iconHover': {
                      color: theme.palette.primary.main,
                    },
                    marginBottom: "1rem"
                  }}
                />
                <Typography>
                  {
                    hrvAppInterest_Hover !== null && hrvAppInterest_Hover !== -1 ? 
                      interest_Labels[hrvAppInterest_Hover]
                    : hrvAppInterest !== null ? 
                      interest_Labels[hrvAppInterest]
                    : ""
                  }
                </Typography>
              </Grid>
              {hrvAppInterest != null && (
                <TextField
                  value={whyHrvAppInterest}
                  onChange={(e) => setWhyHrvAppInterest(e.target.value)}
                  label={translations.why}
                  variant="outlined"
                  sx={{ marginBottom: 2, width: "100%" }}
                />
              )}

              <Grid container direction={"row"} gap={2}>
                <Typography component="legend">{translations.appPayingInterest}</Typography>
                <Rating
                  name="payHrvAppInterest"
                  value={payHrvAppInterest}
                  onChange={(_event, newValue) => {
                    setPayHrvAppInterest(newValue);
                  }}
                  onChangeActive={(_event, newHover) => {
                    setPayHrvAppInterest_Hover(newHover);
                  }}
                  
                  icon={<RadioButtonCheckedIcon fontSize="inherit" />}
                  emptyIcon={<RadioButtonUncheckedIcon fontSize="inherit" />}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiRating-iconHover': {
                      color: theme.palette.primary.main,
                    },
                    marginBottom: "1rem"
                  }}
                />
                  <Typography>
                    {
                      payHrvAppInterest_Hover !== null && payHrvAppInterest_Hover !== -1 ? 
                        interest_Labels[payHrvAppInterest_Hover]
                      : payHrvAppInterest !== null ? 
                        interest_Labels[payHrvAppInterest]
                      : ""
                    }
                  </Typography>
              </Grid>
              {payHrvAppInterest != null && (
                <TextField
                  value={whyPayHrvAppInterest}
                  onChange={(e) => setWhyPayHrvAppInterest(e.target.value)}
                  label={translations.why}
                  variant="outlined"
                  sx={{ marginBottom: 2, width: "100%" }}
                />
              )}

            </Grid>

            <Grid item md={6} sx={{display: {xs:'none', md:'block'}}}>
              <Typography component="legend">{translations.HRVexplanation}</Typography>
              <iframe  
                  src="https://www.youtube.com/embed/5_hMPLcfIy0?si=lOvv-YG5P9cd9zWJ" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 9', 
                    maxWidth: '560px',
                    maxHeight: '315px',
                    display: 'block',
                    margin: '0 auto'
                  }} 
                ></iframe>
            </Grid>
          </Grid>
        </>
      )
    }
  ]

  return (
      <Card sx = {{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"start", textAlign:"center", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
        <Typography component = "h1" sx = {{ marginBottom:1, fontWeight:600, fontSize:22 }}>{translations.GetInvolved}</Typography>
        <Typography sx={{ textWrap: "balance", maxWidth: "400px" }}>{translations.EnterSurvey}</Typography>
        <Box component="form" noValidate>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  {step.label}
                </StepLabel>
                <StepContent>
                  {step.description}
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                      disabled={isStepInvalid(activeStep)} 
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
            <Paper square elevation={3} sx={{ p: 3, backgroundColor: cardBackground, borderRadius: "15px" }}>
              <Typography>¡Muchas gracias!</Typography>
              <Typography>🙂</Typography>
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