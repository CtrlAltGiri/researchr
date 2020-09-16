var colleges = [
    {
        value: "Manipal Institute of Technology", 
        label: "Manipal Institute of Technology",
        url: "manipal.edu",
        studentDomain: 'learner.manipal.edu',
        professorDomain: 'manipal.edu'
    },
    {
        value: "IIT Madras", 
        label: "IIT Madras",
        url: "iitm.ac.in",
        studentDomain: 'smail.com',
        professorDomain: 'smail.com'
    }
];

var collegeValues = []
colleges.forEach(college => {
    collegeValues.push(college.value);
})

var degrees = [
    { value: "BTech.", label: "BTech." }, 
    { value: "MTech.", label: "MTech." }
]

var degreeValues = []
degrees.forEach(degree => {
    degreeValues.push(degree.value);
})

var branches = [
    { value: "CSE", label: "CSE" }, 
    { value: "Electronics", label: "Electronics" }
]

var branchValues = []
branches.forEach(branch => {
    branchValues.push(branch.value);
})

var yog = [
    { value: "2020", label: "2020" }, 
    { value: "2021", label: "2021" }
]

var yogValues= []
yog.forEach(y => {
    yogValues.push(y.value);
})

module.exports = {colleges, degrees, branches, yog, collegeValues, degreeValues, branchValues, yogValues};