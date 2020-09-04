function FormCheck(props, obj){
    let ret = true; 
    props.every(function(ele, index){
        // TODO (Giri): Make sure that the length thing doesn't cause problems on undefined and null
        if(!obj.hasOwnProperty(ele) || obj[ele].length < 1){
            ret = false;
            return false;
        }
        else
            return true;
    })
    return ret;
}


export default FormCheck;