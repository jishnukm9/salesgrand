# Generated by Django 4.2.2 on 2024-08-19 06:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0071_customers_customertype_customers_vatnumber'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customers',
            name='customertype',
            field=models.CharField(default=None, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='customers',
            name='vatnumber',
            field=models.CharField(default=None, max_length=200, null=True),
        ),
    ]