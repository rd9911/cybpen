import Head from "next/head";
import Metatags from '../../components/Metatags'

export default function AdminPostPage() {
  return (
    <main>
      <Metatags title="admin page" description="all needed info about admin" image={null} />
      <h1>Edit Post</h1>
    </main>
    );
}
