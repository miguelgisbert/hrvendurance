import { useState, FC } from 'react'
import { TextField, Button, Box, Card, Theme, Typography } from '@mui/material'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import ReactCardFlip from 'react-card-flip'

const firebaseConfig = {
  apiKey: "AIzaSyCRJA0l7MlxyBo8-NMBerGFyDDKBO9dEss",
  authDomain: "hrv-endurance-landing.firebaseapp.com",
  projectId: "hrv-endurance-landing",
  storageBucket: "hrv-endurance-landing.appspot.com",
  messagingSenderId: "228357777566",
  appId: "1:228357777566:web:9120c54e80fecf3ce3b38f",
  measurementId: "G-80B1PFKXX5"
}

interface SurveyProps {
  theme: Theme
  translations: { greeting: string }
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const Survey: FC<SurveyProps> = ({ theme, translations }) => {
  const cardBackground = theme.myBackground.cardBackground
  // const cardShadow = theme.palette.background.cardShadow
  const shadowColor = theme.myBackground.cardShadow
  const [input, setInput] = useState('')
  const [isFlipped, setIsFlipped] = useState<boolean>(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await addDoc(collection(db, 'surveys'), {
        response: input,
        timestamp: serverTimestamp(),
      })
      setInput('')
    } catch (error) {
      console.error('Error afegint la resposta a Firestore: ', error)
    }
  }

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <Card onMouseOver={() => setIsFlipped(true)} sx={{ width:"100%", height:"300px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"start", textAlign:"center", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
        <Typography component="h1" sx={{ marginBottom:1, fontWeight:600, fontSize:22 }}>{translations.GetInvolved}</Typography>
        <Typography>{translations.EnterSurvey}</Typography>
      </Card>
      <Card onMouseOut={() => setIsFlipped(false)} sx={{ width:"100%", height:"300px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", borderRadius:"20px", padding:"30px 20px", boxShadow:`10px 10px ${shadowColor}`, backgroundColor: cardBackground }}>
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField
            id="outlined-basic"
            label="Pregunta de l'enquesta"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" variant="contained">Enviar</Button>
        </Box>
      </Card>
    </ReactCardFlip> 

    
  )
}

export default Survey