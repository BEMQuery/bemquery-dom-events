/* global chai, fixture, sinon */

'use strict';

import { default as $, BEMQuery as BEMQuery } from 'bemquery-core';
import '../src/listeners';

const expect = chai.expect;

describe( 'BEMQuery#on', () => {
	before( () => {
		fixture.setBase( 'tests/support/fixtures' );
	} );

	afterEach( () => {
		fixture.cleanup();
		BEMQuery.converter = {};
	} );

	it( 'is a function', () => {
		expect( BEMQuery.prototype.on ).to.be.a( 'function' );
	} );

	it( 'returns BEMQuery instance', () => {
		const result = $( [] ).on( 'qwerty', () => {} );

		expect( result ).to.be.instanceof( BEMQuery );
	} );

	it( 'expects the first parameter to be a non empty string', () => {
		const bemQuery = $( [] );

		expect( () => {
			bemQuery.on( 1, () => {} );
		} ).to.throw( TypeError, 'Type of event must be a non-empty string.' );

		expect( () => {
			bemQuery.on( '', () => {} );
		} ).to.throw( TypeError, 'Type of event must be a non-empty string.' );
	} );

	it( 'expects the second parameter to be a non empty string or a function', () => {
		const bemQuery = $( [] );

		expect( () => {
			bemQuery.on( 'click', 1 );
		} ).to.throw( TypeError, 'Selector must be a non-empty string or function.' );

		expect( () => {
			bemQuery.on( 'click', '' );
		} ).to.throw( TypeError, 'Selector must be a non-empty string or function.' );
	} );

	it( 'expects the third parameter to be a function', () => {
		const bemQuery = $( [] );

		expect( () => {
			bemQuery.on( 'click', 'selector', 1 );
		} ).to.throw( TypeError, 'Callback must be a function.' );
	} );

	it( 'adds listeners to all elements in collection', () => {
		fixture.load( 'elements.html' );

		const bemQuery = $( [ ...document.querySelectorAll( '.block' ) ] );

		let fired = 0;
		const spy = sinon.spy();

		bemQuery.on( 'click', spy );

		return new Promise( ( resolve ) => {
			bemQuery.elements.forEach( ( element ) => {
				element.addEventListener( 'click', () => {
					if ( ++fired === bemQuery.elements.length ) {
						resolve();
					}
				} );

				const clickEvent = new Event( 'click' );

				element.dispatchEvent( clickEvent );
			} );
		} ).then( () => {
			expect( spy ).to.have.callCount( bemQuery.elements.length );
		} );
	} );

	it( 'fires listener only for delegated element', () => {
		fixture.load( 'elements.html' );
		BEMQuery.converter = {
			BEM: 'block elem',
			CSS: '.block__elem'
		};

		const bemQuery = $( [ document.getElementById( 'delegation' ) ] );

		const spy = sinon.spy();

		bemQuery.on( 'click', 'block elem', spy );

		return new Promise( ( resolve ) => {
			const element = document.querySelector( '#delegation .block__other' );

			element.addEventListener( 'click', () => {
				resolve();
			} );

			const clickEvent = new Event( 'click', {
				bubbles: true
			} );

			element.dispatchEvent( clickEvent );
		} ).then( () => {
			expect( spy ).to.have.not.been.called;

			return new Promise( ( resolve ) => {
				const element = document.querySelector( '#delegation .block__elem' );

				element.addEventListener( 'click', () => {
					resolve();
				} );

				const clickEvent = new Event( 'click', {
					bubbles: true
				} );

				element.dispatchEvent( clickEvent );
			} );
		} ).then( () => {
			expect( spy ).to.have.been.calledOnce;
		} );
	} );

	it( 'fires listener for descendant of delegated element', () => {
		fixture.load( 'elements.html' );
		BEMQuery.converter = {
			BEM: 'block elem',
			CSS: '.block__elem'
		};

		const bemQuery = $( [ document.getElementById( 'delegation' ) ] );

		const spy = sinon.spy();

		bemQuery.on( 'click', 'block elem', spy );

		return new Promise( ( resolve ) => {
			const element = document.querySelector( '#delegation .block__elem span' );

			element.addEventListener( 'click', () => {
				resolve();
			} );

			const clickEvent = new Event( 'click', {
				bubbles: true
			} );

			element.dispatchEvent( clickEvent );
		} ).then( () => {
			expect( spy ).to.have.been.calledOnce;
		} );
	} );
} );

describe( 'BEMQuery#off', () => {
	before( () => {
		fixture.setBase( 'tests/support/fixtures' );
	} );

	afterEach( () => {
		fixture.cleanup();
		BEMQuery.converter = {};
	} );

	it( 'is a function', () => {
		expect( BEMQuery.prototype.off ).to.be.a( 'function' );
	} );

	it( 'returns BEMQuery instance', () => {
		const result = $( [] ).off( 'qwerty', () => {} );

		expect( result ).to.be.instanceof( BEMQuery );
	} );

	it( 'expects the first parameter to be a non empty string', () => {
		const bemQuery = $( [] );

		expect( () => {
			bemQuery.off( 1, () => {} );
		} ).to.throw( TypeError, 'Type of event must be a non-empty string.' );

		expect( () => {
			bemQuery.off( '', () => {} );
		} ).to.throw( TypeError, 'Type of event must be a non-empty string.' );
	} );

	it( 'expects the second parameter to be a non empty string or a function', () => {
		const bemQuery = $( [] );

		expect( () => {
			bemQuery.off( 'click', 1 );
		} ).to.throw( TypeError, 'Selector must be a non-empty string or function.' );

		expect( () => {
			bemQuery.off( 'click', '' );
		} ).to.throw( TypeError, 'Selector must be a non-empty string or function.' );
	} );

	it( 'expects the third parameter to be a function', () => {
		const bemQuery = $( [] );

		expect( () => {
			bemQuery.off( 'click', 'selector', 1 );
		} ).to.throw( TypeError, 'Callback must be a function.' );
	} );

	it( 'removes listeners to all elements in collection', () => {
		fixture.load( 'elements.html' );

		const bemQuery = $( [ ...document.querySelectorAll( '.block' ) ] );

		let fired = 0;
		const spy = sinon.spy();

		bemQuery.on( 'click', spy );
		bemQuery.off( 'click', spy );

		return new Promise( ( resolve ) => {
			bemQuery.elements.forEach( ( element ) => {
				element.addEventListener( 'click', () => {
					if ( ++fired === bemQuery.elements.length ) {
						resolve();
					}
				} );

				const clickEvent = new Event( 'click' );

				element.dispatchEvent( clickEvent );
			} );
		} ).then( () => {
			expect( spy ).to.have.not.been.called;
		} );
	} );

	it( 'removes listener for delegated element', () => {
		fixture.load( 'elements.html' );
		BEMQuery.converter = {
			BEM: 'block elem',
			CSS: '.block__elem'
		};

		const bemQuery = $( [ document.getElementById( 'delegation' ) ] );

		const spy = sinon.spy();

		bemQuery.on( 'click', 'block elem', spy );
		bemQuery.off( 'click', 'block elem', spy );

		return new Promise( ( resolve ) => {
			const element = document.querySelector( '#delegation .block__elem' );

			element.addEventListener( 'click', () => {
				resolve();
			} );

			const clickEvent = new Event( 'click', {
				bubbles: true
			} );

			element.dispatchEvent( clickEvent );
		} ).then( () => {
			expect( spy ).to.have.not.been.called;
		} );
	} );
} );
