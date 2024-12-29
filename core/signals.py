from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CoASubAccounts, GeneralLedger,Customers,Service

@receiver(post_save, sender=CoASubAccounts)
def update_general_ledger_entries(sender, instance, **kwargs):
    if instance.head_root:
        # Update all GeneralLedger entries that reference this CoASubAccounts
        GeneralLedger.objects.filter(subledger=instance).update(ledger=instance.head_root)



@receiver(post_save, sender=Customers)
def update_service_entries(sender, instance, **kwargs):
    if instance.customertype:
        Service.objects.filter(customerid=instance.unique_id).update(customertype=instance.customertype)
        Service.objects.filter(customerid=instance.unique_id).update(firstname=instance.firstname)
        Service.objects.filter(customerid=instance.unique_id).update(lastname=instance.lastname)
        Service.objects.filter(customerid=instance.unique_id).update(phone=instance.phone)