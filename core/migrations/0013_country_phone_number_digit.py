# Generated by Django 4.2.2 on 2024-03-11 07:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_alter_company_logo_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='country',
            name='phone_number_digit',
            field=models.IntegerField(default=10),
        ),
    ]
