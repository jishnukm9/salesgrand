#!/Users/ranjith/.pyenv/shims/python

import sys
import os
import requests

logFile = 'sendwhatsapp.log'

def whatsapp(number,id):
   
    logFileHandle = open(logFile, 'a')
   
    if not number:
        print ("Missing phone number!")
        logFileHandle.write ("Missing Phone number!")
        sys.exit(1)
    
    logFileHandle.write("Triggering Whatsapp Message to %s\n" % number)

    headers = {
        'Authorization': 'Bearer EAACakOnalMUBAAzJIGwAbsdXfZAv1r7hIx5wtoJ0xKJBCJm1otdJGS10ZAjXASM3rkhP6WTbx4CzUmlVI3ZBBQ92RirHmPFinSDZALwb3QqFklgc3SbJ7Qi6KViT4axJkDUQ8nZCIFQVaZA3RDO59OtZAZBNDP9lUDWGOXUrGkc9F02xylWWrae3GkWblj48siy1cLLzc4EupHFR1egFZCXVh',
        'Content-Type': 'application/json',
    }

    data = {
        'messaging_product': "whatsapp",
        'to': number,
        'type': "template",
        'template': '{ "name": "hello_world", "language": { "code":"en_US" }}',
    }
    response = requests.post('https://graph.facebook.com/v17.0/107125565751253/messages', headers=headers, data=data)
    logFileHandle.write(str(response))
    logFileHandle.close()
    return 0 # Always return exit status 0
    
