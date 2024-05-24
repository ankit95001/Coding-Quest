import { auth } from '@/firebase/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import Logout from '../Button/Logout';
import { useSetRecoilState } from 'recoil';
import { authModelState } from '@/atoms/authModelAtom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsList } from 'react-icons/bs';
import Timer from '../Timer/Timer';


type TopbarProps = {
    problemPage?: boolean
};

const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {

    const [user] = useAuthState(auth);
    const setAuthModelState = useSetRecoilState(authModelState)

    return (
        <nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
            <div className={`flex w-full items-center justify-between ${!problemPage? "max-w-[1200px] max-auto":""}`}>
                <Link href='/' className='h-[22px] flex-wrap ml-2'>
                    <Image src='/logo-full.png' alt='Logo' height={100} width={100} />
                </Link>

                <div className='flex items-center space-x-4 flex-1 justify-end '>
                    {!user && (
                        <Link href='/auth' onClick={() => {
                            // setAuthModelState((prev)=>({...prev, isOpen:true,type:"login"}))
                        }}>
                            <button className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded '>Sign In</button>
                        </Link>
                    )}
                    
                    {problemPage && (
                        <div className='flex items-center gap-4 flex-1 justify-center'>
                            <div className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer ' >
                                <FaChevronLeft />
                            </div>
                            <Link href="/" className='flex items-center gap-2 font-medium max-w-[200px] text-dark-gray-8 cursor-pointer'>
                                <div>
                                    <BsList />
                                </div>
                                <p>Problem List</p>
                            </Link>
                            <div className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer ' >
                                <FaChevronRight />
                            </div>
                        </div>
                    )}
                    <Timer/>
                    {user && (
                        <div className='cursor-pointer group relative'>
                            <img src="/avatar.png" alt="user progile image" className='h-8 w-8 rounded-full' />
                            <div
                                className='absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg 
								z-40 group-hover:scale-100 scale-0 
								transition-all duration-300 ease-in-out'
                            >
                                <p className='text-sm'>{user.email}</p>
                            </div>
                        </div>
                    )}
                    {user && <Logout />}
                </div>
            </div>
        </nav>
    )
}
export default Topbar;