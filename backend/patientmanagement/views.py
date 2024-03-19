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
# from xhtml2pdf import pisa
# from io import BytesIO
import json
from weasyprint import HTML
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from usermanagement.models import OrganizationDetails
import spacy
from django.db.models import Q


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

    def generate_pdf(self, html_data, instance):
        pdf_file = default_storage.open(f'{instance.patient.patient_name}_prescription{instance.id}.pdf',
                                        'wb')  # Open a file-like object for writing
        HTML(string=html_data).write_pdf(pdf_file)  # Write PDF data to the file-like object
        pdf_file.close()  # Close the file-like object
        return f'{instance.patient.patient_name}_prescription{instance.id}.pdf'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        print(request.data)

        nlp1 = spacy.load("/Users/dineshbhupathi/Documents/medimind/model-best 2")  # load the best model
        input_text =request.data.get('prescription')
        print(input_text)
        doc = nlp1(input_text)  # input sample text

        prescription_data = spacy.displacy.parse_ents(doc)
        # print(prescription_data)
        # Render HTML template with appointment data
        html_data = self.render_html(instance,request.data,prescription_data)

        # Generate PDF from HTML and save to prescription_pdf field
        # print(html_data)
        pdf_filename = self.generate_pdf(html_data, instance)
        # print(pdf_filename)
        instance.prescription_pdf.save(pdf_filename, ContentFile(default_storage.open(pdf_filename, 'rb').read()),
                                       save=False)

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def render_html(self, instance,request_data,prescription_data):
        # Render HTML template with appointment data
        prescription_dic = {
            "medicine":[],
            "count":[],
            "when_to_take":[]
        }
        prescription_str = request_data.get('prescription')
        entities = prescription_data.get('ents')
        # print(entities)
        # for entity in entities:
        #     print(entity)
        #     if entity.get('label') == 'MEDICINE':
        #         temp = prescription_str[entity.get("start"):entity.get("end")]
        #         prescription_dic['medicine'].append(temp)
        #
        #     if entity.get('label') == 'COUNT':
        #         temp = prescription_str[entity.get("start"):entity.get("end")]
        #         prescription_dic['count'].append(temp)
        #
        #     if entity.get('label') == 'WHEN_TO_TAKE':
        #         temp = prescription_str[entity.get("start"):entity.get("end")]
        #         prescription_dic['when_to_take'].append(temp)

        # Function to chunk a list into groups of n
        def chunk_list(lst, n):
            for i in range(0, len(lst), n):
                yield lst[i:i + n]

        # Chunking the list into groups of 3
        chunked_list = list(chunk_list(entities, 3))

        # Printing the chunked list
        for chunks in chunked_list:
            print(chunks)
            if len(chunks) == 3:
                for chunk in chunks:
                    print(chunk)
                    if chunk.get('label') == 'MEDICINE':
                        temp = prescription_str[chunk.get("start"):chunk.get("end")]
                        prescription_dic['medicine'].append(temp)
                    if chunk.get('label') == 'COUNT':
                        temp = prescription_str[chunk.get("start"):chunk.get("end")]
                        prescription_dic['count'].append(temp)
                        # else:
                        #     prescription_dic['count'].append("None")

                    if chunk.get('label') == 'WHEN_TO_TAKE':
                        temp = prescription_str[chunk.get("start"):chunk.get("end")]
                        prescription_dic['when_to_take'].append(temp)
                        # else:
                        #     prescription_dic['when_to_take'].append("None")

                    #
                    # else:
                    #     pass
        print(prescription_dic)
        range_count = 0
        for co in prescription_dic.values():
            if range_count <= len(co):
                range_count = len(co)
        max_length = max(len(v) for v in prescription_dic.values())

        # Pad the lists with 'None' if their lengths are less than max_length
        for key, value_list in prescription_dic.items():
            prescription_dic[key] += ['None'] * (max_length - len(value_list))

        # Create a list of indices from 0 to max_length - 1
        indices = list(range(max_length))
        print(indices)
        # Create a list to store pairs
        pairs_list = []

        # Iterate over the indices of the lists
        for i in range(len(prescription_dic['medicine'])):
            # Get the pair of values at index i from each list
            pair = (prescription_dic['medicine'][i], prescription_dic['count'][i], prescription_dic['when_to_take'][i])
            # Append the pair to the pairs_list
            pairs_list.append(pair)

        # prescription_dic['medicine'] =
        organization_details = OrganizationDetails.objects.all()[0]
        context = {
            'hospital_name': organization_details.organization_name,
            'hospital_address': f'{organization_details.road_number},{organization_details.street},{organization_details.city},{organization_details.country},ZipCode {organization_details.zip_code},{organization_details.phone_number}',
            'patient': f'{instance.patient.patient_name}/ Age: {instance.patient.age} \n Mob Number: {instance.patient.mobile_number}',
            'doctor': instance.doctor,
            'specialization': instance.doctor.department.name,
            'appointment_date': f'{instance.appointment_date} || {instance.appointment_time}',
            'appointment_time': instance.appointment_time,
            'prescription': prescription_dic,
            'range_count':range_count,
            'indices': indices,
            'pairs_list':pairs_list
        }
        html_template = 'appointment_defualt.html'
        return render_to_string(html_template, context)


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
        # Get the date and doctor_id from query parameters
        # date_str = self.request.query_params.get('date')
        doctor_id = self.request.query_params.get('doctor_id')
        department = self.request.query_params.get('department')
        print(doctor_id)
        if doctor_id:
            try:
                # date = datetime.strptime(date_str, '%Y-%m-%d').date()
                # print(date)
                # Convert doctor_id to integer
                doctor_id = int(doctor_id) if doctor_id else None
                # Filter queryset based on appointment date or doctor ID
                print(doctor_id,department)
                queryset = queryset.filter(doctor__id=doctor_id)
                print(queryset)
            except ValueError as e:
                print(e)
                pass  # Handle invalid date format gracefully
        if department:
            queryset = queryset.filter(doctor_id__department__id=department)

        return queryset
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Count appointments for each doctor
        doctor_counts = queryset.values('doctor__username').annotate(appointment_count=Count('id'))
        # print(doctor_counts)
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
