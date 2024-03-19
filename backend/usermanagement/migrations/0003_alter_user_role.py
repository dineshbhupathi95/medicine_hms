# Generated by Django 5.0.2 on 2024-03-19 07:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usermanagement', '0002_qualification_user_city_user_country_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('admin', 'Admin'), ('branch_manager', 'Branch Manager'), ('staff', 'Staff'), ('doctor', 'Doctor')], default='regular', max_length=20),
        ),
    ]