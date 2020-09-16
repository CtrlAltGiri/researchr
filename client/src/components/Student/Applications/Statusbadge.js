import React from 'react';

function Statusbadge(props){

    let badge = props.badge.toLowerCase();
    let extraClass;
    if(badge === "active"){
        extraClass ="bg-blue-200"
    }
    else if(badge === "ongoing"){
        extraClass = "bg-pink-200"
    }
    else if(badge === "completed"){
        extraClass = "bg-teal-200";
    }
    else if(badge === "cancelled"){
        extraClass = "bg-gray-200"
    }
    else if(badge === "selected"){
        extraClass = "bg-green-200";
    }
    else if(badge === "rejected"){
        extraClass = "bg-red-200"
    }
    else if(badge === "interview"){
        extraClass = "bg-yellow-200";
    }
    else if(badge === "declined"){
        extraClass = "bg-orange-200";
    }

    return(
        <span className={`relative ${extraClass} px-3 py-1 rounded-lg font-medium mx-auto`}>{badge}</span>
    )
}

export default Statusbadge;