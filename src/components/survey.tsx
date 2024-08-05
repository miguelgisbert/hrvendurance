import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
//import firebase from 'firebase/app';
import 'firebase/firestore';

/*
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "[PROJECT_ID].firebaseapp.com",
  projectId: "[PROJECT_ID]",
  storageBucket: "[PROJECT_ID].appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); 
}
*/

function Survey() {
  const [input, setInput] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Guarda les dades a Firebase
    await db.collection('surveys').add({
      response: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // Reseteja l'input
    setInput('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
      <TextField id="outlined-basic" label="Pregunta de l'enquesta" variant="outlined" value={input} onChange={e => setInput(e.target.value)} />
      <Button type="submit" variant="contained">Enviar</Button>
    </Box>
  );
}

export default Survey;