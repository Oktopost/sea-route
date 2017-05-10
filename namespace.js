'use strict';


const Namespace = require('oktopost-namespace');

const Plankton		= require('oktopost-plankton');
const PlanktonUrl	= require('oktopost-plankton-url');


const container = {
	Plankton: 	require('oktopost-plankton'),
	Classy:		require('oktopost-classy')
};
const SeaRoute = new Namespace(container);


SeaRoute.namespace('SeaRoute');


module.exports = {
	SeaRoute: container.SeaRoute,
	namespace: SeaRoute.getCreator()
};