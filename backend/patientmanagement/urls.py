from django.urls import path
from .views import *

urlpatterns = [
    path('api/create/', PatientCreateAPIView.as_view(), name='patient-create'),
    path('api/doctors/', DoctorView.as_view(), name='doctor-fetch'),
    path('api/appointment/', AppointmentCreateView.as_view(), name='appointment-create'),
    path('api/recent-appointment/', RecentAppointments.as_view(), name='recent-appointments'),
    path('api/appointment/<int:pk>/', AppointmentUpdateView.as_view(), name='appointment-update'),
    path('api/dashboard/', AppointmentDashboard.as_view()),
    path('api/patient-count/', PatientCountAPIView.as_view()),
    path('api/patient-details/<int:patient_id>', PatientDetailsAPIView.as_view()),
    path('api/doctor/<int:doctor_id>/patients/', DoctorPatientsAPIView.as_view(), name='doctor_patients'),


]
