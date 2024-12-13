
from django import template


register = template.Library()


@register.filter
def subtract(value, arg):
    return value - arg




@register.filter
def replaceunderscore(value):
    return value.replace("_"," ")



@register.simple_tag
def merge_keys(receipt_list, payment_list,journal_list):
    """Get unique keys from both receipt and payment lists"""
    keys = set()
    for item in receipt_list:
        keys.update(item.keys())
    for item in payment_list:
        keys.update(item.keys())
    for item in journal_list:
        keys.update(item.keys())
    return sorted(keys)

@register.filter
def get_value(list_of_dicts, key):
    """Get value for a key from a list of dictionaries"""
    for item in list_of_dicts:
        if key in item:
            return item[key]
    return 0