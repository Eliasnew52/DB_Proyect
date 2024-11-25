from django import template

register = template.Library()

@register.filter
def unique_categories(productos):
    return {producto.categoria.nombre for producto in productos}
