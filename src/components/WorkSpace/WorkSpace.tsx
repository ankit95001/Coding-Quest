import React from 'react';
import Split from 'react-split';
import ProblemDescription from './ProblemDescription/ProblemDescription';
import Playground from './Playground/Playground';
import { Problem } from '@/utils/types/problem';
type WorkSpaceProps = {
    problem:Problem,


};

const WorkSpace:React.FC<WorkSpaceProps> = ({problem}) => {
    
    return <Split className='split' >
        <ProblemDescription problem={problem}/>
        <Playground problem={problem} />
    </Split>
}
export default WorkSpace;