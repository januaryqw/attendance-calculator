var Utility = {};

Utility.empsListRaw = '';
Utility.totalNumClass = 0;
Utility.empsList = {};
Utility.database = [];
Utility.classOrder = [];
Utility.publicHoliday = [];
Utility.workingWeekend = [];

Utility.updateClassOrder = function(){
    Utility.classOrder = update("classOrderList", "inputedClassOrderList", false);
};

Utility.updatePublicHolidayList = function(){
    Utility.publicHoliday = update("publicHolidayList", "inputedHolidayList", true);
};

Utility.updateWorkingWeekendList = function(){
    Utility.workingWeekend = update("workingWeekendList", "inputedWorkingWeekendList", true);
};


Utility.generateResult = function(){
    parseEmpListRaw(Utility.empsListRaw);
    // var table = document.getElementById('result');
    // table.innerHTML = '';
    // if (Utility.database.length < 1){
    //     alert('wrong format');
    //     return;
    // }
    // var result = calculate(Utility.database[0]);
    // for (var empId in result){
    //     var tableRow = document.createElement('TR');
    //     var tableCell = document.createElement('TD');
    //     var content = empId;
    //     tableCell.innerHTML  = content;
    //     tableRow.appendChild(tableCell);
    //     for (var prop in result[empId]){
    //         tableCell = document.createElement('TD');
    //         content = result[empId][prop];
    //         tableCell.innerHTML  = content;
    //         tableRow.appendChild(tableCell);
    //     }
    //     table.appendChild(tableRow);
    // }
}

function parseEmpListRaw(raw_empList){
    var temp = raw_empList.trim(' ').split('\n');
    var curClass = 0;
    for (var i in temp){
        var data= temp[i];
        if (Number.isInteger(parseInt(data))){
            curClass = parseInt(data);
        }else{
            Utility.empsList[data.trim()] = curClass;
        }
    }
}

function calculate(raw_data){

    var result = initializeResult(Utility.empsList);
    
    var checkin = "20:30-21:30"; //TODO: provide input for this
    var checkout = "04:00-09:00"; //TODO: provide input for this
    var holidays = Utility.publicHoliday;  //["10/01/16"]
    var rate = 10.0 //TODO: provide input for this
    var holiday_rate = 15.0  //TODO: provide input for this

    for (row in raw_data){
        var name = raw_data[row]['name'];
        var date = raw_data[row]['date'];
        var day = raw_data[row]['day'];
        
        if (!validateInputDate(date)){
            alert('wrong format');
            break;
        }
        if (!validateInputDay(day)){
            alert('wrong format');
            break;
        }
        day = convertDayToNumber(day);

        var checked_in = false;
        var checked_out = false;

        if (result.hasOwnProperty(name)){
            var rowContent = raw_data[row];
            for (var column in rowContent) {
                if (rowContent.hasOwnProperty(column)) {
                    if (Number.isInteger(parseInt(column))){
                        var time = rowContent[column].trim();
                        if (between(time, checkin)){
                            checked_in = true;
                        }
                        if (between(time, checkout)){
                            checked_out = true;
                        }
                    }
                }
            }
            var normal_day = result[id]['work_day'];
            var holiday = result[id]['holiday'];
            if (checked_in){
                if (day === 6 || day === 7 || holidays.includes(date)){
                    holiday += 0.5;
                }else{
                    normal_day += 0.5;
                }    
            }
            if (checked_out){
                var yyyymmdd =  parseDate(date);
                var pre_day = new Date(yyyymmdd[0], yyyymmdd[1]-1, yyyymmdd[2]);
                pre_day.setDate(pre_day.getDate() - 1);
                if (day === 7 || day === 1 || holidays.includes(pre_day)){
                    holiday += 0.5;
                }else{
                    normal_day += 0.5;
                }
            }
            result[id]['total_pay'] += holiday * holiday_rate + normal_day * rate;
            result[id]['work_day'] = normal_day;
            result[id]['holiday'] = holiday;
        }      
    }
    return result;
};

function initializeResult(empNameList){
    var resultList = {};
    for (var empName in empNameList) {
        resultList[empName] = {'work_day': 0, 'holiday': 0, 'total_pay': 0};
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
    for (var i in arr){
        if (arr[i] !== ""){
            arrCopy.push(arr[i]);
        }
    }
    return arrCopy;
}

function update(inputId, displayId, isDate){
    var input = document.getElementById(inputId).value;
    input.replace('，', ',');
    var storage = input.split(',');
    storage = clean(storage);
    var message = '';
    if (isDate){
        for (var s in storage){
            if (!validateInputDate(storage[s])){
                message = "wrong format"
            }
        }
    }
    if (message !== ''){
        document.getElementById(displayId).innerHTML = message;
    }else {
        document.getElementById(displayId).innerHTML = storage.join(', ');    
    }
    return storage;
}

function parseDate(date){
    if (date.split('-').length === 3){
        return date.split('-');    
    }else{
        return [0,0,0];
    }
}

function checkOnDuty(empName, date){
    var classNo = Utility.empsList[empName];
    var dayOfMonth = parseDate(date)[1];
    var numOfEmp = Utility.empsList.length;
    if (index === (dayOfMonth-1)/numOfEmp){
        return true;
    }else{
        return false;
    }
}

function validateInputDate(dateString){
    var date = dateString.replace('-', '-').split('-');
    if (date.length === 3){
        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        
        //year
        var year = parseInt(date[0]);
        if (year > 999 && year <= 9999){
            // Adjust for leap years
            if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)){
                monthLength[1] = 29;
            }
        }else{
            return false;
        }

        //month
        var month = parseInt(date[1]);
        if (month < 1 || month > 12){
            return false;
        }

        //day
        var day = parseInt(date[2]);
        if (day < 1 || day > monthLength[month-1]){
            return false;
        }
        return true;
    }else{
        return false;
    }
}

function validateInputDay(day){
    var validDay = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
    return validDay.includes(day);
}