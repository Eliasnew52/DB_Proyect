from django import forms
from .models import *

# Formulario para Crear Productos

class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = [
            'nombre',
            'precio_venta',
            'precio_compra',
            'descripcion',
            'stock_minimo',
            'stock',
            'categoria',
            'proveedores',
            'imagen',
        ]


#Formulario para las Compras

class DetalleCompraForm(forms.ModelForm):
    class Meta:
        model = DetalleCompra
        fields = ['producto', 'cantidad', 'precio_unitario']

#Formset
DetalleCompraFormSet = forms.inlineformset_factory(
    Compra, DetalleCompra, form=DetalleCompraForm, extra=1, can_delete=False
)

class CompraForm(forms.ModelForm):
    class Meta:
        model = Compra
        fields = ['total', 'proveedor']

#Form de Venta

class DetalleVentaForm(forms.ModelForm):
    class Meta:
        model = DetalleVenta
        fields = ['producto', 'cantidad', 'precio_unitario', 'descuento']

class VentaForm(forms.ModelForm):
    class Meta:
        model = Venta
        fields = ['total', 'forma_de_pago', 'estado', 'cliente']

DetalleVentaFormSet = forms.inlineformset_factory(
    Venta, DetalleVenta, form=DetalleVentaForm, extra=1, can_delete=False
)


#Product Edit Form
class ProductoEditForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = [
            'nombre',
            'precio_venta',
            'precio_compra',
            'descripcion',
            'stock_minimo',
            'stock',
            'categoria',
            'proveedores'
        ]

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Categoria
        exclude = ['created_by']