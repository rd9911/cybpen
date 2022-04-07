import styles from '../../styles/Admin.module.css'
import { useState } from "react";
import { Router, useRouter } from "next/router";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import reactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import AuthCheck from "../../components/AuthCheck";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import ReactMarkdown from 'react-markdown';
import ImageUploader from '../../components/ImageUploader'


export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false)
  const router = useRouter();
  const slug = router.query.slug.toString();
  const postRef = doc(db, 'users', auth.currentUser.uid, 'posts', slug)
  const [post] = useDocumentDataOnce(postRef) // useDocumentData will listen to real time updates which can be handy in the future
  return (
    <main className={styles.container}>
      { post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>
          <aside>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`} passHref>
              <button className='btn-blue'>Live view</button>
            </Link>
          </aside>
        </>
      ) }
    </main>
  )
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState } = useForm({ defaultValues, mode: 'onChange' })
  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    console.log(content, published)
    await updateDoc(postRef, { content, published, updatedAt: serverTimestamp() })
    reset({ content, published })
    toast.success('Artcile was successfully updated!')
  }

  return (
    // rename all "Post" namings to "Article"
    <form onSubmit={handleSubmit(updatePost)}> 
      { preview && (
        <div className='card'>
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}
      <div className={ preview ? styles.hidden : styles.controls }>
        <>
        <ImageUploader />
        </>
        <textarea name='content' {...register('content', {
          maxLength: { value: 20000, message: 'The content is too long!' },
          minLength: { value: 10, message: 'The content is too short!' },
          required: { value: true, message: 'The content is required!' }
        })}></textarea>

      { formState.errors.content && <p className='text-danger'>{formState.errors.content.message}</p> }

        <fieldset>
          <input className={styles.checkbox} name="published" type='checkbox' {...register('published')} />
          <label>Published</label>
        </fieldset>
        <button type='submit' className='btn-green' disabled={!isValid || !isDirty}>Save Changes</button>
      </div>
    </form>
  )
}