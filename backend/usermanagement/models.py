from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.dispatch import receiver
from django.db.models.signals import post_save


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username, password, **extra_fields):
        """
        Creates and saves a User with the given username, email and password.
        """
        if not username:
            raise ValueError('The given username must be set')
        username = self.model.normalize_username(username)
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, password, **extra_fields)

    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, password, **extra_fields)

    def get_by_natural_key(self, username):
        case_insensitive_username_field = '{}__iexact'.format(self.model.USERNAME_FIELD)
        return self.get(**{case_insensitive_username_field: username})


class Department(models.Model):
    name = models.CharField(max_length=250)

    def __str__(self):
        return "{}".format(self.name)


class Qualification(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return "{}".format(self.name)


class OrganizationDetails(models.Model):
    ORG_TYPES = (
        ('corporate', 'Corporate'),
        ('individual','Individual'),
    )
    organization_name = models.CharField(max_length=100, null=True, blank=True)
    road_number = models.CharField(max_length=100, blank=True)
    street = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=100, blank=True)
    org_logo = models.FileField(upload_to='images/', null=True, blank=True)
    org_code = models.CharField(max_length=50, null=True, blank=True)
    org_type = models.CharField(max_length=100,choices=ORG_TYPES, null=True, blank=True)
    #logo field, org code, user linkup, org_type-indivisual,corporate

    def __str__(self):
        return self.organization_name

class User(AbstractUser):
    USER_ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('branch_manager', 'Branch Manager'),
        ('staff', 'Staff'),
        ('doctor', 'Doctor'),
        # ('patients', 'Patients'),
    )
    """User model."""
    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    password = models.CharField(_('password'), max_length=128)
    phone_number = models.CharField(blank=True, max_length=31)
    role = models.CharField(max_length=20, choices=USER_ROLE_CHOICES, default='regular')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True)
    org = models.ForeignKey(OrganizationDetails, on_delete=models.CASCADE, null=True)
    qualification = models.ForeignKey(Qualification, on_delete=models.CASCADE, null=True)
    experience = models.PositiveIntegerField(null=True, blank=True)
    op_fee = models.CharField(max_length=100, null=True, blank=True)
    road_number = models.CharField(max_length=100, blank=True)
    street = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    day_time_availability = models.CharField(max_length=100, null=True, blank=True)
    signature = models.CharField(max_length=100, null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    doc_uid = models.CharField(max_length=100,blank=True,null=True)
    # doc_uid

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
    objects = UserManager()


class AppointmentSlot(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"{self.doctor.name} - {self.start_time.strftime('%Y-%m-%d %H:%M')} to {self.end_time.strftime('%Y-%m-%d %H:%M')}"

    @classmethod
    def create_slots(cls, doctor, start_date):
        # Get the start and end times for the doctor
        start_time = timezone.datetime.combine(start_date, doctor.start_time)
        end_time = timezone.datetime.combine(start_date, doctor.end_time)

        # Ensure end time is greater than start time
        if end_time <= start_time:
            return

        # Create slots within the specified time range
        while start_time < end_time:
            cls.objects.create(doctor=doctor, start_time=start_time,
                               end_time=start_time + timezone.timedelta(minutes=15))
            start_time += timezone.timedelta(minutes=15)


@receiver(post_save, sender=User)
def create_slots(sender, instance, created, **kwargs):
    if created and instance.role == 'doctor':
        start_time = timezone.now().replace(hour=instance.start_time.hour, minute=instance.start_time.minute, second=0,
                                            microsecond=0)
        end_time = timezone.now().replace(hour=instance.end_time.hour, minute=instance.end_time.minute, second=0,
                                          microsecond=0)

        while start_time < end_time:
            AppointmentSlot.objects.create(doctor=instance, start_time=start_time,
                                           end_time=start_time + timezone.timedelta(minutes=15))
            start_time += timezone.timedelta(minutes=15)
