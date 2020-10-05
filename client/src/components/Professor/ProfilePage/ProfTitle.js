import React from 'react';

function addHTTP(props){
    if(props.startsWith("http://") || props.startsWith("https://")){
        return props;
    }
    else{
        return "http://" + props;
    }
}

function ProfTitle(props) {
    return (
        props.fullProfile ?
            <div name="intro-section" className="flex flex-col md:flex-row md:justify-between">
                <div className="">
                    <p className="text-3xl font-semibold">{props.name}</p>
                    <p className="text-xl font-thin">{props.designation}</p>
                    <p className="text-xl font-thin">{props.college}</p>
                    {props.url && <a href={addHTTP(props.url)} target="_blank"><p className="text-lg font-normal hover:underline">{props.url}</p></a>}
                </div>

                {
                    props.mine && <div>
                        <p className="underline cursor-pointer" onClick={e => props.openModal(true)}>Update Password</p>
                    </div>
                }
            </div>
            :

            <div className="px-4 md:px-24 py-0 md:py-24">
                <div name="intro-section" className="flex text-center justify-center w-full">
                    <div>
                        <p className="text-6xl font-semibold">{props.name}</p>
                        <p className="text-3xl font-thin">{props.designation}</p>
                        <p className="text-3xl font-thin">{props.college}</p>
                        {props.url && <a href={props.url} target="_blank"><p className="text-5xl font-normal hover:underline">{props.url}</p></a>}
                    </div>
                </div>
                {
                    props.mine && <div className="flex mt-24 justify-center">
                        <p className="underline cursor-pointer" onClick={e => props.openModal(true)}>Update Password</p>
                    </div>
                }
            </div>
    );
}

export default ProfTitle;