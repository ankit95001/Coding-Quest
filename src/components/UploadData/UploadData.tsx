import { firestore } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';

type UploadDataProps = {
    
};

const UploadData:React.FC<UploadDataProps> = () => {
    const [inputs, setInput]=useState({
        	id:'',
        	title:'',
        	difficulty:'',
        	category:'',
        	videoId:'',
        	link:'',
        	order:0,
        	likes:0,
        	dislikes:0,
        })
        const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        	setInput({
        		...inputs,
        		[e.target.name]:e.target.value
        	})
        }
        const newProblem={
        	...inputs,
        	order:Number(inputs.order)
        }
    
        const handleSubmit= async (e:React.FormEvent<HTMLFormElement>)=>{
        	e.preventDefault();
        	await setDoc(doc(firestore, "problems", inputs.id), newProblem);
        	alert("saved to db")
        }
    return <div>
        <form className="p-6 flex flex-col max-w-sm gap-3" onSubmit={handleSubmit}>
					<input onChange={handleInputChange} type="text" placeholder="problem id" name="id" />
					<input onChange={handleInputChange} type="text" placeholder="title" name="title" />
					<input onChange={handleInputChange} type="text" placeholder="difficulty" name="difficulty" />
					<input onChange={handleInputChange} type="text" placeholder="category" name="category" />
					<input onChange={handleInputChange} type="text" placeholder="order" name="order" />
					<input onChange={handleInputChange} type="text" placeholder="videoId?" name="videoId" />
					<input onChange={handleInputChange} type="text" placeholder="link?" name="link" />

					<button className="bg-white">Save to db</button>
					
				</form>
    </div>
}
export default UploadData;