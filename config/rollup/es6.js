import nodeResolve from 'rollup-plugin-node-resolve';
import convertCJS from 'rollup-plugin-commonjs';

const packageInfo = require( '../../package.json' );

export default {
	entry: 'src/index.js',
	format: 'es',
	external: [
		'bemquery-core'
	],
	globals: {
		'bemquery-core': 'bemquery'
	},
	sourceMap: true,
	plugins: [
		nodeResolve( {
			jsnext: true,
			main: false
		} ),
		convertCJS()
	],
	banner: `/*! ${packageInfo.name} v${packageInfo.version} | (c) ${new Date().getFullYear()} ${packageInfo.author.name} | ${packageInfo.license} license (see LICENSE) */`,
	dest: `dist/${packageInfo.name}.js`
};