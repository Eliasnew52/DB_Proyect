from pandas import read_excel
from .models import Producto, Categoria, Proveedor
from datetime import datetime

def ExcelNewProduct(file, Proveedor):
    date = datetime.now()
    categoria = Categoria.objects.get(nombre='Import')
    if file:
        try:
            DataFrame = read_excel(file)
            for index, row in DataFrame.iterrows():
                NewProduct = Producto(
                    nombre=row['Nombre'],
                    precio_venta=0,
                    precio_compra=row['Precio'],
                    descripcion=f"Imported From Excel on {date}",
                    stock=row['Cantidad'],
                    stock_minimo=0,
                    categoria=categoria
                    
                )
                NewProduct.save()
                NewProduct.proveedores.add(Proveedor)
        except Exception as e:
            print(f"Error al procesar el archivo: {e}")
    else:
        print("No se ha proporcionado ningún archivo")
