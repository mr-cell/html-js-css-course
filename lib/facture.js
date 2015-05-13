var $ = jQuery.noConflict();

$(document).ready(function() {
	bindEvents();

	$('#add-button').on('click', addRow);
	$('#delete-button').on('click', deleteRow);
});

function bindEvents() {
	var amounts = $('input[name=facture\\.details\\.amount]');
	var nettos = $('input[name=facture\\.details\\.netto]');
	var vats = $('select[name=facture\\.details\\.vat]');
	var bruttos = $('input[name=facture\\.details\\.brutto]');
	var sumBruttos = $('input[name=facture\\.details\\.sumbr]');

	amounts.off('change keyup');
	nettos.off('change keyup');
	vats.off('change');
	bruttos.off('change');
	sumBruttos.off('change');

	amounts.on('change keyup', calculateSumaBrutto);
	nettos.on('change keyup', calculateBrutto);
	vats.on('change', calculateBrutto);
	bruttos.on('change', calculateSumaBrutto);
	sumBruttos.on('change', calculateSumaTotal);
}

function calculateBrutto(e) {
	var nettoElem = $(this).parents('tr').find('input[name=facture\\.details\\.netto]');
	var bruttoElem = $(this).parents('tr').find('input[name=facture\\.details\\.brutto]');
	var vatElem = $(this).parents('tr').find('select[name=facture\\.details\\.vat] ');
	var netto = parseFloat(nettoElem.val());
	var vat = parseFloat(vatElem.val());
	var brutto = (netto * vat / 100) + netto;
	if(isNaN(brutto)) {
		bruttoElem.val('0');
	} else {
		bruttoElem.val(brutto.toFixed(2));
	}	

	bruttoElem.trigger('change');
}

function calculateSumaBrutto(e) {
	var nettoElem = $(this).parents('tr').find('input[name=facture\\.details\\.netto]');
	var vatElem = $(this).parents('tr').find('select[name=facture\\.details\\.vat] ');
	var sumaBruttoElem = $(this).parents('tr').find('input[name=facture\\.details\\.sumbr]');
	var amountElem = $(this).parents('tr').find('input[name=facture\\.details\\.amount]');
	var amount = parseInt(amountElem.val());
	var netto = parseFloat(nettoElem.val());
	var vat = parseFloat(vatElem.val());
	var brutto = (netto * vat / 100) + netto;
	var sumaBrutto = brutto * amount;
	if(isNaN(sumaBrutto)) {
		sumaBruttoElem.val('0');
	} else {
		sumaBruttoElem.val(sumaBrutto.toFixed(2));
	}
	
	sumaBruttoElem.trigger('change');
}

function calculateSumaTotal(e) {
	var sumaBruttoElems = $('input[name=facture\\.details\\.sumbr]');
	var totalSumElem = $('input#facture\\.sum');

	var totalSum = $.map(sumaBruttoElems, function(elem, i) {
		return parseFloat($(elem).val());
	}).reduce(function(a, b) {
		return a + b;
	});

	if(isNaN(totalSum)) {
		totalSumElem.val('0');
	} else {
		totalSumElem.val(totalSum.toFixed(2));
	}
}

function addRow(e) {
	var lastRow = $('table#facture-details tbody tr:last');
	var factureDetails = $('table#facture-details tbody');

	factureDetails.append(lastRow.clone());

	var addedRow = $('table#facture-details tbody tr:last');
	var lp = addedRow.prevAll('tr').length;
	lp++;
	addedRow.find('td:first').html(lp + '.');
	clearRow(addedRow);
	bindEvents();
	e.preventDefault();
}

function clearRow(row) {
	row.find('input').val('');
	row.find('input[name=facture\\.details\\.amount]').val('1');
}

function deleteRow(e) {
	var lastRow = $('table#facture-details tbody tr:last');
	if($('table#facture-details tbody tr').length > 1) {
		lastRow.remove();
		var totalSumElem = $('input#facture\\.sum');
		calculateSumaTotal();
		bindEvents();
	} else {
		clearRow(lastRow);
	}
	e.preventDefault();
}