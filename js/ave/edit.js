(function() {
'use strict'

ave.edit = {
	graphic: {
		strokeWidth: {
			_list: {},
			
			_Rewrite: function() {
				var _ListKeys = Object.keys(this._list);
				if( _ListKeys.length == 1
					&& _ListKeys[0] != ''
					&& !isNaN(_ListKeys[0])
				){
					ave.bars.toolbar.children.graphic.strokeWidth.value = _ListKeys[0];
				} else {
					ave.bars.toolbar.children.graphic.strokeWidth.value = null;
				}
			},
			
			Add: function( item) {
				var _val = item.style.strokeWidth;
				
				if( !this._list[_val] ) {
					this._list[_val] = {}
				}
				
				this._list[_val][item.id] = item;
				
				this._Rewrite();
			},
			
			Remove: function( item) {
				var _val = item.style.strokeWidth;
				
				if( !this._list[_val] ) {
					console.warn('ERROR(ave.edit.graphic.strokeWidth.remove): item is not find.');
					return;
				}
				if( !this._list[_val][item.id] ) {
					console.warn('ERROR(ave.edit.graphic.strokeWidth.remove): item is not find.');
					return;
				}
				
				delete this._list[_val][item.id];
				if( Object.keys( this._list[_val] ).length == 0 ) {
					delete this._list[_val];
				}
				
				this._Rewrite();
				
			}
			
		}
	},
	
	_openLayers: [],
	
	_groups: [],
	
	SelectOneGroup: function(group) {
		this.RemoveAllItem();
		this.RemoveAllLayers();
		this.RemoveAllGroups();
		this.AddGroup(group);
	},
	
	AddGroup: function(group) {
		if(!group) {
			console.error('ERROR (ave.edit.AddLayer): Group is not found.');
			return;
		}
		
		if(ave.edit._groups.indexOf(group) > -1) {
			console.warn('WARN (ave.edit.AddGroup): Group('+group.id+') is already added.');
			return;
		}
		
		group.nodes.layersList.area.className += ' itemAreaActive';
		this._groups.push(group);
	},
	
	RemoveGroup: function(group) {
		if(!group) {
			console.error('ERROR (ave.edit.RemoveGroup): Group is not found.');
			return;
		}
		
		var _groupInd = ave.edit._groups.indexOf(group);
		if( _groupInd == -1) {
			console.warn('WARN (ave.edit.RemoveGroup): Group is not found.');
			return;
		}
		
		grnch.RemoveClass( group.nodes.layersList.area, 'itemAreaActive');
		this._groups.splice(_groupInd, 1);
		
	},
	
	RemoveAllGroups: function() {
		this._groups.forEach(function(group) {
			grnch.RemoveClass( group.nodes.layersList.area, 'itemAreaActive');
		});
		
		this._groups = [];
	},
	
	_layers: [],
	
	SelectOneLayer: function(layer) {
		this.RemoveAllItem();
		this.RemoveAllLayers();
		this.RemoveAllGroups();
		this.AddLayer(	layer);
	},
	
	AddLayer: function(layer) {
		var _this = this;
		
		if(!layer) {
			console.error('ERROR (ave.edit.AddLayer): Layer is not found.');
			return;
		}
		
		if(this._layers.indexOf(layer) > -1) {
			console.warn('WARN (ave.edit.AddLayer): Layer('+layer.id+') is already added.');
			return;
		}
		
		grnch.AddClass(layer.nodes.layersList.area, 'itemAreaActive');
		layer.nodes.scene.layerPath.style.display = 'block';
		layer.nodes.scene.itemPathGroup.style.display = 'block';
		layer.nodes.scene.labelGroup.style.display = 'block';
		this._layers.push(layer);
		
		if( this._items[layer.id]) {
			this._items[layer.id].forEach(function( item) {
				if( layer.items.indexOf(item) != -1) {
					_this._RemoveItemStack( item);
				}
			});
		}
		
		this.graphic.strokeWidth.Add(layer);
		
	},
	
	RemoveLayer: function(layer) {
		var _this = this;
		
		if(	!layer) {
			console.error('ERROR (ave.edit.RemoveLayer): Layer is not found.');
			return;
		}
		
		var _layerInd = ave.edit._layers.indexOf(layer);
		if( _layerInd == -1) {
			console.warn('WARN (ave.edit.RemoveLayer): Layer is not found.');
			return;
		}
		
		grnch.RemoveClass( layer.nodes.layersList.area, 'itemAreaActive');
		layer.nodes.scene.layerPath.style.display = 'none';
		layer.nodes.scene.itemPathGroup.style.display = 'none';
		layer.nodes.scene.labelGroup.style.display = 'none';
		this._layers.splice(_layerInd, 1);
		
		if( this._items[layer.id]) {
			this._items[layer.id].forEach(function( item) {
				if( layer.items.indexOf(item) != 1) {
					_this._AddItemStack(item);
				}
			});
		}
		
		this.graphic.strokeWidth.Remove(layer);
	},
	
	RemoveAllLayers: function() {
		var _this = this;
		
		this._layers.forEach(function( layer) {
			grnch.RemoveClass( layer.nodes.layersList.area, 'itemAreaActive');
			layer.nodes.scene.layerPath.style.display = 'none';
			layer.nodes.scene.itemPathGroup.style.display = 'none';
			layer.nodes.scene.labelGroup.style.display = 'none';
			
			if( _this._items[layer.id]) {
				_this._items[layer.id].forEach(function( item) {
					if( !item._sceneProtoUse) {
						_this._AddItemStack( item);
					}
				});
			}
			
			_this.graphic.strokeWidth.Remove(layer);
		});
		
		this._layers = [];
	},
	
	_itemsStack: {},
	
	_AddItemStack: function(item) {
		var _sceneProtoUse = document.createElementNS( ave._xmlns, 'use');
		_sceneProtoUse.setAttributeNS(ave._xlinkns, "href", '#sceneLayerItem+'+item.id);
		_sceneProtoUse.setAttributeNS(ave._xlinkns, "id", 'ave-protoLabelPoint+'+item.id);
		ave.bars.scene.workSpace.children.svgLayers.appendChild(_sceneProtoUse);
		
		item._sceneProtoUse = _sceneProtoUse;
		
		if( !ave.edit._itemsStack[item._parent.id]) {
			ave.edit._itemsStack[item._parent.id] = [];
		}
		ave.edit._itemsStack[item._parent.id].push(item);
	},
	
	_RemoveItemStack: function(item) {
		if( ave.edit._itemsStack[item._parent.id]) {
			var _stackInd = ave.edit._itemsStack[item._parent.id].indexOf(item);
			if( _stackInd != -1) {
				ave.bars.scene.workSpace.children.svgLayers.removeChild(item._sceneProtoUse);
				item._sceneProtoUse = undefined;
				
				ave.edit._itemsStack[item._parent.id].splice(_stackInd, 1);
				
				if( ave.edit._itemsStack[item._parent.id].length == 0) {
					delete ave.edit._itemsStack[item._parent.id];
				}
			}
		}
		
	},
	
	_items: {},
	
	SelectOneItem: function( item) {
		// ave.edit.RemoveAllItem();
		// ave.edit.RemoveAllLayers();
		// ave.edit.RemoveAllGroups();
		this.SelectOneLayer( item._parent);
		ave.edit.AddItem( item);
	},
	
	AddItem: function(item) {
		if( !item) {
			console.error('ERROR (ave.edit.AddItem): Item() is not found.');
			console.warn(item);
			return;
		}
		
		var _layer = item._parent;
		if( !_layer) {
			console.error('ERROR (ave.edit.AddItem): Layer is not found.');
			return;
		}
		
		if( ave.edit._items[_layer.id]) {
			if( ave.edit._items[_layer.id].indexOf(item) > -1) {
				// console.warn('WARN (ave.edit.AddItem): Item('+item.id+') is already added.');
				return;
			}
		} else {
			ave.edit._items[_layer.id] = [];
		}
		
		item.points[0].nodes.scenePoint.setAttributeNS(ave._xlinkns, 'href', '#ave-svgPointActive');
		item.nodes.scene.supGroup.style.display = 'block';
		item.nodes.layersList.item.className += ' itemAreaActive';
		
		var _inStack = true;
		
		for(var layerInd=0, layersLen=ave.edit._layers.length; layerInd<layersLen; layerInd++) {
			if( _layer.id == this._layers[layerInd].id) {
				_inStack = false;
				break;
			}
		}
		
		if(_inStack) {
			this._AddItemStack(item);
		}
		
		if(item.animPath) item.animPath.Show();
		
		item.points.forEach(function( point) {
			if(	point.isActive && point.animPath) {
				point.animPath.nodes.svgAnimPath.style.display = 'block';
				point.animPath.nodes.svgLabels.style.display = 'block';
			}
		});
		
		this._items[_layer.id].push(item);
	},
	
	RemoveItem: function(item) {
		if(	!item) {
			console.error('ERROR (ave.edit.RemoveItem): Item is not found.');
			return;
		}
		
		var _layer = item._parent;
		if( !_layer) {
			console.error('ERROR (ave.edit.RemoveItem): Layer is not found.');
			return;
		}
		
		
		
		if( this._items[_layer.id]) {
			var _itemInd = this._items[_layer.id].indexOf(item);
			if( _itemInd == -1) {
				// console.warn('WARN (ave.edit.RemoveItem): Item('+item.id+') is not found.');
				return;
			}
			
			item.points[0].nodes.scenePoint.setAttributeNS(ave._xlinkns, 'href', '#ave-svgPoint');
			item.nodes.scene.supGroup.style.display = 'none';
			
			if(item.animPath) item.animPath.Hide();
			
			item.points.forEach(function( point) {
				if(	point.animPath) {
					point.animPath.nodes.svgAnimPath.style.display = 'none';
					point.animPath.nodes.svgLabels.style.display = 'none';
				}
			});
			
			this._RemoveItemStack(item);
			grnch.RemoveClass(item.nodes.layersList.item, 'itemAreaActive');
			this._items[_layer.id].splice(_itemInd, 1);
			
			if(	this._items[_layer.id].length == 0) {
				delete ave.edit._items[_layer.id];
			}
		}
		
	},
	
	RemoveItemsInLayer: function( layer) {
		if( this._items[layer.id]) {
			var _itemsList = this._items[layer.id];
			
			for(var ind=_itemsList.length-1; ind>-1; ind--) {
				this.RemoveItem( _itemsList[ind]);
			}
		}
	},
	
	RemoveAllItem: function() {
		var _this = this;
		for(var key in ave.edit._items) {
			this._items[key].forEach(function(item) {
				if(item.animPath) item.animPath.Hide();
				
				item.points.forEach(function( point) {
					if(	point.animPath) {
						point.animPath.nodes.svgAnimPath.style.display = 'none';
						point.animPath.nodes.svgLabels.style.display = 'none';
					}
				});
				
				item.points[0].nodes.scenePoint.setAttributeNS(ave._xlinkns, 'href', '#ave-svgPoint');
				item.nodes.scene.supGroup.style.display = 'none';
				
				_this._RemoveItemStack(item);
				grnch.RemoveClass(item.nodes.layersList.item, 'itemAreaActive');
				
				if(item._sceneProtoUse) {
					ave.bars.scene.workSpace.children.svgLayers.removeChild(item._sceneProtoUse);
					item._sceneProtoUse = undefined;
				}
			});
		}
		
		this._itemsStack = {};
		this._items = {};
	}
	
};
})();