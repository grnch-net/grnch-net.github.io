ave.layerItemsList.items = {
	'layerItem id': {
		_interface: ave.interface.itemsItem,
		
		_ID: 'String', // generate static
		get type() { return 'LayerItem'; },
		
		_index: 'Number',
		get/set index() {},
		
		_isActive: 'Boolean',
		get/set isActive() {},
		
		_parent: 'Layer',
		
		animPath: undefined/'AnimLayerItem',
		
		nodes: {
			layersList: {
				item: 'Node div',
				name: 'Node div',
				switcher: 'Node div'
			},
			scene: {
				afterSupGroup: 'Node g',
				beforeSupGroup: 'Node g',
				group: 'Node g',
				itemPath: 'Node path',
				supGroup: 'Node g',
				supPolyline: 'Node polyline'
			}
		},
		
		points: []
		
	},
	...
}