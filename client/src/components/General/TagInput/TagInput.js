import React from 'react';
import {Label} from '../Form/FormComponents';

// TODO (Giri): Make this a different kind of component. 
// Enter one value, press enter, it should show the added-ones
// Should also show suggestions.
function TagInput(props){
    return(
        <div className={props.extraClass}>
            <Label text={props.text} />
            <input type="text" onChange={props.onChange} className={`outline-none focus:border-teal-500 border-2 rounded-lg py-1 px-2 ${props.fieldExtraClass}`} name={props.name} value={props.value || ''} />            
        </div>
    );
}

export default TagInput;