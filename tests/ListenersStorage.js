/* global chai */

'use strict';

import ListenersStorage from '../src/ListenersStorage';

const expect = chai.expect;

describe( 'ListenersStorage', () => {
	it( 'has method add', () => {
		expect( ListenersStorage.prototype.add ).to.be.a( 'function' );
	} );

	it( 'has method get', () => {
		expect( ListenersStorage.prototype.get ).to.be.a( 'function' );
	} );

	it( 'has method remove', () => {
		expect( ListenersStorage.prototype.add ).to.be.a( 'function' );
	} );

	it( 'adds, gets and removes listeners correctly', () => {
		const storage = new ListenersStorage();
		const element = {};
		const fn = () => {};
		const listener = () => {
			fn();
		};

		storage.add( element, 'click', 'selektor', fn, listener );

		expect( storage.get( element, 'click', 'selektor', fn ) ).to.equal( listener );

		storage.remove( element, 'click', 'selektor', fn );

		expect( storage.get( element, 'click', 'selektor', fn ) ).to.equal( null );
	} );
} );
