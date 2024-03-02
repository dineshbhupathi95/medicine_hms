from django.db import models
from usermanagement.models import User
from django.utils import timezone


# Create your models here.

class Patients(models.Model):
    patient_id = models.CharField(max_length=20, unique=True)  # Field for custom patient ID
    patient_name = models.CharField(max_length=250)
    mobile_number = models.CharField(max_length=31)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=50, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.patient_id:  # Generate patient ID if not provided
            last_patient_id = Patients.objects.order_by('-id').first()  # Get the last patient ID
            if last_patient_id:
                last_id_number = int(last_patient_id.patient_id.split('-')[-1])  # Extract the numeric part
                new_id_number = last_id_number + 1
            else:
                new_id_number = 1
            self.patient_id = f"PAT-{new_id_number:04}"  # Create the new patient ID with padding
        super().save(*args, **kwargs)


class Appointment(models.Model):
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE)
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    prescription = models.TextField(null=True, blank=True)
    prescription_pdf = models.FileField(upload_to='prescriptions/', null=True, blank=True)



