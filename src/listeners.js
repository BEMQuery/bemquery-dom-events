'use strict';

import { BEMQuery as BEMQuery } from 'bemquery-core';
import ListenersStorage from './ListenersStorage';

const storage = new ListenersStorage();

/**
 * Method for adding event listener to the element.
 *
 * @param {String} type Type of the event.
 * @param {String|Function} selector If that parameter is a string,
 * then it's used to construct checking for the event delegation.
 * However if function is passed, then it becomes the event's listener.
 * @param {Function} callback If the second parameter is a string, this
 * function will be used as an event's listener.
 * @return {BEMQuery} Current BEMQuery instance.
 * @memberof BEMQuery
 */
BEMQuery.prototype.on = function( type, selector, callback ) {
	let listener;

	if ( typeof type !== 'string' || !type ) {
		throw new TypeError( 'Type of event must be a non-empty string.' );
	}

	if ( ( typeof selector !== 'string' && typeof selector !== 'function' ) || !selector ) {
		throw new TypeError( 'Selector must be a non-empty string or function.' );
	}

	if ( typeof selector === 'string' ) {
		if ( typeof callback !== 'function' ) {
			throw new TypeError( 'Callback must be a function.' );
		}

		selector = this.selectorEngine.converter.convert( selector ).CSS;
		selector = `${selector}, ${selector} *`;

		listener = ( evt ) => {
			if ( evt.target.matches( selector ) ) {
				callback( evt );
			}
		};
	} else {
		listener = selector;
	}

	this.elements.forEach( ( element ) => {
		element.addEventListener( type, listener, false );

		if ( typeof selector === 'string' ) {
			storage.add( element, type, selector, callback, listener );
		}
	} );

	return this;
};

/**
 * Method for removing event listener from the element.
 *
 * @param {String} type Type of the event.
 * @param {String|Function} selector If that parameter is a string,
 * then it's used to construct checking for the event delegation.
 * However if function is passed, then it becomes the event's listener.
 * @param {Function} callback If the second parameter is a string, this
 * function will be used as an event's listener.
 * @return {BEMQuery} Current BEMQuery instance.
 * @memberof BEMQuery
 */
BEMQuery.prototype.off = function( type, selector, callback ) {
	let listener;

	if ( typeof type !== 'string' || !type ) {
		throw new TypeError( 'Type of event must be a non-empty string.' );
	}

	if ( ( typeof selector !== 'string' && typeof selector !== 'function' ) || !selector ) {
		throw new TypeError( 'Selector must be a non-empty string or function.' );
	}

	if ( typeof selector === 'string' ) {
		if ( typeof callback !== 'function' ) {
			throw new TypeError( 'Callback must be a function.' );
		}

		selector = this.selectorEngine.converter.convert( selector ).CSS;
		selector = `${selector}, ${selector} *`;
	} else {
		listener = selector;
	}

	this.elements.forEach( ( element ) => {
		if ( typeof selector === 'string' ) {
			listener = storage.get( element, type, selector, callback );

			storage.remove( element, type, selector, callback );
		}
		element.removeEventListener( type, listener, false );
	} );

	return this;
};
