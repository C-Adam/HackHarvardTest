const {spawn} = require("child_process");
const { writeFile } = require("fs");

const dataToPassIn = "Send this to python script"

const python_process = spawn("python", ["./MedicationReader.py", JSON.stringify(dataToPassIn)]);

python_process.stdout.on("data", (data)=> {
    console.log("Data recieved from python script:", data.toString());
    writeFile("TagData.txt", data.toString(), (err) =>{
        if (err) throw err 
    })
});

