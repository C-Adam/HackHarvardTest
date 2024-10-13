const { strict } = require("assert");
const express = require("express");
const { writeFile, readFile, write } = require("fs");
var mongoose = require("mongoose");
const app = express();
const {MongoClient, ObjectId, Db} = require("mongodb")
const {spawn} = require("child_process");
const { time } = require("console");
const exp = require("constants");
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}));


const patientSchema = new mongoose.Schema({
    tagId: String,
    name: String,
    medications: Object
})

function StartConnection(){
    mongoose.connect("mongodb+srv://admin:z3WrHoZQkpWYORaz@cluster0.qeklbdv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {dbName: "MediTrack"});
    console.log("Connection Started")
    app.listen(5000, ()=>{
        console.log("Listening to port 5000")
    })
    
}

function CreateData(){
    const dataToPassIn = "Send this to python script"
    const python_process = spawn("python", ["./MedicationReader.py", JSON.stringify(dataToPassIn)]);

    python_process.stdout.on("data", (_data)=> {
        __data = _data.toString()
        data = __data.replace(/(\r\n|\n|\r)/gm, "");
        writeFile("TagData.txt", data, (err) =>{
            if (err) throw err 
        })
    });

    let scannedTagId = "_"
    let scannedTagData = "_";

    _readTagData = data.split("+")
    scannedTagId = _readTagData[0];
    scannedTagData = _readTagData[1];

    StartConnection();
    mongoose.connection.on("open", function(){
        console.log("db connected")
        const newPatient = mongoose.model("patients", patientSchema)
        newPatient.create({
            tagId: str(scannedTagData),
            name: "Patient Name",
            medications: {
                "Tylenol": {"RequiredTime": "0900", "TakenToday": 1},
                "Advil": {"RequiredTime": "1100", "TakenToday": 1},
                "DayQuil": {"RequiredTime": "1730", "TakenToday": 1},
                "NightQuil": {"RequiredTime": "1430", "TakenToday": 1},
                "Insulin": {"RequiredTime": "0800", "TakenToday": 1},
                "Aspirin": {"RequiredTime": "0800", "TakenToday": 1},
                "Robitussin": {"RequiredTime": "0800", "TakenToday": 1},
            },
        });
        setTimeout(function(){mongoose.disconnect()}, 1000);
    })
}

function UpdateData(data){
    let scannedTagId = "_"
    let scannedTagData = "_";
    
    _readTagData = data.split("+")
    scannedTagId = _readTagData[0];
    scannedTagData = _readTagData[1];

    console.log("scanned tag id:", scannedTagId)
    console.log("scanned tag data:", scannedTagData)

    StartConnection();

    mongoose.connection.on("open", function(){
        console.log("Connected To The Database");
        const existingPatient = mongoose.model("patients", patientSchema);
        const filter = {name: "Ray"};
        existingPatient.find(filter).lean().exec().then(result => {
            writeFile("PatientData.json", JSON.stringify(result), (err) => {if (err) throw err })
                existingPatient.findOneAndUpdate({filter}, {$set: {name: "Bob"}})
                readFile("./PatientData.json", "utf-8", function read(err, data){
                    if(err){throw(err)}else{
                        existingPatient.findOneAndUpdate({filter}, {$set: {name: "Bob"}})
                        let x = JSON.parse(data)
                        console.log(x)
                        let patientMedications = x[0].medications
                        var date = new Date();
                        let _currentTime = date.toTimeString()
                        currentTime = _currentTime.split(":")
                        finalCurrentTime = currentTime[0] + currentTime[1]
        
                        //numFinalCurrentTime = Number(finalCurrentTime);
                        numFinalCurrentTime = 1725;
        
                        let allReqTimes = [] //List: ["Medicine Name", Req Time]
        
                        for (const [key, value] of Object.entries(patientMedications)){
                            const {"RequiredTime": reqTime, "TakenToday": takenBool} = value
                            allReqTimes.push([key, reqTime])
                        }
        
                        let validNearTimes = [] //List [currentTime, reqTime, medicineName]
        
                        for (const arr of allReqTimes){
                            for (const reqTime of arr){
                                if (((Number(reqTime) + 10) >= numFinalCurrentTime) && (numFinalCurrentTime >= (Number(reqTime) - 10))){
                                    validNearTimes.push([numFinalCurrentTime, reqTime, arr[0]])
                                }
                            }
                        }
        
                        console.log(validNearTimes)
                        for (const arr of validNearTimes){
                            medicine = arr[2].concat(".TakenToday")
                        }

                        existingPatient.updateOne({name: "Ray"}, {$set: {name: "Bob"}});
                    }
                }  
            ) 
            
            existingPatient.findOneAndUpdate({filter}, {$set: {name: "Bob"}});
        });
    })
}

const dataToPassIn = "Send this to python script"

const python_process = spawn("python", ["./MedicationReader.py", JSON.stringify(dataToPassIn)]);

python_process.stdout.on("data", (_data)=> {
    __data = _data.toString()
    data = __data.replace(/(\r\n|\n|\r)/gm, "");
    writeFile("TagData.txt", data, (err) =>{
        if (err) throw err 
    })
    UpdateData(data);
});

//CreateData();





