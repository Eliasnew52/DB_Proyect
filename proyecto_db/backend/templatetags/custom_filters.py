from django import template

register = template.Library()

@register.filter
def unique_categories(productos):
    return {producto.categoria.nombre for producto in productos}

@register.filter
def unique(detalles):
    """
    Returns a list of unique categories from the given list of detalles.
    """
    categorias = set()
    for detalle in detalles:
        categorias.add(detalle.producto.categoria.nombre)
    return list(categorias)

@register.filter
def dict(value, key):
    """Accede a un diccionario con una clave dinámica en las plantillas."""
    return value.get(key)