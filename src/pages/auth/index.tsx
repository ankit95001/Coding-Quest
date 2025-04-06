import { authModelState } from '@/atoms/authModelAtom';
import AuthModel from '@/components/Modals/AuthModel';
import NavBar from '@/components/NavBar/NavBar';
import { auth } from '@/firebase/firebase';
import useHasMounted from '@/hooks/useHasMounted';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';

type AuthPageProps = {
    
};

const AuthPage:React.FC<AuthPageProps> = () => {
    const hasMounted=useHasMounted();
    const authModel =useRecoilValue(authModelState)
    const [user, loading, error] = useAuthState(auth);
	const [pageLoading, setPageLoading] = useState(true);
	const router = useRouter();

    useEffect(() => {
		if (user) {
            router.push("/");
            return;
        }
		if (!loading && !user) setPageLoading(false);
	}, [user, router, loading]);

    if(!hasMounted) return null;

	if (pageLoading) return null;

    return <div className='bg-gradient-to-b to-dark-purple from-lite-purple h-screen relative'>
        <div className="max-w-7xl mx-auto">
            <NavBar/>
            <div className='flex item-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none'>
                <Image src="/quest1.png" alt="logo" height={700} width={900}/>
            </div>
            {authModel.isOpen && <AuthModel/>}
        </div>
    </div>
}
export default AuthPage;