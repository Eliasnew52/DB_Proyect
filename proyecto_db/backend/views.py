from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, TemplateView, DetailView
from django.urls import reverse_lazy

from .forms import *
from .models import *
from .utils import Stock_Update
import os


all_products = Producto.objects.all()
# Create your views here.

class DashboardView(TemplateView):
    template_name = 'dashboard/index.html'

def NewProduct(request):
    if request.method =='POST':
        NewProductForm = ProductoForm(request.POST, request.FILES)
        if NewProductForm.is_valid():
            NewProductForm.save()
            return redirect('NewProduct')
    else:
        NewProductForm = ProductoForm()
        return render(request,'NewProduct.html', {'NewProductForm': NewProductForm})

# Vista de Compras

def BuyProduct(request):
    if request.method == 'POST':
        compra_form = CompraForm(request.POST)
        detalle_compra_formset = DetalleCompraFormSet(request.POST)
        if compra_form.is_valid() and detalle_compra_formset.is_valid():
            compra = compra_form.save()
            detalles = detalle_compra_formset.save(commit=False)
            for detalle in detalles:
                detalle.compra = compra
                detalle.save()
            Stock_Update(compra, 'Entrada')  # Actualizar el stock
            return redirect('BuyProduct')
    else:
        compra_form = CompraForm()
        detalle_compra_formset = DetalleCompraFormSet()
    return render(request, 'NewBuy.html', {'compra_form': compra_form, 'detalle_compra_formset': detalle_compra_formset})
    
def SellProduct(request):
    if request.method == 'POST':
        venta_form = VentaForm(request.POST)
        detalle_venta_formset = DetalleVentaFormSet(request.POST)
        
        if venta_form.is_valid() and detalle_venta_formset.is_valid():
            venta = venta_form.save()
            detalles = detalle_venta_formset.save(commit=False)
            for detalle in detalles:
                detalle.venta = venta
                detalle.save()
            venta.calcular_total()
            Stock_Update(venta, 'Salida')  # Actualizar el stock
            return redirect('SellProduct')
    else:
        venta_form = VentaForm()
        detalle_venta_formset = DetalleVentaFormSet()
        #print(detalle_venta_formset.management_form)
    return render(request, 'NewSell.html', {'venta_form': venta_form, 'detalle_venta_formset': detalle_venta_formset})

#Inventory

def Inventory(request):
    items = Producto.objects.all()
    
    if request.method == 'POST':
        pass
    else:
        return render(request, 'Inventory.html', {'items':items})

def EditProduct(request, product_id):
    # Obtiene el producto o lanza 404 si no existe
    product = get_object_or_404(Producto, id=product_id)
    
    if request.method == 'POST':
        form = ProductoEditForm(request.POST, instance=product)  # Asocia datos del POST al formulario
        if form.is_valid():
            form.save()  # Guarda los cambios en la base de datos
            return redirect('Inventory')  # Redirige a la vista de inventario
    else:
        form = ProductoEditForm(instance=product)  # Precarga los datos del producto en el formulario

    # Renderiza la página con el formulario
    return render(request, 'EditProduct.html', {'product': product, 'form': form})

class SaleCreateView(TemplateView):
    template_name = 'dashboard/create_sale.html'

class ProductoListView(ListView):
    model = Producto
    template_name = 'dashboard/list_products.html'
    context_object_name = 'productos'

class ProductoCreateView(CreateView):
    model = Producto
    form_class = ProductoForm
    template_name = 'dashboard/create_product.html'
    success_url = reverse_lazy('list_product')

class ProductoUpdateView(UpdateView):
    model = Producto
    form_class = ProductoForm
    template_name = 'dashboard/update_product.html'
    success_url = reverse_lazy('list_product')
    context_object_name = 'product'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categorias'] = Categoria.objects.all()
        if self.object.imagen:
            image_path = self.object.imagen.path
            context['image_size'] = os.path.getsize(image_path)
        else:
            context['image_size'] = None
        return context

class ProductoDeleteView(DeleteView):
    model = Producto
    template_name = 'producto_confirm_delete.html'
    success_url = reverse_lazy('list_product')

class CategoryListView(ListView):
    model = Categoria
    template_name = 'dashboard/list_categories.html'
    context_object_name = 'categories'

class CategoryCreateView(CreateView):
    model = Categoria
    form_class = CategoryForm
    template_name = 'dashboard/create_category.html'
    success_url = reverse_lazy('list_category')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)
    
class ProductoDetailView(DetailView):
    model = Producto
    template_name = 'dashboard/detail_product.html'
    context_object_name = 'product'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.object.imagen:
            image_path = self.object.imagen.path
            context['image_size'] = os.path.getsize(image_path)
        else:
            context['image_size'] = None
        return context

class CategoryDetailView(DetailView):
    model = Categoria
    template_name = 'dashboard/detail_category.html'
    context_object_name = 'category'