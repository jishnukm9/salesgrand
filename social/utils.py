from .globalvars import custom_variables
from publitio import PublitioAPI
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def publitio_image_upload(bytedata=None,folder_id=None,title=None,description=None):
    context = custom_variables(None)
    publitio_api = PublitioAPI(key=context["publitio_key"], secret=context["publitio_secret"])
    if description:
        json_resp=publitio_api.create_file(file=bytedata,title=title,folder=folder_id,description=description)
    else:
        json_resp=publitio_api.create_file(file=bytedata,title=title,folder=folder_id)
    
    try:
        if json_resp['success'] == True:
            if json_resp['extension'] == 'jpg':
                response = {'file_url': json_resp['url_preview']}
            elif json_resp['extension'] == 'png':
                response = {'file_url': json_resp['url_preview']}
            else:
                response ={'file_url':json_resp['url_thumbnail']}
        if json_resp['success'] == False:
            response ={'file_url':"File upload is not successfull. Please try again"}
    except:
        response = {'file_url':"File upload is not successfull. Please try again"}
    return response


def publitio_video_upload(bytedata=None, folder_id=None, title=None, description=None):
    context = custom_variables(None)
    publitio_api = PublitioAPI(key=context["publitio_key"], secret=context["publitio_secret"])
    if description:
        json_resp = publitio_api.create_file(file=bytedata, title=title, folder=folder_id, description=description)
    else:
        json_resp = publitio_api.create_file(file=bytedata, title=title, folder=folder_id)

    try:
        if json_resp['success']:
            if 'video' in json_resp['type']:
                response = {'file_url': json_resp['url_preview']}
            else:
                response = {'file_url': json_resp['url_thumbnail']}
        else:
            response = {'file_url': "File upload is not successful. Please try again"}
    except:
        response = {'file_url':"File upload is not successfull. Please try again"}
    return response






def sendnotification(message,userid):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
    userid,
    {
        'type': 'notification_message',
        'message': message
    }
    )
    resp={
        "Response":"success"
    }
    return resp