# Generated by Django 4.2.2 on 2024-08-22 09:57

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0077_service_invoicedate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sale',
            name='invoicedate',
            field=models.DateTimeField(blank=True, default=datetime.datetime.now),
        ),
        migrations.AlterField(
            model_name='service',
            name='invoicedate',
            field=models.DateTimeField(blank=True, default=datetime.datetime.now, null=True),
        ),
    ]