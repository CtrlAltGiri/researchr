import React, { useState, useEffect } from 'react';
import { Label } from '../Form/FormComponents';
import axios from 'axios';

/*
Usage:
    <TagInput
      text="Enter tags"
      extraClass="flex justify-center px-16 mx-auto flex-col"
      updateTags={updateTags}
      chosenTags={interestTags}
      maxNumberOfTags={3}
    />
*/


function TagInputs(props) {

    const [val, setVal] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [shouldQuery, setShouldQuery] = useState(true);
    const [chosenTags, setChosenTags] = useState(props.chosenTags || []);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (!shouldQuery && val.length === 0) {
            setShouldQuery(true);
            setSuggestions([]);
        }
        else if (val.length === 1 && shouldQuery) {
            axios.get("/api/platform/tagQuery", {
                params: {
                    text: val.toLowerCase()
                }
            })
            .then(function(response) {
                setShouldQuery(false);
                setSuggestions(response.data);
            })
            .catch(function (err) {
                console.log(err);
            })
        }
    }, [val, shouldQuery])

    return (
        <div className={props.extraClass}>
            <Label text={props.text} />
            <input type="text" onChange={(e) => setVal(e.target.value.toLowerCase())} className={`outline-none focus:border-teal-500 border-2 rounded-lg py-1 px-2 ${props.fieldExtraClass}`} name={props.name} value={val} />

            <div className="flex flex-row flex-wrap mt-4">
                {
                    suggestions.map((suggestion) => {
                        let found = false;
                        if (suggestion.startsWith(val))
                            found = true;
                        else {
                            suggestion.split("-").every(function (element) {
                                if (element.startsWith(val)) {
                                    found = true;
                                    return false;
                                }
                                else {
                                    return true;
                                }
                            })
                        }
                        if (found) {
                            return (<div className="py-1 px-4 bg-teal-300 font-medium text-teal-800 rounded-md mx-4 my-2">
                                <a className="cursor-pointer" onClick={(e) => {
                                    let temp = new Set(chosenTags)
                                    temp.add(suggestion)
                                    temp = [...temp.keys()]
                                    if (temp.length > props.maxNumberOfTags) {
                                        setShowError(true);
                                    }
                                    else {
                                        setShowError(false);
                                        props.updateTags(temp);
                                        setChosenTags(temp)
                                        setVal('');
                                    }
                                }
                                }>
                                    #{suggestion}
                                </a>
                            </div>
                            );
                        }
                    })
                }
            </div>

            <div className="m-4">
            {chosenTags.length > 0 && <p className="-m-2 font-medium text-gray-800 mb-2">CHOSEN TAGS {showError ? <span className="text-red-700">(only upto {props.maxNumberOfTags} tags)</span> : ""}</p>}
                {chosenTags.length > 0 && chosenTags.map((tag) => {
                    return <div className="flex flex-row my-4" key={tag}>
                        <p className="font-medium text-teal-800">{tag}</p>
                        <button className="focus:outline-none" onClick={(e) => {
                            let index = chosenTags.indexOf(tag);
                            let temp = [...chosenTags];
                            temp.splice(index, 1);
                            props.updateTags(temp);
                            setChosenTags(temp);
                            setShowError(false);
                        }
                        }>
                            <svg className="svg-icon-small ml-8" viewBox="0 0 18 18">
                                <path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
                            </svg>
                        </button>
                    </div>
                })}
            </div>
        </div>
    );
}

export default TagInputs;