(function() {
'use strict'

ave.prefabs = {
	Group: function( name) {
		var _this = this;
		
		var _id;
		var _groupList = ave.groupsList.items;
		
		var _idInd = 1;
		while( _groupList['gr'+_idInd]) { _idInd++; }
		_id = 'gr'+_idInd;
		this.id = _id;
		
		if( name) {
			this.name = name;
		} else {
			this.name = 'Group-'+_idInd;
		}
		
		this._parent = undefined;
		
		Object.defineProperties(this, {
			type: {
				get: function() {
					return 'Group';
				}
			}
		});
		
		this.nodes = {
			layersList: {
				item: undefined,
				area: undefined,
				folder: undefined,
				name: undefined,
				children: undefined,
				itemsList: undefined
			},
			scene: {
				contentGroup: undefined,
				itemPathGroup: undefined,
				labelGroup: undefined
			}
		};
		
		this._isFolder = false;
		// this.FolderEvent = function() {
			// if( this._isFolder) {
				// this.nodes.layersList.folder.style['background-image'] = '';
				// this.nodes.layersList.children.style.display = '';
			// } else {
				// this.nodes.layersList.folder.style['background-image'] = 'url(img/folderOpenIco.png)';
				// this.nodes.layersList.children.style.display = 'block';
			// }
			
			// this._isFolder = !this._isFolder;
		// }
		
		// Create hierarchy(layersList) item
		this.nodes.layersList.folder = grnch.CreateNode({
			id: 'layerFolder',
			class: 'folder'
		});
		
		this.nodes.layersList.name = grnch.CreateNode({
			id: 'layerName', 
			class: 'name',
			html: this.name
		});
		
		this.nodes.layersList.area = grnch.CreateNode({
			id: 'layerArea', 
			class: 'itemArea indent',
			html: grnch.DOMCreator([
				{
					id: 'layerType', 
					class: 'type typeGroup'
				},
			]),
			children: [ this.nodes.layersList.folder, this.nodes.layersList.name]
		});
		
		this.nodes.layersList.itemsList = grnch.CreateNode({
			class: 'list'
		});
		
		this.nodes.layersList.children = grnch.CreateNode({
			class: 'children',
			html: grnch.DOMCreator([
				{
					class: 'path indent',
					children: [
						{
							class: 'area',
							children: [
								{
									class: 'listType typeGroup'
								},
								{
									class: 'listEnd typeGroup'
								}
							]
						}
					]
				}
			]),
			children: [ this.nodes.layersList.itemsList]
		});
		
		this.nodes.layersList.item = grnch.CreateNode({
			id: 'ave-group+'+_id,
			class: 'item',
			html: grnch.DOMCreator([
				{
					id: 'layerEye', 
					class: 'eye eyeActive'
				}
			]),
			children: [ this.nodes.layersList.area, this.nodes.layersList.children]
		});
		
		// Create scene content group
		this.nodes.scene.contentGroup = grnch.CreateNode({
			type: 'g',
			id: 'ave-sceneContentGroup+'+_id
		});
		
		// Create scene itemPath group
		this.nodes.scene.itemPathGroup = document.createElementNS( ave._xmlns, 'g');
		// this.nodes.scene.itemPathGroup.style.display = 'none';
		
		//Create scene label group
		this.nodes.scene.labelGroup = document.createElementNS( ave._xmlns, 'g');
		// this.nodes.scene.labelGroup.style.display = 'none';
		
		// ItemsList
		this.items = [];
		
		// Style
		this.style = {
			_fill: undefined,
			get fill() {
				return this._fill;
			},
			set fill(val) {
				this._fill = val;
				_this.nodes.scene.contentGroup.setAttributeNS( null, 'fill', val)
			},
			
			_stroke: undefined,
			get stroke() {
				return this._stroke;
			},
			set stroke(val) {
				this._stroke = val;
				_this.nodes.scene.contentGroup.setAttributeNS( null, 'stroke', val)
			},
			
			_strokeWidth: undefined,
			get strokeWidth() {
				return this._strokeWidth;
			},
			set strokeWidth(val) {
				this._strokeWidth = val;
				_this.nodes.scene.contentGroup.setAttributeNS( null, 'stroke-width', val)
			},
		};
		
		// Interface
		for(var key in ave.interface.group) {
			this[key] = ave.interface.group[key];
		}
	},
	
	Layer: function( name) {
		var _this = this;
		var _id;
		var _layerList = ave.layersList.items;
		
		var _idInd = 1;
		while( _layerList['la'+_idInd]) { _idInd++; }
		_id = 'la'+_idInd;
		this.id = _id;
		
		if( name) {
			this.name = name;
		} else {
			this.name = 'Layer-'+_idInd;
		}
		
		this._isFolder = false;
		
		this._parent = undefined;
		
		Object.defineProperties(this, {
			type: {
				get: function() {
					return 'Layer';
				}
			}
		});
		
		this.nodes = {
			layersList: {
				item: undefined,
				area: undefined,
				folder: undefined,
				name: undefined,
				children: undefined,
				itemsList: undefined
			},
			scene: {
				content: undefined,
				labelGroup: undefined,
				itemPathGroup: undefined,
				layerPath: undefined
			}
		};
		
		// Create hierarchy(layersList) item
		this.nodes.layersList.name = grnch.CreateNode({
			id: 'layerName', 
			class: 'name',
			html: this.name
		});
		
		this.nodes.layersList.area = grnch.CreateNode({
			id: 'layerArea', 
			class: 'itemArea indent',
			html: grnch.DOMCreator([
				{
					id: 'layerType', 
					class: 'type typeLayer'
				},
			]),
			children: [ 
				this.nodes.layersList.name
			]
		});
		
		this.nodes.layersList.itemsList = grnch.CreateNode({
			class: 'list point'
		});
		
		this.nodes.layersList.children = grnch.CreateNode({
			class: 'children',
			html: grnch.DOMCreator([
				{
					class: 'path indent',
					children: [
						{
							class: 'area',
							children: [
								{
									class: 'listType typeLayer'
								},
								{
									class: 'listEnd typeLayer'
								}
							]
						}
					]
				}
			]),
			children: [ this.nodes.layersList.itemsList]
		});
		
		this.nodes.layersList.item = grnch.CreateNode({
			id: 'ave-layer+'+_id,
			class: 'item layer',
			html: grnch.DOMCreator([
				{
					id: 'layerEye', 
					class: 'eye eyeActive'
				}
			]),
			children: [ this.nodes.layersList.area, this.nodes.layersList.children]
		});
				
		// Create scene content
		var _SceneContent = ave.bars.scene.workSpace.children.svgContent;
		
		this.nodes.scene.content = grnch.CreateNode({
			type: 'path',
			id: 'ave-sceneContent+'+_id
		});
		
		// Create scene itemPath group
		var _SceneItemPathGroup = ave.bars.scene.workSpace.children.svgItemsPath;
		
		this.nodes.scene.itemPathGroup = document.createElementNS( ave._xmlns, 'g');
		this.nodes.scene.itemPathGroup.style.display = 'none';
		
		//Create scene label group
		var _SceneLabels = ave.bars.scene.workSpace.children.svgLayers;
		
		this.nodes.scene.labelGroup = document.createElementNS( ave._xmlns, 'g');
		this.nodes.scene.labelGroup.style.display = 'none';
		
		//Create scene layerPath
		this.nodes.scene.layerPath = document.createElementNS( ave._xmlns, 'path');
		this.nodes.scene.layerPath.style.display = 'none';
		
		// ItemsList
		this.items = [];
		
		// Layer closed properties
		this._isClosed = false;
		Object.defineProperties(this, {
			isClosed: {
				get: function() {
					return this._isClosed;
				},
				set: function(val) {
					if( val == this._isClosed) { return;}
					
					this._isClosed = val;
					this.items[0].RewritePath();
				}
			}
		});
		
		// Style
		this.style = {
			_fill: undefined,
			get fill() {
				return this._fill;
			},
			set fill(val) {
				this._fill = val;
				_this.nodes.scene.content.setAttributeNS( null, 'fill', val)
			},
			
			_stroke: undefined,
			get stroke() {
				return this._stroke;
			},
			set stroke(val) {
				this._stroke = val;
				_this.nodes.scene.content.setAttributeNS( null, 'stroke', val)
			},
			
			_strokeWidth: undefined,
			get strokeWidth() {
				return this._strokeWidth;
			},
			set strokeWidth(val) {
				this._strokeWidth = val;
				_this.nodes.scene.content.setAttributeNS( null, 'stroke-width', val)
			},
		};
		
		// Interface
		for(var key in ave.interface.layer) {
			this[key] = ave.interface.layer[key];
		}
		
	},
	
	LayerItem: function( param) {
		var _id;
		var _layerItem = this;
		var _layerItemsList = ave.layerItemsList.items;
		
		var _idInd = 1;
		while( _layerItemsList['it'+_idInd]) { _idInd++; }
		_id = 'it'+_idInd;
		this.id = _id;
		
		this._isActive = true;
		this._index = undefined;
		Object.defineProperties(this, {
			isActive: {
				get: function() {
					return this._isActive;
				},
				set: function(val) {
					if( val == this._isActive) { return;}
					
					if( val) {
						this.nodes.scene.group.setAttributeNS(null, 'display', 'block');
						grnch.RemoveClass( this.nodes.layersList.switcher, 'switchedOff');
					} else {
						this.nodes.scene.group.setAttributeNS(null, 'display', 'none');
						this.nodes.layersList.switcher.className += ' switchedOff';
					}
					
					this._isActive = val;
				}
			},
			
			index: {
				get: function() {
					return this._index;
				},
				set: function(val) {
					this._index = val;
					this.nodes.layersList.name.innerHTML = 'Point '+(val+1);
				}
			},
			
			type: {
				get: function() {
					return 'LayerItem';
				}
			}
			
		});
		
		// Create scene groups
		var _scenePointGroup = document.createElementNS( ave._xmlns, 'g');
		_scenePointGroup.setAttributeNS(null, 'id', 'sceneLayerItem+'+this.id);
		
		var _sceneSupGroup = document.createElementNS( ave._xmlns, 'g');
		
		// Create supPolyline
		var _sceneSupPolyline = document.createElementNS( ave._xmlns, 'polyline');
		_sceneSupPolyline.setAttributeNS(null, 'class', 'supPointsPolyline');
		
		// Create itemPoints
		this.points = [];
		var _coordSupPolyline = '';
		
		// Create main point
		this.points[0] = new ave.prefabs.LayerItemPoint({
			parent: this,
			index: 0,
			isActive: true,
			x: param.x,
			y: param.y,
			pointGroup: _scenePointGroup,
		});
		
		var _supParam = {};
		// Create supPoint 1
		var _sceneBeforeSupPointsGroup = document.createElementNS( ave._xmlns, 'g');
		if( param.x1 && param.y1) {
			_supParam.isActive = true;
			_supParam.x = param.x1;
			_supParam.y = param.y1;
				
			_coordSupPolyline += param.x1+','+param.y1;
		} else {
			_supParam.isActive = false;
			_supParam.x = param.x;
			_supParam.y = param.y;
		}
		this.points[1] = new ave.prefabs.LayerItemPoint({
			parent: this,
			index: 1,
			isActive: _supParam.isActive,
			x: _supParam.x,
			y: _supParam.y,
			pointGroup: _sceneBeforeSupPointsGroup,
		});
		
		_coordSupPolyline += ' '+param.x+','+param.y;
		
		// Create supPoint 2
		var _sceneAfterSupPointsGroup = document.createElementNS( ave._xmlns, 'g');
		if( param.x2 && param.y2) {
			_supParam.isActive = true;
			_supParam.x = param.x2;
			_supParam.y = param.y2;
			
			_coordSupPolyline += ' '+param.x2+','+param.y2;
		} else {
			_supParam.isActive = false;
			_supParam.x = param.x;
			_supParam.y = param.y;
		}
		this.points[2] = new ave.prefabs.LayerItemPoint({
			parent: this,
			index: 2,
			isActive: _supParam.isActive,
			x: _supParam.x,
			y: _supParam.y,
			pointGroup: _sceneAfterSupPointsGroup,
		});
		
		// Rewrite supPolyline
		_sceneSupPolyline.setAttributeNS(null, 'points', _coordSupPolyline);
		
		//	Create itemPath
		var _sceneItemPath = document.createElementNS( ave._xmlns, 'path');
		
		_sceneSupGroup.appendChild(_sceneSupPolyline);
		_sceneSupGroup.appendChild(_sceneBeforeSupPointsGroup);
		_sceneSupGroup.appendChild(_sceneAfterSupPointsGroup);
		
		_sceneSupGroup.style.display = 'none';
		_scenePointGroup.insertBefore(_sceneSupGroup, _scenePointGroup.firstChild);
		
		this.nodes = {};
		this.nodes.layersList = undefined;
		this.nodes.scene = {
			group: _scenePointGroup,
			supGroup: _sceneSupGroup,
			beforeSupGroup: _sceneBeforeSupPointsGroup,
			afterSupGroup: _sceneAfterSupPointsGroup,
			supPolyline: _sceneSupPolyline,
			itemPath: _sceneItemPath
		};
		
		this.animPath = undefined;
	
		// Interface
		for(var key in ave.interface.layerItem) {
			this[key] = ave.interface.layerItem[key];
		}
		
		ave.layerItemsList.items[this.id] = this;
	},
	
	/*	param: {
			parent: 'LayerItem',
			index: 'Number',
			isActive: 'Boolean',
			x: 'Number',
			y: 'Number',
			pointGroup: 'Node',
			isAnimGroup: 'Boolean'
		}
	*/
	LayerItemPoint: function( param) {
		var _this = this;
		
		this._index = param.index;
		this._parent = param.parent;
		
		if( param.isActive) {
			this._x = Number(param.x);
			this._y = Number(param.y);
		} else {
			this._x = undefined;
			this._y = undefined;
		}
		
		this.nodes = {
			scenePoint: undefined,
			// sceneAnimPathGroup: undefined
		}
		
		this.animPath = undefined;
		// this.nodes.sceneAnimPathGroup = document.createElementNS( ave._xmlns, 'g');
		
		this.nodes.scenePoint = document.createElementNS( ave._xmlns, 'use');
		
		if(param.index == 0) {
			this.nodes.scenePoint.setAttributeNS(ave._xlinkns, 'href', '#ave-svgPoint');
			this.nodes.scenePoint.setAttributeNS(ave._xlinkns, "id", 'ave-labelPoint');
		} else {
			this.nodes.scenePoint.setAttributeNS(ave._xlinkns, 'href', '#ave-svgSupPoint');
			this.nodes.scenePoint.setAttributeNS(ave._xlinkns, "id", 'ave-labelSupPoint+'+param.index);
		}
		
		this.nodes.scenePoint.setAttributeNS(null, 'x', param.x);
		this.nodes.scenePoint.setAttributeNS(null, 'y', param.y);
		
		
		param.pointGroup.appendChild( this.nodes.scenePoint);
		// param.pointGroup.appendChild( this.nodes.sceneAnimPathGroup);
		
		this._ReConstructPolyline = ave.interface.layerItemPoint._ReConstructPolyline;
		this._RewriteItemsPath = ave.interface.layerItemPoint._RewriteItemsPath;
		
		this._isActive = param.isActive;
		Object.defineProperties( this, {
			isActive: {
				get: function() {
					return this._isActive;
				},
				set: ave.interface.layerItemPoint.SetActive	
			}
		});
		
		var _SetX, _SetY;
		if( param.index == 0) {
			// MainPoint interface
			_SetX = ave.interface.layerItemPoint.main.SetX;
			_SetY = ave.interface.layerItemPoint.main.SetY;
		
			this.Move = ave.interface.layerItemPoint.main.Move;
			this.MoveTo = ave.interface.layerItemPoint.main.MoveTo;
		} else {
			// SupPoint interface
			_SetX = ave.interface.layerItemPoint.sup.SetX;
			_SetY = ave.interface.layerItemPoint.sup.SetY;
		
			this.Move = ave.interface.layerItemPoint.sup.Move;
			this.MoveTo = ave.interface.layerItemPoint.sup.MoveTo;
		}
		
		Object.defineProperties( this, {
			x: {
				get: function() {
					return this._x;
				},
				set: _SetX
			},
			
			y: {
				get: function() {
					return this._y;
				},
				set: _SetY
			}
		});
		
	},
	
	
	animPath: {
		/*	param: {
				item: 'LayerItem',
			}
		*/
		LayerItem: function( param) {
			var _this = this;
			
			this.nodes = {
				animList: {
					itemArea: undefined,
					name: undefined,
					children: {
						node: undefined,
						point0: undefined,
						point1: undefined,
						point2: undefined
					}
				},
				svgLine: {
					group: undefined,
					item: undefined,
					main: undefined,
					sup1: undefined,
					sup2: undefined
				}
			};
			
			// Create hierarchy(layersList) item
			this.nodes.animList.name = grnch.CreateNode({
				id: 'ave-animList-itemName',
				class: 'name active',
				html: param.item._parent.name+', point '+(param.item._index+1)
			});
			
			this.nodes.animList.children.point0 = grnch.CreateNode({
				id: 'ave-animList-itemPoint+0',
				class: 'child active',
				html: grnch.DOMCreator([
					{
						id: 'ave-animList-childType',
						class: 'type',
					},
					{
						id: 'ave-animList-addbtn',
						class: 'addBtn',
					},
					{
						id: 'ave-animList-childName',
						class: 'name',
						html: 'Anchor point',
					},
				])
			});
					
			this.nodes.animList.children.point1 = grnch.CreateNode({
				id: 'ave-animList-itemPoint+1',
				class: 'child active',
				html: grnch.DOMCreator([
					{
						id: 'ave-animList-childType',
						class: 'type',
					},
					{
						id: 'ave-animList-addbtn',
						class: 'addBtn',
					},
					{
						id: 'ave-animList-childName',
						class: 'name',
						html: 'Direction point 1',
					},
				])
			});
			
			this.nodes.animList.children.point2 = grnch.CreateNode({
				id: 'ave-animList-itemPoint+2',
				class: 'child active',
				html: grnch.DOMCreator([
					{
						id: 'ave-animList-childType',
						class: 'type',
					},
					{
						id: 'ave-animList-addbtn',
						class: 'addBtn',
					},
					{
						id: 'ave-animList-childName',
						class: 'name',
						html: 'Direction point 2',
					},
				])
			});
			
			this.nodes.animList.children.node = grnch.CreateNode({
				class: 'children',
				children: [
					this.nodes.animList.children.point0,
					this.nodes.animList.children.point1,
					this.nodes.animList.children.point2
				]
			});
			
			this.nodes.animList.itemArea = grnch.CreateNode({
				id: 'ave-animList-itemArea+'+param.item.id, 
				class: 'itemArea',
				html: grnch.DOMCreator([
					{
						class: 'type'
					},
					{
						class: 'listType'
					},
					{
						class: 'typeBottom'
					},
				]),
				children: [ 
					this.nodes.animList.name,
					this.nodes.animList.children.node
				]
			});
			
			ave.bars.animation.blockLeft.children.itemsList.appendChild(this.nodes.animList.itemArea);
			
			// Create svg line
			this.nodes.svgLine.group = document.createElement('div');
			this.nodes.svgLine.group.setAttributeNS(null, 'id', 'ave-animArea-itemGroup+'+param.item.id);
			
			var _CreateSvgLine = function(id) {
				var _svgLine = document.createElementNS( ave._xmlns, 'svg');
				_svgLine.setAttributeNS(null, 'id', 'ave-animArea-timeline+'+id);
				_svgLine.setAttributeNS(null, 'class', 'itemLine');
				_svgLine.setAttributeNS(null, 'width', (parseInt(ave.animation.timeLength/1000*ave.animation.fps)+1)*10+10 );
				_svgLine.innerHTML = '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ave-timeline-itemLine"></use>';
				return _svgLine;
			};
			
			this.nodes.svgLine.item = _CreateSvgLine(-1);
			this.nodes.svgLine.main = _CreateSvgLine(0);
			this.nodes.svgLine.sup1 = _CreateSvgLine(1);
			this.nodes.svgLine.sup2 = _CreateSvgLine(2);
			
			this.nodes.svgLine.group.appendChild(this.nodes.svgLine.item);
			this.nodes.svgLine.group.appendChild(this.nodes.svgLine.main);
			this.nodes.svgLine.group.appendChild(this.nodes.svgLine.sup1);
			this.nodes.svgLine.group.appendChild(this.nodes.svgLine.sup2);
			
			ave.bars.animation.blockRight.children.itemsArea.appendChild(this.nodes.svgLine.group);
			
			this._parent = param.item;
			this.pointsFrames = [
				[],
				[],
				[]
			];
			
			// Interface
			for(var key in ave.interface.animPath.layerItem) {
				this[key] = ave.interface.animPath.layerItem[key];
			}
			
			var _layer = param.item._parent;
			if( ave.edit._items[_layer.id]
				&& ave.edit._items[_layer.id].indexOf(param.item) > -1
			) {
				this.Show();
			} else {
				this.Hide();
			}
			
		},
		
		/*	param: {
				point: LayerItemPoint,
			}
		*/
		LayerItemPoint: function( param) {
			var _this = this;
			
			this._parent = param.point;
			this.frames = {};
			
			this.isSelect = true;
			
			// svgAnimPath
			var _svgAnimPath = document.createElementNS( ave._xmlns, 'path');
			// _svgAnimPath.style.display = 'none';
			ave.bars.scene.workSpace.children.svgAnimPath.appendChild(_svgAnimPath);
			
			// svgLabels
			var _svgLabels = document.createElementNS( ave._xmlns, 'g');
			_svgLabels.setAttributeNS(null, 'id', 'ave-animLabel+'+param.point._parent.id+'+'+param.point._index);
			// _svgLabels.style.display = 'none';
			ave.bars.scene.workSpace.children.svgAnimLabels.appendChild(_svgLabels);
			
			this.nodes = {
				svgAnimPath: _svgAnimPath,
				svgLabels: _svgLabels
			};
			
			
			// Interface
			for(var key in ave.interface.animPath.layerItemPoint) {
				this[key] = ave.interface.animPath.layerItemPoint[key];
			}
			
			
			var _pointPos = {};
			if( param.point.isActive) {
				_pointPos = {
					x: param.point.x,
					y: param.point.y
				};
			} else {
				_pointPos = {
					x: param.point._parent.points[0].x,
					y: param.point._parent.points[0].y
				};
			}
			
			// this.AddFrame({
				// frame: 0,
				// x: _pointPos.x,
				// y: _pointPos.y
			// });
			
		},
		
		/*	param: {
				parent: LayerItemPointAnimPath,
				frame: Number,
				x: Number,
				y: Number,
				*x1: Number,
				*y1: Number,
				*x2: Number,
				*y2: Number
			} */
		Frame: function( param) {
			// Interface
			for(var key in ave.interface.animPath.frame) {
				this[key] = ave.interface.animPath.frame[key];
			}
			
			this._parent = param.parent;
			this._index = param.frame;
			
			// Create scene groups
			var _scenePointGroup = document.createElementNS( ave._xmlns, 'g');
			_scenePointGroup.setAttributeNS(null, 'id', 'ave-frame+'+param.frame);
			
			var _sceneSupGroup = document.createElementNS( ave._xmlns, 'g');
			
			// Create supPolyline
			var _sceneSupPolyline = document.createElementNS( ave._xmlns, 'polyline');
			_sceneSupPolyline.setAttributeNS(null, 'class', 'supPointsPolyline');
			
			// Create itemPoints
			this.points = [];
			var _coordSupPolyline = '';
			
			// Create main point
			this.points[0] = new ave.prefabs.animPath.FramePoint({
				parent: this,
				index: 0,
				isActive: true,
				x: param.x,
				y: param.y,
				pointGroup: _scenePointGroup,
			});
			
			var _supParam = {};
			// Create supPoint 1
			var _sceneBeforeSupPointsGroup = document.createElementNS( ave._xmlns, 'g');
			if( param.x1 && param.y1) {
				_supParam.isActive = true;
				_supParam.x = param.x1;
				_supParam.y = param.y1;
					
				_coordSupPolyline += param.x1+','+param.y1;
			} else {
				_supParam.isActive = false;
				_supParam.x = param.x;
				_supParam.y = param.y;
			}
			
			this.points[1] = new ave.prefabs.animPath.FramePoint({
				parent: this,
				index: 1,
				isActive: _supParam.isActive,
				x: _supParam.x,
				y: _supParam.y,
				pointGroup: _sceneBeforeSupPointsGroup,
			});
			
			_coordSupPolyline += ' '+param.x+','+param.y;

			// Create supPoint 2
			var _sceneAfterSupPointsGroup = document.createElementNS( ave._xmlns, 'g');
			if( param.x2 && param.y2) {
				_supParam.isActive = true;
				_supParam.x = param.x2;
				_supParam.y = param.y2;
				
				_coordSupPolyline += ' '+param.x2+','+param.y2;
			} else {
				_supParam.isActive = false;
				_supParam.x = param.x;
				_supParam.y = param.y;
			}
			
			this.points[2] = new ave.prefabs.animPath.FramePoint({
				parent: this,
				index: 2,
				isActive: _supParam.isActive,
				x: _supParam.x,
				y: _supParam.y,
				pointGroup: _sceneAfterSupPointsGroup,
			});
			
			// Rewrite supPolyline
			_sceneSupPolyline.setAttributeNS(null, 'points', _coordSupPolyline);
			
			//	Create itemPath
			
			_sceneSupGroup.appendChild(_sceneSupPolyline);
			_sceneSupGroup.appendChild(_sceneBeforeSupPointsGroup);
			_sceneSupGroup.appendChild(_sceneAfterSupPointsGroup);
			
			// _sceneSupGroup.style.display = 'none';
			_scenePointGroup.insertBefore(_sceneSupGroup, _scenePointGroup.firstChild);
			param.parent.nodes.svgLabels.appendChild(_scenePointGroup);
			
			// Create timeline point
			var _timelinePoint = document.createElementNS( ave._xmlns, 'use');
			_timelinePoint.setAttributeNS(null, 'id', 'ave-animArea-itemFrame+'+param.frame);
			_timelinePoint.setAttributeNS(ave._xlinkns, 'href', '#ave-animation-linePoint');
			_timelinePoint.setAttributeNS(null, 'x', (param.frame+1)*10);
			_timelinePoint.setAttributeNS(null, 'y', 12);
			
			var _layerItemPoint = this._parent._parent;
			var _layerItem = _layerItemPoint._parent;
			
			switch(_layerItemPoint._index) {
			case 0:
				_layerItem.animPath.nodes.svgLine.main.appendChild(_timelinePoint);
				break;
			case 1:
				_layerItem.animPath.nodes.svgLine.sup1.appendChild(_timelinePoint);
				break;
			case 2:
				_layerItem.animPath.nodes.svgLine.sup2.appendChild(_timelinePoint);
				break;
			}
			
			this.nodes = {
				group: _scenePointGroup,
				supGroup: _sceneSupGroup,
				beforeSupGroup: _sceneBeforeSupPointsGroup,
				afterSupGroup: _sceneAfterSupPointsGroup,
				supPolyline: _sceneSupPolyline,
				timelinePoint: _timelinePoint
			};
			
		},
		
		/*	param: {
				parent: 'AnimItem',
				index: 'Number',
				isActive: 'Boolean',
				x: 'Number',
				y: 'Number',
				pointGroup: 'Node',
				isAnimGroup: 'Boolean'
			}
		*/
		FramePoint: function( param) {
			var _this = this;
			
			this._parent = param.parent;
			
			if( param.isActive) {
				this._x = Number(param.x);
				this._y = Number(param.y);
			} else {
				this._x = undefined;
				this._y = undefined;
			}
			
			this.nodes = {
				scenePoint: undefined
			}
			
			this.nodes.scenePoint = document.createElementNS( ave._xmlns, 'use');
			
			if(param.index == 0) {
				this.nodes.scenePoint.setAttributeNS(ave._xlinkns, 'href', '#ave-svgAnimPoint');
				this.nodes.scenePoint.setAttributeNS(ave._xlinkns, 'id', 'ave-animPoint');
			} else {
				this.nodes.scenePoint.setAttributeNS(ave._xlinkns, 'href', '#ave-svgAnimSupPoint');
				this.nodes.scenePoint.setAttributeNS(ave._xlinkns, 'id', 'ave-animSupPoint+'+param.index);
			}
			
			this.nodes.scenePoint.setAttributeNS(null, 'x', param.x);
			this.nodes.scenePoint.setAttributeNS(null, 'y', param.y);
			
			
			param.pointGroup.appendChild( this.nodes.scenePoint);
			
			var _interface = ave.interface.animPath.FramePoint;
			
			this._ReConstructPolyline = _interface._ReConstructPolyline;
			this._RewriteItemsPath = _interface._RewriteItemsPath;
			
			this._isActive = param.isActive;
			Object.defineProperties( this, {
				isActive: {
					get: function() {
						return this._isActive;
					},
					set: _interface.SetActive
				}
			});
			
			var _SetX, _SetY;
			if( param.index == 0) {
				// MainPoint interface
				_SetX = _interface.main.SetX;
				_SetY = _interface.main.SetY;
			
				this.Move = _interface.main.Move;
				
				this.MoveTo = _interface.main.MoveTo;
			} else {
				// SupPoint interface
				
				_SetX = _interface.sup.SetX;
				_SetY = _interface.sup.SetY;
			
				this.Move = _interface.sup.Move;
				
				this.MoveTo = _interface.sup.MoveTo;
			}
			
			Object.defineProperties( this, {
				x: {
					get: function() {
						return this._x;
					},
					set: _SetX
				},
				
				y: {
					get: function() {
						return this._y;
					},
					set: _SetY
				}
			});
			
		}
		
	}
	
};
})();