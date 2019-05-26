ave.history = {
	
	_prefabs: {
		
	},
	
	addEvent: {
		/*	param: {
				layer: 'hierarchyItem',
				index: 'Number',
				parent: undefined || 'groupItem'
			}*/
		CreateLayer: function( param) {},
		
		/*	param: {
				newGroup: 'Group',
				hierarchyList: [
					{
						item: 'Layer' || 'Group',
						index: 'Number',
						parent: undefined || 'Group'
					},
					...
				]
		}*/
		CreateGroup: function( param) {},
		
		/*	param: {
				hierarchyList: [
					{
						item: 'Layer' || 'Group',
						index: 'Number',
						parent: undefined || 'Group'
					},
					...
				],
				layerItemsList: {
					'layerId': [
						{
							item: 'LayerItem',
							index: 'Number',
							parent:	'Layer'
						},
						...
					],
					...
				}
			}*/
		RemoveHierarchyItems: function( param) {},
		
		/*	param: {
				newParent: 'Group',
				newIndex: 'Number',
				hierarchyList: [
					{
						item: 'Layer' || 'Group',
						index: 'Number',
						parent: undefined || 'Group'
					},
					...
				]
			}*/
		SwapHierarchyItems: function( param) {},
		
		/* 	param: {
				layer: 'Layer'
			}*/
		CloseLayer: function( param) {},
		
		/* 	param: {
				itemsList: [
					{
						item: 'LayerItem',
						parent: 'Layer'
					},
					...
				]
			}*/
		CreateLayerItem: function( param) {},
		
		/* 	param: {
				layer: 'Layer',
				item: 'LayerItem',
				index: 'Number'
			}*/
		LayerInsertItemBefore: function( param) {},
		
		/* 	param: {
				layer: 'Layer',
				item: 'LayerItem',
				index: 'Number'
			}*/
		LayerItemRemove: function( param) {},
		
		/*	param: {
				itemsList: {
					'layerId': [
						{
							item: 'LayerItem',
							before: {
								x: 'Number',
								y: 'Number'
							},
							after: {
								x: 'Number',
								y: 'Number'
							}
						},
						...
					],
					...
				}
			}*/
		LayerItemsMove: function( param) {},
		
		/*	param: {
				item: 'LayerItem',
				before: {
					x1: 'Number',
					y1: 'Number',
					x2: 'Number',
					y2: 'Number'
				},
				after: {
					x1: 'Number',
					y1: 'Number',
					x2: 'Number',
					y2: 'Number'
				}
			}*/
		LayerItemsCurve: function( param) {},
		
		/*	param: {
				list: [
					{
						item: 'Layer' || 'Group',
						before: 'String'
					},
					...
				],
				after: 'String'
			}*/
		Fill: function( param) {},
		
		/*	param: {
				list: [
					{
						item: 'Layer' || 'Group',
						before: 'String'
					},
					...
				],
				after: 'String'
			}*/
		Stroke: function( param) {},
		
		/*	param: {
				list: [
					{
						item: 'Layer' || 'Group',
						before: 'String'
					},
					...
				],
				after: 'String'
			}*/
		StrokeWidth: function( param) {}
	}
}