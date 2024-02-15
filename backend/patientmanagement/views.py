from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers.patient_serializer import *
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError
import datetime


class PatientCreateAPIView(generics.ListCreateAPIView):
    queryset = Patients.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST' or self.request.method == 'PUT':
            return PatientSerializer
        else:
            return PatientRetrivalSerializer


class DoctorView(generics.ListAPIView):
    queryset = User.objects.filter(role='doctor').all()
    serializer_class = UserRetrieveSerializer


class PatientCountAPIView(generics.GenericAPIView):
    def get_queryset(self):
        return Patients.objects.all()

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        total_count = queryset.count()
        return Response({'total_count': total_count})


class AppointmentCreateView(generics.ListCreateAPIView):
    queryset = Appointment.objects.all()

    # serializer_class = AppointmentSerializer
    def get_serializer_class(self):
        if self.request.method == 'POST' or self.request.method == 'PUT':
            return AppointmentSerializer
        else:
            return AppointmentRetrivalSerializer


class AppointmentUpdateView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()


class DoctorPatientsAPIView(generics.ListAPIView):
    serializer_class = AppointmentRetrivalSerializer

    def get_queryset(self):
        doctor_id = self.kwargs['doctor_id']  # Extract doctor_id from URL kwargs
        queryset = Appointment.objects.filter(doctor_id=doctor_id)

        appointment_date = self.request.query_params.get('appointment_date')
        if appointment_date:
            queryset = queryset.filter(appointment_date=appointment_date)

        return queryset


# class PatientDetailsAPIView(generics.ListAPIView):
#     serializer_class = PatientDetailsSerializer
#
#     def get_queryset(self):
#         patient_id = self.kwargs['patient_id']  # Extract doctor_id from URL kwargs
#         queryset = Appointment.objects.filter(patient_id=patient_id)
#
#         appointment_date = self.request.query_params.get('appointment_date')
#         if appointment_date:
#             queryset = queryset.filter(appointment_date=appointment_date)
#
#         return queryset
class PatientDetailsAPIView(generics.RetrieveAPIView):
    serializer_class = PatientDetailsSerializer

    def get_object(self):
        patient_id = self.kwargs.get('patient_id')

        # Validate patient_id
        if not isinstance(patient_id, int):
            raise ValidationError("Invalid patient ID")

        # Retrieve patient details
        try:
            patient = Patients.objects.get(id=patient_id)
        except Patients.DoesNotExist:
            raise NotFound("Patient not found")

        return patient
