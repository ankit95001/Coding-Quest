import React, { useState } from 'react';
import { AiOutlineFullscreen, AiOutlineSetting } from 'react-icons/ai';
import LanguageSelector from './LanguageSelecter';
import { CODE_SNIPPETS } from '../constants/Constants';

type PreferenceNavProps = {
    
};

const PreferenceNav: React.FC<PreferenceNavProps> = () => {

    const [language, setLanguage] = useState<string>("javascript");
    const [value, setValue] = useState<string>("");
    const onSelect = (language: string) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language]);
    }
    

    return (<div className='flex items-center justify-between bg-dark-layer-2 h-11 w-full' >
        <div className='flex items-center text-white'>
            Language :
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

    )
}
export default PreferenceNav;