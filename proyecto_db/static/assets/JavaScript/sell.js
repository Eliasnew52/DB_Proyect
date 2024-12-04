document.addEventListener('DOMContentLoaded', function () {
    const selectedProductsContainer = document.getElementById('selected-products');
    const formsetContainer = document.getElementById('formset-container');
    const totalFormsInput = document.querySelector('#id_detalleventa_set-TOTAL_FORMS');
    const totalItemsElement = document.getElementById('total-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutTotalElement = document.getElementById('checkout-total');
    const clearAllButton = document.getElementById('clear-all');

    let selectedProducts = []; // Lista de productos seleccionados

    // Manejo de selección de productos
    document.querySelectorAll('.productset').forEach(function (productElement) {
        productElement.addEventListener('click', function () {
            const productId = productElement.getAttribute('data-product-id');
            const productName = productElement.getAttribute('data-product-name');
            const productPrice = parseFloat(productElement.getAttribute('data-product-price'));

            const existingProduct = selectedProducts.find(product => product.id === productId);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                selectedProducts.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1,
                });
            }

            updateSelectedProducts();
            syncFormsetWithCart();
        });
    });

    // Limpia todo el carrito y el formset
    clearAllButton.addEventListener('click', function () {
        selectedProducts = [];
        updateSelectedProducts();
        syncFormsetWithCart();
    });

    // Actualiza la lista de productos seleccionados en el carrito
    function updateSelectedProducts() {
        selectedProductsContainer.innerHTML = '';
        let totalItems = 0;
        let subtotal = 0;

        selectedProducts.forEach(function (product) {
            totalItems += product.quantity;
            subtotal += product.price * product.quantity;

            const productElement = document.createElement('ul');
            productElement.classList.add('product-lists');
            productElement.innerHTML = `
                <li>
                    <div class="productimg">
                        <div class="productimgs">
                            <img src="{% static 'assets/img/product/noimage.png' %}" alt="img" style="width: 72px; height: 72px;" />
                        </div>
                        <div class="productcontet">
                            <h4>${product.name}</h4>
                            <div class="productlinkset">
                                <h5>ID ${product.id}</h5>
                            </div>
                            <div class="increment-decrement">
                                <div class="input-groups">
                                    <input type="button" value="-" class="button-minus dec button" data-product-id="${product.id}" />
                                    <input type="text" name="child" value="${product.quantity}" class="quantity-field" readonly />
                                    <input type="button" value="+" class="button-plus inc button" data-product-id="${product.id}" />
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                <li>${(product.price * product.quantity).toFixed(2)}</li>
                <li>
                    <a href="javascript:void(0);" class="ms-2" data-product-id="${product.id}" data-action="remove">
                        <img src="{% static 'assets/img/icons/delete-2.svg' %}" alt="img" />
                    </a>
                </li>
            `;

            selectedProductsContainer.appendChild(productElement);
        });

        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        totalItemsElement.textContent = totalItems;
        subtotalElement.textContent = `${subtotal.toFixed(2)}$`;
        taxElement.textContent = `${tax.toFixed(2)}$`;
        totalElement.textContent = `${total.toFixed(2)}$`;
        checkoutTotalElement.textContent = `${total.toFixed(2)}$`;
    }

    // Sincroniza los datos del carrito con el formset
    function syncFormsetWithCart() {
        // Reiniciar el formset
        formsetContainer.querySelectorAll('.detalleventa-form').forEach(function (form, index) {
            if (index >= selectedProducts.length) {
                form.remove(); // Elimina formularios innecesarios
            }
        });

        selectedProducts.forEach(function (product, index) {
            let form = formsetContainer.querySelector(`.detalleventa-form:nth-of-type(${index + 1})`);

            // Si el formulario no existe, clonar uno nuevo
            if (!form) {
                const lastForm = formsetContainer.querySelector('.detalleventa-form:last-of-type');
                form = lastForm.cloneNode(true);
                formsetContainer.appendChild(form);
            }

            // Actualizar los campos del formulario con datos del producto
            form.querySelectorAll('input, select').forEach(function (field) {
                if (field.name.includes('producto')) {
                    field.value = product.id;
                } else if (field.name.includes('cantidad')) {
                    field.value = product.quantity;
                } else if (field.name.includes('precio_unitario')) {
                    field.value = product.price;
                }
            });
        });

        // Actualizar el número total de formularios
        totalFormsInput.value = selectedProducts.length;
    }
});
