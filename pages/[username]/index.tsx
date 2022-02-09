import { collection, getDocs, getFirestore, limit, orderBy, where, query } from "firebase/firestore";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";

export async function getServerSideProps({ query: urlQuery }) {
  const { username } = urlQuery;
  const userDoc = await getUserWithUsername(username)

  // JSON serialized data
  let user = null
  let posts = null

  if (userDoc) {
    user = userDoc.data()
    const postQuery = query(
      collection(getFirestore(), userDoc.ref.path, 'posts'),  where('published', '==', true),
      orderBy('createdAt', 'desc'), limit(5)
    )
    posts = (await getDocs(postQuery)).docs.map(postToJSON)
  }

  return { 
    props: { user, posts }
   }
}

export default function UserProfilePage({ user, posts }) {
    return (
      <main>
        <UserProfile user={user} />
        <PostFeed posts={posts} admin={true} />
      </main>
      );
  }
  