from mfrc522 import SimpleMFRC522
import sys
from time import strftime, gmtime

#Reading
reader = SimpleMFRC522()

tagId, _tagData = reader.read() 
tagData = _tagData.replace(" ", "")

_currentTime = strftime("%H:%M")
currentTime = _currentTime.replace(" ", "")

print(str(tagId)+"+1") 
#print(str(tagId) + "+" + tagData + "+" + currentTime) 

sys.stdout.flush()