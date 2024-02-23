from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers.user_serializer import *
from django.contrib.auth import login, authenticate, logout
from rest_framework.response import Response
import json
from django.core.serializers import serialize
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from twilio.rest import Client
from django.conf import settings
from django.core.mail import send_mail
import asyncio
import io
from django.http import JsonResponse
from google.cloud import speech_v1p1beta1
from channels.generic.websocket import WebsocketConsumer


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
            user = authenticate(request, username=username, password=password)
            # print(user, 'kjhkjhk')
        except User.DoesNotExist:
            return Response({'Error': "Invalid username/password"}, status="400")
        print(user, 'nee')
        if user:
            login(request, user)
            user_details = {
                "id": user.id,
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


class SendSMSMessage(APIView):
    def post(self, request):
        to = request.data.get('to')
        body = request.data.get('body')
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        # client = Client("AC136c50e99273410e3e8e185b13213da0", "81d724472b5004cc53a6af68b3410c3e")
        client.messages.create(to=to,
                               from_=settings.TWILIO_PHONE_NUMBER,
                               body=body)
        return Response({'message': 'SMS message sent successfully'})


class SendEmail(APIView):
    def post(self, request):
        subject = request.data.get('subject')
        message = request.data.get('message')
        recipient_list = request.data.get('recipient_list')
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,  # Sender email address
            recipient_list,
            # fail_silently=False,
        )
        return Response({'message': 'Email sent successfully'})


class SendWhatsAppMessage(APIView):
    def post(self, request):
        to = request.data.get('to')
        body = request.data.get('body')
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            from_='whatsapp:'+settings.TWILIO_WHATSAPP_NUMBER,
            body=body,
            to='whatsapp:' + to
        )
        return Response({'message': 'WhatsApp message sent successfully'})

class DoctorSlotsAPIView(generics.ListAPIView):
    serializer_class = AppointmentSlotSerializer

    def get_queryset(self):
        doctor_id = self.kwargs['doctor_id']
        date_param = self.request.query_params.get('date')

        if not date_param:
            return AppointmentSlot.objects.none()  # Return empty queryset if date is not provided

        # Get doctor instance
        doctor = User.objects.get(id=doctor_id)

        # Create slots for future dates if the doctor has not been assigned slots for the provided date
        if not AppointmentSlot.objects.filter(doctor=doctor, start_time__date=date_param).exists():
            start_date = timezone.datetime.strptime(date_param, '%Y-%m-%d').date()
            AppointmentSlot.create_slots(doctor, start_date)

        # Filter appointment slots for the specified doctor and date
        queryset = AppointmentSlot.objects.filter(doctor=doctor, start_time__date=date_param)
        return queryset



# Speech-to-text streaming handler

class SpeechToTextConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        # Initialize Google Cloud Speech client
        client = speech_v1p1beta1.SpeechClient()

        # Configuration for streaming speech recognition
        config = {
            'encoding': 'LINEAR16',
            'sample_rate_hertz': 16000,
            'language_code': 'en-US',
        }

        # Initialize streaming recognizer with interim results enabled
        streaming_config = {
            'config': config,
            'interim_results': True,
        }

        # Process incoming audio chunks and stream the transcription back to the client
        async def stream_transcription(requests):
            responses = client.streaming_recognize(streaming_config, requests)

            for response in responses:
                for result in response.results:
                    for alternative in result.alternatives:
                        # Send interim transcription to the client
                        await self.send(text_data=json.dumps({
                            'transcript': alternative.transcript,
                            'is_final': result.is_final,
                        }))

        # Process audio chunks received from the client
        async def handle_audio_chunks(audio_chunks):
            requests = (
                speech_v1p1beta1.StreamingRecognizeRequest(audio_content=chunk)
                for chunk in audio_chunks
            )

            # Stream transcription asynchronously
            await stream_transcription(requests)

        # Process audio data received from the client
        async def process_audio_data(audio_data):
            audio_chunks = io.BytesIO(audio_data).chunks()
            await handle_audio_chunks(audio_chunks)

        # Receive audio data from the client and start transcription
        await process_audio_data(text_data.encode('latin-1'))
