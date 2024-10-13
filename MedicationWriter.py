import RPi.GPIO as GPIO

from mfrc522 import MFRC522
from mfrc522 import SimpleMFRC522

rfid = SimpleMFRC522()

print(rfid.read())

print("Tap your card")
tagId, _currentData = rfid.read()
currentData = _currentData.replace(" ", "")

print(currentData)

inputID = input("Input medicine ID:")

tempMedicineID = None
finalMedicineID = None

if currentData == "!Clean!":
    finalMedicineID = inputID
else:
    tempMedicineID = currentData + "/" + inputID
    finalMedicineID = tempMedicineID.replace(" ", "")

print("Place tag to write the medicine to")
try:
    rfid.write(finalMedicineID)
    print("Successfuly written:")
    print("Card Id:", rfid.read()[0])
    print("Card Data:", rfid.read()[1])
except:
    print("Error writing to card")
finally:
    GPIO.cleanup()

