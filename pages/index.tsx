import Loader from "../components/Loader";
import toast from 'react-hot-toast'
import { collectionGroup, getDocs, limit, orderBy, query, startAfter, Timestamp, where } from "firebase/firestore";
import { db, postToJSON } from "../lib/firebase";
import { useState } from "react";
import PostFeed from "../components/PostFeed";

const LIMIT = 1;

export async function getServerSideProps(context) {
  const postRef = collectionGroup(db, 'posts')
  const postQuery = query(postRef, where('published', '==', true), orderBy('createdAt', 'desc'), limit(LIMIT))
  const posts = (await getDocs(postQuery)).docs.map(postToJSON)

  return {
    props: { posts }
  }
}

export default function Home( props ) {
  const [ posts, setPosts ] = useState(props.posts)
  const [ loading, setLoading ] = useState(false)
  const [ postsEnd, setPostsEnd ] = useState(false)

  const getMorePosts = async() => {
    setLoading(true)
    const last = posts[posts.length - 1];
    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;

    const getPostsQuery = query(collectionGroup(db, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), startAfter(cursor), limit(LIMIT))
    const additionalPosts = (await getDocs(getPostsQuery)).docs.map((doc) => doc.data())
    setPosts(posts.concat(additionalPosts))
    setLoading(false)
    if (additionalPosts.length < LIMIT) {
      setPostsEnd(true)
    }

  }

  return (
    <main>
      <PostFeed posts={posts} admin={false} />
      { !loading && !postsEnd && <button onClick={getMorePosts}>Load More</button> }

      <Loader show={loading} />
      { postsEnd && <p>You have reached the end.</p> }
    </main>
  )
}
