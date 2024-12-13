import os

from datetime import datetime


def global_var(request):
    fe = False
    if request.user.is_authenticated and not request.user.is_superuser:
        if request.user.userprofile.role == "Field Engineer":
            fe = True
        return {"fe": fe}
    else:
        return {"fe": fe}


def custom_variables(request):

    app_version = "Version 24.10.02"
    publitio_key = "-----------------"
    publitio_secret = "-------------"
    receiver_email = "ranjith@senseweave.com"


    # current_host = 'http://127.0.0.1:8000'
    # current_host = "https://magnusksa.salesgrand.com"
    # current_host = "https://magnus.salesgrand.com"
    current_host = "http://magnustest.salesgrand.com"

    return {
        "app_version": app_version,
        "publitio_key": publitio_key,
        "publitio_secret": publitio_secret,
        "current_year_now": datetime.today().year,
        "receiver_email": receiver_email,
        "current_host": current_host,
    }
