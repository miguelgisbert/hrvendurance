import { useState, useEffect, useContext, useRef } from 'react'
import { auth } from '../firebaseConfig'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { Button, Box, TextField, Popper, Snackbar, Alert, SnackbarCloseReason, ClickAwayListener } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { doc, setDoc, getFirestore, getDoc } from 'firebase/firestore'
import { UserContext } from '../UserContext'
import { usePopper } from '../PopperContext'
import { CustomUser } from '../types'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LoginIcon from '@mui/icons-material/Login';
import { Translations, Language } from '../types'

interface LoginProps {
  showPopper: boolean
  translations: Translations[Language]
}

const Login: React.FC<LoginProps> = ({ showPopper, translations }) => {

  const { user, setUser, setLoading } = useContext(UserContext)
  const { formToShow, setFormToShow } = usePopper()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const loginButtonRef = useRef<HTMLButtonElement>(null)
  const signUpButtonRef = useRef<HTMLButtonElement>(null)

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const fetchUser = async () => {
        if (user) {
          const docRef = doc(db, 'users', user.uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const data = docSnap.data()
            setUser({ ...user, ...data } as CustomUser)
          } else {
            setUser(user as CustomUser)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
        setEmail('')
        setPassword('')
        setErrorMessage('')
      }
      fetchUser();
    },
    () => {setLoading(false)})
    if (!auth.currentUser) {
      setLoading(false)
    }
    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    setFormToShow(showPopper ? 'signup' : 'none')
  }, [showPopper])


  const signIn = async () => {
    setFormToShow('none')
    setAnchorEl(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      const user = auth.currentUser
      // if (user) {
      //   const docRef = doc(db, 'users', user.uid)
      //   const docSnap = await getDoc(docRef)
      //   if (docSnap.exists()) {
      //     const data = docSnap.data()
      //     setUser({ ...user, ...data } as CustomUser)
      //   } else {
      //     setUser(user as CustomUser)
      //   }
      // }
    } catch (error) {
      if (error instanceof Error) {
        const firebaseError = error as FirebaseError
        switch (firebaseError.code) {
          case 'auth/invalid-credential':
            setErrorMessage('Invalid user or password.')
            break;
          case 'auth/invalid-email':
            setErrorMessage('Invalid email.')
            break;
          default:
            setErrorMessage('Unknown error.')
        }
        setOpen(true)
        console.log(firebaseError.code)
      }
    }
  }

  const db = getFirestore()

  const signUp = async () => {
    setFormToShow('none')
    setAnchorEl(null)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log(email, password)
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email
      })

      await signOut(auth);
      await signInWithEmailAndPassword(auth, email, password);

      // const user = auth.currentUser
      // console.log("USER: ", user)
      // if (user) {
      //   const docRef = doc(db, 'users', user.uid)
      //   const docSnap = await getDoc(docRef)
      //   if (docSnap.exists()) {
      //     const data = docSnap.data()
      //     setUser({ ...user, ...data } as CustomUser)
      //   } else {
      //     setUser(user as CustomUser)
      //   }
      // }
    } catch (error) {
      if (error instanceof Error) {
        const firebaseError = error as FirebaseError
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            setErrorMessage('Email already in use.')
            break;
          case 'auth/weak-password':
            setErrorMessage('Weak password (6 characters).')
            break;
          case 'auth/invalid-email':
            setErrorMessage('Invalid email.')
            break;
          case 'auth/invalid-credential':
            setErrorMessage('Wrong password.')
            break;
          default:
            setErrorMessage('Unknown error.')
        }
        setOpen(true)
        console.log(firebaseError.code)
      }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      console.log("User signed out successfully.")
    } catch (error) {
      console.log("Error signing out:", error)
    }
  }

  const [open, setOpen] = useState(false)

  const handleClose = (_: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  const handleAlertClose = (event: React.SyntheticEvent<Element, Event>) => {
    handleClose(event, 'timeout');
  }

  return (
    <>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
        {errorMessage}
      </Alert>
    </Snackbar>
      {!user ? (
        <Box sx={{ display: "flex", alignItems: "stretch" }}>
          <Button ref={loginButtonRef} color="inherit" sx={{ display: "flex", alignItems: "center", height: "100%" }} 
            onClick={(e) => {
              setFormToShow('login')
              setAnchorEl(e.currentTarget)
            }}>
              <LoginIcon />
          </Button>
          <Button ref={signUpButtonRef} color="inherit" sx={{ display: "flex", alignItems: "center", height: "100%", lineHeight: 1.3 }} 
            onClick={(e) =>{
              setFormToShow('signup')
              setAnchorEl(e.currentTarget)  
            }} >
              <PersonAddAltIcon />
          </Button>
        </Box>
      ) : (
        <Box gap={2} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <Button><LogoutIcon onClick={logout} sx={{ color: "white" }} /></Button>
        </Box>
      )}
      <ClickAwayListener onClickAway={(event) => {
        if (
          loginButtonRef.current &&
          signUpButtonRef.current &&
          event.target !== loginButtonRef.current &&
          event.target !== signUpButtonRef.current &&
          !loginButtonRef.current.contains(event.target as Node) &&
          !signUpButtonRef.current.contains(event.target as Node)
        ) {
          setFormToShow('none');
        }
      }}>
        <Popper open={formToShow === 'login' || formToShow === 'signup'} anchorEl={isSmallScreen ? null : anchorEl} placement={isSmallScreen ? 'bottom' : 'bottom-end'} sx={{ boxShadow: 5, padding:"40px", width: isSmallScreen ? "70vw" : "340px", top: isSmallScreen ? '70px!important' : '20px!important', left: isSmallScreen ? '5vw!important' : 'auto', backgroundColor: theme.myBackground.cardBackground, zIndex: 1000 }}>
          <Box  component="form" 
                sx={{ 
                  width:"100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  padding: 0,
                  gap: 2 
                }} 
                padding={5} 
                onSubmit={e => {
                  e.preventDefault()
                  if (formToShow === 'login') {
                    signIn()
                  } else if (formToShow === 'signup') {
                    signUp()
                  }
                }}>
            <TextField
              required
              id="email_login"
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              required
              id="password_login"
              label={translations.password}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={formToShow === 'login' ? signIn : signUp}>
              {formToShow === 'login' ? translations.login : translations.createAccount}
            </Button>
          </Box>
        </Popper>
      </ClickAwayListener>
    </>
  )
}

export { Login, auth }