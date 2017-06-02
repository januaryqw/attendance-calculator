var Utility = {};

Utility.empsList = [];
Utility.publicHoliday = [];
Utility.workingWeekend = [];

Utility.updateEmpsList = function(){
    update(Utility.empsList, "empsList", "inputedEmpsList");
};

Utility.updatePublicHolidayList = function(){
    update(Utility.publicHoliday, "publicHolidayList", "inputedHolidayList");
};

Utility.updateWorkingWeekendList = function(){
    update(Utility.workingWeekend, "workingWeekendList", "inputedWorkingWeekendList");
};

// only for one class
Utility.calculate = function(raw_data){
    var numOfEmp = Utility.empsList.length; // to check if the day is really the day he/she is on duty.
    var emps = Utility.empsList;
    var result = initializeResult(Utility.empsList);
    
    var checkin = "20:30-21:30";
    var checkout = "04:00-09:00";
    var holidays = ["10/01/16"];
    
    var rate = 10.0
    var holiday_rate = 15.0

    for (row in raw_data){
        var id = raw_data[row]['EMP No.'];
        var date = raw_data[row]['DATE'];
        var day = raw_data[row]['DAY'];
        day = convertDayToNumber(day);

        var checked_in = false;
        var checked_out = false;

        for (var column in row) {
            if (row.hasOwnProperty(column) && Number.isInteger(column)) {
                var time = row.column.trim();
                if (between(time, checkin)){
                    checked_in = true;
                }
                if (between(time, checkout)){
                    checked_out = true;
                }
            }
        }

        if (result.hasOwnProperty(id)){
            var normal_day = result[id]['work_day'];
            var holiday = result[id]['holiday'];
            var total_day = result[id]['total_pay'];
            if (checked_in){
                if (day === 6 || day === 7 || holidays.contains(date)){
                    holiday += 0.5;
                }else{
                    normal_day += 0.5;
                }    
            }
            if (checked_out){

            }
        }

        // emps[id] = emps.get(id, 0) + \
        //            (holiday_rate if day == 6 or day == 7 or date in holidays else rate) * (0.5 if checked_in else 0)
        // pre_day = datetime.datetime.strftime(datetime.datetime.strptime("10/02/16", "%m/%d/%y") - datetime.timedelta(
        //     days=1), "%m/%d/%y")
        // emps[id] = emps.get(id, 0) + \
        //            (holiday_rate if day == 7 or day == 1 or pre_day in holidays else rate) * (0.5 if checked_out else 0)
    }
};

function initializeResult(empIdList){
    var resultList = {};
    for ( i in empIdList ) {
        resultList[empIdList[i]] = {'work_day': [], 'holiday': [], 'total_pay': 0};
    }
    return resultList;
}

function between(time, interval){
    return time !== "" && interval.split("-")[0] <= time && time <= interval.split("-")[1];
}

function convertDayToNumber(day){
    switch(day) {
        case '星期一':
            return 1;
            break;
        case '星期二':
            return 2;
            break;
        case '星期三':
            return 3;
            break;
        case '星期四':
            return 4;
            break;
        case '星期五':
            return 5;
            break;
        case '星期六':
            return 6;
            break;
        case '星期日':
            return 7;
            break;
        default:
            return 0;
    }
}
function clean(arr){
    var arrCopy = [];
    for (i in arr){
        if (arr[i] !== ""){
            arrCopy.push(arr[i]);
        }
    }
    return arrCopy;
}

function update(storage, inputId, displayId){
    var input = document.getElementById(inputId).value;
    input.replace('，', ',');
    storage = input.split(',');
    storage = clean(storage);
    document.getElementById(displayId).innerHTML = storage.join(', ');
}

function getDayOfMonth(date){
    if (date.split('/').length === 3){
        return data.split('/')[1];    
    }else{
        return 0;
    }
}

function checkOnDuty(empId, date){
    var index = Utility.empsList.indexOf(empId);
}