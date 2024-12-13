from rest_framework.response import Response
from rest_framework.decorators import api_view,authentication_classes,permission_classes,parser_classes
from .serializers import *
from django.contrib.auth import logout 
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from core.models import Service
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .tokens import create_jwt_pair_for_user
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.parsers import MultiPartParser
from urllib.request import urlopen
from core.models import *
# from core.views import publitio_file_upload
from core.accountsutils import coa,addaccounts
from datetime import datetime,timedelta
from core.senseutils.utils import generate_unique_id,whatsapp
from django.db.models import F,Q
from django.core.files.storage import FileSystemStorage
from django.core.files.base import ContentFile
from core.globalvar import custom_variables
import pdfkit
from pathlib import Path
from django.template.loader import get_template
from io import BytesIO
from barcode import EAN13
import base64
from PIL import Image,ImageDraw, ImageFont
import barcode
from barcode.writer import ImageWriter
import os

BASE_DIR = Path(__file__).resolve().parent.parent
GLOBAL_VARIABLES=custom_variables(None)


# @api_view(['POST'])
# def signup(request):
#     serializer = UserSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         user = User.objects.get(username=request.data['username'])
#         user.set_password(request.data['password'])
#         user.save()
#         token = Token.objects.create(user=user)
#         return Response({'token':token[0].key,'user':serializer.data})
#     return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def login(request):
    user = User.objects.filter(username=request.data['username']).first()
    if not user:
        return Response({"Response":"Not found."},status=status.HTTP_404_NOT_FOUND)
    if not user.check_password(request.data['password']):
        return Response({"Response":"Not found."},status=status.HTTP_404_NOT_FOUND)
    token = create_jwt_pair_for_user(user)
    serializer = UserSerializer(instance=user)
    data={}
    data['id']=user.id
    data['username']=user.username
    data['email']=user.email
    data['branch'] = user.userprofile.branch.name
    data['branch_id'] = user.userprofile.branch.id
    data['role']=user.userprofile.role
    return Response({"Response":"Logged in successfully",'Token':token,"User":data},status=status.HTTP_200_OK)



@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        token_str = request.data.get('refresh')
        if not token_str:
            return Response({"error": "No refresh token provided"}, status=status.HTTP_400_BAD_REQUEST)
        token = RefreshToken(token_str)
        token.blacklist()
        return Response({"response": "User logged out successfully"}, status=status.HTTP_200_OK)
    except TokenError as e:
        return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({"error": "An error occurred during logout"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response({"Response":f'Passed for {request.user.username}'},status=status.HTTP_200_OK)



@api_view(['POST'])
def add_service_booking(request):

    try:
        name = request.data['name']
    except:
        name = None
    try:
        phone = request.data['phone']
    except:
        phone = None

    try:
        city = request.data['city']
    except:
        city = None

    try:
        product = request.data['product']
    except:
        product = None

    try:
        brand = request.data['brand']
    except:
        brand = None

    try:
        email = request.data['email']
    except:
        email = None
    try:
        issue = request.data['issue']
    except:
        issue = None

    try:
        address = request.data['address']
    except:
        address = None

    try:
        latitude = request.data['latitude']
    except:
        latitude = None

    try:
        longitude = request.data['longitude']
    except:
        longitude = None

    try:
        modal = request.data['modal']
    except:
        modal = None

    if not name:
        return Response({"Response":"Entry failed, name is required!"},status=status.HTTP_400_BAD_REQUEST)
    if not phone:
        return Response({"Response":"Entry failed, phone number is required!"},status=status.HTTP_400_BAD_REQUEST)

    if not brand:
        return Response({"Response":"Entry failed, brand is required!"},status=status.HTTP_400_BAD_REQUEST)
    if not issue:
        return Response({"Response":"Entry failed, issue is required!"},status=status.HTTP_400_BAD_REQUEST)
    if not product:
        return Response({"Response":"Entry failed, product is required!"},status=status.HTTP_400_BAD_REQUEST)
    
    booking_obj = CustomerBookingRepair()
    booking_obj.name=name
    booking_obj.phone=phone
    booking_obj.city=city
    booking_obj.brand=brand
    booking_obj.product=product
    booking_obj.issue=issue
    booking_obj.email=email
    booking_obj.status="NotVerified"
    booking_obj.address = address
    booking_obj.latitude = latitude
    booking_obj.longitude =longitude
    booking_obj.modal = modal
    booking_obj.save()

    try:
        whatsapp(number=phone,message_type='service_booking',fullname=name)
    except:
        pass


    return Response({"Response":"Service booking saved successfully"},status=status.HTTP_201_CREATED)


@api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
def get_products(request):
    try:
        
        products_obj = ServiceProduct.objects.all().order_by("-pk")
        products=[]
        for item in products_obj:
            data={}
            data['product']=item.name
            data['id']=item.id
            data['code'] = item.code
            data['arabic_name'] = item.arabic_name
            products.append(data)
    except:
        return Response({"Response":"Unable to get products"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":products},status=status.HTTP_200_OK,content_type='application/json; charset=utf-8')



@api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
def get_brands(request):
    try:
        # try:
        product_id = request.data['id']
        # except:
        #     product_id = None
        brands_obj = PhoneBrand.objects.filter(product__id=int(product_id)).order_by("-pk")
        brands=[]
        for item in brands_obj:
            data={}
            data['brand']=item.name
            data['id']=item.id
            data['arabic_name'] = item.arabic_name
            brands.append(data)
    except:
        return Response({"Response":"Unable to get brands"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":brands},status=status.HTTP_200_OK,content_type='application/json; charset=utf-8')


@api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
def get_modals(request):
    try:
        
        brandid=request.data['brandid']
    
        try:
            brand=PhoneBrand.objects.filter(id=int(brandid)).first()
        except:
            return Response({"Response":"Unable to get modals"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if brand:
            modals = PhoneModal.objects.filter(brand=brand)
        else:
            return Response({"Response":"Unable to get modals"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        resp=[]
        for item in modals:
            data={}
            data["modal"]=item.name
            data["id"]=item.id
            data["code"]=item.code
            data['arabic_name'] = item.arabic_name
            resp.append(data)
    except:
        return Response({"Response":"Unable to get modals"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":resp},status=status.HTTP_200_OK,content_type='application/json; charset=utf-8')



@api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
def get_service_issues(request):
    try:
        service_issues = ServiceIssues.objects.all().order_by("-pk")
        resp=[]
        for item in service_issues:
            data={}
            data['issue']=item.name
            data['id']=item.id
            data['arabic_name']=item.arabic_name
            resp.append(data)
        
    except:
        return Response({"Response":"Unable to get service issues"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":resp},status=status.HTTP_200_OK,content_type='application/json; charset=utf-8')



@api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
def get_service(request):

    servicerefnumber = request.data['servicerefnumber']
    service = Service.objects.filter(servicerefnumber=servicerefnumber).first()
    if not service:
        return Response({"Response":"Not found."},status=status.HTTP_404_NOT_FOUND)
    else:
        item=service
        data={}
        data['id']=item.id
        data['ref_number']=item.servicerefnumber
        data['customer_id']=item.customerid
        data['firstname']=item.firstname
        data['lastname']=item.lastname
        data['address']=item.address
        data['phone']=item.phone
        data['memodate']=item.memodate
        data['expecteddate']=item.expecteddate
        data['product']=item.product
        data['brand']=item.brand
        data['model']=item.model
        data['imei']=item.imei
        if item.booking:
            data['booking_id']=item.booking.bookingid
        data['servicecharge']=item.servicecharge
        data['problem']=item.problem
        data['remarks']=item.remarks
        data['status']=item.status
        data['warrenty']=item.warrenty
        data['totalamount']=item.totalamount
        data['totaltax'] = item.totaltax
        data['discount'] = item.discount






        data['finalamount'] = item.finalamount



        
        data['amountrecieved'] = item.amountrecieved
        data['duebalance'] = item.duebalance
        data['branch'] = item.branch.name
        data['createddate'] = item.createddate
        data['modifieddate'] = item.modifieddate
        data['accessories'] = item.accessories
        data['paymentmode'] = item.paymentmode
        data['customertype'] = item.customertype
        
        try:
            data['image1'] =  GLOBAL_VARIABLES['current_host'] + item.image1.url
        except:
            data['image1'] = None

        try:
            data['image2'] =  GLOBAL_VARIABLES['current_host'] + item.image2.url
        except:
            data['image2'] = None

        try:
            data['image3'] =  GLOBAL_VARIABLES['current_host'] + item.image3.url
        except:
            data['image3'] = None
       
        try:
            data['image4'] =  GLOBAL_VARIABLES['current_host'] + item.image4.url
        except:
            data['image4'] = None

        try:
            data['image5'] =  GLOBAL_VARIABLES['current_host'] + item.image5.url
        except:
            data['image5'] = None

        try:
            data['image6'] =  GLOBAL_VARIABLES['current_host'] + item.image6.url
        except:
            data['image6'] = None
    
        if item.technician:
            data['technician'] = item.technician.username
        data['rack_no'] = item.rack_no
        data['shedule_call'] = item.shedule_call
        data['reject_code'] = item.reject_code
        data['technician_remark'] = item.technician_remark
        data['qcok'] = item.qcok
        data['qcnotok'] = item.qcnotok
        data['qcremark'] = item.qcremark
        if item.qc:
            data['qc'] = item.qc.username
        if item.cnp:
            data['cnp'] = item.cnp.username
        if item.frontdesk:
            data['frontdesk'] = item.frontdesk.username
        if item.entry_by:
            data['entry_by'] = item.entry_by.username
        data['entry_type'] = item.entry_type
        data['entry_validated'] = item.entry_validated
        data['barcode_number'] = item.barcode_number
        data['servicetax'] = item.servicetax
        data['pattern'] = item.pattern
       
    
    return Response({"Response":data},status=status.HTTP_200_OK,content_type='application/json; charset=utf-8')






@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_booking_list(request):
    try:
        current_user =request.user
        if current_user.userprofile.role == 'Field Engineer':
            booking_obj = CustomerBookingRepair.objects.filter(assigned_to=current_user).order_by("-pk")
        else:
            booking_obj = CustomerBookingRepair.objects.filter(
        Q(assigned_to__isnull=True, status='NotVerified') | 
        Q(branch=current_user.userprofile.branch)
    ).order_by("-pk")
       
        if not booking_obj:
            return Response({"Response":"Not found."},status=status.HTTP_404_NOT_FOUND)
        else:
            resp=[]
            for item in booking_obj:
                data={}
                data['id']=item.id
                data['booking_id']=item.bookingid
                data['name']=item.name
                data['email']=item.email
                data['phone']=item.phone
                data['city']=item.city
                data['brand']=item.brand
                data['issue']=item.issue
                data['created_date']=item.created_date
                data['status']=item.status
                data['product']=item.product
                data['latitude']=item.latitude
                data['longitude']=item.longitude
                data['address']=item.address
                if item.assigned_to:
                    data['assigned_to']=item.assigned_to.username
                if item.branch:
                    data['branch']=item.branch.name
                resp.append(data)
    except:
        return Response({"Response":"Unable to get booking list"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":resp},status=status.HTTP_200_OK,content_type='application/json; charset=utf-8')





@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_service_list(request):
    try:
      
        current_user =request.user
        if current_user.userprofile.role == "Field Engineer":
            service_obj = Service.objects.filter(Q(booking__assigned_to=current_user) | Q(entry_by=current_user)).order_by("-pk")
        else:
            service_obj = Service.objects.filter(branch=current_user.userprofile.branch).order_by("-pk")

        if not service_obj:
            return Response({"Response":"Not found."},status=status.HTTP_404_NOT_FOUND)
        else:
            resp=[]
            for item in service_obj:
                data={}
                data['id']=item.id
                data['ref_number']=item.servicerefnumber
                data['customer_id']=item.customerid
                data['firstname']=item.firstname
                data['lastname']=item.lastname
                data['address']=item.address
                data['phone']=item.phone
                data['memodate']=item.memodate
                data['expecteddate']=item.expecteddate
                data['product']=item.product
                data['brand']=item.brand
                data['model']=item.model
                data['imei']=item.imei
                if item.booking:
                    data['booking_id']=item.booking.bookingid
                data['servicecharge']=item.servicecharge
                data['problem']=item.problem
                data['remarks']=item.remarks
                data['status']=item.status
                data['warrenty']=item.warrenty
                data['totalamount']=item.totalamount
                data['totaltax'] = item.totaltax
                data['discount'] = item.discount
                data['finalamount'] = item.finalamount
                data['amountrecieved'] = item.amountrecieved
                data['duebalance'] = item.duebalance
                data['branch'] = item.branch.name
                data['createddate'] = item.createddate
                data['modifieddate'] = item.modifieddate
                data['accessories'] = item.accessories
                data['paymentmode'] = item.paymentmode

                

                try:
                    data['image1'] =  GLOBAL_VARIABLES['current_host'] + item.image1.url
                except:
                    data['image1'] = None

                try:
                    data['image2'] =  GLOBAL_VARIABLES['current_host'] + item.image2.url
                except:
                    data['image2'] = None

            
                try:
                    data['image3'] =  GLOBAL_VARIABLES['current_host'] + item.image3.url
                except:
                    data['image3'] = None
            


                try:
                    data['image4'] =  GLOBAL_VARIABLES['current_host'] + item.image4.url
                except:
                    data['image4'] = None


                try:
                    data['image5'] =  GLOBAL_VARIABLES['current_host'] + item.image5.url
                except:
                    data['image5'] = None


                try:
                    data['image6'] =  GLOBAL_VARIABLES['current_host'] + item.image6.url
                except:
                    data['image6'] = None



                if item.technician:
                    data['technician'] = item.technician.username
                data['rack_no'] = item.rack_no
                data['shedule_call'] = item.shedule_call
                data['reject_code'] = item.reject_code
                data['technician_remark'] = item.technician_remark
                data['qcok'] = item.qcok
                data['qcnotok'] = item.qcnotok
                data['qcremark'] = item.qcremark
                if item.qc:
                    data['qc'] = item.qc.username
                if item.cnp:
                    data['cnp'] = item.cnp.username
                if item.frontdesk:
                    data['frontdesk'] = item.frontdesk.username
                if item.entry_by:
                    data['entry_by'] = item.entry_by.username
                data['entry_type'] = item.entry_type
                data['entry_validated'] = item.entry_validated
                data['barcode_number'] = item.barcode_number
                data['servicetax'] = item.servicetax
                data['pattern'] = item.pattern
                resp.append(data)
    except:
        return Response({"Response":"Unable to get service list"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":resp},status=status.HTTP_200_OK,content_type='application/json; charset=utf-8')






@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_customers(request):
    try:
        customer_phone_numbers = list(Customers.objects.filter(branch=request.user.userprofile.branch).values('phone','firstname'))
    except:
        return Response({"Response":"Unable to get customer details"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":customer_phone_numbers},status=status.HTTP_200_OK,content_type='application/json; charset=utf-8')




@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_customer_details(request):

    phone = request.data.get('phone')
    if not phone:
        return Response({"Response":"Unable to get customer details!"},status=status.HTTP_400_BAD_REQUEST)

    customer = Customers.objects.filter(phone=phone).first()
    if customer:
        response_data ={
            "customerid":customer.unique_id,
            "firstname":customer.firstname,
            "lastname":customer.lastname,
            "phone":customer.phone,
            "address":customer.address,

        }
    else:
        return Response({"Response":"Not found."},status=status.HTTP_404_NOT_FOUND)
    return Response({"Response":response_data},status=status.HTTP_200_OK,content_type='application/json; charset=utf-8')




@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def verify_reject_service_booking(request):
    try:
        bookingid = request.data.get('id')
        sevice_status = request.data.get('status')
        if sevice_status != "Verified" and sevice_status != "Rejected":
            return Response({"Response":"Unable to verify/reject service booking"},status=status.HTTP_400_BAD_REQUEST)
        if not bookingid or not sevice_status:
            return Response({"Response":"Unable to verify/reject service booking"},status=status.HTTP_400_BAD_REQUEST)
        bookingobj = CustomerBookingRepair.objects.filter(id=int(bookingid)).first()
        bookingobj.status=sevice_status
        bookingobj.save()
        if sevice_status == "Verified":
            return Response({"Response":"Booking verified successfully"},status=status.HTTP_200_OK)
        elif sevice_status == "Rejected":
            return Response({"Response":"Booking rejected successfully"},status=status.HTTP_200_OK)
        

    except:
        return Response({"Response":"Unable to verify/reject service booking"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":resp},status=status.HTTP_200_OK)





@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_servicerefnumber(request):    
    try:
        servicerefnumber = UniqueIdGenerator.objects.filter(model='Service').last()
        servicerefnumber = str(servicerefnumber.prefix)+str(servicerefnumber.uniqueid)
    except:
        return Response({"Response":"Unable to generate servicerefnumber!"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":servicerefnumber},status=status.HTTP_200_OK)




@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_paymentmodes(request):
    try:
        
        payments_obj = PaymentMode.objects.all()
        resp=[]
        for item in payments_obj:
            data={}
            data["mode"]=item.name
            data["id"]=item.id

            resp.append(data)
    except:
        return Response({"Response":"Unable to get payment modes"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":resp},status=status.HTTP_200_OK)



@api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
def get_cities(request):
    try:
        
        city_obj = City.objects.all()
        resp=[]
        for item in city_obj:
            data={}
            data["name"]=item.name
            data["id"]=item.id
            data['code']=item.code

            resp.append(data)
    except:
        return Response({"Response":"Unable to get cities"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":resp},status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_field_engineers(request):
    # try:
    current_user=request.user
    field_engg = User.objects.filter(Q(userprofile__branch=current_user.userprofile.branch)&Q(userprofile__role='Field Engineer'))
    resp=[]
    for item in field_engg:
        data={}
        data["username"]=item.username
        data["id"]=item.id

        resp.append(data)
    # except:
    #     return Response({"Response":"Unable to get field engineers"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":resp},status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_bookings(request):
    try:

        customerbooking = CustomerBookingRepair.objects.filter(
        Q(branch=request.user.userprofile.branch) &
        Q(status='Verified') &
        Q(service__isnull=True)  
    )

        resp=[]
        for item in customerbooking:
            data={}
            data["bookingid"]=item.bookingid
            data["id"]=item.id
            data["name"]=item.name
            data["email"]=item.email
            data["phone"]=item.phone
            data["city"]=item.city
            data["address"]=item.address
            data["id"]=item.id
            resp.append(data)
    except:
        return Response({"Response":"Unable to get booking ids"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":resp},status=status.HTTP_200_OK,content_type='application/json; charset=utf-8')


    

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_booking_details(request):

    bookingid = request.data.get('bookingid')
    if not bookingid:
        return Response({"Response":"Unable to get customer booking details!"},status=status.HTTP_400_BAD_REQUEST)

    bookingobj = CustomerBookingRepair.objects.filter(bookingid=bookingid).first()
    if bookingobj:
        response_data ={
           
            "firstname":bookingobj.name,
            "phone":bookingobj.phone,
            "address":bookingobj.address,
            "city":bookingobj.city,

        }
    else:
        return Response({"Response":"Not found."},status=status.HTTP_404_NOT_FOUND)
    return Response({"Response":response_data},status=status.HTTP_200_OK,content_type='application/json; charset=utf-8')






@api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
def get_srnumbers(request):

    phone = request.data.get('phone')
    if not phone:
        return Response({"Response":"Unable to get SR Numbers!"},status=status.HTTP_400_BAD_REQUEST)

    services = Service.objects.filter(phone=phone).values('servicerefnumber')
    
    return Response({"Response":services},status=status.HTTP_200_OK)





@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_service_charge(request):
    try:
        productid=request.data['productid']
        brandid=request.data['brandid']
        modalid=request.data['modalid']
        problemid=request.data['problemid']

     
        brand=PhoneBrand.objects.filter(id=int(brandid)).first()
        if not brand:
            return Response({"Response":"Unable to get service charge"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

       
        product=ServiceProduct.objects.filter(id=int(productid)).first()
        if not product:
            return Response({"Response":"Unable to get service charge"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
        issue=ServiceIssues.objects.filter(id=int(problemid)).first()
        if not issue:
            return Response({"Response":"Unable to get service charge"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

      
        modal = PhoneModal.objects.filter(id=int(modalid)).first()
        if not modal:
            return Response({"Response":"Unable to get service charge"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        default_charge=0
        try:
            service_charge = ServiceCharge.objects.filter(Q(brand=brand)&Q(modal=modal)&Q(issue=issue)&Q(product=product)).first()
        except:
            return Response({"Response":"Unable to get service charge"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if service_charge:
            service_charge=service_charge.charge
        else:
            service_charge=default_charge
        
    except:
        return Response({"Response":"Unable to get service charge"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":service_charge},status=status.HTTP_200_OK)



###########################################################





def get_service_pdf_bytes(request,action,serviceref):

    serviceobj = Service.objects.filter(servicerefnumber=serviceref).first()
    firstname =serviceobj.firstname
    lastname=serviceobj.lastname
    customerid =serviceobj.customerid
    phone_customer =serviceobj.phone
    expecteddate =serviceobj.expecteddate
    servicecharge = serviceobj.servicecharge
    estimatedprice =serviceobj.finalamount
    totalamount =serviceobj.totalamount
    discount=serviceobj.discount
    amountrecieved =serviceobj.amountrecieved
    duebalance = serviceobj.duebalance
    product =serviceobj.product
    brand = serviceobj.brand
    modal=serviceobj.model
    malfunction =serviceobj.problem
    currentdate =date.today()
    imei=serviceobj.imei
    address_customer =serviceobj.address

    if serviceobj.image1:
        image1=GLOBAL_VARIABLES['current_host'] + serviceobj.image1.url
    else:
        image1=''
    if serviceobj.image2:
        image2=GLOBAL_VARIABLES['current_host'] + serviceobj.image2.url
    else:
        image2=''
    if serviceobj.image3:
        image3=GLOBAL_VARIABLES['current_host'] + serviceobj.image3.url
    else:
        image3=''
    if serviceobj.image4:
        image4=GLOBAL_VARIABLES['current_host'] + serviceobj.image4.url
    else:
        image4=''
    if serviceobj.image5:
        image5=GLOBAL_VARIABLES['current_host'] + serviceobj.image5.url
    else:
        image5=''
    if serviceobj.image6:
        image6=GLOBAL_VARIABLES['current_host'] + serviceobj.image6.url
    else:
        image6=''

    branch = serviceobj.branch

    if serviceobj.totaltax == None or serviceobj.totaltax =='':
        totaltax = 0
    else:
        totaltax = serviceobj.totaltax


    if serviceobj.servicetax == None or serviceobj.servicetax =='':
        servicetax  = 0
    else:
        servicetax  = serviceobj.servicetax
    # servicetax = float(serviceobj.servicetax)
 
    

    company=request.user.userprofile.company
    company_name =company.company_name
    if branch.name=='WAREHOUSE':
        address_line1=company.address_line1
        address_line2=company.address_line2
        address_line3=company.address_line3
        phone=''
    else:
        address_line1=branch.address
        phone=branch.phone
        address_line2=''
        address_line3=''
    logo = company.logo_url
  
    barcode_image_url = None
    barcode_base64 =''
    if action == "order":
        
        barcode_number = serviceobj.barcode_number
        writer_options = {
        'module_width': 0.3,
        'module_height': 10.0,
        'font_size': 12,
        'text_distance': 5.0,
        'center_text': True,
             }
        barcode_bytes_io = BytesIO()
        barcode_format=barcode.get_barcode_class('code128')
        my_barcode = barcode_format(barcode_number, writer=ImageWriter()).write(barcode_bytes_io,options=writer_options)
        barcode_bytes_io.seek(0)
        barcode_image_bytes = barcode_bytes_io.getvalue()
        barcode_base64 = base64.b64encode(barcode_image_bytes).decode()
    
 
    context = {
        "servicetax":servicetax,
        'servicecharge':servicecharge,
        "totalamount":round(totalamount,2),
        'totaltax':round(totaltax,2),
        'finalamount':round(estimatedprice,2),
        "discount":round(discount,2),
        "amountrecieved":round(amountrecieved,2),
        "duebalance":round(duebalance,2),
        "product":product,
        "customerid":customerid,
        "phone":phone,
        "price":round(estimatedprice,2),
        "estimateddate":expecteddate,
        "firstname":firstname,
        "lastname":lastname,
        "serviceref":serviceref,
        "brand":brand,
        "modal":modal,
        "malfunction":malfunction,
        'company_name':company_name,
        'address_line1':address_line1,
        'address_line2':address_line2,
        'address_line3':address_line3,
        # 'logo':logo,
        'logo': GLOBAL_VARIABLES['current_host'] + logo.url  ,
        "currentdate":currentdate,
        "imei":imei,
        "barcode":barcode_base64,
        "image1":image1,
        "image2":image2,
        "image3":image3,
        "image4":image4,
        "image5":image5,
        "image6":image6,
        
        'phone':phone,
   
        "branch":branch,
        "current_host":str(request.get_host()),
        "phone_customer":phone_customer,
        "address_customer":address_customer,

      
   
    }

    spare = SpareParts.objects.filter(servicerefnumber=serviceref)
    spare_list=[]
    for i in spare:
        data={}
        data['name'] = i.name
        data['price'] = i.price
        data['salegst'] = i.salegst
        data['totalquantity'] = i.totalquantity
        data['barcodenumber'] = i.barcodenumber
        if i.price and i.salegst:
            try:
                data['total'] = (float(i.price) + ((float(i.salegst)/100) * float(i.price))) * int(i.totalquantity)
            except:
                data['total'] = ''
        else:
            data['total'] = ''

        spare_list.append(data)

    if spare:
        context['spare'] = spare_list
    else:
        context['spare'] = 0

    language = Language.objects.first()
    if language:
        language = language.language
    else:
        language =None

    # create a template object
    if action == "order":
        if language == 'ar':
            template = get_template("serviceorderpdfarabic.html")
        else:
            template = get_template("serviceorderpdf.html")
        css=os.path.join(BASE_DIR,'core','static','css','serviceorder.css')
    elif action == "invoice":
        if language == 'ar':
            template = get_template("serviceinvoicepdfarabic.html")
        else:
            template = get_template("serviceinvoicepdf.html")
        css=os.path.join(BASE_DIR,'core','static','css','serviceinvoice.css')



    
    # render the context dictionary values
    html = template.render(context)
    options = {
        'quiet': '',
        'encoding': 'UTF-8',
        'page-size':"A4"
        
    }
    #generate the pdf from html
    pdf = pdfkit.from_string(html, False, options=options ,css=css)

    return pdf




##############################################################



@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
# @parser_classes([MultiPartParser])
def add_service(request):

    service = Service()
    # print("data",request.data)

    try:
        image1 = request.data['image1']
    except:
        image1 = None
    try:
        image2 = request.data['image2']
    except:
        image2 = None
    try:
        image3 = request.data['image3']
    except:
        image3 = None
    try:
        image4 = request.data['image4']
    except:
        image4 = None
    try:
        image5 = request.data['image5']
    except:
        image5 = None
    try:
        image6 = request.data['image6']
    except:
        image6 = None
    try:
        servicerefnumber = request.data['servicerefnumber']
    except:
        return Response({"Response":"Service entry failed, servicerefnumber is required!"},status=status.HTTP_400_BAD_REQUEST)
    try:
        product =  request.data['product']
    except:
        return Response({"Response":"Service entry failed, product is required!"},status=status.HTTP_400_BAD_REQUEST)

    try:
        brand =  request.data['brand']
    except:
        return Response({"Response":"Service entry failed, brand is required!"},status=status.HTTP_400_BAD_REQUEST)

    try:
        model =  request.data['modal']
    except:
        return Response({"Response":"Service entry failed, modal is required!"},status=status.HTTP_400_BAD_REQUEST)
    try:
        imei = request.data['imei']
    except:
        imei=None
    try:
        servicecharge = request.data['servicecharge']
    except:
        servicecharge = 0
    try:
        firstname=request.data['firstname']
    except:
        firstname=None
    try:
        lastname=request.data['lastname']
    except:
        lastname=None
    try:
        address=request.data['address']
    except:
        address=None
    try:
        phone=request.data['mobilenumber']
    except:
        phone=None
    try:
        customerid=request.data['customerid']
    except:
        customerid=None
    try:
        memodate = request.data.get("serviceentrydate")
    except:
        memodate=None

    if memodate != None and memodate != "":
        memodate =datetime.strptime(memodate,"%d-%m-%Y").strftime("%Y-%m-%d")
    else:
        memodate=None
    
    try:
        estimateddate = request.data.get("expecteddate")
    except:
        estimateddate=None
    if estimateddate != None and estimateddate != "":
        estimateddate =datetime.strptime(estimateddate,"%d-%m-%Y").strftime("%Y-%m-%d")
    else:
        estimateddate=None
    try:
        problemdetected = request.data.get("problem")
    except:
        problemdetected=None
    try:
        warrentystatus = request.data.get("warrentystatus")
    except:
        warrentystatus=None
    try:
        remarks = request.data.get("remarks")
    except:
        remarks=None
    try:
        accessory_battery= request.data.get("battery")
    except:
        accessory_battery=None
    try:
        accessory_charger= request.data.get("charger")
    except:
        accessory_charger=None
    try:
        accessory_sim= request.data.get("sim")
    except:
        accessory_sim=None
    try:
        accessory_memory= request.data.get("memory")
    except:
        accessory_memory=None

    try:
        pattern= request.data.get("pattern")
    except:
        pattern=None

    try:
        password= request.data.get("password")
    except:
        password=None

    try:
        paymentmode= request.data.get("paymentmode")
    except:
        paymentmode=None

    try:
        customertype= request.data.get("customertype")
    except:
        customertype=None

    try:
        booking_id = request.data.get['bookingid']
        customer_booking_obj = CustomerBookingRepair.objects.filter(id=int(booking_id)).first()
    except:
        customer_booking_obj=None

    accessories=list(filter(lambda item: item is not None and item != "",[accessory_battery,accessory_charger,accessory_sim,accessory_memory]))

    
    service_status = 'Unassigned'
    

    total = float(servicecharge)
    
    discount=0
    final = total - discount
    
    try:
        recieved =request.data.get("amountreceived")
    except:
        return Response({"Response":"Service entry failed, amountreceived is required!"},status=status.HTTP_400_BAD_REQUEST)
       
    
    due = float(final) - float(recieved)
    totaltax=0
    

    if image1:
        image1=urlopen(image1).read()
        uploaded_file = ContentFile(image1,name=f"{servicerefnumber}.png")
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        image1_url = fs.url(name)
        # service.image1 =image1_url
        filename1=name
        service.image1 =filename1
    if image2:
        image2=urlopen(image2).read()
        uploaded_file = ContentFile(image2,name=f"{servicerefnumber}.png")
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        image2_url = fs.url(name)
        # service.image2 =image2_url
        filename2=name
        service.image2 =filename2
    
    if image3:
        image3=urlopen(image3).read()
        uploaded_file = ContentFile(image3,name=f"{servicerefnumber}.png")
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        image3_url = fs.url(name)
        # service.image3 =image3_url
        filename3=name
        service.image3 =filename3
    if image4:
        image4=urlopen(image4).read()
        uploaded_file = ContentFile(image4,name=f"{servicerefnumber}.png")
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        image4_url = fs.url(name)
        # service.image4 =image4_url
        filename4=name
        service.image4 =filename4
    if image5:
        image5=urlopen(image5).read()
        uploaded_file = ContentFile(image5,name=f"{servicerefnumber}.png")
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        image5_url = fs.url(name)
        # service.image5=image5_url
        filename5=name
        service.image5 =filename5

    if image6:
        image6=urlopen(image6).read()
        uploaded_file = ContentFile(image6,name=f"{servicerefnumber}.png")
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        image6_url = fs.url(name)
        # service.image6 =image6_url
        filename6=name
        service.image6 =filename6

    user=request.user
    branch=user.userprofile.branch
    service.branch =branch
    # print("role-",user.userprofile.role)
    if user.userprofile.role=='TRC Front Desk':
        service.frontdesk = user
        service.entry_by = user
        service.entry_type="FDE"
        service.entry_validated =True
    elif user.userprofile.role=='Field Engineer':
        
        service.entry_by = user
        service.entry_type="PDE"
        service.entry_validated =False
    else:
        service.entry_by = user
        service.entry_type="OE"
        service.entry_validated =False


    service.servicerefnumber =servicerefnumber
    service.customerid = customerid
    service.firstname =firstname
    service.lastname =lastname
    service.address = address
    service.phone = phone
    service.memodate =memodate
    service.expecteddate =estimateddate
    service.problem =problemdetected
    service.remarks =remarks
    service.warrenty =warrentystatus
    service.status =service_status
    service.totalamount=total
    service.totaltax=totaltax
    service.discount =discount
    service.finalamount =final
    service.amountrecieved =recieved
    service.duebalance =due
    service.branch =branch
    service.set_accessories(accessories)
    service.product =product
    service.brand =brand
    service.model =model
    service.imei = imei
    service.pattern=pattern
    service.paymentmode = paymentmode
    service.customertype = customertype
    service.screen_password = password
    service.barcode_number= generate_unique_id("ServiceBarcode","SB")[2::]
    if servicecharge == '' or servicecharge == None:
        servicecharge = 0
    service.servicecharge=servicecharge
    if customer_booking_obj:
        service.booking = customer_booking_obj
        customer_booking_obj.status = 'Picked'
        customer_booking_obj.save()

    try:
        service.save()
        generate_unique_id("Service","SR")


        ############ send whatsapp message ####################
        try:
            fullname=f"{firstname} {lastname}"
            device=f"{brand} {model}"
            sr_number=servicerefnumber
            pdf_byte = get_service_pdf_bytes(request,"order",servicerefnumber)
            whatsapp(phone,pdf_byte,'service_jobsheet',fullname,sr_number,device)
        except:
            pass
        #######################################################
    except:
        return Response({"Response":"Service details not saved!."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    entry_message= f"Service Reference Number : {servicerefnumber} is created by {request.user.username} on {datetime.now().strftime('%b %d, %Y, %I:%M %p')} of customer {firstname} {lastname}"
    try:
        service_history = ServiceHistory()
        service_history.service = service
        service_history.description = entry_message
        service_history.save()
    except:
        pass

    try:
        notification = BroadcastNotification()
        notification.message = entry_message
        notification.broadcast_on = datetime.now() + timedelta(seconds=5)
        notification.notification_type = "service_entry"
        notification.notification_id = servicerefnumber
        notification.seen = False
        branch = request.user.userprofile.branch
        notification.user =UserProfile.objects.filter(Q(branch=branch) & (Q(role="Branch Admin") | Q(role="Franchise Admin"))).first().user
        notification.save()
    except:
        pass

    try:
        financial_statement = addaccounts.AccountStatement()        

        ledger_params = {
        'invoicenumber' : servicerefnumber,
        'invoicedate'   : date.today(),
        'totalamount' : final,
        'customer_or_vendor' : f"{firstname} {lastname}",
        'userbranch' : request.user.userprofile.branch,
        'amountrecieved' : recieved,
        'duebalance' : due,
        }

        financial_statement.add_ledger("ServiceEntry", ledger_params)

        cashbook_params = {
            'userbranch' : request.user.userprofile.branch,
            'amountrecieved' : recieved,
            'paymentmode' : paymentmode,
            'invoicedate' : date.today()
        }

        financial_statement.add_cashbook('ServiceEntry', cashbook_params)
    except:
        pass

    return Response({"Response":"Service details saved successfully"},status=status.HTTP_201_CREATED)












@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
# @parser_classes([MultiPartParser])
def update_service(request):

    try:
        servicerefnumber = request.data['servicerefnumber']
    except:
        return Response({"Response":"Service update failed, servicerefnumber is required!"},status=status.HTTP_400_BAD_REQUEST)

    service = Service.objects.filter(servicerefnumber=servicerefnumber).first()
    

    try:
        image1 = request.data['image1']
    except:
        image1 = None

    print("\n\nimage 1 ",image1)
    if image1:
        try:
            image1=urlopen(image1).read()
            uploaded_file = ContentFile(image1,name=f"{servicerefnumber}.png")
            fs = FileSystemStorage()
            name = fs.save(uploaded_file.name, uploaded_file)
            image1_url = fs.url(name)
            service.image1 =image1_url
        except:
            pass


    try:
        image2 = request.data['image2']
    except:
        image2 = None
    
    if image2:
        try:
            image2=urlopen(image2).read()
            uploaded_file = ContentFile(image2,name=f"{servicerefnumber}.png")
            fs = FileSystemStorage()
            name = fs.save(uploaded_file.name, uploaded_file)
            image2_url = fs.url(name)
            service.image2 =image2_url
        except:
            pass

    try:
        image3 = request.data['image3']
    except:
        image3 = None

    if image3:
        try:
            image3=urlopen(image3).read()
            uploaded_file = ContentFile(image3,name=f"{servicerefnumber}.png")
            fs = FileSystemStorage()
            name = fs.save(uploaded_file.name, uploaded_file)
            image3_url = fs.url(name)
            service.image3 =image3_url
        except:
            pass

    try:
        image4 = request.data['image4']
    except:
        image4 = None

    if image4:
        try:
            image4=urlopen(image4).read()
            uploaded_file = ContentFile(image4,name=f"{servicerefnumber}.png")
            fs = FileSystemStorage()
            name = fs.save(uploaded_file.name, uploaded_file)
            image4_url = fs.url(name)
            service.image4 =image4_url
        except:
            pass

    try:
        image5 = request.data['image5']
    except:
        image5 = None

    if image5:
        try:
            image5=urlopen(image5).read()
            uploaded_file = ContentFile(image5,name=f"{servicerefnumber}.png")
            fs = FileSystemStorage()
            name = fs.save(uploaded_file.name, uploaded_file)
            image5_url = fs.url(name)
            service.image5=image5_url
        except:
            pass

    try:
        image6 = request.data['image6']
    except:
        image6 = None

    if image6:
        try:
            image6=urlopen(image6).read()
            uploaded_file = ContentFile(image6,name=f"{servicerefnumber}.png")
            fs = FileSystemStorage()
            name = fs.save(uploaded_file.name, uploaded_file)
            image6_url = fs.url(name)
            service.image6 =image6_url
        except:
            pass

    
    try:
        product =  request.data['product']
    except:
        product = None
    if product:
        service.product = product

    try:
        brand =  request.data['brand']
    except:
        brand = None
    if brand:
        service.brand = brand

    try:
        model =  request.data['modal']
    except:
        model  =None
    if model:
        service.model = model

    try:
        imei = request.data['imei']
    except:
        imei=None
    if imei:
        service.imei = imei

    # try:
    #     servicecharge = request.data['servicecharge']
    # except:
    #     servicecharge = None
    # if servicecharge:
    #     service.servicecharge = servicecharge

    #     total = float(servicecharge)
    #     discount=0
    #     final = total - discount
    #     try:
    #         recieved =request.data.get("amountreceived")
    #     except:
    #         return Response({"Response":"Service entry failed, amountreceived is required!"},status=status.HTTP_400_BAD_REQUEST)
    #     due = float(final) - float(recieved)
    #     totaltax=0


    try:
        firstname=request.data['firstname']
    except:
        firstname=None
    if firstname:
        service.firstname = firstname

    try:
        lastname=request.data['lastname']
    except:
        lastname=None
    if lastname:
        service.lastname=lastname

    try:
        address=request.data['address']
    except:
        address=None
    if address:
        service.address  = address


    try:
        paymentmode=request.data['paymentmode']
    except:
        paymentmode=None
    if paymentmode:
        service.paymentmode  = paymentmode


    try:
        phone=request.data['mobilenumber']
    except:
        phone=None
    if phone:
        service.phone = phone


    # try:
    #     customerid=request.data['customerid']
    # except:
    #     customerid=None


    try:
        memodate = request.data.get("serviceentrydate")
    except:
        memodate=None
    if memodate:
        try:
            memodate =datetime.strptime(memodate,"%d-%m-%Y").strftime("%Y-%m-%d")
            service.memodate=memodate
        except:
            memodate=None
    
    try:
        estimateddate = request.data.get("expecteddate")
    except:
        estimateddate=None
    if estimateddate:
        try:
            estimateddate =datetime.strptime(estimateddate,"%d-%m-%Y").strftime("%Y-%m-%d")
            service.expecteddate = estimateddate
        except:
            estimateddate=None



    try:
        problemdetected = request.data.get("problem")
    except:
        problemdetected=None
    if problemdetected:
        service.problem=problemdetected


    try:
        warrentystatus = request.data.get("warrentystatus")
    except:
        warrentystatus=None


    try:
        remarks = request.data.get("remarks")
    except:
        remarks=None




    try:
        accessory_battery= request.data.get("battery")
    except:
        accessory_battery=None
    try:
        accessory_charger= request.data.get("charger")
    except:
        accessory_charger=None
    try:
        accessory_sim= request.data.get("sim")
    except:
        accessory_sim=None
    try:
        accessory_memory= request.data.get("memory")
    except:
        accessory_memory=None

    if accessory_battery == None and accessory_charger == None and accessory_sim == None and accessory_memory == None:
        pass
    else:
        accessories=list(filter(lambda item: item is not None and item != "",[accessory_battery,accessory_charger,accessory_sim,accessory_memory]))
        service.set_accessories(accessories)




    try:
        pattern= request.data.get("pattern")
    except:
        pattern=None
    if pattern:
        service.pattern = pattern

    try:
        password= request.data.get("password")
    except:
        password=None
    if password:
        service.screen_password = pattern

    try:
        booking_id = request.data.get['bookingid']
    except:
        booking_id = None

    if booking_id:
        try:
            customer_booking_obj = CustomerBookingRepair.objects.filter(id=int(booking_id)).first()
            if customer_booking_obj:
                service.booking = customer_booking_obj
        except:
            pass


    service.save()
    
    # entry_message= f"Service Reference Number : {servicerefnumber} is created by {request.user.username} on {datetime.now().strftime('%b %d, %Y, %I:%M %p')} of customer {firstname} {lastname}"
    # try:
    #     service_history = ServiceHistory()
    #     service_history.service = service
    #     service_history.description = entry_message
    #     service_history.save()
    # except:
    #     pass

    # try:
    #     notification = BroadcastNotification()
    #     notification.message = entry_message
    #     notification.broadcast_on = datetime.now() + timedelta(seconds=5)
    #     notification.notification_type = "service_entry"
    #     notification.notification_id = servicerefnumber
    #     notification.seen = False
    #     branch = request.user.userprofile.branch
    #     notification.user =UserProfile.objects.filter(Q(branch=branch) & (Q(role="Branch Admin") | Q(role="Franchise Admin"))).first().user
    #     notification.save()
    # except:
    #     pass

    return Response({"Response":"Service details updated successfully"},status=status.HTTP_200_OK)







@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
# @parser_classes([MultiPartParser])
def delete_image(request):
    try:
        image = request.data.get("image")
    except:
        return Response({"Response":"Image deletion failed, please provide the image name to delete!"},status=status.HTTP_400_BAD_REQUEST)
    try:
        servicerefnumber = request.data['servicerefnumber']
    except:
        return Response({"Response":"Image deletion failed, servicerefnumber is required!"},status=status.HTTP_400_BAD_REQUEST)

    service = Service.objects.filter(servicerefnumber=servicerefnumber).first()
    if not service:
        return Response({"Response":"service not found!"},status=status.HTTP_404_NOT_FOUND)

    if image == "image1":
        service.image1 = None
    elif image == "image2":
        service.image2 = None
    elif image == "image3":
        service.image3 = None
    elif image == "image4":
        service.image4 = None
    elif image == "image5":
        service.image5 = None
    elif image == "image6":
        service.image6 = None
    # elif image == "image7":
    #     service.image7 = None
    # elif image == "image8":
    #     service.image8 = None
    # elif image == "image9":
    #     service.image9 = None
    else:
        return Response({"Response":"image not found!"},status=status.HTTP_404_NOT_FOUND)

    service.save()

    return Response({"Response":"Image deleted successfully"},status=status.HTTP_200_OK)







@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    try:
        
        notification_obj = BroadcastNotificationMobileApp.objects.all().order_by('-pk')
        resp=[]
        for item in notification_obj:
            data={}
            data["message"]=item.message
            data["id"]=item.id
            data['date'] = item.created_date
            data['sent_status'] = item.sent
            data['username'] = item.user.username
            data['user_id'] = item.user.id
            data['notification_type'] = item.notification_type
            data['link_id'] = item.notification_id
            data['active_status'] = item.active
            data['seen_status'] = item.seen


            resp.append(data)
    except:
        return Response({"Response":"Unable to get notifications"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Response":resp},status=status.HTTP_200_OK)





@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def change_notification_status(request):
    try:
        
        notif_id=request.data['notification_id']

        if notif_id is None:
            return Response({"Response": "Notification ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        notif_obj = BroadcastNotificationMobileApp.objects.filter(id=int(notif_id)).first()

        if not notif_obj:
            return Response({"Response": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
        notif_obj.active = False
        notif_obj.save()
    except:
        return Response({"Response":"Something went wrong!"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"Response":'Notification status changed successfully'},status=status.HTTP_200_OK)






@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def change_notification_status(request):
    try:
        
        notif_id=request.data['notification_id']

        if notif_id is None:
            return Response({"Response": "Notification ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        notif_obj = BroadcastNotificationMobileApp.objects.filter(id=int(notif_id)).first()

        if not notif_obj:
            return Response({"Response": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
        notif_obj.active = False
        notif_obj.save()
    except:
        return Response({"Response":"Something went wrong!"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"Response":'Notification status changed successfully'},status=status.HTTP_200_OK)





@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delivered_service_booking(request):
    try:
        bookingid = request.data.get('id')
        sevice_status = request.data.get('status')
        if sevice_status != "Delivered":
            return Response({"Response":"Invalid status"},status=status.HTTP_400_BAD_REQUEST)

        bookingobj = CustomerBookingRepair.objects.filter(id=int(bookingid)).first()

        if not bookingobj:
            return Response({"Response": "Service Booking Not Found!"}, status=status.HTTP_404_NOT_FOUND)

        bookingobj.status=sevice_status
        bookingobj.save()

        return Response({"Response":"Delivered successfully"},status=status.HTTP_200_OK)
        
    except:
        return Response({"Response":"Something went wrong"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

















        