from django.db.models.signals import pre_save, post_save, post_delete
from backend.models import SaleDetail 
from django.dispatch import receiver

@receiver(post_save, sender=SaleDetail)
@receiver(post_delete, sender=SaleDetail)
def update_sale_total(sender, instance, **kwargs):
    instance.sale.update_total()