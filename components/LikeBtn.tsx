import { collection, doc, increment, writeBatch } from "firebase/firestore"
import { useDocument } from "react-firebase-hooks/firestore"
import { auth, db } from "../lib/firebase"


export default function LikeBtn({ postRef }) {
  const heartRef = doc(db, postRef.path, 'hearts', auth.currentUser.uid)
  const [heartDoc] = useDocument(heartRef)

  const addHeart = async () => {
    const batch = writeBatch(db)
    const uid = auth.currentUser.uid;
    batch.update(postRef, { heartCount: increment(1) })
    batch.set(heartRef, { uid })
    await batch.commit()
  }

  const removeHeart = async () => {
    const batch = writeBatch(db)
    batch.update(postRef, { heartCount: increment(-1) })
    batch.delete(heartRef)
    await batch.commit()
  }

  return heartDoc?.exists() ? ( <button onClick={removeHeart}>💔 Unlike</button> )
                          : ( <button onClick={addHeart}>❤️ Like</button> )
}
