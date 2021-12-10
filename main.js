// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCrtrm0XzGDeGgGd8AD6XFsLVct680BwTw",
    authDomain: "d3atemperature-fd015.firebaseapp.com",
    databaseURL:"https://d3atemperature-fd015-default-rtdb.firebaseio.com",
    projectId: "d3atemperature-fd015",
    storageBucket: "d3atemperature-fd015.appspot.com",
    messagingSenderId: "862536099803",
    appId: "1:862536099803:web:8ab3695e2287b1c25a29fe",
    measurementId: "G-B9J128R88S"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.database().goOnline();
var database = firebase.database()
var time = new Date()
var m = time.getMonth()+1
var d = time.getDate()
if(m < 10){m = "0" + (time.getMonth()+1)}
if(d < 10){d = "0" + time.getDate()}
var Nowtime = "" + time.getFullYear() + m + d

//上傳資料
function uploadData(){
    if(document.getElementById('div1').style.display == "block"){displayTable()}
    var dateVal = document.getElementById('date').value
    var userId = document.getElementById('userId').value
    var temperature = document.getElementById('temperature').value
    var date = Nowtime
    if(userId.length == 1){userId = "0" + userId}
    if(userId == "" || temperature == ""){
        alert("請輸入座號及今日體溫!!!")
    }
    else{
        if(checkDate(dateVal) != true){
            alert("請輸入符合規則的日期")
        }
        else if(userId >= 0 && userId <= 35 && temperature > 30 && temperature < 45){
            if(dateVal != ''){date = dateVal}
            database.ref('DetailedRecords/' + date + '/' + userId ).once("value").then(function(snapshot){
                var val = snapshot.val();
                if(val == null){
                    if(userId >= 0 && userId <= 35 && temperature > 30 && temperature < 45){
                        if(temperature > 37.5){
                            database.ref('DetailedRecords/' + date + '/' + userId).set({
                                Temperature : temperature ,
                                Warning : 1 ,
                                Date : date
                                })
                            database.ref('Records/' + userId).child(date).set(temperature)
                        }
                        else{
                            database.ref('DetailedRecords/' + date + '/' + userId).set({
                                Temperature : temperature ,
                                Warning : 0 ,
                                Date : date
                                })
                            database.ref('Records/' + userId).child(date).set(temperature)
                        }
                        alert('體溫上傳成功')
                        document.getElementById('temperature').value = ''
                    }
                }
                else{
                    alert('體溫已回報完畢，不需要重複上傳')
                    document.getElementById('temperature').value = ''
                }
            })
        }
        else{
            alert('座號或體溫輸入有誤')
            document.getElementById('userId').value = ''
            document.getElementById('temperature').value = ''
        }
    }
}

//檢查日期
function checkDate(dateP){
    if(dateP.length == 0){
        return true
    }
    else if(dateP.length == 8){
        if(Number(dateP.slice(0,4)) > 2020 && Number(dateP.slice(4,6)) <= 12 && Number(dateP.slice(4,6)) > 0 && Number(dateP.slice(6,8)) <= 31 && Number(dateP.slice(6,8)) > 0){
            return true
        }
        else{
            return false
        }
    }
    else{
        return false
    }
}

//顯示表格
function displayTable(){
    if(document.getElementById('div1').style.display == "block"){
        document.getElementById('div1').style.display = "none"
    }
    else{
        document.getElementById('div1').style.display = "block"
    }
}

//獲取資料庫中的個人的每日體溫紀錄
function getRecords(){
    cleanTable()
    var dateVal = document.getElementById('date').value
    var userId = document.getElementById('userId').value
    if(userId >= 0 && userId <= 35 && userId != ''){
        if(userId.length == 1){userId = "0" + userId}
        if(document.getElementById('div1').style.display != "block"){displayTable()}
        if(dateVal != ''){
            database.ref('DetailedRecords/' + dateVal + '/' + userId).once("value").then(function(snapshot){
                var val = snapshot.val();
                if(val != null){
                    createTable(val.Date,val.Temperature)
                }
            })
        }
        else{
            for(i = 0; i < 5; i++){
                var dateTime = new Date()
                dateTime = dateTime.setDate(dateTime.getDate()-i)
                dateTime = new Date(dateTime)
                var tm = dateTime.getMonth()+1
                var td = dateTime.getDate()
                if(tm < 10){tm = "0" + (dateTime.getMonth()+1)}
                if(td < 10){td = "0" + dateTime.getDate()}
                var dateString = "" + dateTime.getFullYear() + tm + td
                database.ref('DetailedRecords/' + dateString + '/' + userId).once("value").then(function(snapshot){
                    var val = snapshot.val();
                    if(val != null){
                        createTable(val.Date,val.Temperature)
                    }
                })
            }
        }
    }
    else{
        if(document.getElementById('div1').style.display == "block"){displayTable()}
        alert('請先輸入正常的座號，才可以查看紀錄')
        document.getElementById('userId').value = ''
        document.getElementById('temperature').value = ''
    }
}

//創建表格
function createTable(date,temperature){
    var td1 = document.createElement('td')
    td1.appendChild(document.createTextNode(date));
    var td2 = document.createElement('td')
    td2.appendChild(document.createTextNode(temperature));
    var tr1 = document.createElement('tr')
    tr1.appendChild(td1)
    tr1.appendChild(td2)
    var table = document.getElementsByTagName('table')[0]
    table.appendChild(tr1)
}

//清空表格
function cleanTable(){
    var table = document.getElementsByTagName('table')[0]
    while(table.rows.length > 1){
        table.deleteRow(1)
    }
}