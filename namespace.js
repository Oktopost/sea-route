'use strict';


const Namespace = require('oktopost-namespace');


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