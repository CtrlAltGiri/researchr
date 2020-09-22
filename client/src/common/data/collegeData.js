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
    { value: "Aerospace", label: "Aerospace" }, 
    { value: "Biological Sciences", label: "Biological Sciences" },
    { value: "Chemical", label: "Chemical" },
    { value: "Metallurgy", label: "Metallurgy"}, 
    { value: "Civil", label: "Civil" }, 
    { value: "Computer Science", label: "Computer Science" }, 
    { value: "Earth Sciences", label: "Earth Sciences" }, 
    { value: "Electrical / Electronics", label: "Electrical / Electronics" }, 
    { value: "Material Sciences", label: "Material Sciences" },
    { value: "Mathematics", label: "Mathematics" }, 
    { value: "Mechanical", label: "Mechanical" }, 
    { value: "Industrial Sciences", label: "Industrial Sciences" }, 
    { value: "Humanities", label: "Humanities" },  
    { value: "Physics", label: "Physics" },
    { value: "Ocean Engineering", label: "Ocean Engineering" },
    { value: "Theoretical Studies", label: "Theoretical Studies" },
    { value: "Other", label: "Other" }
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