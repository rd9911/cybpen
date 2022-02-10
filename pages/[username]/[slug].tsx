import { collectionGroup, doc, getDoc, getDocs, getFirestore, limit, query, where } from "firebase/firestore";
import { db, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import PostContent from "../../components/PostContent";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;
  if (userDoc) {
    const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug);
    post = postToJSON( await getDoc(postRef) )
    path = postRef.path
  }
  return {
    props: { post, path },
    revalidate: 5000,
  }
}

export async function getStaticPaths() {
  // Improve it by using Admin SDK to select empty docs
  const q = query(collectionGroup(getFirestore(), 'posts'), limit(1))
  const snapshot = await getDocs(q)
  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: {username, slug}
    }
  })
  return {
    paths,
    fallback: 'blocking'
  }
}

export default function Post(props) {
  const postRef = doc(getFirestore(), props.path);
  const [realTimePost] = useDocumentData(postRef)
  const post = realTimePost || props.post
  return (
    <main className='container'>
      <section><PostContent post={post} /></section>
      <aside className="card">
        <p><strong>{post.heartCount || 0} ❤️</strong></p>
      </aside>
    </main>
    );
}
