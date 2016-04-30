/* global chai */

'use strict';

import { BEMQuery as BEMQuery } from 'bemquery-core';
import '../src/index';

const expect = chai.expect;

describe( 'BEMQuery', () => {
	it( 'has on method', () => {
		expect( BEMQuery.prototype.on ).to.be.a( 'function' );
	} );

	it( 'has off method', () => {
		expect( BEMQuery.prototype.off ).to.be.a( 'function' );
	} );
} );
