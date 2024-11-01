var colleges = [
    {
        value: "Manipal Institute of Technology", 
        label: "Manipal Institute of Technology",
        url: "manipal.edu",
        studentDomain: 'learner.manipal.edu',
        professorDomain: 'manipal.edu'
    }
];

var collegeValues = []
colleges.forEach(college => {
    collegeValues.push(college.value);
})

var degrees = [
    { value: "BTech.", label: "BTech." }, 
    { value: "MTech.", label: "MTech." },
    { value: "PhD.", label: "PhD"}
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
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" }, 
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" }
]

var yogValues= []
yog.forEach(y => {
    yogValues.push(y.value);
})

// For the landing page
var yos = [
    { value: "1", label: "1st Year" },
    { value: "2", label: "2nd Year" },
    { value: "3", label: "3rd Year" },
    { value: "4", label: "4th Year" },
    { value: "5", label: "5th Year" },
    { value: "not applicable", label: "Not Applicable" },
]

var yosValues= []
yos.forEach(y => {
    yosValues.push(y.value);
})

module.exports = {colleges, degrees, branches, yog, collegeValues, degreeValues, branchValues, yogValues, yos, yosValues};