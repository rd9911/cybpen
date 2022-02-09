import Loader from "../components/Loader";
import toast from 'react-hot-toast'

export default function Home() {
  return (
    <main>
      <button onClick={() => toast.success('Hello toast!') }>Toast me</button>
    </main>
  )
}
