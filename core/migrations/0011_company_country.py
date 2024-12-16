# Generated by Django 4.2.2 on 2024-03-11 06:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_alter_sale_branch'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='country',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='core.country'),
        ),
    ]