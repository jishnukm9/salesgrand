# Generated by Django 4.2.2 on 2024-04-10 04:26

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0025_stocktransaction'),
    ]

    operations = [
        migrations.AddField(
            model_name='stocktransaction',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
