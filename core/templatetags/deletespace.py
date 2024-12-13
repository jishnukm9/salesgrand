from django import template


register = template.Library()

@register.filter
def deletespace(value):
    return value.replace(" ","")