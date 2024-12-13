

from datetime import datetime 
import os


def custom_variables(request):
    # Define your custom variables here
    app_version= "Version 24.01"
    publitio_key=os.getenv('PUBLITIO_KEY', '')
    publitio_secret= os.getenv('PUBLITIO_SECRET', '')
    

    return {
        "app_version":app_version,
        "publitio_key":publitio_key,
        "publitio_secret":publitio_secret,
        "current_year":datetime.today().year
    }