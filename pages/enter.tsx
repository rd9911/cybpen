import google_image from '../public/google.png'
import Image from "next/image";
import { signInWithPopup, signOut, signInAnonymously } from "firebase/auth";
import { db, provider } from '../lib/firebase';
import { auth } from '../lib/firebase';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/context';
import { getFirestore, doc, getDoc, writeBatch } from 'firebase/firestore';
import  debounce from 'lodash.debounce'

export default function EnterPage( {} ) {
  const { user, username } = useContext(UserContext)

  return (
    <main>
        <h1>Sign in</h1>
        {console.log(user)}
        { user ?
            !username ? <UsernameForm /> : <SignOutBtn />
            : <SignInBtn /> }
    </main>
    );
}

function SignInBtn () {

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider)
   } catch (error) {
     console.log(error)
   }
  }

  return (
    <div>
      <button className="btn-google" onClick={signInWithGoogle}>
        <p>Sign in with Google</p>
        <Image src={google_image} alt="google-logo" width={'30px'} height={'30px'} />
      </button>
      <button onClick={ () => signInAnonymously(auth) }>Sign in ananymously</button>
    </div>
  )
}

export function SignOutBtn () {
  return <button onClick={() => signOut(auth)}>Sign Out</button>
}

function UsernameForm () {
  const [ formValue, setFormValue ] = useState('')
  const [ isValid, setIsValid ] = useState(false)
  const [ loading, setLoading ] = useState(false)

  const { user, username } = useContext(UserContext)

  useEffect(() => {
    checkUsernameFunc(formValue)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue])

  const onChangeFunc = (event: any) => {
    const value = event.target.value.toLowerCase();
    const regx = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    if ( value.length < 3 ) {
      setFormValue(value)
      setLoading(false)
      setIsValid(false)
    }
    if (regx.test(value)) {
      setFormValue(value)
      setLoading(true)
      setIsValid(false)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkUsernameFunc = useCallback(
    debounce(async(username: string) => {
      if ( username.length >= 3 ) {
        const ref = doc(getFirestore(), 'usernames', username)
        const snap = await getDoc(ref)
        setIsValid(!snap.exists())
        setLoading(false)
      }
    }, 500),
    []
  )
  async function onSubmit(event) {
    event.preventDefault();
    const userDoc = doc(getFirestore(), 'users', user.uid)
    const usernameDoc = doc(getFirestore(), 'usernames', formValue)

    const batch = writeBatch(db)
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
    batch.set(usernameDoc, { uid: user.uid } )
    try {
      await batch.commit()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input type={'text'} name='username' placeholder='username' value={formValue} onChange={onChangeFunc} />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type='submit' className='btn-green' disabled={!isValid}>Choose</button>

          <h3>Debug State</h3>
          <div>
            Username: { formValue }
            <br />
            Loading: { loading.toString() }
            <br />
            Username Valid: { isValid.toString() }
          </div>
        </form>
      </section>
    )
  )
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className='text-success'>{username} is available</p>
  } else if ( username && !isValid ) {
    return <p className='text-danger'>That username is either taken or too short!</p>
  } else {
    return <></>
  }
}