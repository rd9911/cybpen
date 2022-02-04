import Link from 'next/link';
// import Loader from './Loader'
import Image from 'next/image';

export default function Navbar( {} ) {
    const user = null;
    const username = null;
  return (
      <div>
            <nav className='navbar'>
                <ul>
                  <li> <Link href={'/'} passHref><button className='btn-logo'> Feed </button></Link> </li>
                  { username && (
                    <>
                      <li className='push-left'> <Link href={'/admin'} passHref><button className='btn-blue'> Write Post </button></Link> </li>
                      <li> <Link href={`/${username}`} passHref><Image src={user?.photoURL} alt='profile-picture'/></Link> </li>
                    </>
                  ) }
                  { !username && (
                    <>
                      <li> <Link href={'enter'} passHref><button className='btn-blue'> Log In </button></Link> </li>
                    </>
                  ) }
                </ul>
            </nav>
      </div>
  );
}
