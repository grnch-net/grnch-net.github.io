var ave;

(function() {
'use strict'

ave = {
	_xmlns: 'http://www.w3.org/2000/svg',
	_xlinkns: 'http://www.w3.org/1999/xlink',
	
	hierarchy: {
		items: []
	},
	
	groupsList: {
		Create: function( groupId) {
			var _group = new ave.prefabs.Group(groupId);
			// _group.InsertTo(0);
			
			_group.FolderEvent();
			
			return _group;
		},
		
		Remove: function( groupId) {
			var _group = ave.groupsList.items[groupId];
			if( !_group) {
				console.error('ERROR (ave.groupsList.Remove): Group is undefined.');
				return;
			}
			
			_group.Remove();
		},
		
		items: {}
	},
	
	layersList: {
		Create: function( layerId) {
			var _layer = new ave.prefabs.Layer(layerId);
			_layer.InsertTo(0);
			
			ave.edit.SelectOneLayer(_layer);
			
			return _layer;
		},
		
		Remove: function( layerId) {
			var _layer = ave.layersList.items[layerId];
			if( !_layer) {
				console.error('ERROR (ave.layersList.DeleteLayer): Layer is undefined.');
				return;
			}
			
			_layer.Remove();
			
		},
		
		items: {}
	},
	
	layerItemsList: {
		items: {}
	},
		
	bars: {
		handArea: undefined,
		contextMenu: undefined,
		toolbar: undefined,
		layersList: undefined,
		blackout: undefined,
		blackoutNull: undefined,
		svgLoad: undefined,
		svgSave: undefined,
		animLoad: undefined,
		animSave: undefined,
		webSave: undefined,
		editorBlockLeft: undefined,
		scene: {
			window: undefined,
			workSpace: undefined
		},
		animation: {
			window: undefined,
			blockLeft: undefined,
			blockRight: undefined
		}
	}

};
})();