'use strict';

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

export default ListenersStorage;
