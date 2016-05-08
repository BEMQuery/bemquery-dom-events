'use strict';

class BEMQuery {
	constructor( elements ) {
		this.elements = elements;

		this.converter = {
			convert() {
				return BEMQuery.converter;
			}
		};

		this.selectorEngine = {};
	}
}

BEMQuery.converter = {};

function factory( elements ) {
	return new BEMQuery( elements );
}

export { BEMQuery as BEMQuery };

export { factory as default };
