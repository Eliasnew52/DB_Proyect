from django.db import models
from datetime import timedelta
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from django.db.models import F
from django.core.exceptions import ValidationError
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db import transaction
from decimal import Decimal
from django.contrib.postgres.indexes import GinIndex
from jsonschema import validate, ValidationError


def default_product_schema():
    return {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {},
        "required": []
    }

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    product_schema = models.JSONField(default=default_product_schema, blank=True,)

    class Meta: 
        verbose_name_plural='Categories'

    def __str__(self):
        return self.name

class Company(models.Model):
    name = models.CharField(max_length=100, unique=True)
    last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    class Meta: 
        verbose_name_plural='Companies'

    def __str__(self):
        return self.name

class Supplier(models.Model):
    name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=255, blank=True, null=True, unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    brands = models.ManyToManyField('Brand')
    last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f'{self.name} - {self.company}'

class Product(models.Model):
    name = models.CharField(max_length=100)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    minimum_stock = models.IntegerField()
    stock = models.IntegerField()
    last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    suppliers = models.ManyToManyField(Supplier, blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    active = models.BooleanField(default=True)
    brand = models.ForeignKey('Brand', on_delete=models.PROTECT, related_name='products', blank=True, null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    attributes = models.JSONField(
        default=default_product_schema,
        blank=True,
        help_text="Atributos específicos según el tipo de producto"
    )

    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['stock']),
            GinIndex(fields=['attributes'], name='gin_attributes')
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(stock__gte=0),
                name='non_negative_stock'
            )
        ]

    def clean(self):
        if self.stock < 0:
            raise ValidationError("Stock cannot be negative")
        if self.sale_price < self.purchase_price:
            raise ValidationError("Sale price cannot be lower than purchase price")
        
        if self.category and self.category.product_schema:
            try:
                validate(instance=self.attributes, schema=self.category.product_schema)
            except ValidationError as e:
                raise ValidationError({'attributes': f"Datos inválidos: {e.message}"})

        
    def check_stock(self, required_quantity):
        return self.stock >= required_quantity
    
    def get_attribute(self, key, default=None):
        return self.attributes.get(key, default)
    
    def update_attributes(self, new_attributes):
        self.attributes.update(new_attributes)
        self.save(update_fields=['attributes'])

    def __str__(self):
        return self.name

class Purchase(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    invoice_image = models.ImageField(upload_to='purchases/invoices/', blank=True, null=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[
        ('PENDING', 'Pending'),
        ('RECEIVED', 'Received'),
        ('CANCELLED', 'Cancelled')
    ], default='PENDING')
    notes = models.TextField(blank=True, null=True)
    invoice_number = models.CharField(
        max_length=50, 
        unique=True, 
        blank=True, 
        null=True,
        verbose_name="Número de Factura"
    )
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True) 
    last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def clean(self):
        if self.total < 0:
            ValidationError("Total cannot be negative")

    def __str__(self):
        return f"Purchase {self.id} - {self.date}"

class PurchaseDetail(models.Model):
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.product.stock = F('stock') + self.quantity
        self.product.purchase_price = self.unit_price
        self.product.save()
        super().save(*args, **kwargs)
        
        StockMovement.objects.create(
            product=self.product,
            quantity=self.quantity,
            movement_type='In',
            purchase=self.purchase
        )

    def __str__(self):
        return f"{self.product.name} - {self.quantity} units"

class Customer(models.Model):
    name = models.CharField(max_length=100, unique=True)
    address = models.TextField(blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True, unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return self.name
    
class Discount(models.Model):
    class ScopeType(models.TextChoices):
        ALL_PRODUCTS = 'ALL', 'All products'
        SELECTED_PRODUCTS = 'PROD', 'Specific products'
        ALL_CATEGORIES = 'CAT_ALL', 'All categories'
        SELECTED_CATEGORIES = 'CAT', 'Specific categories'

    class DiscountType(models.TextChoices):
        PERCENTAGE = 'POR', 'Percentage'
        FIXED_AMOUNT = 'FIX', 'Fixed Amount'

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=3, choices=DiscountType.choices)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    scope = models.CharField(
        max_length=10,
        choices=ScopeType.choices,
        default=ScopeType.SELECTED_PRODUCTS
    )
    products = models.ManyToManyField(Product, blank=True)
    categories = models.ManyToManyField(Category, blank=True)
    active = models.BooleanField(
        default=True,
        help_text="Discount available to apply"
    )
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return f"{self.name}"

    def clean(self):
        if self.scope == self.ScopeType.SELECTED_PRODUCTS and not self.products.exists():
            raise ValidationError("You must select at least one product for this scope")
            
        if self.scope == self.ScopeType.SELECTED_CATEGORIES and not self.categories.exists():
            raise ValidationError("You must select at least one category for this scope")

    def applicable_products(self):
        """Returns queryset with products eligible for discount"""
        if self.scope == self.ScopeType.ALL_PRODUCTS:
            return Product.objects.all()
        
        if self.scope == self.ScopeType.ALL_CATEGORIES:
            return Product.objects.filter(category__isnull=False)
        
        if self.scope == self.ScopeType.SELECTED_CATEGORIES:
            return Product.objects.filter(category__in=self.categories.all())
        
        return self.products.all()

    def apply_to_product(self, product):
        """Checks if discount applies to a specific product"""
        if not self.active:
            return False
            
        if self.scope == self.ScopeType.ALL_PRODUCTS:
            return True
            
        if self.scope == self.ScopeType.ALL_CATEGORIES and product.category:
            return True
            
        if self.scope == self.ScopeType.SELECTED_CATEGORIES:
            return product.category in self.categories.all()
            
        return product in self.products.all()

    def calculate_discount(self, original_price):
        if not self.is_active:
            return 0
            
        if self.type == self.DiscountType.PERCENTAGE:
            return original_price * (self.value / 100)
            
        return min(self.value, original_price)    

class Sale(models.Model):

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('CANCELLED', 'Cancelled')
    ]

    date = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.ForeignKey('PaymentMethod', on_delete=models.PROTECT)
    status = models.CharField(choices=STATUS_CHOICES, max_length=100, default=STATUS_CHOICES[0][0])
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='SaleDetail')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        ordering = ['-date']
        indexes = [
            models.Index(fields=['-date', 'customer']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"Sale {self.id} - {self.date}"

class SaleDetail(models.Model):
    sale = models.ForeignKey('Sale', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.ForeignKey('Discount', null=True, blank=True, on_delete=models.SET_NULL)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    sale_attributes = models.JSONField(
        default=dict,
        help_text="Atributos del producto al momento de la venta"
    )

    def save(self, *args, **kwargs):
        if not self.sale_attributes and self.product:
            self.sale_attributes = self.product.attributes.copy()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - {self.quantity} units from {self.sale}"

class SaleInvoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    issue_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    total_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    sale = models.ForeignKey('Sale', on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.issue_date}"

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            self.invoice_number = f"I-{self.sale.id}"
        if not self.issue_date:
            self.issue_date = timezone.now()
        if not self.due_date:
            self.due_date = self.issue_date + timedelta(days=30)
        self.total_discount = sum(detail.discount * detail.quantity for detail in SaleDetail.objects.filter(sale=self.sale))
        self.total_amount = self.total - self.total_discount
        super(SaleInvoice, self).save(*args, **kwargs)

class StockMovement(models.Model):
    MOVEMENT_TYPE_CHOICES = [
        ('In', 'In'),
        ('Out', 'Out'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    movement_type = models.CharField(max_length=10, choices=MOVEMENT_TYPE_CHOICES)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.movement_type} of {self.quantity} units of {self.product.name}"

class PurchaseReturn(models.Model):
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    reason = models.TextField()
    date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected')
    ], default='PENDING')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.quantity > self.purchase.purchasedetail_set.get(product=self.product).quantity:
            raise ValidationError("Return quantity exceeds original purchase")
            
        super().save(*args, **kwargs)
        
        if self.status == 'APPROVED':
            self.product.stock = F('stock') - self.quantity
            self.product.save()
            
            StockMovement.objects.create(
                product=self.product,
                quantity=self.quantity,
                movement_type='Out',
                purchase_return=self
            )

class SaleReturn(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    reason = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected')
    ], default='PENDING')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    def save(self, *args, **kwargs):
        original_detail = self.sale.saledetail_set.get(product=self.product)
        if self.quantity > original_detail.quantity:
            raise ValidationError("Return quantity exceeds original sale")
        
        super().save(*args, **kwargs)
        
        if self.status == 'APPROVED':
            self.product.stock = F('stock') + self.quantity
            self.product.save()
            
            StockMovement.objects.create(
                product=self.product,
                quantity=self.quantity,
                movement_type='In',
                sale_return=self
            )

class PaymentMethod(models.Model):
    class Types(models.TextChoices):
        CASH = 'CA', 'Cash'
        CREDIT_CARD = 'CC', 'Credit Card'
        DEBIT_CARD = 'DC', 'Debit Card'
    
    name = models.CharField(max_length=2, choices=Types.choices, unique=True)
    description = models.TextField(blank=True, null=True)
    active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)

class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    creation_date = models.DateField(auto_now_add=True)
    image = models.ImageField(upload_to='brands/', blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    
    class Meta:
        verbose_name = 'Brand'
        verbose_name_plural = 'Brands'
        ordering = ['name']
        indexes = [
            models.Index(fields=['name'], name='idx_brand_name')
        ]

    def __str__(self):
        return f"Brand {self.name}"