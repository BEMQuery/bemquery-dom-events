/*! bemquery-dom-events v0.1.4 | (c) 2016 BEMQuery team | MIT license (see LICENSE) */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('bemquery-core')) :
	typeof define === 'function' && define.amd ? define(['bemquery-core'], factory) :
	(factory(global.bemquery));
}(this, (function (bemqueryCore) { 'use strict';

/** Storage for events listeners */
class ListenersStorage {
	/**
	 * Creates new storage for event lsiteners
	 *
	 * @class
	 */
	constructor() {
		this.storage = new WeakMap();
	}

	/**
	 * Adds event listener to the storage.
	 *
	 * @param {Object} element Element to which listener is binded.
	 * @param {String} type Type of event.
	 * @param {String} selector Selector for event delegation.
	 * @param {Function} fn Original callback.
	 * @param {Function} listener Created listener.
	 * @return {void}
	 */
	add( element, type, selector, fn, listener ) {
		let listeners = {};

		if ( this.storage.has( element ) ) {
			listeners = this.storage.get( element );
		}

		if ( typeof listeners[ type ] === 'undefined' ) {
			listeners[ type ] = {};
		}

		if ( typeof listeners[ type ][ selector ] === 'undefined' ) {
			listeners[ type ][ selector ] = [];
		}

		listeners[ type ][ selector ].push( [ fn, listener ] );

		this.storage.set( element, listeners );
	}

	/**
	 * Gets event listener that matches the given criteria.
	 *
	 * @param {Object} element Element to which listener is binded.
	 * @param {String} type Type of event.
	 * @param {String} selector Selector for event delegation.
	 * @param {Function} fn Original callback.
	 * @return {Function} Event listener.
	 */
	get( element, type, selector, fn ) {
		if ( !this.storage.has( element ) ) {
			return null;
		}

		const listeners = this.storage.get( element );

		if ( typeof listeners[ type ] === 'undefined' || typeof listeners[ type ][ selector ] === 'undefined' ) {
			return null;
		}

		for ( let pair of listeners[ type ][ selector ] ) { // eslint-disable-line prefer-const
			if ( pair[ 0 ] === fn ) {
				return pair[ 1 ];
			}
		}

		return null;
	}

	/**
	 * Removes event listener that matches the given criteria.
	 *
	 * @param {Object} element Element to which listener is binded.
	 * @param {String} type Type of event.
	 * @param {String} selector Selector for event delegation.
	 * @param {Function} fn Original callback.
	 * @return {Function} Event listener.
	 */
	remove( element, type, selector, fn ) {
		if ( !this.storage.has( element ) ) {
			return null;
		}

		const listeners = this.storage.get( element );

		if ( typeof listeners[ type ] === 'undefined' || typeof listeners[ type ][ selector ] === 'undefined' ) {
			return null;
		}

		listeners[ type ][ selector ].forEach( ( pair, i ) => {
			if ( pair[ 0 ] === fn ) {
				listeners[ type ][ selector ].splice( i, 1 );
			}
		} );

		return null;
	}
}

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
bemqueryCore.BEMQuery.prototype.on = function( type, selector, callback ) {
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

		selector = this.converter.convert( selector ).CSS;
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
bemqueryCore.BEMQuery.prototype.off = function( type, selector, callback ) {
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

		selector = this.converter.convert( selector ).CSS;
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

/** @class BEMQuery */

})));
//# sourceMappingURL=bemquery-dom-events.umd.js.map
