# Generated by Django 4.2.2 on 2024-02-20 10:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='servicechargerequests',
            name='branch',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='branch_servicechargerequests', to='core.branch'),
        ),
        migrations.AddField(
            model_name='sparerequests',
            name='branch',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='branch_sparerequests', to='core.branch'),
        ),
    ]
