# Generated by Django 4.2.8 on 2024-06-10 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0045_productpricelist_modified_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='sale',
            name='customer_gst_number',
            field=models.CharField(blank=True, default=None, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='service',
            name='customer_gst_number',
            field=models.CharField(blank=True, default=None, max_length=50, null=True),
        ),
    ]
