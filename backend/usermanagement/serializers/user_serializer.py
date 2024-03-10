from rest_framework import serializers
from ..models import *
from django.contrib.auth.hashers import make_password


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = serializers.ALL_FIELDS


class OrganizationDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationDetails
        fields = serializers.ALL_FIELDS


class QualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qualification
        fields = serializers.ALL_FIELDS


class UserSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all())  # Use PrimaryKeyRelatedField for dropdown
    qualification = serializers.PrimaryKeyRelatedField(
        queryset=Qualification.objects.all())
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'role',
                  'password', 'phone_number', 'department',
                  'qualification', 'experience', 'op_fee', 'road_number', 'street', 'city',
                  'state', 'zip_code', 'country', 'day_time_availability', 'signature',
                                                                           'start_time', 'end_time']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['is_active'] = True
        validated_data['is_staff'] = True
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def clean(self):
        cleaned_data = super(UserSerializer, self).clean()
        username = cleaned_data.get('username')
        if username and User.objects.filter(username__iexact=username).exists():
            self.add_error('username', 'A user with that username already exists.')
        return cleaned_data


class UserRetrieveSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer()  # Use DepartmentSerializer for nested representation
    qualification = QualificationSerializer()
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'role', 'phone_number',
                  'department','qualification', 'experience', 'op_fee', 'road_number', 'street', 'city',
                  'state', 'zip_code', 'country', 'day_time_availability', 'signature',
                                                                           'start_time', 'end_time'
                  ]


class TimeField(serializers.Field):
    """
    A custom read-only field to represent time without losing timezone information.
    """

    def to_representation(self, value):
        # Convert datetime to time while preserving timezone information
        return value.time()


class AppointmentSlotSerializer(serializers.ModelSerializer):
    start_time = TimeField()
    end_time = TimeField()

    class Meta:
        model = AppointmentSlot
        fields = ['start_time', 'end_time']
