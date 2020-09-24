const { colleges, degrees, branches, yog } = require('../data/collegeData');

const MAX_NO_TAGS = 2;

function FormCheck(props, obj) {
    let ret = true;
    props.every(function (ele, index) {
        // TODO (Giri): Make sure that the length thing doesn't cause problems on undefined and null
        if (!obj.hasOwnProperty(ele) || obj[ele].length < 1) {
            ret = false;
            return false;
        }
        else
            return true;
    })
    return ret;
}

function checkProofLink(url) {

    if (/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(url)) {
        if (/^(www\.)?drive\.google\.com\/(.+)/.test(url) || /^https:\/\/(www\.)?drive\.google\.com\/(.+)/.test(url))
            return true;
        else if(/^(www\.)?github.com\/(.+)/.test(url) || /^https:\/\/(www\.)?github.com\/(.+)/.test(url))
            return true;
    }
    else
        return false;
}

function isValidMonthYear(date) {

    if (date === "Present") {
        return true;
    }

    const m = date.substr(0, 2);
    const y = date.substr(3, 4);

    if (isNaN(m) || isNaN(y) || date[2] !== '/')
        return false;
    return true;

}

function schoolFormValidator(props) {

    let scoring = ["Percentage", "CGPA"]
    let vals = [["scoring10", "grade10"], ["scoring12", "grade12"]];
    let retVal = true;

    vals.every((val) => {
        let score = val[0];
        let grade = val[1];
        if (!scoring.find(scoreType => scoreType === props[score])) {
            retVal = "Please ensure dropdown is selected correctly for scoring."
            return false;
        }
        else if (isNaN(props[grade]) === true) {
            retVal = "Please enter numeric values for CGPA / Percentage."
            return false;
        }
        else {
            grade = Number.parseFloat(props[grade]);
            switch (props[score]) {
                case scoring[0]:
                    if (grade < 0 || grade > 100) {
                        retVal = "Please enter a valid percentage value";
                        return false;
                    }
                    break;
                case scoring[1]:
                    if (grade < 0 || grade > 10) {
                        retVal = "Please enter a valid CGPA (out of 10).";
                        return false;
                    }
                    break;
            }
        }

        return true;
    })

    return retVal;
}

function collegeFormValidator(props) {

    if (!colleges.find(college => college.value === props.college)) {
        return "Incorrect college selected";
    }
    else if (!branches.find(branch => branch.value === props.branch)) {
        return "Selected Branch is invalid";
    }
    else if (!degrees.find(degree => degree.value === props.degree)) {
        return "Selected Degree is invalid";
    }
    else if (!yog.find(yogx => yogx.value === props.yog)) {
        return "Year of Graduation is invalid";
    }
    else if (isNaN(props.cgpa) === true || Number.parseFloat(props.cgpa) > 10 || Number.parseFloat(props.cgpa) < 0) {
        return "CGPA entered is invalid";
    }

    return true;
}

function workFormValidator(props) {

    if (!(props.organization.length > 0)) {
        return "Company name must be specified."
    }
    else if (!(props.position.length > 0)) {
        return "Position must be specified (ex. Intern / Software Engineer)"
    }
    else if (props.startDate.length !== 7 || !isValidMonthYear(props.startDate)) {
        return "Select a valid date for start date.";
    }
    else if (props.endDate.length !== 7 || !isValidMonthYear(props.endDate)) {
        return "Select a valid date for end date."
    }
    else if (!checkProofLink(props.proof)) {
        return "Please enter valid proof link to the drive"
    }
    else if (!(props.tags.length > 0)) {
        return "Please enter atleast one tag that matches project."
    }
    else if (props.tags.length > MAX_NO_TAGS) {
        return "Too many tags entered.";
    }

    return true;
}

function projectFormValidator(props) {
    if (!(props.title.length > 0)) {
        return "Please enter the title of the project"
    }
    else if (!(checkProofLink(props.proof))) {
        return "Please enter valid proof link to the drive"
    }
    else if (!(props.tags.length > 0)) {
        return "Please enter alteast one tag that matches project"
    }
    else if (props.tags.length > MAX_NO_TAGS) {
        return "Too many tags entered.";
    }
    if (props.researchProject) {
        if (!(props.professor.length > 0)) {
            return "Please enter valid professor name."
        }
        else if (!(props.college.length > 0)) {
            return "Please enter valid college name associated with professor."
        }
        else if (!(props.startDate.length === 7) || !isValidMonthYear(props.startDate)) {
            return "Please enter valid start date."
        }
        else if (!(props.endDate.length === 7) || !isValidMonthYear(props.endDate)) {
            return "Please enter valid end date."
        }
    }

    return true;
}

module.exports = { schoolFormValidator, collegeFormValidator, workFormValidator, projectFormValidator, FormCheck }