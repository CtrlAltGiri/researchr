function retDayOptions() {
    return [
        { value: "01", label: "1" },
        { value: "02", label: "2" },
        { value: "03", label: "3" },
        { value: "04", label: "4" },
        { value: "05", label: "5" },
        { value: "06", label: "6" },
        { value: "07", label: "7" },
        { value: "08", label: "8" },
        { value: "09", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
        { value: "13", label: "13" },
        { value: "14", label: "14" },
        { value: "15", label: "15" },
        { value: "16", label: "16" },
        { value: "17", label: "17" },
        { value: "18", label: "18" },
        { value: "19", label: "19" },
        { value: "20", label: "20" },
        { value: "21", label: "21" },
        { value: "22", label: "22" },
        { value: "23", label: "23" },
        { value: "24", label: "24" },
        { value: "25", label: "25" },
        { value: "26", label: "26" },
        { value: "27", label: "27" },
        { value: "28", label: "28" },
        { value: "29", label: "29" },
        { value: "30", label: "30" },
        { value: "31", label: "31" }
    ]

}

function retMonthOptions() {
    return [
        { value: "01", label: "January" },
        { value: "02", label: "February" },
        { value: "03", label: "March" },
        { value: "04", label: "April" },
        { value: "05", label: "May" },
        { value: "06", label: "June" },
        { value: "07", label: "July" },
        { value: "08", label: "August" },
        { value: "09", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" }
    ]
}

function retYearOptions(onlyFuture) {

    let last10;
    if(!onlyFuture)
        last10 = (new Date()).getFullYear() - 10;
    else
        last10 = (new Date()).getFullYear();

    const len = onlyFuture ? 2 : 10;
    const yearOptions = [];
    for (let i = 0; i <= len; i++) {
        yearOptions.push({ value: last10 + i, label: (last10 + i).toString() })
    }

    return yearOptions
}

export {retDayOptions, retMonthOptions, retYearOptions};