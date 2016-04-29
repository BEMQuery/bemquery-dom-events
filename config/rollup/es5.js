import config from './umd.js';
import babel from 'rollup-plugin-babel';

config.plugins.push( babel( {
	presets: [
		'es2015-rollup'
	]
} ) );

config.dest = 'dist/bemquery-dom-events.es5.js';

export default config;
