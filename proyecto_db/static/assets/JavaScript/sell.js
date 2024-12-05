document.addEventListener('DOMContentLoaded', function () {
    // Función para agregar el botón "Eliminar" a una fila
    function addDeleteButton(row) {
        const actionCell = row.querySelector('td:last-child'); // Última celda
        actionCell.innerHTML = ''; // Asegúrate de que la celda esté vacía

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'btn btn-danger btn-remove';
        deleteButton.style.cssText = 'margin: 5px;';

        // Evento para eliminar la fila
        deleteButton.addEventListener('click', function () {
            const totalForms = document.querySelector('#id_detalleventa_set-TOTAL_FORMS');
            row.remove(); // Elimina la fila actual
            totalForms.value = parseInt(totalForms.value) - 1; // Decrementa el contador total de formularios
        });

        actionCell.appendChild(deleteButton);
    }

    // Agregar botones "Eliminar" a las filas existentes al cargar la página
    document.querySelectorAll('.detalleventa-form').forEach(function (row) {
        addDeleteButton(row);
    });

    // Evento para cada botón "Agregar" en las cards
    document.querySelectorAll('.add-product-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            const nombre = this.getAttribute('data-nombre');
            let precio = this.getAttribute('data-precio');

            // Reemplazar comas por puntos
            precio = precio.replace(',', '.');

            console.log(`ID: ${id}, Nombre: ${nombre}, Precio (formateado): ${precio}`);
            updateFirstFormOrAddNew(id, nombre, precio);
        });
    });

    // Evento para el botón "Añadir Producto"
    document.getElementById('add-form').addEventListener('click', function () {
        addProductToFormset(null, null, null); // Agrega un formulario vacío
    });

    // Función para completar el primer formulario o agregar uno nuevo
    function updateFirstFormOrAddNew(id, nombre, precio) {
        const firstProductInput = document.querySelector('select[name="detalleventa_set-0-producto"]');
        const firstPriceInput = document.querySelector('input[name="detalleventa_set-0-precio_unitario"]');
        const firstQuantityInput = document.querySelector('input[name="detalleventa_set-0-cantidad"]');
        const firstDiscountInput = document.querySelector('input[name="detalleventa_set-0-descuento"]');

        // Si el primer formulario está vacío, completa sus valores
        if (!firstProductInput.value) {
            firstProductInput.value = id;
            firstPriceInput.value = precio;
            firstQuantityInput.value = 1; // Cantidad por defecto
            firstDiscountInput.value = 0; // Descuento por defecto
        } else {
            // Si ya está lleno, agrega un nuevo formulario
            addProductToFormset(id, nombre, precio);
        }
    }

    // Función para agregar un producto al formset
    function addProductToFormset(id, nombre, precio) {
        const totalForms = document.querySelector('#id_detalleventa_set-TOTAL_FORMS');
        const formIndex = parseInt(totalForms.value);

        const tableBody = document.querySelector('#detalleventa-table tbody');
        const lastRow = tableBody.querySelector('.detalleventa-form:last-of-type');
        const newRow = lastRow.cloneNode(true);

        // Actualizar los valores en los inputs del nuevo formulario
        newRow.querySelectorAll('input, select, textarea').forEach(function (input) {
            const name = input.name.replace(`-${formIndex - 1}-`, `-${formIndex}-`);
            const idInput = input.id.replace(`-${formIndex - 1}-`, `-${formIndex}-`);
            input.name = name;
            input.id = idInput;

            // Asignar valores automáticamente
            if (input.name.includes('producto')) {
                input.value = id || ''; // ID del producto o vacío
            } else if (input.name.includes('precio_unitario')) {
                input.value = precio || ''; // Precio del producto o vacío
            } else if (input.name.includes('cantidad')) {
                input.value = id ? 1 : ''; // Por defecto, cantidad 1 si es automático
            } else if (input.name.includes('descuento')) {
                input.value = 0; // Por defecto, descuento 0
            } else {
                input.value = ''; // Limpiar otros valores
            }
        });

        // Agregar el nuevo formulario al cuerpo de la tabla
        tableBody.appendChild(newRow);

        // Incrementar el contador total de formularios
        totalForms.value = formIndex + 1;

        // Agregar botón "Eliminar" a la nueva fila
        addDeleteButton(newRow);
    }
});
