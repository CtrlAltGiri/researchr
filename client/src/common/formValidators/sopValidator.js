const MAX_WORDS = 150;
const MAX_SOP_WORDS = 300;

function retWords(str){
    str = str.replace(/(^\s*)|(\s*$)/gi,"");
    str = str.replace(/[ ]{2,}/gi," ");
    str = str.replace(/\n /,"\n");
    return str.split(' ').length;
}

function checkWords(str, max){
    return retWords(str) <= max;
}

function answersFormCheck(answers){

    let retVal = true;
    answers.every((answer, index) => {
        if(!checkWords(answer, MAX_WORDS)){
            retVal = index + 1;
            return false;
        }
        return true;
    })
    return retVal;
}

function sopFormCheck(sop){
    if(!sop){
        return "Please fill out the SOP form"
    }
    let words = retWords(sop);
    if(words <  50){
        return `Please ensure that the SOP is extensive (50 words min.)`
    }
    else if(words > MAX_SOP_WORDS){
        return `Please ensure that the SOP is concise (under ${MAX_SOP_WORDS} words)`
    }
    else{
        return true;
    }
}

module.exports = {answersFormCheck, sopFormCheck, retWords}