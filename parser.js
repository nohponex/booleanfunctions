/*
 Boole Function Parser
 Author: NohponeX (xenofons@auth.gr)
 Version: 1.01
 Date: 7/11/2011
 */

var current = 0;

//Implement contains method if not exists
if( !Array.prototype.contains ){
	Array.prototype.contains = function(element) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == element) {
				return true;
			}
		}
		return false;
	}
}

function trace(str) {
	var result = document.getElementById("results");

	result.innerHTML += "<p>" + str + "</p>";
}

function getLogicBit(value, position) {
	return ((value & (1 << position)) != 0);
}

function variableIndex(variables, variable) {
	for (var i = 0; i < variables.length; i++) {
		if (variables[i] == variable) {
			return i;
		}
	}
	return -1;
}

function isValid(c) {
	if (c == '!' || c == '+' || c == '^' || c == '(' || c == ')')
		return true;
	if (c >= 'a' && c <= 'z')
		return true;
	if (c >= 'A' && c <= 'Z')
		return true;
	return false;
}

function parser(input, callback) {

	//remove whitespaces
	input = input.replace(/\s+/g, "");

	//Input Validation

	for (var i = 0; i < input.length; i++) {

		if (!isValid(input.charAt(i))) {
			
			//error
			if( callback ){
				callback( "ERROR!\n ilegal character found at position " + i + "[" + input.charAt(i) + "]" + " !" );
			}
			return;
		}
	}

	/* Find Variables */

	var variables = new Array();

	for (var i = 0; i < input.length; i++) {
		var c = input.charAt(i);
		if (c != '!' && c != '+' && c != '(' && c != ')' && c != '^') {
			if (!variables.contains(c))
				variables.push(c);
		}
	}
	variables.sort();

	//Create truth table
	var variations = Math.pow(2, variables.length);

	var TruthTableValues = new Array(variations);
	var TruthTableResult = new Array(variations);

	var Index = 0;
	for (var i = 0; i < variations; i++) {
		TruthTableValues[i] = new Array(variables.length);

		TruthTableResult[i] = false;

		for (var v = 0; v < variables.length; v++) {
			TruthTableValues[i][v] = getLogicBit(Index, variables.length - v - 1);
		}

		Index++;
	}

	//Set values
	var lastNot = false;
	var cvalue = true;
	for (var i = 0; i < variations; i++) {
		current = 0;
		lastNot = false;
		cvalue = true;
		for (; ; ) {
			var c = input.charAt(current);
			if (c == '!') {
				lastNot = !lastNot;
			} else if (c == '+') {
				cvalue |= evaluate(input, TruthTableValues[i], variables);
				if (lastNot) {//NOR
					cvalue = !cvalue;
					lastNot = false;
				}
			} else if (c == '^') {//XOR
				var temp = evaluate(input, TruthTableValues[i], variables);
				if (lastNot) {//XNOR
					temp = !temp;
					lastNot = false;
				}
				cvalue = (!cvalue && temp || cvalue && !temp );
			} else if (c == '(') {
				cvalue &= ( lastNot ? !evaluate(input, TruthTableValues[i], variables) : evaluate(input, TruthTableValues[i], variables));
				if (lastNot)
					lastNot = false;
			} else {
				cvalue &= ( lastNot ? !TruthTableValues[i][ variableIndex(variables, c)] : TruthTableValues[i][ variableIndex(variables, c)]);
				if (lastNot)
					lastNot = false;
			}
			current++;
			if (current >= input.length) {
				TruthTableResult[i] |= cvalue;
				break;
			}
		}
	}

	//Call callback
	if( callback ){
		callback( null, variables, variations, TruthTableValues, TruthTableResult );
	}
}

function evaluate(input, variation, variables) {
	var cvalue = true;
	var lastNot = false;
	for (; ; ) {
		current++;
		if (current >= input.length) {
			return cvalue;
		}
		var c = input.charAt(current);
		if (c == '!') {
			lastNot = !lastNot;
		} else if (c == '+') {//OR
			cvalue |= evaluate(input, variation, variables);
			if (lastNot) {//NOR
				cvalue = !cvalue;
				lastNot = false;
			}
		} else if (c == '^') {//XOR
			var temp = evaluate(input, variation, variables);
			if (lastNot) {//XNOR
				temp = !temp;
				lastNot = false;
			}
			cvalue = (!cvalue && temp || cvalue && !temp );
		} else if (c == '(') {//AND
			cvalue &= ( lastNot ? !evaluate(input, variation, variables) : evaluate(input, variation, variables));
			if (lastNot)
				lastNot = false;
		} else if (c == ')') {
			current++;
			if (lastNot)
				lastNot = false;
			return cvalue;
		} else {//AND
			cvalue &= ( lastNot ? !variation[variableIndex(variables, c)] : variation[ variableIndex(variables, c)]);
			if (lastNot)
				lastNot = false;
		}
	}
	return cvalue;
}