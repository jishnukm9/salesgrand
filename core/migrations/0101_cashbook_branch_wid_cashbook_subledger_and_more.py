# Generated by Django 4.2.10 on 2024-12-28 07:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0100_suppliers_supplier_ledger'),
    ]

    operations = [
        migrations.AddField(
            model_name='cashbook',
            name='branch_wid',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='cash_book', to='core.branch'),
        ),
        migrations.AddField(
            model_name='cashbook',
            name='subledger',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='core.coasubaccounts'),
        ),
        migrations.AddField(
            model_name='transaction',
            name='subledger',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='core.coasubaccounts'),
        ),
    ]
