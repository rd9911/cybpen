import Link from "next/link"

export default function Custom404() {
  return (
    <main>
        <h1>404 - That page does not seem to exist...</h1>
        <Link href='/' passHref><button className="btn-blue">Go home</button></Link>
        <div className="gif-div">
            <iframe src="https://giphy.com/embed/3o6MbgPPiCCYwr9XMc" width="100%" height="100%" style={{position: 'absolute'}} frameBorder="0" allowFullScreen></iframe>
        </div>
    </main>

  )
}

