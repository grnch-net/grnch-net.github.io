(function() {
'use strict'

ave.animation = {
	_currTimePos: 0,
	
	fps: 30,
	timeLength: 1600,
	
	_cursor: 0,
	get cursor() {
		return this._cursor
	},
	set cursor( val) {
		this._cursor = val;
	},
	
	GeneretaTimeline: function() {
		var _svg = ave.bars.animation.blockRight.children.svgTimeline;
		var _group = ave.bars.animation.blockRight.children.timelineGroup;
		var _fps = this.fps;
		var _length = parseInt(this.timeLength/1000*_fps)+1;
		
		_svg.setAttributeNS(null, 'width', _length*10+10);
		
		for(var frame=1; frame<=_length; frame++) {
			var _line = document.createElementNS( ave._xmlns, 'use');
			
			if( frame%_fps == 1) {
				var _text = document.createElementNS( ave._xmlns, 'text');
				_text.innerHTML = parseInt(frame/_fps);
				_text.setAttributeNS(null, 'x', frame*10);
				_text.setAttributeNS(null, 'y', '15');
				_text.setAttributeNS(null, 'class', 'ave-timeline-text');
				_group.appendChild(_text);
				
				_line.setAttributeNS(ave._xlinkns, 'href', '#ave-timeline-longLine');
			} else {
				_line.setAttributeNS(ave._xlinkns, 'href', '#ave-timeline-shortLine');
			}
			
			_line.setAttributeNS(null, 'x', frame*10);
			_group.appendChild(_line);
			
		}
		
	},
	
	GoToFrame: function(frameNum) {
		var _animation = ave.animation;
		
		if( _animation.cursor != frameNum) {
			ave.bars.animation.blockRight.children.timeCursor.setAttributeNS(null, 'x', 5+frameNum*10);
			_animation.cursor = frameNum;
		}
		
		
		for(var key in ave.layersList.items) {
			var _layer = ave.layersList.items[key];
			_layer.items.forEach(function(_item) {
				if( _item.animPath) {
					_item.points.forEach(function(_point, _pointInd) {
						if( !_point.animPath) return;
						
						if(_item.animPath.pointsFrames[_pointInd].length > 0) {
							var _pos = _item.animPath.pointsFrames[_pointInd][frameNum];
							_point.isActive = true;
							_point.MoveTo( _pos.x, _pos.y);
						}
						
					})
						
				}
			});
			_layer._PathBuild();
		}
		
	},
	
	ClickTimeline: function() {
		var _animation = ave.animation;
		var _lastFrame = parseInt( ave.animation.timeLength/1000 * ave.animation.fps );
		
		if( _animation._currTimePos > _lastFrame) {
			_animation._currTimePos = _lastFrame;
		}
			
		_animation.GoToFrame( _animation._currTimePos);
	},
	
	isActiveSvgElement: true,
	EyeAnimSvgElement: function() {
		if(	this.isActiveSvgElement) {
			ave.bars.scene.workSpace.children.svgAnimLabels.style.display = 'none';
			ave.bars.scene.workSpace.children.svgAnimPath.style.display = 'none';
			ave.bars.animation.blockLeft.children.optionSeeImg.setAttribute('src', 'img/eyeIcon.png');
		} else {
			ave.bars.scene.workSpace.children.svgAnimLabels.style.display = 'block';
			ave.bars.scene.workSpace.children.svgAnimPath.style.display = 'block';
			ave.bars.animation.blockLeft.children.optionSeeImg.setAttribute('src', 'img/eyeActiveIcon.png');
		}
		
		this.isActiveSvgElement = !this.isActiveSvgElement;
		
	}
	
};
})();