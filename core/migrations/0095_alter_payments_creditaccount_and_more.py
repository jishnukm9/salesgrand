# Generated by Django 4.2.10 on 2024-12-14 17:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0094_alter_journals_creditaccount_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payments',
            name='creditaccount',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='receipts',
            name='debitaccount',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]