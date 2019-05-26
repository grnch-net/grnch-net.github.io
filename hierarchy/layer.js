ave.layersList.items = {
	'layer id': {
		_interface: ave.interface.layer,
		
		id: 'String', // generate static
		get type() { return 'Layer'; },
		
		_isFolder: 'Boolean',
		get/set isFolder() {}, // ADD
		
		_isClosed: 'Boolean',
		get/set isClosed() {},
		
		_parent: 'undefined'/'group',
		
		name: 'String',
		
		style: {
			_fill: 'String',
			get/set fill() {},
			
			_stroke: 'String',
			get/set stroke() {},
			
			_strokeWidth: 'Number',
			get/set strokeWidth() {}
		},
		
		nodes: {
			layersList: {
				area: 'Node div',
				children: 'Node div',
				folder: undefined, // delete obj
				item: 'Node div',
				itemsList: 'Node div',
				name: 'Node div'
			},
			scene: {
				content: 'Node path',
				itemPathGroup : 'Node g',
				labelGroup: 'Node g',
				layerPath: 'Node path'
			}
		},
		
		items: [] // Rename perem
		
	},
	...
};