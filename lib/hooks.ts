import { auth } from './firebase'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { onSnapshot, getFirestore, doc } from 'firebase/firestore'


export function useUserData() {
    const [user] = useAuthState(auth)
    const [username, setUsername] = useState(null)
  
    useEffect( () => {
      let unsubscribe: any;
      if (user) {
        const ref = doc(getFirestore(), 'users', user.uid);
        unsubscribe = onSnapshot(ref, (doc) => {
          console.log(doc.data())
          setUsername(doc.data()?.username)
        })
      } else {
        setUsername(null)
      }
      return unsubscribe;
    }, [user])

    return { user, username }
}

