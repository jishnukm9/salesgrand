# Generated by Django 4.2.2 on 2024-06-27 08:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0050_delete_sidebarstatus_userprofile_sidebar_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customers',
            name='phone',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterUniqueTogether(
            name='customers',
            unique_together={('phone', 'branch')},
        ),
    ]