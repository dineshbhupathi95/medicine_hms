# Generated by Django 5.0.2 on 2024-02-18 15:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usermanagement', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='end_time',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='start_time',
            field=models.TimeField(blank=True, null=True),
        ),
    ]