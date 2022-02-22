import { auth, storage, STATE_CHANGED } from "../lib/firebase"
import { useState } from "react"
import Loader from "./Loader"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"

export default function ImageUploader() {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [downloadURL, setDownloadURL] = useState(null)

    const uploadFile = async (e) => {
        // chaneg the type
        const file: any = Array.from(e.target.files)[0]
        const extension = file.type.split('/')[1]
        // Make a ref to the storage bucket location
        const fileRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`)
        console.log(fileRef)
        setUploading(true)
        const task = uploadBytesResumable(fileRef, file)
        task.on(STATE_CHANGED, (snapshot) => {
            const pct: number = Number((( snapshot.bytesTransferred / snapshot.totalBytes ) * 100).toFixed(0))
            setProgress(pct)
        })
        task.then((d) => getDownloadURL(fileRef))
            .then((url) => {
                setDownloadURL(url);
                setUploading(false)
            })
        

    }

  return (
    <div className="box">
        <Loader show={uploading} />
        { uploading && <h3>{progress}%</h3> }
        { !uploading && (
            <>
                <label className="btn">
                    📷 Upload Image
                    <input type='file' onChange={uploadFile} accept='image/x-png,image/gif,image/jpeg' />
                </label>
            </>
        )}
        { downloadURL && ( <code className="upload-snippet">{`[alt](${downloadURL})`}</code> ) }
    </div>
  )
}
