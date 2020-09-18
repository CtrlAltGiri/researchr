
function projectValidator(props, editMode){

    if(!props){
        return "Please enter values";
    }

    if(typeof(props.startDate) === typeof('')){
        props.startDate = new Date(props.startDate);
    }

    if(typeof(props.applicationCloseDate === typeof(''))){
        props.applicationCloseDate = new Date(props.applicationCloseDate);
    }

    if(!( props.startDate && props.startDate instanceof Date && props.startDate.getTime())){
        return "Please enter a valid date for Start Date";
    }
    else if(!(props.applicationCloseDate && props.applicationCloseDate instanceof Date && props.applicationCloseDate.getTime())){
        return "Please enter a valid date for Application Close Date";
    }
    else if(!(props.name && props.name.length > 5)){
        return "Please enter a valid name for the project";
    }
    else if(!(props.desc && props.desc.length > 20)){
        return "Please enter a comprehensive description for the project";
    }
    else if(!(props.prereq && props.prereq.length > 0)){
        return "Please enter atleast one prerequisite for the project";
    }
    else if(!(props.duration && !isNaN(props.duration))){
        return "Please enter duration (in months) of the project"
    }
    else if(!(props.commitment && !isNaN(props.commitment))){
        return "Please enter commitment (in hours/week) of the project";
    }
    else if(!(props.location)){
        return "Please enter the location of the project";
    }
    else if(!(props.restrictedView !== null && (props.restrictedView === true || props.restrictedView === false))){
        return "Please enter the visibility of the project";
    }
    else if(!editMode && !(props.tags && props.tags.length > 0)){
        return "Please enter atleast one tag to match appropriate students";
    }

    return true;
}


module.exports = {projectValidator};