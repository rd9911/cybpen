import Link from 'next/link';
// import Loader from './Loader'
import Image from 'next/image';
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import userLogo from '../public/user.png'
import { SignOutBtn } from '../pages/enter';

export default function Navbar( {} ) {
  const { user, username } = useContext(UserContext)
  return (
      <div>
            <nav className='navbar'>
                <ul>
                  <li> <Link href={'/'} passHref><button className='btn-logo'> Feed </button></Link> </li>
                  { username && (
                    <>
                      <li className='push-left'><SignOutBtn /></li>
                      <li><Link href={'/admin'} passHref><button className='btn-blue'> Write Post </button></Link> </li>
                      <li><Link href={`/${username}`} passHref><Image src={user?.photoURL || userLogo } alt='profile-picture' height={'30px'} width={'30px'}/></Link></li>
                    </>
                  ) }
                  { !username && (
                    <>
                      <li> <Link href={'/enter'} passHref><button className='btn-blue'> Log In </button></Link> </li>
                    </>
                  ) }
                </ul>
            </nav>
      </div>
  );
}
