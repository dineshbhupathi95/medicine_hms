from rest_framework import serializers
from ..models import *
from usermanagement.serializers.user_serializer import UserRetrieveSerializer


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patients
        fields = ['id','patient_name', 'mobile_number', 'age', 'gender','email','address']


class PatientRetrivalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patients
        fields = serializers.ALL_FIELDS


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = serializers.ALL_FIELDS


class AppointmentRetrivalSerializer(serializers.ModelSerializer):
    patient = PatientRetrivalSerializer()
    doctor = UserRetrieveSerializer()

    class Meta:
        model = Appointment
        fields = serializers.ALL_FIELDS


class PatientAppointmentsSerializer(serializers.ModelSerializer):
    patient = PatientRetrivalSerializer()

    class Meta:
        model = Appointment
        fields = serializers.ALL_FIELDS


class AppointmentDoctorRetrivalSerializer(serializers.ModelSerializer):
    doctor = UserRetrieveSerializer()

    class Meta:
        model = Appointment
        fields = serializers.ALL_FIELDS


class PatientDetailsSerializer(serializers.ModelSerializer):
    appointments = serializers.SerializerMethodField()

    class Meta:
        model = Patients
        fields = ['id', 'patient_id', 'patient_name', 'mobile_number', 'age', 'gender', 'appointments']

    def get_appointments(self, obj):
        appointments = Appointment.objects.filter(patient_id=obj.id).order_by('-appointment_date')
        return AppointmentRetrivalSerializer(appointments, many=True).data
