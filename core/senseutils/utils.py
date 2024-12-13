import sys
import os
import requests
from core.models import UniqueIdGenerator
from publitio import PublitioAPI
from core.globalvar import custom_variables
from core.models import WhatsappStatus,Country
from datetime import datetime
import json
import base64
import qrcode
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()
##############################################
# publitio_file_upload
# This function upload files to Publitio
##############################################
def publitio_file_upload(bytedata=None,folder_id=None,title=None,description=None):
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
        response = {'error': json_resp}
    return response




##############################################
# generate_unique_id
# This function generates unique id
##############################################
def generate_unique_id(modal_name,string_name):
    id_obj = UniqueIdGenerator.objects.filter(model=modal_name).first()
    if id_obj:
        unique_id = f"{id_obj.prefix}{id_obj.uniqueid+1}"
        id_obj.uniqueid=id_obj.uniqueid+1
        id_obj.save()
    else:
        id_obj =UniqueIdGenerator()
        id_obj.model =modal_name
        id_obj.prefix=string_name
        id_obj.uniqueid=1
        id_obj.save()
        unique_id = f"{string_name}{1}"
    return unique_id



##############################################
# whatsapp
# This function sends whatsapp messages 
##############################################


def func_send_whatsappp_test_message(accesstoken,recipient_number,url):
    headers = {
                'Authorization': f'Bearer {accesstoken}',
                'Content-Type': 'application/json',
            }

    data = {
            'messaging_product': "whatsapp",
            'to': recipient_number,
            'type': "template",
            'template': '{ "name": "hello_world", "language": { "code":"en_US" }}',
        }
    response = requests.post(url, headers=headers, data=data)
    return response




def upload_document(access_token, phone_number_id,byte_code):
    url = f"https://graph.facebook.com/v17.0/{phone_number_id}/media"
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
   
    files = {
        'file': ('document.pdf', byte_code, 'application/pdf')
    }
    data = {
        'messaging_product': 'whatsapp',
        'type': 'document'
    }
    response = requests.post(url, headers=headers, data=data, files=files)
    
    if response.status_code == 200:
        return response.json()['id']
    else:
        raise Exception(f"Failed to upload document: {response.text}")


def func_send_whatsapp_pdf_service(access_token, phone_number_id, recipient, document_id,fullname,device,sr_number,template,pdf_name):
    

    url = f"https://graph.facebook.com/v17.0/{phone_number_id}/messages"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "to": recipient,
        "type": "template",
        "template": {
            "name": template,
            "language": {
                "code": "en"
            },
            "components": [
                {
                    "type": "header",
                    "parameters": [
                        {
                            "type": "document",
                            "document": {
                                "id": document_id,
                                "filename": pdf_name
                            }
                        }
                    ]
                },
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": fullname
                        },
                        {
                            "type": "text",
                            "text": device
                        },
                        {
                            "type": "text",
                            "text": sr_number
                                    }
                                ]
                            }
                        ]
                    }
                }
                
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    return response.json()



def func_send_whatsapp_pdf_service_arabic(access_token, phone_number_id, recipient, document_id,fullname,device,sr_number,template,pdf_name):
    

    url = f"https://graph.facebook.com/v17.0/{phone_number_id}/messages"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "to": recipient,
        "type": "template",
        "template": {
            "name": template,
            "language": {
                "code": "ar"
            },
            "components": [
                {
                    "type": "header",
                    "parameters": [
                        {
                            "type": "document",
                            "document": {
                                "id": document_id,
                                "filename": pdf_name
                            }
                        }
                    ]
                },
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": fullname
                        },
                        {
                            "type": "text",
                            "text": sr_number
                                    }
                                ]
                            }
                        ]
                    }
                }
                
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    return response.json()




def func_send_whatsapp_service_booking_arabic(access_token, phone_number_id, recipient,fullname,template,pdf_name):
    

    url = f"https://graph.facebook.com/v17.0/{phone_number_id}/messages"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "to": recipient,
        "type": "template",
        "template": {
            "name": template,
            "language": {
                "code": "ar"
            },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": fullname
                        },
                                ]
                            }
                        ]
                    }
                }
                
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    return response.json()



def func_send_whatsapp_pdf_sales(access_token, phone_number_id, recipient, document_id,fullname,template,pdf_name):
    

    url = f"https://graph.facebook.com/v17.0/{phone_number_id}/messages"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "to": recipient,
        "type": "template",
        "template": {
            "name": template,
            "language": {
                "code": "en"
            },
            "components": [
                {
                    "type": "header",
                    "parameters": [
                        {
                            "type": "document",
                            "document": {
                                "id": document_id,
                                "filename": pdf_name
                            }
                        }
                    ]
                },
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": fullname
                        }
                       
                                ]
                            }
                        ]
                    }
                }
                
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    return response.json()




def whatsapp(number=None,byte_code=None,message_type=None,fullname=None,sr_number=None,device=None):

    logFile = 'sendwhatsapp.log'
    logFileHandle = open(logFile, 'a')

    status = WhatsappStatus.objects.all().first().active

    if status == True:

        country_obj = Country.objects.filter(default=True).first()
        calling_code = country_obj.calling_code
        if "+" in calling_code:
            calling_code = calling_code.replace("+","")


        digit = country_obj.phone_number_digit

        if len(str(number)) >= digit:
            number = str(number)[-digit:]
            number = str(calling_code) + number
            logFileHandle.write(f"\nTime {datetime.now()}, ")

            
            logFileHandle.write("Triggering Whatsapp Message to %s, " % number)

            # accesstoken = os.environ.get('WHATSAPP_PERMENENT_TOKEN')
            url = "https://graph.facebook.com/v20.0/391557664043176/messages"
            # phone_number_id = os.environ.get('WHATSAPP_PHONE_NUMBER_ID')
            WHATSAPP_PERMENENT_TOKEN="EAACakOnalMUBOZCZBSj2Oq2RD3YDwtQ7m3ddVL6rWXqaR8K7qxBPMY4L2HMNxSjiJMOejNt8fPm5NjscSgkp9zyRph5QydJb3DjzZA9FUOtbotZBLetItKdQqTbQpbqQzK8FmzU7fDsX1VIZA7OYQKNW9eTJmsFYLMZAZCO3Bf7w7tDEl153sZAS5696HGDEw3ZAyaAZDZD"
            WHATSAPP_PHONE_NUMBER_ID="391557664043176"
            accesstoken = WHATSAPP_PERMENENT_TOKEN
            phone_number_id = WHATSAPP_PHONE_NUMBER_ID
            
            if message_type == "service_jobsheet":
                logFileHandle.write(f"Message type {message_type},")
                document_id = upload_document(accesstoken, phone_number_id,byte_code)
                response =func_send_whatsapp_pdf_service_arabic(access_token=accesstoken,phone_number_id=phone_number_id,recipient=number,document_id=document_id,fullname=fullname,device=device,sr_number=sr_number,template="service_entry_arabic",pdf_name="jobsheet.pdf")
            elif message_type == 'service_invoice':
                logFileHandle.write(f"Message type {message_type},")
                document_id = upload_document(accesstoken, phone_number_id,byte_code)
                response =func_send_whatsapp_pdf_service(access_token=accesstoken,phone_number_id=phone_number_id,recipient=number,document_id=document_id,fullname=fullname,device=device,sr_number=sr_number,template="repair_completed_pdf",pdf_name="invoice.pdf")
            elif message_type == 'sale_invoice':
                logFileHandle.write(f"Message type {message_type},")
                document_id = upload_document(accesstoken, phone_number_id,byte_code)
                response =func_send_whatsapp_pdf_sales(access_token=accesstoken,phone_number_id=phone_number_id,recipient=number,document_id=document_id,fullname=fullname,template="sales_invoice",pdf_name="invoice.pdf")
            elif message_type == 'service_booking':
                logFileHandle.write(f"Message type {message_type},")
                document_id =""
                response =func_send_whatsapp_service_booking_arabic(access_token=accesstoken,phone_number_id=phone_number_id,recipient=number,fullname=fullname,template="service_booking_arabic",pdf_name="service_booking.pdf")
            logFileHandle.write(f"Document id {document_id},")
            logFileHandle.write(f"Response {str(response)}")
            logFileHandle.close()
    else:
        logFileHandle.write(f"\nTime {datetime.now()}, ")
        logFileHandle.write (f"Whatsapp is not Active!")
        logFileHandle.close()

    return 0 # Always return exit status 0



##############################################
# sendEmail
# This function sends email notification 
##############################################
def sendEmail(emailids, subject, content):
    os.system(f"echo {content} | mail -s {subject} {emailids}")
    return 0




##############################################
# func_generate_invoice_qrcode
# This function generate qr code for all invoices
##############################################


def encode_tlv(tag, value):
    tag = tag.to_bytes(1, 'big')
    length = len(value).to_bytes(1, 'big')
    return tag + length + value.encode('utf-8')



def func_generate_invoice_qrcode(total_amount,vat_amount,invoicedate):

    # Data
    seller_name = "EYE LON AL-DAWLIYA EST"
    vat_number = "300115306700003"
    try:
        invoice_date = invoicedate.strftime("%Y-%m-%dT%H:%M:%SZ")
    except:
        invoice_date = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    total_amount = str(total_amount)
    vat_amount = str(vat_amount)

    # Encoding the fields
    tlv_data = b''.join([
        encode_tlv(1, seller_name),
        encode_tlv(2, vat_number),
        encode_tlv(3, invoice_date),
        encode_tlv(4, total_amount),
        encode_tlv(5, vat_amount),
    ])

    # Converting to base64
    base64_data = base64.b64encode(tlv_data).decode('utf-8')

    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(base64_data)
    qr.make(fit=True)

    # Convert QR code to image and then to base64 string
    img = qr.make_image(fill='black', back_color='white')
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode("utf-8")

    # The base64 string to be embedded in HTML
    img_html = f"data:image/png;base64,{img_str}"
    
    return img_html