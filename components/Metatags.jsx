import Head from "next/head";


export default function Metatags( { title, description, image } ) {
  return (
    <Head>
        <title>My page</title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@brodsky9911" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        <meta name="og:title" content={title} />
        <meta name="og:description" content={description} />
        <meta name="og:image" content={image} />
  </Head>
  )
}
