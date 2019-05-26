(function() {
'use strict'

ave.interface = {
	group: {
		FolderEvent: function() {
			if( this._isFolder) {
				this.nodes.layersList.folder.style['background-image'] = '';
				this.nodes.layersList.children.style.display = '';
			} else {
				this.nodes.layersList.folder.style['background-image'] = 'url(img/folderOpenIco.png)';
				this.nodes.layersList.children.style.display = 'block';
			}
			
			this._isFolder = !this._isFolder;
		},
		
		InsertTo: function( ind, group) {
			var _parent = undefined,
				_layersListParent = undefined,
				_scene = {
					contentParent: undefined,
					labelsParent: undefined,
					itemPathGroupParent: undefined
				};
			
			if( !group) {
				_parent = ave.hierarchy;
				_layersListParent = ave.bars.layersList.children.list;
				_scene.contentParent = ave.bars.scene.workSpace.children.svgContent;
				_scene.itemPathGroupParent = ave.bars.scene.workSpace.children.svgItemsPath;
				_scene.labelsParent = ave.bars.scene.workSpace.children.svgLayers;
				
				this._parent = undefined;
			} else {
				_parent = group;
				_layersListParent = group.nodes.layersList.itemsList;
				_scene.contentParent = group.nodes.scene.contentGroup;
				_scene.itemPathGroupParent = group.nodes.scene.itemPathGroup;
				_scene.labelsParent = group.nodes.scene.labelGroup;
				
				this._parent = _parent;
			}
			
			//	Hierarchy(layersList) item
			_layersListParent.insertBefore( this.nodes.layersList.item, _layersListParent.children[ind]);
			
			//	Scene
			var _listLen = _parent.items.length;
			var _svgInd = _listLen - ind -1;
			
			//	Scene content group
			if( _svgInd < 1) {
				_scene.contentParent.appendChild( this.nodes.scene.contentGroup);
			} else {
				grnch.InsertAfter( this.nodes.scene.contentGroup, _scene.contentParent.children[_svgInd] );
			}
			
			// Scene itemPath group
			if( _svgInd < 1) {
				_scene.itemPathGroupParent.appendChild( this.nodes.scene.itemPathGroup);
			} else {
				grnch.InsertAfter( this.nodes.scene.itemPathGroup, _scene.itemPathGroupParent.children[_svgInd]);
			}
			
			// Scene label group
			if( _svgInd < 1) {
				_scene.labelsParent.appendChild( this.nodes.scene.labelGroup);
			} else {
				grnch.InsertAfter( this.nodes.scene.labelGroup, _scene.labelsParent.children[_svgInd]);
			}
			
			if( _parent.items.length == 0) {
				_parent.items.push( this);
			} else {
				_parent.items.splice( ind, 0, this);
			}
			
			ave.groupsList.items[this.id] = this;
		},
	
		Remove: function() {
			var _parent = this._parent,
				_layersListParent = undefined,
				_scene = {
					contentParent: undefined,
					labelsParent: undefined,
					itemPathGroupParent: undefined
				};
			
			if( !_parent) {
				_parent = ave.hierarchy;
				_layersListParent = ave.bars.layersList.children.list;
				_scene.contentParent = ave.bars.scene.workSpace.children.svgContent;
				_scene.itemPathGroupParent = ave.bars.scene.workSpace.children.svgItemsPath;
				_scene.labelsParent = ave.bars.scene.workSpace.children.svgLayers;
				
			} else {
				_layersListParent = _parent.nodes.layersList.itemsList;
				_scene.contentParent = _parent.nodes.scene.contentGroup;
				_scene.itemPathGroupParent = _parent.nodes.scene.itemPathGroup;
				_scene.labelsParent = _parent.nodes.scene.labelGroup;
			}
			
			//	Hierarchy(layersList) item
			_layersListParent.removeChild( this.nodes.layersList.item);
			
			// Scene
			//	Scene content group
			_scene.contentParent.removeChild( this.nodes.scene.contentGroup);
			
			// Scene itemPath group
			_scene.itemPathGroupParent.removeChild( this.nodes.scene.itemPathGroup);
			
			// Scene label group
			_scene.labelsParent.removeChild( this.nodes.scene.labelGroup);
			
			var _ind = _parent.items.indexOf(this);
			_parent.items.splice( _ind, 1);
			
			delete ave.groupsList.items[this.id];
			
			this._parent = undefined;
		},
		
		Rename: function() {
			var _this = this;
			
			var _nameNode = this.nodes.layersList.name;
			_nameNode.removeChild(_nameNode.firstChild);
			
			var _input = document.createElement('input');
			_input.value = this.name;
			
			_nameNode.appendChild(_input);
			_input.focus();
			_input.select();
			
			_input.onblur = function() {
				_this.name = _input.value;
				_nameNode.removeChild(_nameNode.firstChild);
				_nameNode.innerHTML = _input.value;
			};
		}
		
	},
	
	layer: {
		_PathBuild:  function() {
			var _d = '';
			var _itemsList = this.items;
			var _preSupPoint = false;
			var _isFirst = true;
			
			for(var itemInd=0, listLen=_itemsList.length; itemInd<listLen; itemInd++) {
				if( !_itemsList[itemInd].isActive) { continue; }
				
				if( _isFirst) {
					_d += 'M ';
					_isFirst = false;
				} else 
				if( _preSupPoint
					|| _itemsList[itemInd].points[1].isActive
				){
					_d += 'C ';
					
					if( _preSupPoint) {
						_d += _itemsList[itemInd-1].points[2].x + ' ';
						_d += _itemsList[itemInd-1].points[2].y + ' ';
					} else {
						_d += _itemsList[itemInd-1].points[0].x + ' ';
						_d += _itemsList[itemInd-1].points[0].y + ' ';
					}
					
					
					if( _itemsList[itemInd].points[1].isActive) {
						_d += _itemsList[itemInd].points[1].x + ' ';
						_d += _itemsList[itemInd].points[1].y + ' ';
					} else {
						_d += _itemsList[itemInd].points[0].x + ' ';
						_d += _itemsList[itemInd].points[0].y + ' ';
					}
					
				} else {
					_d += 'L ';
				}
				
				_d += _itemsList[itemInd].points[0].x + ' ';
				_d += _itemsList[itemInd].points[0].y + ' ';
				
				if( _itemsList[itemInd].points[2].isActive) {
					_preSupPoint = true;
				} else {
					_preSupPoint = false;
				}
				
			}
			
			if( this.isClosed) {
				_d += 'C ';
				
				if( _itemsList[_itemsList.length-1].points[2].isActive) {
					_d += _itemsList[_itemsList.length-1].points[2].x + ' ';
					_d += _itemsList[_itemsList.length-1].points[2].y + ' ';
				} else {
					_d += _itemsList[_itemsList.length-1].points[0].x + ' ';
					_d += _itemsList[_itemsList.length-1].points[0].y + ' ';
				}
				
				if( _itemsList[0].points[1].isActive) {
					_d += _itemsList[0].points[1].x + ' ';
					_d += _itemsList[0].points[1].y + ' ';
				} else {
					_d += _itemsList[0].points[0].x + ' ';
					_d += _itemsList[0].points[0].y + ' ';
				}
				
				_d += _itemsList[0].points[0].x + ' ';
				_d += _itemsList[0].points[0].y + ' ';
			}
			
			this.nodes.scene.content.setAttributeNS(null, 'd', _d);
			this.nodes.scene.layerPath.setAttributeNS(null, 'd', _d);
		},
		
		InsertTo: function( ind, group) {
			var _parent = undefined,
				_layersListParent = undefined,
				_scene = {
					contentParent: undefined,
					labelsParent: undefined,
					itemPathGroupParent: undefined
				};
			
			if( !group) {
				_parent = ave.hierarchy;
				_layersListParent = ave.bars.layersList.children.list;
				_scene.contentParent = ave.bars.scene.workSpace.children.svgContent;
				_scene.itemPathGroupParent = ave.bars.scene.workSpace.children.svgItemsPath;
				_scene.labelsParent = ave.bars.scene.workSpace.children.svgLayers;
				
				this._parent = undefined;
			} else {
				_parent = group;
				_layersListParent = group.nodes.layersList.itemsList;
				_scene.contentParent = group.nodes.scene.contentGroup;
				_scene.itemPathGroupParent = group.nodes.scene.itemPathGroup;
				_scene.labelsParent = group.nodes.scene.labelGroup;
				
				this._parent = _parent;
			}
			
			//	Hierarchy(layersList) item
			_layersListParent.insertBefore( this.nodes.layersList.item, _layersListParent.children[ind]);
			
			// Scene
			var _listLen = _parent.items.length;
			var _svgInd = _listLen - ind -1;
			
			if( _svgInd < 0){
				_scene.contentParent.insertBefore( this.nodes.scene.content, _scene.contentParent.firstChild);
				_scene.itemPathGroupParent.insertBefore( this.nodes.scene.itemPathGroup, _scene.itemPathGroupParent.firstChild);
				_scene.labelsParent.insertBefore( this.nodes.scene.labelGroup, _scene.labelsParent.firstChild);
			} else
			if( _svgInd >= _listLen){
				_scene.contentParent.appendChild( this.nodes.scene.content);
				_scene.itemPathGroupParent.appendChild( this.nodes.scene.itemPathGroup);
				_scene.labelsParent.appendChild( this.nodes.scene.labelGroup);
			} else {
				grnch.InsertAfter( this.nodes.scene.content, _scene.contentParent.children[_svgInd]);
				grnch.InsertAfter( this.nodes.scene.itemPathGroup, _scene.itemPathGroupParent.children[_svgInd]);
				grnch.InsertAfter( this.nodes.scene.labelGroup, _scene.labelsParent.children[_svgInd]);
			}
			
			// Scene layerPath
			var _SceneLayersPath = ave.bars.scene.workSpace.children.svgLayersPath;
			_SceneLayersPath.appendChild( this.nodes.scene.layerPath);
			
			if( _parent.items.length == 0) {
				_parent.items.push( this);
			} else {
				_parent.items.splice( ind, 0, this);
			}
			
			ave.layersList.items[this.id] = this;
		},
		
		Remove: function() {
			var _parent = this._parent,
				_layersListParent = undefined,
				_scene = {
					contentParent: undefined,
					labelsParent: undefined,
					itemPathGroupParent: undefined
				};
			
			if( !_parent) {
				_parent = ave.hierarchy;
				_layersListParent = ave.bars.layersList.children.list;
				_scene.contentParent = ave.bars.scene.workSpace.children.svgContent;
				_scene.itemPathGroupParent = ave.bars.scene.workSpace.children.svgItemsPath;
				_scene.labelsParent = ave.bars.scene.workSpace.children.svgLayers;
				
			} else {
				_layersListParent = _parent.nodes.layersList.itemsList;
				_scene.contentParent = _parent.nodes.scene.contentGroup;
				_scene.itemPathGroupParent = _parent.nodes.scene.itemPathGroup;
				_scene.labelsParent = _parent.nodes.scene.labelGroup;
			}
			
			//	Hierarchy(layersList) item
			_layersListParent.removeChild( this.nodes.layersList.item);
			
			// Scene
			//	Scene content group
			_scene.contentParent.removeChild( this.nodes.scene.content);
			
			// Scene itemPath group
			_scene.itemPathGroupParent.removeChild( this.nodes.scene.itemPathGroup);
			
			// Scene label group
			_scene.labelsParent.removeChild( this.nodes.scene.labelGroup);
			
			// Scene layerPath
			var _SceneLayersPath = ave.bars.scene.workSpace.children.svgLayersPath;
			_SceneLayersPath.removeChild( this.nodes.scene.layerPath);
			
			var _ind = _parent.items.indexOf(this);
			_parent.items.splice( _ind, 1);
			
			delete ave.layersList.items[this.id];
			
			this._parent = undefined;
		},
		
		InsertItemBefore: function(index, newItem) {
			var _childId = Number(index);
			
			// Create hierarchy element
			this.nodes.layersList.itemsList.insertBefore( 
				newItem.CreateHierarchyElement( _childId), 
				this.nodes.layersList.itemsList.children[_childId]
			);
			
			// 	Add point scene group
			this.nodes.scene.labelGroup.insertBefore(newItem.nodes.scene.group, this.nodes.scene.labelGroup.children[_childId]);
			
			newItem._parent = this;
			newItem._index = _childId;
			
			newItem.nodes.scene.group.setAttributeNS(null, 'id', 'sceneLayerItem+'+newItem.id);
			newItem.nodes.scene.itemPath.setAttributeNS(null, 'id', 'ave-sceneItemPath+'+newItem.id);
			
			newItem.RewritePath();
			this.nodes.scene.itemPathGroup.insertBefore(newItem.nodes.scene.itemPath, this.nodes.scene.itemPathGroup.children[_childId]);
			
			this.items.splice( _childId, 0, newItem );
			
			var _itemInd = _childId;
			for(var listLen=this.items.length; _itemInd<listLen; _itemInd++) {
				this.items[_itemInd].index = _itemInd;
			}
		},
		
		// ReplaceItem: function(index:'Number', newItem:'LayerItem') {},
		
		RemoveItem: function(item) {
			this.nodes.layersList.itemsList.removeChild(item.nodes.layersList.item);
			
			if( item._sceneProtoUse) {
				ave.bars.scene.workSpace.children.svgLayers.removeChild(item._sceneProtoUse);
			}
			this.nodes.scene.labelGroup.removeChild(item.nodes.scene.group);
			
			this.nodes.scene.itemPathGroup.removeChild(item.nodes.scene.itemPath);
			
			var _itemInd = item._index;
			this.items.splice(_itemInd, 1);
			
			for(var listLen=this.items.length; _itemInd<listLen; _itemInd++) {
				this.items[_itemInd].index = _itemInd;
			}
			
			if( this.items.length < 2) {
				this.isClosed = false;
			}
			
			if( this.items.length != 0){
				if( item._index == this.items.length) {
					this.items[0].RewritePath();
				} else {
					this.items[item._index].RewritePath();
				}
			}
			
			// delete ave.layerItemsList.items[item.id];
		},
		
		AppendItem: function(newItem) {
			var _childId = this.nodes.layersList.itemsList.children.length;
			
			// Create hierarchy element
			this.nodes.layersList.itemsList.appendChild( newItem.CreateHierarchyElement( _childId));
			
			// 	Add point scene group
			this.nodes.scene.labelGroup.appendChild( newItem.nodes.scene.group);
			
			newItem._parent = this;
			newItem._index = _childId;
			
			newItem.nodes.scene.group.setAttributeNS(null, 'id', 'sceneLayerItem+'+newItem.id);
			newItem.nodes.scene.itemPath.setAttributeNS(null, 'id', 'ave-sceneItemPath+'+newItem.id);
			
			this.nodes.scene.itemPathGroup.appendChild(newItem.nodes.scene.itemPath);
			
			this.items.push(newItem);
			
			newItem.RewritePath();
		},
		
		FolderEvent: function() {
			if( this._isFolder) {
				// this.nodes.layersList.folder.style['background-image'] = '';
				this.nodes.layersList.children.style.display = '';
				
				var _ind = ave.edit._openLayers.indexOf(this);
				ave.edit._openLayers.splice(_ind, 1);
				
			} else {
				// this.nodes.layersList.folder.style['background-image'] = 'url(img/folderOpenIco.png)';
				this.nodes.layersList.children.style.display = 'block';
				
				 ave.edit._openLayers.push(this);
			}
			
			this._isFolder = !this._isFolder;
		},
		
		Rename: function() {
			var _this = this;
			
			var _nameNode = this.nodes.layersList.name;
			_nameNode.removeChild(_nameNode.firstChild);
			
			var _input = document.createElement('input');
			_input.value = this.name;
			
			_nameNode.appendChild(_input);
			_input.focus();
			_input.select();
			
			_input.onblur = function() {
				_this.name = _input.value;
				_nameNode.removeChild(_nameNode.firstChild);
				_nameNode.innerHTML = _input.value;
			};
		}
		
	},
	
	layerItem: {
		RewritePath: function() {
			var _this = this;
			var _dPath = 'M ';
			var _WriteItemPath = function( preItem) {
					_dPath += preItem.points[0].x + ' ';
					_dPath += preItem.points[0].y + ' ';
					
					_dPath += 'C '
					if( preItem.points[2].isActive) {
						_dPath += preItem.points[2].x + ' ';
						_dPath += preItem.points[2].y + ' ';
					} else {
						_dPath += preItem.points[0].x + ' ';
						_dPath += preItem.points[0].y + ' ';
					}
					
					if(	_this.points[1].isActive) {
						_dPath += _this.points[1].x + ' ';
						_dPath += _this.points[1].y + ' ';
					} else {
						_dPath += _this.points[0].x + ' ';
						_dPath += _this.points[0].y + ' ';
					}
					
					_dPath += _this.points[0].x + ' ';
					_dPath += _this.points[0].y + ' ';
					
					_dPath += 'C '
					if(	_this.points[1].isActive) {
						_dPath += _this.points[1].x + ' ';
						_dPath += _this.points[1].y + ' ';
					} else {
						_dPath += _this.points[0].x + ' ';
						_dPath += _this.points[0].y + ' ';
					}
					
					if( preItem.points[2].isActive) {
						_dPath += preItem.points[2].x + ' ';
						_dPath += preItem.points[2].y + ' ';
					} else {
						_dPath += preItem.points[0].x + ' ';
						_dPath += preItem.points[0].y + ' ';
					}
					
					_dPath += preItem.points[0].x + ' ';
					_dPath += preItem.points[0].y + ' ';
			}
			
			var _layer = this._parent;
			if(	this._index == 0){
				if(	_layer.isClosed) {
					_WriteItemPath( _layer.items[_layer.items.length-1]);
				} else {
					_dPath = '';
				}
			} else {
				_WriteItemPath( _layer.items[this._index-1]);
			}
			this.nodes.scene.itemPath.setAttributeNS(null, 'd', _dPath);
		},
		
		CreateHierarchyElement: function( childId) {
			var _childSwitcherEl = grnch.CreateNode({
				id: 'layerChildSwitcher',
				class: 'type typePoint'
			});
			
			var _childNameEl = grnch.CreateNode({
				id: 'layerChildName',
				class: 'name',
				html: 'Point '+(childId+1)
			});
			
			var _childEl = grnch.CreateNode({
				id: 'layerChild+'+this.id,
				class: 'itemArea indent',
				children: [ _childSwitcherEl, _childNameEl]
			});
			
			this.nodes.layersList = {
				item: _childEl,
				switcher: _childSwitcherEl,
				name: _childNameEl
			};
			
			return _childEl;
		}
		
	},
	
	layerItemPoint: {
		_ReConstructPolyline: function() {
			var _coordSupPolyline = '';
			
			if( this._parent.points[2].isActive) {
				_coordSupPolyline += ' '+this._parent.points[2].x+','+this._parent.points[2].y;
			}
			
			_coordSupPolyline += ' '+this._parent.points[0].x+','+this._parent.points[0].y;
			
			if( this._parent.points[1].isActive) {
				_coordSupPolyline += ' '+this._parent.points[1].x+','+this._parent.points[1].y;
			}
			
			this._parent.nodes.scene.supPolyline.setAttributeNS(null, 'points', _coordSupPolyline);
		},
		
		_RewriteItemsPath: function() {
			this._parent.RewritePath();
			
			var _layer = this._parent._parent;
			
			if( this._parent._index == _layer.items.length-1) {
				if( _layer.isClosed) {
					_layer.items[0].RewritePath();
				}
			} else {
				_layer.items[this._parent._index+1].RewritePath();
			}
		},
		
		SetActive: function(val) {
			if( val == this._isActive) { return; }
			this._isActive = val;
			
			var _main = {
				x: this._parent.points[0].x,
				y: this._parent.points[0].y
			}
			
			this._x = _main.x;
			this._y = _main.y;
			
			if( val) {
				
			} else {
				this.nodes.scenePoint.setAttributeNS(null, 'x', _main.x);
				this.nodes.scenePoint.setAttributeNS(null, 'y', _main.y);
				
				this._ReConstructPolyline();
				this._RewriteItemsPath();
			}
		},
		
		main: {
			SetX: function(val) {
				var _val = Number(val);
				
				var _move = _val - this._x;
				
				this._x = _val;
				this.nodes.scenePoint.setAttributeNS(null, 'x', _val);
				
				for(var pointInd=1; pointInd<3; pointInd++){
					if( this._parent.points[pointInd].isActive) {
						var _newX = this._parent.points[pointInd]._x + _move;
						this._parent.points[pointInd]._x = _newX;
						this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'x', _newX);
					} else {
						this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'x', _val);
					}
					
				}
				
				this._ReConstructPolyline();
				this._RewriteItemsPath();
			},
			
			SetY: function(val) {
				var _val = Number(val);
				
				var _move = _val - this._y;
				
				this._y = _val;
				this.nodes.scenePoint.setAttributeNS(null, 'y', _val);
				
				for(var pointInd=1; pointInd<3; pointInd++){
					if( this._parent.points[pointInd].isActive) {
						var _newX = this._parent.points[pointInd]._y + _move;
						this._parent.points[pointInd]._y = _newY;
						this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'y', _newY);
					} else {
						this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'y', val);
					}
					
				}
				
				this._ReConstructPolyline();
				this._RewriteItemsPath();
			},
		
			Move: function( x, y) {
				var _x = Number(x);
				var _y = Number(y);
				
				this._x += _x;
				this.nodes.scenePoint.setAttributeNS(null, 'x', this._x);
				
				this._y += _y;
				this.nodes.scenePoint.setAttributeNS(null, 'y', this._y);
				
				for(var pointInd=1; pointInd<3; pointInd++){
					if( this._parent.points[pointInd].isActive) {
						this._parent.points[pointInd]._x += _x;
						this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'x', this._parent.points[pointInd]._x);
						
						this._parent.points[pointInd]._y += _y;
						this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'y', this._parent.points[pointInd]._y);
					} else {
						this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'x', this._x);
						this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'y', this._y);
					}
					
				}
				
				this._ReConstructPolyline();
				this._RewriteItemsPath();
			},
			
			MoveTo: function( x, y) {
				var _x = Number(x);
				var _y = Number(y);
				
				var _moveX = _x - this._x;
				var _moveY = _y - this._y;
				
				this._x = _x;
				this.nodes.scenePoint.setAttributeNS(null, 'x', _x);
				
				this._y = _y;
				this.nodes.scenePoint.setAttributeNS(null, 'y', _y);
				
				for(var pointInd=1; pointInd<3; pointInd++){
					if( this._parent.points[pointInd].isActive) {
						this._parent.points[pointInd]._x += _moveX;
						this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'x', this._parent.points[pointInd]._x);
						
						this._parent.points[pointInd]._y += _moveY;
						this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'y', this._parent.points[pointInd]._y);
					} else {
						this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'x', this._x);
						this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'y', this._y);
					}
					
				}
				
				this._ReConstructPolyline();
				this._RewriteItemsPath();
			}
		},
		
		sup: {
			_SetX: function(val) {
				var _val = Number(val);
				
				this._x = _val;
				this.nodes.scenePoint.setAttributeNS(null, 'x', _val);
				this._ReConstructPolyline();
				this._RewriteItemsPath();
			},
			
			_SetY: function(val) {
				var _val = Number(val);
				
				this._y = _val;
				this.nodes.scenePoint.setAttributeNS(null, 'y', _val);
				this._ReConstructPolyline();
				this._RewriteItemsPath();
			},
		
			Move: function( x, y) {
				var _x = Number(x);
				var _y = Number(y);
				
				this._x += _x;
				this.nodes.scenePoint.setAttributeNS(null, 'x', this._x);
				
				this._y += _y;
				this.nodes.scenePoint.setAttributeNS(null, 'y', this._y);
				
				this._ReConstructPolyline();
				this._RewriteItemsPath();
			},
			
			MoveTo: function( x, y) {
				var _x = Number(x);
				var _y = Number(y);
				
				this._x = _x;
				this.nodes.scenePoint.setAttributeNS(null, 'x', _x);
				
				this._y = _y;
				this.nodes.scenePoint.setAttributeNS(null, 'y', _y);
				
				this._ReConstructPolyline();
				this._RewriteItemsPath();
			}
		}
	},
	
	animPath: {
		layerItem: {
			ReFrames: function() {
				var _this = this;
				var _layerItem = _this._parent;
				var _lastFrame = parseInt( ave.animation.timeLength/1000 * ave.animation.fps );
				
				this.pointsFrames = [[],[],[]];
				
				_layerItem.points.forEach(function(point, pointInd) {
					if( point.animPath) {
						var _currFrame = 0;
						
						var _preActive = point.isActive;
						point.isActive = true;
						
						if( point.animPath.frames[0] == undefined) {
							var _firstFrame = Number(Object.keys( point.animPath.frames)[0]);
							for(; _currFrame< _firstFrame; _currFrame++) {
								_this.pointsFrames[pointInd][_currFrame] = {
									x: point.animPath.frames[_firstFrame].points[0].x,
									y: point.animPath.frames[_firstFrame].points[0].y
								};
							}
							
							_currFrame = _firstFrame;
						}
						
						var _preFrame;
						for(var frameInd in point.animPath.frames) {
							var _frame = Number(frameInd);
							
							if( _currFrame == _frame) {
								_preFrame = _frame;
								continue;
							}
							
							var _timeStep = 1/(_frame-_preFrame);
							
							var _Px = [
								point.animPath.frames[_preFrame].points[0].x,
								(point.animPath.frames[_preFrame].points[2].isActive)? point.animPath.frames[_preFrame].points[2].x : point.animPath.frames[_preFrame].points[0].x,
								(point.animPath.frames[_frame].points[1].isActive)? point.animPath.frames[_frame].points[1].x : point.animPath.frames[_frame].points[0].x,
								point.animPath.frames[_frame].points[0].x
							];
							var _Py = [
								point.animPath.frames[_preFrame].points[0].y,
								(point.animPath.frames[_preFrame].points[2].isActive)? point.animPath.frames[_preFrame].points[2].y : point.animPath.frames[_preFrame].points[0].y,
								(point.animPath.frames[_frame].points[1].isActive)? point.animPath.frames[_frame].points[1].y : point.animPath.frames[_frame].points[0].y,
								point.animPath.frames[_frame].points[0].y
							];
														
							var t=0;
							for(; _currFrame<_frame; _currFrame++) {
								if(t >= 1) { console.error('t >= 1', t);  }
								
								_this.pointsFrames[pointInd][_currFrame] = {
									x: Math.pow(1-t,3)*_Px[0]+3*t*Math.pow(1-t,2)*_Px[1]+3*Math.pow(t,2)*(1-t)*_Px[2]+Math.pow(t,3)*_Px[3],
									y: Math.pow(1-t,3)*_Py[0]+3*t*Math.pow(1-t,2)*_Py[1]+3*Math.pow(t,2)*(1-t)*_Py[2]+Math.pow(t,3)*_Py[3]
								};
								
								t += _timeStep;
							}
							
							if(_currFrame != _frame) { console.error('_currFrame != _frame', _currFrame, _frame); }
							_preFrame = _frame;
							
						}
						
						if(_currFrame == _lastFrame) {
							_this.pointsFrames[pointInd][_lastFrame] = {
								x: point.animPath.frames[_lastFrame].points[0].x,
								y: point.animPath.frames[_lastFrame].points[0].y
							};
							
						} else {
							for(; _currFrame<= _lastFrame; _currFrame++) {
								_this.pointsFrames[pointInd][_currFrame] = {
									x: point.animPath.frames[_preFrame].points[0].x,
									y: point.animPath.frames[_preFrame].points[0].y
								};
							}
						}
						
					}
					
					point.isActive = _preActive;
				});
			},
			
			RemoveAnimPath: function() {
				var _sceneGroups = ave.bars.scene.workSpace.children;
				
				this._parent.points.forEach(function(point) {
					if( point.animPath) {
						_sceneGroups.svgAnimPath.removeChild( point.animPath.nodes.svgAnimPath);
						_sceneGroups.svgAnimLabels.removeChild( point.animPath.nodes.svgLabels);
						
						point.animPath = undefined;
					}
				});
				
				ave.bars.animation.blockLeft.children.itemsList.removeChild(this.nodes.animList.itemArea);
				ave.bars.animation.blockRight.children.itemsArea.removeChild(this.nodes.svgLine.group);
				
				this._parent.animPath = undefined;
				
			},
			
			Show: function() {
				this.nodes.animList.itemArea.style.display = 'block';
				this.nodes.svgLine.group.style.display = 'block';
				
				this._parent.points.forEach(function(point) {
					if(	point.animPath) {
						point.animPath.OnSelect();
					}
				});
			},
			
			Hide: function() {
				this.nodes.animList.itemArea.style.display = 'none';
				this.nodes.svgLine.group.style.display = 'none';
			},
			
		},
		
		layerItemPoint: {
			_PathBuild:  function() {
				var _this = this;
				
				var _d = '';
				var _itemsList = Object.keys(this.frames);
				var _preSupPoint = false;
				var _isFirst = true;
				
				
				_itemsList.forEach(function(frame, keyInd) {
					if( _isFirst) {
						_d += 'M ';
						_isFirst = false;
					} else 
					if( _preSupPoint
						|| _this.frames[frame].points[1].isActive
					){
						_d += 'C ';
						
						if( _preSupPoint) {
							_d += _this.frames[_itemsList[keyInd-1]].points[2].x + ' ';
							_d += _this.frames[_itemsList[keyInd-1]].points[2].y + ' ';
						} else {
							_d += _this.frames[_itemsList[keyInd-1]].points[0].x + ' ';
							_d += _this.frames[_itemsList[keyInd-1]].points[0].y + ' ';
						}
						
						
						if( _this.frames[frame].points[1].isActive) {
							_d += _this.frames[frame].points[1].x + ' ';
							_d += _this.frames[frame].points[1].y + ' ';
						} else {
							_d += _this.frames[frame].points[0].x + ' ';
							_d += _this.frames[frame].points[0].y + ' ';
						}
						
					} else {
						_d += 'L ';
					}
					
					_d += _this.frames[frame].points[0].x + ' ';
					_d += _this.frames[frame].points[0].y + ' ';
					
					if( _this.frames[frame].points[2].isActive) {
						_preSupPoint = true;
					} else {
						_preSupPoint = false;
					}
				});
				
				// if( this.isClosed) {
					// _d += 'C ';
					
					// if( _itemsList[_itemsList.length-1].points[2].isActive) {
						// _d += _itemsList[_itemsList.length-1].points[2].x + ' ';
						// _d += _itemsList[_itemsList.length-1].points[2].y + ' ';
					// } else {
						// _d += _itemsList[_itemsList.length-1].points[0].x + ' ';
						// _d += _itemsList[_itemsList.length-1].points[0].y + ' ';
					// }
					
					// if( _itemsList[0].points[1].isActive) {
						// _d += _itemsList[0].points[1].x + ' ';
						// _d += _itemsList[0].points[1].y + ' ';
					// } else {
						// _d += _itemsList[0].points[0].x + ' ';
						// _d += _itemsList[0].points[0].y + ' ';
					// }
					
					// _d += _itemsList[0].points[0].x + ' ';
					// _d += _itemsList[0].points[0].y + ' ';
				// }
				
				this.nodes.svgAnimPath.setAttributeNS(null, 'd', _d);
			},
			
			/*	param: {
					*frame: 'Number',
					x: 'Number',
					y: 'Number',
					*x1: Number,
					*y1: Number,
					*x2: Number,
					*y2: Number
				} */
			AddFrame: function( param) {
				var _frame = param.frame;
				
				if( _frame == undefined) {
					_frame = ave.animation.cursor;
				}
				
				if( this.frames[_frame]) {
					console.error('frame is exist');
					return;
				} 
				
				
				var _frameParam = {
					parent: this,
					frame: _frame,
					x: param.x,
					y: param.y,
				};
				
				if( param.x1 && param.y1) {
					_frameParam.x1 = param.x1;
					_frameParam.y1 = param.y1;
				}
				if( param.x2 && param.y2) {
					_frameParam.x2 = param.x2;
					_frameParam.y2 = param.y2;
				}
				
				this.frames[_frame] = new ave.prefabs.animPath.Frame(_frameParam);
					
			},
			
			RemoveFrame: function(frameNum) {
				var _frame = this.frames[frameNum];
				this.nodes.svgLabels.removeChild(_frame.nodes.group);
				delete this.frames[frameNum];
				
				this._PathBuild();
				this._parent._parent.animPath.ReFrames();
			},
			
			OnSelect: function() {
				this.nodes.svgAnimPath.style.display = 'block';
				this.nodes.svgLabels.style.display = 'block';
				
				var _point = this._parent;
				var _item = _point._parent;
				
				grnch.AddClass(
					_item.animPath.nodes.animList.children['point'+_point._index],
					'active'
				);
				
				this.isSelect = true;
			},
			
			OffSelect: function() {
				this.nodes.svgAnimPath.style.display = 'none';
				this.nodes.svgLabels.style.display = 'none';
				
				var _point = this._parent;
				var _item = _point._parent;
				
				grnch.RemoveClass(
					_item.animPath.nodes.animList.children['point'+_point._index],
					'active'
				);
				
				this.isSelect = false;
			}
			
		},
		
		frame: {
			Reorder: function( newFrame) {
				var _animPath = this._parent;
				
				if( _animPath.frames[newFrame] != undefined) return;
				if( newFrame == this._index) return;
				
				this.nodes.timelinePoint.setAttributeNS(null, 'x', (newFrame+1)*10);
				this.nodes.group.setAttributeNS(null, 'id', 'ave-frame+'+newFrame);
				this.nodes.timelinePoint.setAttributeNS(null, 'id', 'ave-animArea-itemFrame+'+newFrame);
				
				_animPath.frames[newFrame] = this;
				delete _animPath.frames[this._index];
				this._index = newFrame;
				
			}
			
		},
		
		FramePoint: {
			_ReConstructPolyline: function() {
				var _coordSupPolyline = '';
				
				if( this._parent.points[2].isActive) {
					_coordSupPolyline += ' '+this._parent.points[2].x+','+this._parent.points[2].y;
				}
				
				_coordSupPolyline += ' '+this._parent.points[0].x+','+this._parent.points[0].y;
				
				if( this._parent.points[1].isActive) {
					_coordSupPolyline += ' '+this._parent.points[1].x+','+this._parent.points[1].y;
				}
				
				this._parent.nodes.supPolyline.setAttributeNS(null, 'points', _coordSupPolyline);
			},
			
			_RewriteItemsPath: function() {},
			
			SetActive: function(val) {
				if( val == this._isActive) { return; }
				this._isActive = val;
				
				var _main = {
					x: this._parent.points[0].x,
					y: this._parent.points[0].y
				}
				
				if( val) {
					this._x = _main.x;
					this._y = _main.y;
				} else {
					this.nodes.scenePoint.setAttributeNS(null, 'x', _main.x);
					this.nodes.scenePoint.setAttributeNS(null, 'y', _main.y);
					
					this._ReConstructPolyline();
					this._RewriteItemsPath();
				}
			},
			
			main: {
				SetX: function(val) {
					var _val = Number(val);
					
					var _move = _val - this._x;
					
					this._x = _val;
					this.nodes.scenePoint.setAttributeNS(null, 'x', _val);
					
					for(var pointInd=1; pointInd<3; pointInd++){
						if( this._parent.points[pointInd].isActive) {
							var _newX = this._parent.points[pointInd]._x + _move;
							this._parent.points[pointInd]._x = _newX;
							this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'x', _newX);
						} else {
							this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'x', _val);
						}
						
					}
					
					this._ReConstructPolyline();
					this._RewriteItemsPath();
				},
				
				SetY: function(val) {
					var _val = Number(val);
					
					var _move = _val - this._y;
					
					this._y = _val;
					this.nodes.scenePoint.setAttributeNS(null, 'y', _val);
					
					for(var pointInd=1; pointInd<3; pointInd++){
						if( this._parent.points[pointInd].isActive) {
							var _newX = this._parent.points[pointInd]._y + _move;
							this._parent.points[pointInd]._y = _newY;
							this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'y', _newY);
						} else {
							this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'y', val);
						}
						
					}
					
					this._ReConstructPolyline();
					this._RewriteItemsPath();
				},
			
				Move: function( x, y) {
					var _x = Number(x);
					var _y = Number(y);
					
					this._x += _x;
					this.nodes.scenePoint.setAttributeNS(null, 'x', this._x);
					
					this._y += _y;
					this.nodes.scenePoint.setAttributeNS(null, 'y', this._y);
					
					for(var pointInd=1; pointInd<3; pointInd++){
						if( this._parent.points[pointInd].isActive) {
							this._parent.points[pointInd]._x += _x;
							this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'x', this._parent.points[pointInd]._x);
							
							this._parent.points[pointInd]._y += _y;
							this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'y', this._parent.points[pointInd]._y);
						} else {
							this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'x', this._x);
							this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'y', this._y);
						}
						
					}
					
					this._ReConstructPolyline();
					this._RewriteItemsPath();
				},
				
				MoveTo: function( x, y) {
					var _x = Number(x);
					var _y = Number(y);
					
					var _moveX = _x - this._x;
					var _moveY = _y - this._y;
					
					this._x = _x;
					this.nodes.scenePoint.setAttributeNS(null, 'x', _x);
					
					this._y = _y;
					this.nodes.scenePoint.setAttributeNS(null, 'y', _y);
					
					for(var pointInd=1; pointInd<3; pointInd++){
						if( this._parent.points[pointInd].isActive) {
							this._parent.points[pointInd]._x += _moveX;
							this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'x', this._parent.points[pointInd]._x);
							
							this._parent.points[pointInd]._y += _moveY;
							this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'y', this._parent.points[pointInd]._y);
						} else {
							this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'x', this._x);
							this._parent.points[pointInd].nodes.scenePoint.setAttributeNS(null, 'y', this._y);
						}
						
					}
					
					this._ReConstructPolyline();
					this._RewriteItemsPath();
				}
			},
			
			sup: {
				_SetX: function(val) {
					var _val = Number(val);
					
					this._x = _val;
					this.nodes.scenePoint.setAttributeNS(null, 'x', _val);
					
					this._ReConstructPolyline();
					this._RewriteItemsPath();
				},
				
				_SetY: function(val) {
					var _val = Number(val);
					
					this._y = _val;
					this.nodes.scenePoint.setAttributeNS(null, 'y', _val);
					
					this._ReConstructPolyline();
					this._RewriteItemsPath();
				},
			
				Move: function( x, y) {
					var _x = Number(x);
					var _y = Number(y);
					
					this._x += _x;
					this.nodes.scenePoint.setAttributeNS(null, 'x', this._x);
					
					this._y += _y;
					this.nodes.scenePoint.setAttributeNS(null, 'y', this._y);
					
					this._ReConstructPolyline();
					this._RewriteItemsPath();
				},
				
				MoveTo: function( x, y) {
					var _x = Number(x);
					var _y = Number(y);
					
					this._x = _x;
					this.nodes.scenePoint.setAttributeNS(null, 'x', _x);
					
					this._y = _y;
					this.nodes.scenePoint.setAttributeNS(null, 'y', _y);
					
					this._ReConstructPolyline();
					this._RewriteItemsPath();
				}
			}
		
		}
		
	}
};
})();