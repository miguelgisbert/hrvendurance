import { createContext, useState, useEffect, Dispatch, SetStateAction, ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebaseConfig'
import { CustomUser } from './types'

interface UserContextProps {
  user: CustomUser | null
  setUser: Dispatch<SetStateAction<CustomUser | null>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const UserContext = createContext<UserContextProps>({ 
  user: null, 
  setUser: () => {},
  loading: true,
  setLoading: () => {}
})

interface UserProviderProps {
    children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged user: ", user)
      setUser(user as CustomUser)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  )
}