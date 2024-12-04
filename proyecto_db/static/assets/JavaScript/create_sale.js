
    document.addEventListener('DOMContentLoaded', function () {
        const selectedProductsContainer = document.getElementById('selected-products');
        const totalItemsElement = document.getElementById('total-items');
        const subtotalElement = document.getElementById('subtotal');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');
        const checkoutTotalElement = document.getElementById('checkout-total');
        const clearAllButton = document.getElementById('clear-all');

        let selectedProducts = [];

        document.querySelectorAll('.productset').forEach(function (productElement) {
            productElement.addEventListener('click', function () {
                const productId = productElement.getAttribute('data-product-id');
                const productName = productElement.getAttribute('data-product-name');
                const productImage = productElement.getAttribute('data-image-url');
                const productPrice = parseFloat(productElement.getAttribute('data-product-price'));

                const existingProduct = selectedProducts.find(product => product.id === productId);

                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    selectedProducts.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1,
                    });
                }

                updateSelectedProducts();
            });
        });

        clearAllButton.addEventListener('click', function () {
            selectedProducts = [];
            updateSelectedProducts();
            document.querySelectorAll('.productset').forEach(function (productElement) {
                productElement.classList.remove('active');
            });
        });

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
                                <img src="${product.image}" alt="img" style="width: 72px; height: 72px;" />
                            </div>
                            <div class="productcontet">
                                <h4>
                                    ${product.name}
                                    <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#edit-${product.id}" class="ms-2">
                                        <img src="{% static 'assets/img/icons/edit-5.svg' %}" style="opacity: 1!important" alt="img" />
                                    </a>
                                </h4>
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

                // Set modal values
                document.getElementById(`modal-cantidad-${product.id}`).value = product.quantity;
                document.getElementById(`modal-precio-${product.id}`).value = product.price;
            });

            const tax = subtotal * 0.1;
            const total = subtotal + tax;

            totalItemsElement.textContent = totalItems;
            subtotalElement.textContent = `${subtotal.toFixed(2)}$`;
            taxElement.textContent = `${tax.toFixed(2)}$`;
            totalElement.textContent = `${total.toFixed(2)}$`;
            checkoutTotalElement.textContent = `${total.toFixed(2)}$`;

            document.querySelectorAll('[data-action="remove"]').forEach(function (removeButton) {
                removeButton.addEventListener('click', function () {
                    const productId = removeButton.getAttribute('data-product-id');
                    selectedProducts = selectedProducts.filter(product => product.id !== productId);
                    updateSelectedProducts();
                    document.querySelector(`.productset[data-product-id="${productId}"]`).classList.remove('active');
                });
            });

            document.querySelectorAll('.button-minus').forEach(function (minusButton) {
                minusButton.addEventListener('click', function () {
                    const productId = minusButton.getAttribute('data-product-id');
                    const product = selectedProducts.find(product => product.id === productId);
                    if (product.quantity > 1) {
                        product.quantity -= 1;
                    } else {
                        selectedProducts = selectedProducts.filter(product => product.id !== productId);
                        document.querySelector(`.productset[data-product-id="${productId}"]`).classList.remove('active');
                    }
                    updateSelectedProducts();
                });
            });

            document.querySelectorAll('.button-plus').forEach(function (plusButton) {
                plusButton.addEventListener('click', function () {
                    const productId = plusButton.getAttribute('data-product-id');
                    const product = selectedProducts.find(product => product.id === productId);
                    product.quantity += 1;
                    updateSelectedProducts();
                });
            });
        }

        window.saveChanges = function(productId) {
            const quantity = parseInt(document.getElementById(`modal-cantidad-${productId}`).value);
            const price = parseFloat(document.getElementById(`modal-precio-${productId}`).value);
        
            const product = selectedProducts.find(product => product.id === productId);
            if (product) {
                product.quantity = quantity;
                product.price = price;
                updateSelectedProducts();
        
                // Añadir campos ocultos al formulario para enviar los datos del producto
                let hiddenFieldsContainer = document.getElementById('hidden-fields');
        
                // Eliminar los campos ocultos previos del producto (en caso de haberlos)
                const existingHiddenField = document.getElementById(`hidden-field-${productId}`);
                if (existingHiddenField) {
                    existingHiddenField.remove();
                }
        
                // Crear nuevos campos ocultos
                let quantityField = document.createElement('input');
                quantityField.type = 'hidden';
                quantityField.name = `product_${productId}_quantity`;
                quantityField.value = quantity;
                quantityField.id = `hidden-field-${productId}`;
                
                let priceField = document.createElement('input');
                priceField.type = 'hidden';
                priceField.name = `product_${productId}_price`;
                priceField.value = price;
                priceField.id = `hidden-field-${productId}`;
        
                // Agregar los campos al contenedor de campos ocultos
                hiddenFieldsContainer.appendChild(quantityField);
                hiddenFieldsContainer.appendChild(priceField);
            }
        }
        
    });
