from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers.user_serializer import *
from django.contrib.auth import login, authenticate,logout
from rest_framework.response import Response
import json
from django.core.serializers import serialize
from django.http import JsonResponse

class UserCreateAPIView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    def get_serializer_class(self):
        if self.request.method == 'POST' or self.request.method == 'PUT':
            return UserSerializer
        else:
            return UserRetrieveSerializer

class DepartmentView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class Login(generics.views.APIView):
    def post(self, request):
        if not request.data:
            return Response({'Error': "Please provide username/password"}, status="400")
        username = request.data['username']
        password = request.data['password']
        try:
            user = authenticate(request,username=username, password=password)
            print(user,'kjhkjhk')
        except User.DoesNotExist:
            return Response({'Error': "Invalid username/password"}, status="400")
        print(user,'nee')
        if user:
            login(request, user)
            user_details = {
                "id":user.id,
                "username": user.username,
                "role": user.role
            }
            return JsonResponse(user_details)
        else:
            return Response(
                json.dumps({'Error': "Invalid credentials"}),
                status=404,
                content_type="application/json"
            )

class Logout(generics.views.APIView):
    '''
    Logs out the current user.
    '''
    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out successfully'}, status=200)