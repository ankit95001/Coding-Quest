import CircularSkeleton from '@/components/skeleton/CircularSkeleton';
import RectangleSkeleton from '@/components/skeleton/RectangleSkeleton';
import { auth, firestore } from '@/firebase/firebase';
import { DBProblem, Problem } from '@/utils/types/problem';
import { position } from '@chakra-ui/react';
import { Transaction, arrayRemove, arrayUnion, doc, getDoc, runTransaction, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AiFillDislike, AiFillLike, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BsCheck2Circle } from 'react-icons/bs';
import { TiStarFullOutline, TiStarOutline } from 'react-icons/ti';
import { toast } from 'react-toastify';

type ProblemDescriptionProps = {
    problem: Problem
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
    const { currectProblem, loading, problemDifficultyClass, setCurrentProblem } = useGetCurrectProblem(problem.id);
    const { liked, disliked, solved, setData, stared } = useGetUserDataOnProblem(problem.id);
    const [user] = useAuthState(auth);
    const [updating, setUpdating] = useState(false);

	const returnUserDataAndProblemData = async (transaction: any) => {
		const userRef = doc(firestore, "users", user!.uid);
		const problemRef = doc(firestore, "problems", problem.id);
		const userDoc = await transaction.get(userRef);
		const problemDoc = await transaction.get(problemRef);
		return { userDoc, problemDoc, userRef, problemRef };
	};
    const handleLike = async () => {
        if (!user) {
            toast.error("You must be logged in to like a problem", { position: "top-left", theme: "dark" });
            return;
        }
        if (updating) return;
        setUpdating(true);
        await runTransaction(firestore, async (transaction) => {
            const { problemDoc, userDoc, problemRef, userRef } = await returnUserDataAndProblemData(transaction);

            if (userDoc.exists() && problemDoc.exists()) {
                if (liked) {
                    // remove problem id from likedProblems on user document, decrement likes on problem document
                    transaction.update(userRef, {
                        likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id),
                    });
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes - 1,
                    });

                    setCurrentProblem((prev) => (prev ? { ...prev, likes: prev.likes - 1 } : null));
                    setData((prev) => ({ ...prev, liked: false }));
                } else if (disliked) {
                    transaction.update(userRef, {
                        likedProblems: [...userDoc.data().likedProblems, problem.id],
                        dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id),
                    });
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes + 1,
                        dislikes: problemDoc.data().dislikes - 1,
                    });

                    setCurrentProblem((prev) =>
                        prev ? { ...prev, likes: prev.likes + 1, dislikes: prev.dislikes - 1 } : null
                    );
                    setData((prev) => ({ ...prev, liked: true, disliked: false }));
                } else {
                    transaction.update(userRef, {
                        likedProblems: [...userDoc.data().likedProblems, problem.id],
                    });
                    transaction.update(problemRef, {
                        likes: problemDoc.data().likes + 1,
                    });
                    setCurrentProblem((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
                    setData((prev) => ({ ...prev, liked: true }));
                }
            }
        });
        setUpdating(false);
    };

    const handleDislike = async () => {
		if (!user) {
			toast.error("You must be logged in to dislike a problem", { position: "top-left", theme: "dark" });
			return;
		}
		if (updating) return;
		setUpdating(true);
		await runTransaction(firestore, async (transaction) => {
			const { problemDoc, userDoc, problemRef, userRef } = await returnUserDataAndProblemData(transaction);
			if (userDoc.exists() && problemDoc.exists()) {
				// already disliked, already liked, not disliked or liked
				if (disliked) {
					transaction.update(userRef, {
						dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id),
					});
					transaction.update(problemRef, {
						dislikes: problemDoc.data().dislikes - 1,
					});
					setCurrentProblem((prev) => (prev ? { ...prev, dislikes: prev.dislikes - 1 } : null));
					setData((prev) => ({ ...prev, disliked: false }));
				} else if (liked) {
					transaction.update(userRef, {
						dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
						likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id),
					});
					transaction.update(problemRef, {
						dislikes: problemDoc.data().dislikes + 1,
						likes: problemDoc.data().likes - 1,
					});
					setCurrentProblem((prev) =>
						prev ? { ...prev, dislikes: prev.dislikes + 1, likes: prev.likes - 1 } : null
					);
					setData((prev) => ({ ...prev, disliked: true, liked: false }));
				} else {
					transaction.update(userRef, {
						dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
					});
					transaction.update(problemRef, {
						dislikes: problemDoc.data().dislikes + 1,
					});
					setCurrentProblem((prev) => (prev ? { ...prev, dislikes: prev.dislikes + 1 } : null));
					setData((prev) => ({ ...prev, disliked: true }));
				}
			}
		});
		setUpdating(false);
	};

    const handleStar = async () => {
		if (!user) {
			toast.error("You must be logged in to star a problem", { position: "top-left", theme: "dark" });
			return;
		}
		if (updating) return;
		setUpdating(true);

		if (!stared) {
			const userRef = doc(firestore, "users", user.uid);
			await updateDoc(userRef, {
				StaredProblems: arrayUnion(problem.id),
			});
			setData((prev) => ({ ...prev, stared: true }));
		} else {
			const userRef = doc(firestore, "users", user.uid);
			await updateDoc(userRef, {
				StaredProblems: arrayRemove(problem.id),
			});
			setData((prev) => ({ ...prev, stared: false }));
		}

		setUpdating(false);
	};

    return (
        < div className='bg-dark-layer-1' >
            {/* TAB */}
            < div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden' >
                <div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
                    Description
                </div>
            </div >

            <div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
                <div className='px-5'>
                    {/* Problem heading */}
                    <div className='w-full'>
                        <div className='flex space-x-4'>
                            <div className='flex-1 mr-2 text-lg text-white font-medium'>{problem.title}</div>
                        </div>

                        {!loading && currectProblem && (
                            <div className='flex items-center mt-3'>
                                <div
                                    className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                                >
                                    {currectProblem.difficulty}
                                </div>
                                <div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-dark-gray-6'>
                                    {solved && <BsCheck2Circle className='text-dark-green-s' />}
                                    {!solved && <BsCheck2Circle />}

                                </div>

                                <div
                                    className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
                                    onClick={handleLike}
                                >
                                    {liked && !updating && <AiFillLike className='text-dark-blue-s' />}
                                    {!liked && !updating && <AiFillLike />}
                                    {updating && <AiOutlineLoading3Quarters className='animate-spin'/>}

                                    <span className='text-xs'>{currectProblem.likes}</span>
                                </div>
                                <div
                                    className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
                                    onClick={handleDislike}
                                >
                                    {!updating && disliked && <AiFillDislike className='text-dark-blue-s' />}
                                    {!disliked && !updating && <AiFillDislike />}
                                    {updating && <AiOutlineLoading3Quarters className='animate-spin'/>}
                                    <span className='text-xs'>{currectProblem.dislikes}</span>
                                </div>
                                <div
                                    className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '
                                    onClick={handleStar}
                                >
                                    {!updating && stared && <TiStarFullOutline className='text-dark-yellow' />}
                                    {!stared && !updating && <TiStarOutline />}
                                    {updating && <AiOutlineLoading3Quarters className='animate-spin'/>}

                                </div>
                            </div>
                        )}
                        {loading && (
                            <div className='mt-3 flex space-x-2'>
                                <RectangleSkeleton />
                                <CircularSkeleton />
                                <RectangleSkeleton />
                                <RectangleSkeleton />
                                <CircularSkeleton />

                            </div>
                        )}


                        <div className='text-white text-sm'>
                            <div
                                dangerouslySetInnerHTML={
                                    { __html: problem.problemStatement }
                                }
                            />
                        </div>
                        <div className='mt-4'>
                            {problem.examples.map((example, index) => (
                                <div key={example.id}>
                                    <p className='font-medium text-white '>Example {index + 1}: </p>

                                    <div className='example-card'>
                                        <pre>
                                            <strong className='text-white'>Input: </strong> {example.inputText}
                                            <br />
                                            <strong>Output:</strong>
                                            {example.outputText} <br />

                                            <strong>Explanation:</strong> {example.explanation}
                                        </pre>
                                    </div>
                                </div>

                            ))}





                            {/* Constraints */}
                            <div className='my-5 pb-4'>
                                <div className='text-white text-sm font-medium'>Constraints:</div>
                                <ul className='text-white ml-5 list-disc my-4'>
                                    <div
                                        dangerouslySetInnerHTML={
                                            { __html: problem.constraints }
                                        }
                                    />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default ProblemDescription;

function useGetCurrectProblem(problemId: string) {
    const [currectProblem, setCurrentProblem] = useState<DBProblem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [problemDifficultyClass, setProblemDifficultyClass] = useState<string>("");
    useEffect(() => {
        const getCurrectProblem = async () => {
            setLoading(true);

            const docRef = doc(firestore, "problems", problemId)
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const problem = docSnap.data();
                setCurrentProblem({ id: docSnap.id, ...problem } as DBProblem);
                setProblemDifficultyClass(
                    problem.difficulty === "Easy" ? "bg-olive text-olive" : problem.difficulty === "Medium" ? "bg-dark-yellow text-dark-yellow" : "bg-dark-pink text-dark-pink"
                )
            }
            setLoading(false);
        }
        getCurrectProblem()
    }, [problemId])
    return { currectProblem, loading, problemDifficultyClass, setCurrentProblem };
}


function useGetUserDataOnProblem(problemId: string) {
    const [data, setData] = useState({ liked: false, disliked: false, stared: false, solved: false })
    const [user] = useAuthState(auth);
    useEffect(() => {
        const getUsetDataOnProblem = async () => {
            if (!user) return;
            const userRef = doc(firestore, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                const { solvedProblems, likedProblems, dislikedProblems, StaredProblems } = data;
                // 
                setData({
                    liked: likedProblems?.includes(problemId),
                    disliked: dislikedProblems?.includes(problemId),
                    stared: StaredProblems?.includes(problemId),
                    solved: solvedProblems?.includes(problemId),
                });
            }
        };
        if (user) getUsetDataOnProblem();
        return () => setData({ liked: false, disliked: false, stared: false, solved: false });
    }, [problemId, user])

    return { ...data, setData }
}