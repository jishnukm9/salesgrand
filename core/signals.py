from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CoASubAccounts, GeneralLedger

@receiver(post_save, sender=CoASubAccounts)
def update_general_ledger_entries(sender, instance, **kwargs):
    if instance.head_root:
        # Update all GeneralLedger entries that reference this CoASubAccounts
        GeneralLedger.objects.filter(subledger=instance).update(ledger=instance.head_root)