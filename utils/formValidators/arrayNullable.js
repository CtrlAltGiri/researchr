function arrayNullable({ value, args }, validator){
    if (value === null || value === undefined){
        return true;
    }
    else{
        const maxArray = args[0];
        const maxEle = args[1];
        if(value.length > maxArray){
            return false;
        }
        value.forEach(ele => {
            if(ele.length > maxEle){
                return false;
            }
        })
        
        return true;
    }
}

module.exports = arrayNullable;