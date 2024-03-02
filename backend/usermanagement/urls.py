from django.urls import path
from .views import *
from django.urls import include
# from . import routing

urlpatterns = [
    path('api/create/', UserCreateAPIView.as_view(), name='user-create'),
    path('api/department/', DepartmentView.as_view(), name='department-create'),
    path('api/organization/', OrganizationView.as_view(), name='organization-create'),
    # path('api/login/', user_login, name='api_login'),
    path('api/login/', Login.as_view()),
    path('api/logout/', Logout.as_view(), name='logout'),

    path('api/send-whatsapp/', SendWhatsAppMessage.as_view(), name='send_whatsapp'),
    path('api/send-sms/', SendSMSMessage.as_view(), name='send_sms'),
    path('api/send-email/', SendEmail.as_view(), name='send_email'),
    path('api/doctor-slots/<int:doctor_id>/', DoctorSlotsAPIView.as_view(), name='doctor-slots'),
    # path('user/', include(routing.websocket_urlpatterns)),

]
