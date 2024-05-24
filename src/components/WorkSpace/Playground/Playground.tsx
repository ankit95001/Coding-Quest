import React, { useRef, useState } from 'react';
import Split from 'react-split';
import EditorFooter from './EditorFooter/EditorFooter';
import { Problem } from '@/utils/types/problem';
import { Editor, OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';  // Ensure to have monaco-editor types
import LanguageSelector from '../PreferenceNav/LanguageSelecter';
import { AiOutlineFullscreen, AiOutlineSetting } from 'react-icons/ai';
import { CODE_SNIPPETS } from '../constants/Constants';

type PlaygroundProps = {
    problem: Problem
};

const Playground: React.FC<PlaygroundProps> = ({ problem }) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
    const onMount: OnMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };
    const [language, setLanguage] = useState<string>("javascript");
    const [value, setValue] = useState<string>("");
    const onSelect = (language: string) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language]);
    }
    return (
        <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>

            <Split className="h-[calc(100vh-94px)]" direction='vertical' sizes={[60, 40]} minSize={60}>
                <div className="w-full overflow-auto">
                    <div>
                        <div className='flex items-center justify-between bg-dark-layer-2 h-11 w-full'>
                            <div className='flex items-center text-white'>
                                Language:
                                <LanguageSelector language={language} onSelect={onSelect} />
                            </div>
                            <div className='flex items-center m-2'>
                                <button className='preferenceBtn group'>
                                    <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
                                        <AiOutlineSetting />
                                    </div>
                                    <div className='preferenceBtn-tooltip'>
                                        Setting
                                    </div>
                                </button>
                                <button className='preferenceBtn group'>
                                    <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
                                        <AiOutlineFullscreen />
                                    </div>
                                    <div className='preferenceBtn-tooltip'>
                                        FullScreen
                                    </div>
                                </button>
                            </div>
                        </div>
                        <Editor
                            height="90vh"
                            theme='vs-dark'
                            language={language}
                            defaultValue={CODE_SNIPPETS[language]}
                            onMount={onMount}
                            value={value}
                            onChange={(value) => setValue(value ?? "")}
                        />
                    </div>


                </div>
                <div className='w-full px-5 overflow-auto'>
                    <div className='flex h-10 items-center space-x-6'>
                        <div className='relative flex h-full flex-col justify-center cursor-pointer'>
                            <div className='text-sm font-medium leading-5 text-white'>
                                TestCase
                            </div>
                            <hr className='absolute bottom-0 h-0.5 w-full rounded-full bg-white' />
                        </div>
                    </div>
                    <div className="flex">
                        {problem.examples.map((example, index) => (
                            <div className='mr-2 item-start mt-2 text-gray-500' key={example.id}
                                onClick={() => setActiveTestCaseId(index)}
                            >
                                <div className='flex flex-wrap items-center gap-y-4'>
                                    <div className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
                                    ${activeTestCaseId === index ? "text-white" : ""}
                                    `}>Case: {index + 1}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='font-semibold my-4'>
                        <p className='text-sm font-medium mt-4 text-white'>Input:</p>
                        <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                            {problem.examples[activeTestCaseId].inputText}
                        </div>
                        <p className='text-sm font-medium mt-4 text-white'>Output:</p>
                        <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                            {problem.examples[activeTestCaseId].outputText}
                        </div>
                    </div>
                </div>
            </Split>
            <EditorFooter />
        </div>
    )
}

export default Playground;
