import { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'
import firebase, { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCRJA0l7MlxyBo8-NMBerGFyDDKBO9dEss",
  authDomain: "hrv-endurance-landing.firebaseapp.com",
  projectId: "hrv-endurance-landing",
  storageBucket: "hrv-endurance-landing.appspot.com",
  messagingSenderId: "228357777566",
  appId: "1:228357777566:web:9120c54e80fecf3ce3b38f",
  measurementId: "G-80B1PFKXX5"
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

function Survey() {
  const [input, setInput] = useState('')

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
  )
}

export default Survey