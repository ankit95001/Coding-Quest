import { authModelState } from '@/atoms/authModelAtom';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from "@/firebase/firebase";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';




type SignupProps = {
    
};

const Signup:React.FC<SignupProps> = () => {
    const setAuthModel=useSetRecoilState(authModelState);
    const router=useRouter();
    const handleClick=()=>{
        setAuthModel((prev)=>({...prev,type:'login'}))
    }

    const [inputs,setInputs]=useState({email:'',displayName:'',password:''})
    
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useCreateUserWithEmailAndPassword(auth);

    const handleChangeInput=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setInputs((prev)=>({...prev,[e.target.name]:e.target.value}))
    }

    const handleRegister=async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(!inputs.email || !inputs.password || !inputs.displayName){
            toast.error("Please fill all fields",{position:"top-center",autoClose:3000, theme:"dark"});
            return ;
        }
        try {
            const newUser=await createUserWithEmailAndPassword(inputs.email, inputs.password)
            if(!newUser){
                return;
            }
            router.push('/')
        } catch (error:any) {
            toast.error("Registration failed",{position:"top-center",autoClose:3000, theme:"dark"});
        }
    }

    useEffect(()=>{
        if(error) toast.error("Registration failed",{position:"top-center",autoClose:3000, theme:"dark"});
    },[error])



    return (<form className='space-y-6 px-6 pb-4' onSubmit={handleRegister}>
    <h3 className='text-xl font-medium text-white'>Register to Coding Quest</h3>
    <div>
        <label htmlFor="email" className='text-sm font-medium blockmb-2 text-gray-300'>Email</label>
        <input 
        onChange={handleChangeInput}
            type="email" 
            name='email' 
            id='email' 
            className='border-2 outline-none sm:text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white' placeholder='name@gmail.com'/>
    </div>
    <div>
        <label htmlFor="displayName" className='text-sm font-medium blockmb-2 text-gray-300'>Name</label>
        <input 
        onChange={handleChangeInput}
            type="displayName" 
            name='displayName' 
            id='displayName' 
            className='border-2 outline-none sm:text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white' placeholder='Ankit kumar'/>
    </div>  

    <div>
        <label htmlFor="password" className='text-sm font-medium blockmb-2 text-gray-300'>Set Password</label>
        <input 
        onChange={handleChangeInput}
            type="password" 
            name='password' 
            id='password' 
            className='border-2 outline-none sm:text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white' placeholder='*********'/>
    </div>

    <button type='submit' className='w-full text-white focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-lite-orange' >
        {loading? "Registering.....":"Register"}
    </button>
    
    <div className='text-sm font-medium text-gray-500'>Already have an account?{" "}
        <a href="#" className='text-blue-700 hover:underline' onClick={()=>handleClick()}>Login</a>
    </div>
    
</form>)
}
export default Signup;