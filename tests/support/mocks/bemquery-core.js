'use strict';

class BEMQuery {
	constructor( elements ) {
		this.elements = elements;

		this.selectorEngine = {
			converter: {
				convert() {
					return BEMQuery.converter;
				}
			}
		};
	}
}

BEMQuery.converter = {};

function factory( elements ) {
	return new BEMQuery( elements );
}

export { BEMQuery as BEMQuery };

export { factory as default };
