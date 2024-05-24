import { authModelState } from '@/atoms/authModelAtom';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';


type LoginProps = {
    
};

const Login:React.FC<LoginProps> = () => {
    const setAuthModel = useSetRecoilState(authModelState);
    const handleClick=(type: 'login' | 'register' | 'forgetPassword')=>{
        setAuthModel((prev)=>({ ...prev,type}));
    }
    const router=useRouter();
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

    const [inputs,setInputs]=React.useState({email:"",password:""});

    const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setInputs((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleLogin=async (e:React.ChangeEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(!inputs.email || !inputs.password) {
            toast.error("Please fill all fields",{position:"top-center",autoClose:3000, theme:"dark"});
            return ;}

        try {
            const newUser= await signInWithEmailAndPassword(inputs.email, inputs.password);
            if(!newUser) return;
            router.push('/')
            
        } catch (error:any) {
            console.log("The error is "+error.message)
            toast.error("Registration failed",{position:"top-center",autoClose:3000, theme:"dark"});
        }
    }
    useEffect(()=>{
        if(error){
            toast.error("Login Failed",{position:"top-center",autoClose:3000, theme:"dark"});
        }
    },[error])

    console.log(user ,"user")
    return <form className='space-y-6 px-6 pb-4' onSubmit={handleLogin}>
        <h3 className='text-xl font-medium text-white'>Sign in to Coding Quest</h3>
        <div>
            <label htmlFor="email" className='text-sm font-medium blockmb-2 text-gray-300'>Your Email</label>
            <input 
            onChange={handleInputChange}
                type="email" 
                name='email' 
                id='email' 
                className='border-2 outline-none sm:text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white' placeholder='name@gmail.com'/>
        </div>
        <div>
            <label htmlFor="password" className='text-sm font-medium blockmb-2 text-gray-300'>Your Password</label>
            <input 
                onChange={handleInputChange}    
                type="password" 
                name='password' 
                id='password' 
                className='border-2 outline-none sm:text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white' placeholder='*********'/>
        </div>

        <button type='submit' className='w-full text-white focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-lite-orange'>
            {loading?"Loading......":"Log In"}
        </button>
        <button className='flex w-full justify-end' onClick={()=>handleClick("forgetPassword")}>
            <a href="#" className='text-sm block text-lite-orange hover:underline w-full text-right'>Forgot Password?</a>
        </button>
        <div className='text-sm font-medium text-gray-500'>Not Registered?{" "}
            <a href="#" className='text-blue-700 hover:underline' onClick={()=>handleClick("register")}> Create account</a>
        </div>
        
    </form>
}
export default Login;