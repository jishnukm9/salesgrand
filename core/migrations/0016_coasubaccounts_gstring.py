# Generated by Django 3.2.20 on 2024-03-18 13:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_paymentmode'),
    ]

    operations = [
        migrations.AddField(
            model_name='coasubaccounts',
            name='gstring',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
