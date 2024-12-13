
from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenVerifyView,TokenObtainPairView,TokenRefreshView,TokenBlacklistView

urlpatterns =[
     path('login/',login,name='login_api'),
     path('logout/',logout_user,name='logout_api'),
     path('test_token/',test_token,name='test_token'),
     path('get_service/',get_service,name='get_service'),
     path('get_customers/',get_customers,name='get_customers'),
     path('get_customer_details/',get_customer_details,name='get_customer_details'),
     path('get_servicerefnumber/',get_servicerefnumber,name='get_servicerefnumber'),
     path('add_service/',add_service,name='add_service'),
     path('add_service_booking/',add_service_booking,name='add_service_booking'),
     path('get_products/',get_products,name='get_products'),
     path('get_brands/',get_brands,name='get_brands'),
     path('get_modals/',get_modals,name='get_modals'),
     path('get_service_charge/',get_service_charge,name='get_service_charge'),
     path('get_service_issues/',get_service_issues,name='get_service_issues'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    # path('get_booking_list_fe/',get_booking_list_fe,name='get_booking_list_fe'),
    path('get_service_list/',get_service_list,name='get_service_list'),
      path('get_booking_list/',get_booking_list,name='get_booking_list'),
      path('get_paymentmodes/',get_paymentmodes,name='get_paymentmodes'),
         path('get_bookings/',get_bookings,name='get_bookings'),
         path('get_booking_details/',get_booking_details,name='get_booking_details'),
         path('get_field_engineers/',get_field_engineers,name='get_field_engineers'),
          path('verify_reject_service_booking/',verify_reject_service_booking,name='verify_reject_service_booking'),
          path('update_service/',update_service,name='update_service'),
          path('delete_image/',delete_image,name='delete_image'),
path('get_srnumbers/',get_srnumbers,name='get_srnumbers'),
path('get_cities/',get_cities,name='get_cities'),
path('get_notifications/',get_notifications,name='get_notifications'),
path('change_notification_status/',change_notification_status,name='change_notification_status'),
path('delivered_service_booking/',delivered_service_booking,name='delivered_service_booking'),

          
]

