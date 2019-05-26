ave.groupsList.items = {
	'group id': {
		_interface: ave.interface.group,
		
		_ID: 'String' // generate static
		get type() { return 'Group'; },
		
		_isFolder: 'Boolean',
		get/set isFolder() {}, // ADD
		
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
				folder: 'Node div',
				item: 'Node div',
				itemsList: 'Node div',
				name: 'Node div'
			},
			scene: {
				contentGroup: 'Node g',
				itemPathGroup : 'Node g',
				labelGroup: 'Node g'
			}
		},
		
		items: []
		
	},
	...
};