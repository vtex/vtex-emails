var helpers = module.exports;

helpers.formatDateTime = function( value, format ) {
	'use strict';
	value = new Date( value );
	var o = {
		'M+' : value.getMonth() + 1,
		'd+' : value.getDate(),
		'h+' : value.getHours(),
		'm+' : value.getMinutes(),
		's+' : value.getSeconds(),
		'q+' : Math.floor( ( value.getMonth() + 3 ) / 3 ),
		'S' : value.getMilliseconds()
	};
	if ( /(y+)/.test( format ) )
		format = format.replace( RegExp.$1, ( value.getFullYear()+'' ).substr( 4 - RegExp.$1.length ) );
	for ( var k in o ) {
		if( new RegExp( '('+ k +')' ).test( format ) ) {
			format = format.replace( RegExp.$1, RegExp.$1.length==1 ? o[k] : ( '00'+ o[k] ).substr( ( ''+ o[k] ).length ) );
		}
	}
	return format;
};

helpers.addDaysToDate = function( date, days ) {
	'use strict';
	var result = new Date( date );
	result.setDate( result.getDate() + days );
	return result;
};

helpers.formatNumber = function( value, locale, decimals ) {
	'use strict';
	var num = isNaN( value ) || value === '' || value === null ? 0.00 : value;
	return num.toLocaleString( locale, { minimumFractionDigits: decimals } );
};

helpers.formatCurrency = function( value ) {
	'use strict';
	var num = isNaN( value ) || value === '' || value === null ? 0.00 : value / 100;
	return parseFloat( num ).toFixed( 2 ).replace( '.',',' ).toString().replace( /( \d )( ?=( \d\d\d )+( ?!\d ) )/g, '$1.' );
};

helpers.formatCurrencyWithoutDecimals = function( value ) {
	'use strict';
	var num = isNaN( value ) || value === '' || value === null ? 0 : value / 100;
	return parseFloat( num ).toFixed( 0 ).replace( '.', ',' ).toString().replace( /( d )( ?=( ddd )+( ?!d ) )/g, '$1.' );
};

helpers.formatPENCurrency = function( value ) {
	'use strict';
	var num = isNaN( value ) || value === '' || value === null ? 0.00 : value / 100;
	return parseFloat( num ).toFixed( 2 ).toString().replace( /( \d )( ?=( \d\d\d )+( ?!\d ) )/g, '$1,' );
};

helpers.formatUSDCurrency = function( value ) {
	'use strict';
	var num = isNaN( value ) || value === '' || value === null ? 0.00 : value / 100;
	return parseFloat( num ).toFixed( 2 ).toString().replace( /( \d )( ?=( \d\d\d )+( ?!\d ) )/g, '$1,' );
};

helpers.ifCond = function( v1, operator, v2, options ) {
	'use strict';
	switch ( operator ) {
		 case '==':
				 return ( v1 == v2 ) ? options.fn( this ) : options.inverse( this );
		 case '===':
				 return ( v1 === v2 ) ? options.fn( this ) : options.inverse( this );
		case '!=':
				 return ( v1 != v2 ) ? options.fn( this ) : options.inverse( this );
		 case '<':
				 return ( v1 < v2 ) ? options.fn( this ) : options.inverse( this );
		 case '<=':
				 return ( v1 <= v2 ) ? options.fn( this ) : options.inverse( this );
		 case '>':
				 return ( v1 > v2 ) ? options.fn( this ) : options.inverse( this );
		 case '>=':
				 return ( v1 >= v2 ) ? options.fn( this ) : options.inverse( this );
		 case '&&':
				 return ( v1 && v2 ) ? options.fn( this ) : options.inverse( this );
		 case '||':
				 return ( v1 || v2 ) ? options.fn( this ) : options.inverse( this );
		 default:
				 return options.inverse( this );
		 }
};

helpers.hasSubStr = function(value, search, options) { if (value != null && value.toString().indexOf(search) !== -1) { return options.fn(this); } else { return options.inverse(this); }};

helpers._formatDateNoTimezone = function( _baseDate ) {
	'use strict';
	var splittedDate = _baseDate.split( '-' );
	var year = splittedDate[ 0 ];
	var month = splittedDate[ 1 ];
	var day = splittedDate[ 2 ];
	return [ day, month, year ].join( '/' );
};

helpers.math = function( lvalue, operator, rvalue ) {
	'use strict';
	lvalue = parseFloat( lvalue );
	rvalue = parseFloat( rvalue );

	return {
		'+': lvalue + rvalue,
		'-': lvalue - rvalue,
		'*': lvalue * rvalue,
		'/': lvalue / rvalue,
		'%': lvalue % rvalue
	}[ operator ];
};

helpers.eval = function( expr, options ) {
	'use strict';
	var reg = new RegExp( '\\${( \\S+ )}', 'g' );
	var compiled = expr.replace( reg, function( match, pull ) {
		return options.hash[ pull ];
	} );
	return eval( compiled );
};

helpers.group = function( list, options ) {
	'use strict';
	options = options || {};

	var fn = options.fn || noop,
			inverse = options.inverse || noop,
			hash = options.hash,
			prop = hash && hash.by,
			keys = [],
			groups = {},
			groupIndex = -1;

	if ( ! prop || ! list || ! list.length ) {
		return inverse( this );
	}

	function groupKey( item ) {
		var key = get( item, prop );

		if ( keys.indexOf( key ) === -1 ) {
			keys.push( key );
			groupIndex++;
		}

		if ( ! groups[ key ] ) {
			groups[ key ] = {
				index: groupIndex,
				value: key,
				items: []
			};
		}

		groups[ key ].items.push( item );
	}

	function renderGroup( buffer, key ) {
		return buffer + fn( groups[ key ] );
	}

	function get( obj, prop ) {
		var parts = prop.split( '.' ),
				last = parts.pop();

		while ( ( prop = parts.shift() ) ) {
			obj = obj[ prop ];

			if ( obj == null ) {
				return;
			}
		}

		return obj[ last ];
	}

	function noop() {
		return '';
	}

	list.forEach( groupKey );

	return keys.reduce( renderGroup, '' );
};

helpers.isMoreThanOneDay = function( d, options ) {
	'use strict';

	if ( /^(\d)+(?=d)/g.test( d ) ) {
		d = d.substring( 0, d.length - 1 );
	} else if ( /^(\d)+(?=bd)/g.test( d ) ) {
		d = d.substring( 0, d.length - 2 );
	} else {
		return options.inverse( this );
	}

	if ( parseInt( d ) > 1 ) {
		return options.fn( this );
	}

	return options.inverse( this );
};
