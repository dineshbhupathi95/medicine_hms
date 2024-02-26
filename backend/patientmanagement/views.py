from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers.patient_serializer import *
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError
from django.db.models import Count
from datetime import datetime
from django.db.models import F
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from io import BytesIO
import json

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

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = AppointmentRetrivalSerializer(instance)
        return Response(serializer.data)


class DoctorPatientsAPIView(generics.ListAPIView):
    serializer_class = AppointmentRetrivalSerializer

    def get_queryset(self):
        doctor_id = self.kwargs['doctor_id']  # Extract doctor_id from URL kwargs
        queryset = Appointment.objects.filter(doctor_id=doctor_id)

        appointment_date = self.request.query_params.get('appointment_date')
        if appointment_date:
            queryset = queryset.filter(appointment_date=appointment_date)

        # Sort queryset by appointment_time in ascending order
        queryset = queryset.order_by(F('appointment_time').asc())

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


class RecentAppointments(generics.ListAPIView):
    queryset = Appointment.objects.all().order_by('-id')[:5]
    serializer_class = AppointmentRetrivalSerializer



class AppointmentDashboard(generics.ListAPIView):
    def get_queryset(self):
        queryset = Appointment.objects.all()
        # Get the date from query parameters
        date_str = self.request.query_params.get('date')
        if date_str:
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d').date()
                queryset = queryset.filter(appointment_date=date)
            except ValueError:
                pass  # Handle invalid date format gracefully
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Count appointments for each doctor
        doctor_counts = queryset.values('doctor__username').annotate(appointment_count=Count('id'))
        print(doctor_counts)
        doctor_wise_counts = [{'label': item['doctor__username'], 'value': item['appointment_count']} for item in
                              doctor_counts]

        # Count appointments for each department
        department_counts = queryset.values('doctor__department__name').annotate(appointment_count=Count('id'))
        department_wise_counts = [
            {'label': item['doctor__department__name'], 'value': item['appointment_count']} for item in
            department_counts]
        all_counts = doctor_wise_counts + department_wise_counts

        total_count = queryset.count()

        return Response({'total_count': total_count, 'dashboard_counts': all_counts})

from django.template.loader import render_to_string

def generate_pdf(request):
    if request.method == 'POST':
        try:
            # Get dynamic data from the request
            pdf_data = json.loads(request.body)

            # Render HTML template with dynamic data
            # template = get_template('pdf_generate.html')
            html_content = render_to_string('pdf_generate.html', pdf_data)

            # html_content = template.render(pdf_data)
            html_content_with_style = f"""
                         <html>
                         <head>
                             <style>
                                 /* Add your CSS styles here */
                                 body {{
                                     font-family: Arial, sans-serif;
                                     color: #333;
                                 }}
                                 /* Add more styles as needed */
                                 .container {{
            display: flex;
            justify-content: space-between;
        }}
        .left {{
            width: 45%; /* Adjust as needed */
        }}
        .right {{
            width: 45%; /* Adjust as needed */
        }}
                             </style>
                         </head>
                         <body>
                             {html_content}
                         </body>
                         </html>
                     """
            # Create PDF file
            result = BytesIO()
            pdf = pisa.pisaDocument(BytesIO(html_content_with_style.encode('utf-8')), result)
            print(pdf)
            # Return PDF as HttpResponse
            if not pdf.err:
                response = HttpResponse(result.getvalue(), content_type='application/pdf')
                response['Content-Disposition'] = 'filename="output.pdf"'
                return response
            return HttpResponse('Error generating PDF')
        except Exception as e:
            return HttpResponse(f'Error generating PDF: {str(e)}', status=500)
    return HttpResponse('Method not allowed', status=405)