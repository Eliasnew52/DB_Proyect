document.addEventListener('DOMContentLoaded', function () {
    const selectedProductsContainer = document.getElementById('selected-products');
    const totalItemsElement = document.getElementById('total-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutTotalElement = document.getElementById('checkout-total');
    const clearAllButton = document.getElementById('clear-all');
    const detalleVentaFormset = document.getElementById('detalle-venta-formset');

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
                addProductToFormSet(productId, productPrice, 1);
            }

            updateSelectedProducts();
        });
    });

    clearAllButton.addEventListener('click', function () {
        selectedProducts = [];
        updateSelectedProducts();
        resetFormSet();
    });

    function addProductToFormSet(productId, price, quantity) {
        const formIndex = detalleVentaFormset.dataset.formCount;
        const newFormHtml = `
            <div class="row" id="form-${formIndex}">
                <input type="hidden" name="detalleventa_set-${formIndex}-producto" value="${productId}" />
                <input type="hidden" name="detalleventa_set-${formIndex}-precio_unitario" value="${price}" />
                <input type="hidden" name="detalleventa_set-${formIndex}-cantidad" value="${quantity}" />
            </div>
        `;
        detalleVentaFormset.insertAdjacentHTML('beforeend', newFormHtml);
        detalleVentaFormset.dataset.formCount = parseInt(formIndex) + 1;
    }

    function updateProductInFormSet(productId, quantity) {
        const formInput = document.querySelector(`input[name$="-producto"][value="${productId}"]`);
        if (formInput) {
            const formRow = formInput.closest('.row');
            const quantityInput = formRow.querySelector(`input[name$="-cantidad"]`);
            quantityInput.value = quantity;
        }
    }

    function resetFormSet() {
        detalleVentaFormset.innerHTML = '';
        detalleVentaFormset.dataset.formCount = '0';
    }

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
                            <h4>${product.name}</h4>
                            <div class="increment-decrement">
                                <div class="input-groups">
                                    <input type="button" value="-" class="button-minus" data-product-id="${product.id}" />
                                    <input type="text" value="${product.quantity}" class="quantity-field" readonly />
                                    <input type="button" value="+" class="button-plus" data-product-id="${product.id}" />
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                <li>${(product.price * product.quantity).toFixed(2)}$</li>
                <li>
                    <a href="javascript:void(0);" class="remove-product" data-product-id="${product.id}">
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

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll('.button-minus').forEach(function (minusButton) {
            minusButton.addEventListener('click', function () {
                const productId = minusButton.getAttribute('data-product-id');
                const product = selectedProducts.find(product => product.id === productId);
                if (product.quantity > 1) {
                    product.quantity -= 1;
                    updateProductInFormSet(productId, product.quantity);
                } else {
                    selectedProducts = selectedProducts.filter(p => p.id !== productId);
                    resetFormSet();
                }
                updateSelectedProducts();
            });
        });

        document.querySelectorAll('.button-plus').forEach(function (plusButton) {
            plusButton.addEventListener('click', function () {
                const productId = plusButton.getAttribute('data-product-id');
                const product = selectedProducts.find(product => product.id === productId);
                product.quantity += 1;
                updateProductInFormSet(productId, product.quantity);
                updateSelectedProducts();
            });
        });

        document.querySelectorAll('.remove-product').forEach(function (removeButton) {
            removeButton.addEventListener('click', function () {
                const productId = removeButton.getAttribute('data-product-id');
                selectedProducts = selectedProducts.filter(product => product.id !== productId);
                resetFormSet();
                updateSelectedProducts();
            });
        });
    }
});
