from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, TemplateView, DetailView, FormView
from django.urls import reverse_lazy
from django.utils.dateparse import parse_date
from django.db.models import Sum

from .forms import *
from .models import *
from .utils import Stock_Update
from .files import ExcelNewProduct
import os
from datetime import timedelta
import json


all_products = Producto.objects.all()
# Create your views here.

class DashboardView(TemplateView):
    template_name = 'dashboard/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Categoria.objects.all()
        context['all_products'] = Producto.objects.all()
        
        context['products'] = Producto.objects.count()
        context['sells'] = Venta.objects.count()
        context['buys'] = Compra.objects.count()
        context['clients'] = Cliente.objects.count()
        context['providers'] = Proveedor.objects.count()

        #Recopilacion de Dinero Ganado (solo para Pagado)
        context['total_income'] = Venta.objects.aggregate(total=Sum('total'))['total'] or 0
        context['total_pending'] = Venta.objects.filter(estado='Pendiente').aggregate(total=Sum('total'))['total'] or 0
        context['total_payed'] = Venta.objects.filter(estado='Pagado').aggregate(total=Sum('total'))['total'] or 0
        print(context)
        return context

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
    products = Producto.objects.all()
    categories = Categoria.objects.all()
    if request.method == 'POST':
        # Formularios de la venta y los detalles
        venta_form = VentaForm(request.POST)
        detalle_venta_formset = DetalleVentaFormSet(request.POST)

        # Validación de formularios
        if venta_form.is_valid() and detalle_venta_formset.is_valid():
            # Guardar la venta
            venta = venta_form.save()

            # Asignar la venta a cada detalle y guardarlos
            detalles = detalle_venta_formset.save(commit=False)
            for detalle in detalles:
                detalle.venta = venta
                detalle.save()

            # Calcular total y actualizar el stock
            venta.calcular_total()
            Stock_Update(venta, 'Salida')  # Función personalizada para manejar el stock

            # Redirigir tras la venta exitosa
            return redirect('list_product')  # Cambia 'SellProduct' por la URL deseada
        else:
            print(venta_form.errors)
            print(detalle_venta_formset.errors)

    else:
        # Inicialización de formularios en caso de GET
        venta_form = VentaForm()
        detalle_venta_formset = DetalleVentaFormSet()

    # Renderizar el template con los formularios
    return render(request, 'NewSell.html', {
        'venta_form': venta_form,
        'detalle_venta_formset': detalle_venta_formset,
        'products':products,
        'categories':categories
    })


#Inventory

def Inventory(request):
    items = Producto.objects.all()
    
    if request.method == 'POST':
        pass
    else:
        return render(request, 'Inventory.html', {'items':items})


            


class CreateSaleView(CreateView):
    model = Venta
    form_class = VentaForm
    template_name = 'dashboard/create_sale.html'
    success_url = reverse_lazy('report_sales')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Categoria.objects.all()
        context['products'] = Producto.objects.all()
        return context



    @transaction.atomic
    def form_valid(self, form):
        try:
            self.object = form.save(commit=False)
            self.object.creado_por = self.request.user
            
            productos_data = json.loads(form.cleaned_data['products_data'])
            print("productos_data", productos_data)
            self.object.create_sale(productos_data)
            
            FacturaVenta.objects.create(venta=self.object)
            
            return redirect(self.get_success_url())
            
        except Exception as e:
            print("ee")
            form.add_error(None, f"Error: {str(e)}")
            return self.form_invalid(form)

class ProductoListView(ListView):
    model = Producto
    template_name = 'dashboard/list_products.html'
    context_object_name = 'productos'

class ProductoCreateView(CreateView):
    model = Producto
    form_class = ProductoForm
    template_name = 'dashboard/create_product.html'
    success_url = reverse_lazy('list_product')

    def form_valid(self, form): 
        form.instance.creado_por = self.request.user
        return super().form_valid(form)

class ProductoUpdateView(UpdateView):
    model = Producto
    form_class = ProductoForm
    template_name = 'dashboard/update_product.html'
    success_url = reverse_lazy('list_product')
    context_object_name = 'product'

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

class ProductoDeleteView(DeleteView):
    model = Producto
    success_url = reverse_lazy('list_product')

class BrandListView(ListView):
    model = Marca
    template_name='dashboard/list_brands.html'
    context_object_name='marcas'
class BrandCreateView(CreateView):
    model = Marca
    template_name='dashboard/create_brand.html'
    form_class = BrandForm
    success_url = reverse_lazy('list_brands')

    def form_valid(self, form):
        form.instance.creado_por = self.request.user
        return super().form_valid(form)

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
        form.instance.creado_por = self.request.user
        return super().form_valid(form)
class CategoryDetailView(DetailView):
    model = Categoria
    template_name = 'dashboard/detail_category.html'
    context_object_name = 'category'

class CategoryUpdateView(UpdateView):
    model = Categoria
    form_class = CategoryForm
    template_name = 'dashboard/update_category.html'
    success_url = reverse_lazy('list_category')
    context_object_name = 'category'
class CategoryDeleteView(DeleteView):
    model = Categoria
    success_url = reverse_lazy('list_category')

class SupplierListView(ListView):
    model = Proveedor
    template_name = 'dashboard/list_suppliers.html'
    context_object_name = 'suppliers'

class SupplierCreateView(CreateView):
    context_object_name = 'supplier'

    model = Proveedor
    form_class = SupplierForm
    template_name = 'dashboard/create_supplier.html'
    success_url = reverse_lazy('list_supplier')

    def form_valid(self, form):
        form.instance.creado_por = self.request.user
        return super().form_valid(form)
class SupplierUpdateView(UpdateView):
    model = Proveedor
    form_class = SupplierForm
    template_name = 'dashboard/update_supplier.html'
    success_url = reverse_lazy('list_supplier')

class SupplierDeleteView(DeleteView):
    model = Proveedor
    success_url = reverse_lazy('list_supplier')

class CustomerListView(ListView):
    model = Cliente
    template_name = 'dashboard/list_customers.html'
    context_object_name = 'customers'

class CustomerCreateView(CreateView):
    model = Cliente
    form_class = CustomerForm
    template_name = 'dashboard/create_customer.html'
    success_url = reverse_lazy('list_customer')

class CustomerUpdateView(UpdateView):
    model = Cliente
    form_class = CustomerForm
    template_name = 'dashboard/update_customer.html'
    success_url = reverse_lazy('list_customer')

class CustomerDeleteView(DeleteView):
    model = Cliente
    success_url = reverse_lazy('list_customer')

    
class PurchaseCreateView(CreateView):
    model = Compra
    form_class = CompraForm
    template_name = 'dashboard/create_purchase.html'
    success_url = reverse_lazy('report_purchases')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Categoria.objects.all()
        context['productos'] = Producto.objects.all()
        if self.request.POST:
            context['detalle_compra_formset'] = DetalleCompraFormSet(self.request.POST)
        else:
            context['detalle_compra_formset'] = DetalleCompraFormSet()
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        detalle_compra_formset = context['detalle_compra_formset']
        if form.is_valid() and detalle_compra_formset.is_valid():
            self.object = form.save()
            detalle_compra_formset.instance = self.object
            detalle_compra_formset.save()
            Stock_Update(self.object, 'Entrada')
            return redirect(self.success_url)
        else:
            return self.form_invalid(form)

    def form_invalid(self, form):
        context = self.get_context_data()
        detalle_compra_formset = context['detalle_compra_formset']
        context['form_errors'] = form.errors
        context['form_non_field_errors'] = form.non_field_errors()
        context['detalle_compra_formset_errors'] = detalle_compra_formset.errors
        context['detalle_compra_formset_non_field_errors'] = detalle_compra_formset.non_form_errors()
        print(form.errors)
        print(detalle_compra_formset.errors)
        return self.render_to_response(context)
# Reportes

class InventoryReportView(ListView):
    model = Producto
    template_name = 'dashboard/report_inventory.html'
    context_object_name = 'productos'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['productos'] = self.get_filtered_products()
        context['proveedores'] = Proveedor.objects.all()
        return context

    def get_filtered_products(self):
        productos = Producto.objects.all()
        proveedor_id = self.request.GET.get('proveedor')
        from_date = self.request.GET.get('from_date')
        to_date = self.request.GET.get('to_date')

        if proveedor_id:
            productos = productos.filter(proveedor_id=proveedor_id)
        if from_date:
            from_date = parse_date(from_date)
            productos = productos.filter(ultima_actualizacion__date__gte=from_date)
        if to_date:
            to_date = parse_date(to_date)
            productos = productos.filter(ultima_actualizacion__date__lte=to_date)

        return productos

class SalesReportView(ListView):
    model = Venta
    template_name = 'dashboard/report_sales.html'
    context_object_name = 'ventas'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ventas'] = self.get_filtered_sales()
        return context

    def get_filtered_sales(self):
        ventas = Venta.objects.all()
        from_date = self.request.GET.get('from_date')
        to_date = self.request.GET.get('to_date')

        if from_date:
            from_date = parse_date(from_date)
            ventas = ventas.filter(fecha__date__gte=from_date)
        if to_date:
            to_date = parse_date(to_date)
            ventas = ventas.filter(fecha__date__lte=to_date)

        return ventas
    
class PurchasesReportView(ListView):
    model = Compra
    template_name = 'dashboard/report_purchases.html'
    context_object_name = 'compras'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['compras'] = self.get_filtered_purchases()
        return context

    def get_filtered_purchases(self):
        compras = Compra.objects.all()
        from_date = self.request.GET.get('from_date')
        to_date = self.request.GET.get('to_date')

        if from_date:
            from_date = parse_date(from_date)
            compras = compras.filter(fecha__date__gte=from_date)
        if to_date:
            to_date = parse_date(to_date)
            compras = compras.filter(fecha__date__lte=to_date)

        return compras
    
class InvoicesReportView(ListView):
    model = FacturaVenta
    template_name = 'dashboard/report_invoices.html'
    context_object_name = 'facturas'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['facturas'] = self.get_filtered_invoices()
        return context

    def get_filtered_invoices(self):
        facturas = FacturaVenta.objects.all()
        from_date = self.request.GET.get('from_date')
        to_date = self.request.GET.get('to_date')

        if from_date:
            from_date = parse_date(from_date)
            facturas = facturas.filter(fecha_emision__date__gte=from_date)
        if to_date:
            to_date = parse_date(to_date)
            facturas = facturas.filter(fecha_emision__date__lte=to_date)

        return facturas

# Implementacion de Excel 


class ExcelUploadView(FormView):
    template_name = 'dashboard/import_excel.html'
    form_class = ExcelBuyForm
    success_url = reverse_lazy('list_product')

    def form_valid(self, form):
        file = form.cleaned_data['archivo']
        proveedor = form.cleaned_data['proveedor']
        ExcelNewProduct(file, proveedor.id)
        return super().form_valid(form)