function formatState(state) {
	if (!state.id) {
		return state.text;
	}
	const rawOptions = state.element.label;
	const cleanedOptions = rawOptions.replace(/\n/g, "").trim().split("-");
    const dataset = state.element.dataset;

	var $state = $(
		`<div class="d-flex flex-column p-1" data-product-id="${dataset.productId}" data-product-name="${dataset.productName}" data-image-url="${dataset.imageUrl}" data-product-price="${dataset.productPrice}"> <div class="d-flex gap-2 align-items-center"> <i class="fe fe-shopping-bag"></i><strong>` +
			cleanedOptions[0] +
			"</strong></div>" +
            '<div class="d-flex gap-1">' +
                '<div class="d-flex gap-1 align-items-center"> <i class="fe fe-tag"></i>' +
                cleanedOptions[1] +
                "</div>" +
                '<div class="d-flex gap-1 align-items-center"> <i class="fe fe-briefcase"></i>' +
                cleanedOptions[2] +
                "</div>" +
                '<div class="d-flex gap-1 align-items-center">' +
                '<strong>Precio: ' + cleanedOptions[3] +
                "</strong></div>" +
            '</div>' +
            
        "</div>"
	);

	return $state;
}

function selectionState(state) {
	if (!state.id) {
		return state.text;
	}

	const rawOptions = state.element.label;
	const cleanedOptions = rawOptions.replace(/\n/g, "").trim().split("-");

	var $state = $(
		'<div class="d-flex gap-1"> <div class="d-flex gap-2 align-items-center"> <i class="fe fe-shopping-bag"></i><strong>' +
			cleanedOptions[0] +
			"</strong></div>" +
            '<div class="d-flex gap-1 align-items-center"> <i class="fe fe-tag"></i>' +
                cleanedOptions[1] +
                "</div>" +
                '<div class="d-flex gap-1 align-items-center">' +
                '<strong>Precio:<strong/> ' + cleanedOptions[3] +
                "</div>" +
        "</div>"
	);

	return $state;
}

$(document).ready(function () {
	$(".js-example-basic-single").select2({
		templateResult: formatState,
        templateSelection: selectionState,  
        placeholder: 'Buscar productos'

	});

	$(".client-select").select2();
});

// $(document).ready(function () {
// 	$(".basic").select2({ tags: true });
// 	var formSmall = $(".form-small").select2({ tags: true });
// 	formSmall.data("select2").$container.addClass("form-control-sm");
// 	$(".nested").select2({ tags: true });
// 	$(".tagging").select2({ tags: true });
// 	$(".disabled-results").select2();
// 	$(".placeholder").select2({
// 		placeholder: "Make a Selection",
// 		allowClear: true,
// 	});
// 	function formatState(state) {
// 		if (!state.id) {
// 			return state.text;
// 		}
// 		var baseClass = "flaticon-";
// 		var $state = $(
// 			'<span><i class="' +
// 				baseClass +
// 				state.element.value.toLowerCase() +
// 				'" /> ' +
// 				state.text +
// 				"</i> </span>"
// 		);
// 		return $state;
// 	}
// 	$(".templating").select2({ templateSelection: formatState });
// 	$(".js-example-basic-single").select2();
// });
