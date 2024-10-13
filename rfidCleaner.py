import RPi.GPIO as GPIO

from mfrc522 import MFRC522
from mfrc522 import SimpleMFRC522

rfid = SimpleMFRC522()

print("Place tag to clean")
try:
    rfid.write("!Clean!")
    print("Successfuly written:")
    print("Card Id:", rfid.read()[0])
    print("Card Data:", rfid.read()[1])
finally:
    GPIO.cleanup()


