import styles from '../../styles/Admin.module.css'
import { getAuth } from "firebase/auth";
import { collection, getFirestore, query, orderBy, serverTimestamp, setDoc, doc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import Metatags from '../../components/Metatags'
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { auth, db } from '../../lib/firebase'
import kebabCase from 'lodash.kebabcase'
import toast from 'react-hot-toast';

export default function AdminPostPage() {
  return (
    <main>
      <Metatags title="admin page" description="all needed info about admin" image={null} />
      <AuthCheck>
        <CreateNewPost />
        <PostList />
      </AuthCheck>
    </main>
    );
}



function PostList() {
  const ref = collection(db , 'users', auth.currentUser.uid, 'posts')
  const q = query(ref, orderBy('createdAt'))
  const [ querySnapshot ] = useCollection(q)

  const posts = querySnapshot?.docs.map((doc) => doc.data()) // try useCollectionData() if you want just this functionality
  return (
    <>
      <h1>Manage your posts</h1>
      <PostFeed admin posts={posts} />
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState('')

  const slug = encodeURI(kebabCase(title)) // ensure URI friendliness of the string
  const isValid = slug.length > 3 && slug.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(db, 'users', uid, 'posts', slug)
    const data = { title, slug, uid, username,
      published: false, content: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp(), heartCount: 0  
    }
    await setDoc(ref, data)

    toast.success('Article is created!')
    router.push(`/admin/${slug}`)
  }
  return (
    <form onSubmit={createPost}>
      <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Type a title of an article...'></input>
      <p><strong>Slug:</strong> {slug} </p>
      <button className='btn-green' type='submit' disabled={!isValid}>Create New Artcile</button>
    </form>
  )
}
