from rest_framework import serializers
from ..models import *
from django.contrib.auth.hashers import make_password


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = serializers.ALL_FIELDS


class UserSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all())  # Use PrimaryKeyRelatedField for dropdown

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'role', 'password', 'phone_number',
                  'department']
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

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'role', 'phone_number',
                  'department']
