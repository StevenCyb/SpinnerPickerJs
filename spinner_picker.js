/*
 * Author: Steven Cybinski
 * GitHub: https://github.com/StevenCyb/SpinnerPickerJs
 */
class SpinnerPicker {
    /*
     * Constructor for instantiating this object
     * Parameter:
     * canvas: HTMLCanvasElement to use
     * valueHandler: Function with index parameter to translate index to selectable item
     * config: JSON-Object that contains configuration
     * onchanged: Function with index parameter as callback (default: null)
     */
    constructor(canvas, valueHandler, config, onchanged=null) {
        if(!(canvas instanceof HTMLCanvasElement)) {
            throw "Provided object is not a HTMLCanvasElement";
        }
        try {
            if(typeof valueHandler != "function" || valueHandler(0) == null) {
                throw "";
            }
        } catch {
            throw "Provided valueHandler is not valid. Shold be 'string|number = valueHandler(number)'";
        }
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 4;
        canvas.height = rect.height * 4;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.blockInput = false;
        this.gotoIndex = (config != null && "index" in config)?config["index"]:0;
        this.currentIndex = this.gotoIndex;
        this.animationSpeed = (config != null && "animation_speed" in config)?config["animation_speed"]:10;
        this.animationSteps = (config != null && "animation_steps" in config)?config["animation_steps"]:5;
        this.currentAnimationStep = this.animationSteps;
        this.fontColor = (config != null && "font_color" in config)?config["font_color"]:"#000000";
        this.selectionColor = (config != null && "selection_color" in config)?config["selection_color"]:"#000000";
        this.font = (config != null && "font" in config)?config["font"]:"Arial";
        this.addClickEvent = (config != null && "onclick" in config)?config["onclick"]:true;
        this.addDblclickEvent = (config != null && "ondblclick" in config)?config["ondblclick"]:true;
        this.addKeydownEvent = (config != null && "onkeydown" in config)?config["onkeydown"]:true;
        this.addWheelEvent = (config != null && "onwheel" in config)?config["onwheel"]:true;
        this.addTouchmoveEvent = (config != null && "ontouchmove" in config)?config["ontouchmove"]:true;
        this.addResizeEvent = (config != null && "onresize" in config)?config["onresize"]:true;
        this.valueHandler = valueHandler;
        this.onchanged = onchanged;
        var self = this;
        this.focused = false;
        this.mouseEventHandler = function(e) { self.mouseInteraction(e); };
        this.mouseFocusInEventHandler = function() { self.focused = true; }; 
        this.mouseFocusOutEventHandler = function() { self.focused = false; }; 
        this.keyEventHandler = function(e) { self.keyInteraction(e); };
        this.lastTouchY = null;
        this.touchStartHandler = function(e) { self.touchInteractionStart(e); };
        this.touchMoveHandler = function(e) { self.touchInteractionMove(e); };
        this.scrollEventHandler = function(e) { self.scrollInteraction(e); };
        this.resizeEventId = null;
        this.resizeEventHandler = function() { self.onresize(); };
        // Detection based on https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
        this.isMobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test((navigator.userAgent||navigator.vendor||window.opera))||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent||navigator.vendor||window.opera).substr(0,4)))?true:false;
        if (canvas.addEventListener) {
            if(this.addClickEvent && !this.isMobile) {
                canvas.addEventListener('click', this.mouseEventHandler, false);
            }
            if(this.addDblclickEvent && !this.isMobile) {
                canvas.addEventListener('dblclick', this.mouseEventHandler, false);
            }
            if(this.addKeydownEvent && !this.isMobile) {
                canvas.addEventListener('mouseover', this.mouseFocusInEventHandler, false);
                canvas.addEventListener('mouseout', this.mouseFocusOutEventHandler, false);
                document.addEventListener('keydown', this.keyEventHandler, false);
            }
            if(this.addWheelEvent) {
                canvas.addEventListener('wheel', this.scrollEventHandler, false);
                canvas.addEventListener('mousewheel', this.scrollEventHandler, false);
            }
            if(this.addTouchmoveEvent && this.isMobile) {
                canvas.addEventListener('touchstart', this.touchStartHandler, false);
                canvas.addEventListener('touchmove', this.touchMoveHandler, false);
            }
            if(this.addResizeEvent && !this.isMobile) {
                window.addEventListener('resize', this.resizeEventHandler);
            }
        } 
        this.updateView();
    }
    
    /*
     * Remove event listener from canvas and window element
     * Parameter:
     * void
     * Return:
     * void
     */
    remove() {
        if (this.canvas.removeEventListener) {
            this.canvas.removeEventListener('click', this.mouseEventHandler);
            this.canvas.removeEventListener('dblclick', this.mouseEventHandler);
            this.canvas.removeEventListener('keydown', this.keyEventHandler);
            this.canvas.removeEventListener('wheel', this.scrollEventHandler);
            this.canvas.removeEventListener('touchstart', this.touchStartHandler);
            this.canvas.removeEventListener('touchmove', this.touchMoveHandler);
            this.canvas.removeEventListener('mousewheel', this.scrollEventHandler);
            window.removeEventListener('resize', this.resizeEventHandler);
        } 
    }

    /*
     * Get current selected value
     * Parameter:
     * void
     * Return:
     * Return current value (not index)
     */
    getValue() {
        return this.valueHandler(this.currentIndex);
    }

    /*
     * Set a new index and update view
     * Parameter:
     * index: The new index value
     * Return:
     * void
     */
    setIndex(index) {
        this.blockInput = true;
        this.currentAnimationStep = 0;
        this.currentIndex = index;
        this.gotoIndex = index;
        this.updateView();
    }

    /*
     * Mouse interaction event function (used internally)
     * Parameter:
     * e: Event
     * Return:
     * void
     */
    mouseInteraction(e) {
        var rect = this.canvas.getBoundingClientRect();
        if((e.clientY - rect.top) * (this.canvas.height / rect.height) > this.canvas.height / 2) {
            this.scrollInteraction({deltaY: -1, ne: true});
        } else {
            this.scrollInteraction({deltaY: 1});
        }
    }

    /*
     * Key interaction event function (used internally)
     * Parameter:
     * e: Event
     * Return:
     * void
     */
    keyInteraction(e) {
        if(this.focused) {
            var key = (window.event)?window.event.keyCode:e.which;
            if(key == 83 || key == 40) {
                this.scrollInteraction({deltaY: -1, ne: true});
            } else if(key == 87 || key == 38) {
                this.scrollInteraction({deltaY: 1});
            }
        }
    }

    /*
     * Touch interaction event start function (used internally)
     * Parameter:
     * e: Event
     * Return:
     * void
     */
    touchInteractionStart(e) {
        this.lastTouchY = (e.touches?e.changedTouches[0]:e).clientY;
        e.preventDefault();
    }

    /*
     * Key interaction event move function (used internally)
     * Parameter:
     * e: Event
     * Return:
     * void
     */
    touchInteractionMove(e) {
        var currentTouchY = (e.touches?e.changedTouches[0]:e).clientY;
        if(this.lastTouchY != null && Math.abs(this.lastTouchY - currentTouchY) > 3) {
            if (this.lastTouchY > currentTouchY) {
                this.scrollInteraction({deltaY: -1, ne: true});
            } else {
                this.scrollInteraction({deltaY: 1});
            }
        }
        this.lastTouchY = currentTouchY;
        e.preventDefault();
    }
    
    /*
     * Scroll interaction event function (used internally)
     * Parameter:
     * e: Event
     * Return:
     * void
     */
    scrollInteraction(e) {
        if(!this.blockInput) {
            this.blockInput = true;
            this.currentAnimationStep = 0;
            if(e.deltaY > 0 && this.valueHandler(this.gotoIndex - 1) != null) {
                this.gotoIndex--;
                this.updateView();
            } else if(e.deltaY < 0 && this.valueHandler(this.gotoIndex + 1) != null){
                this.gotoIndex++;
                this.updateView();
            } else {
                this.blockInput = false;
            }
        }
        if(!"ne" in e) {
            e.preventDefault();
        }
    }
    
    /*
     * Resize event function (used internally)
     * Parameter:
     * void
     * Return:
     * void
     */
    onresize() {
        clearTimeout(this.resizeEventId);
        var self = this;
        this.resizeEventId = setTimeout(function() {
            self.updateView();
        }, 100);
    }
    
    /*
     * Function to draw a line on the canvas
     * Parameter:
     * points: Array of points that define the line
     * lineWidth: Width of the line
     * lineColor: Color of the line
     * shadowBlur: Definition of the shadow blur
     * shadowColor: Color of the shadow
     * Return:
     * void
     */
    drawLine(points, lineWidth, lineColor, shadowBlur=null, shadowColor=null) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = lineColor;
        if(shadowBlur != null && shadowColor != null) {
            this.ctx.shadowColor = shadowColor;
            this.ctx.shadowBlur = shadowBlur;
        }
        for(var i=0; i<points.length; i++) {
            var x=parseInt(points[i][0] - (lineWidth / 2)),
                y=parseInt(points[i][1] - (lineWidth / 2));
            if(i == 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    /*
     * Function to draw a polygon on the canvas
     * Parameter:
     * points: Array of points that define the line
     * color: Fill color of the polygon
     * borderWidth: Width of the border
     * borderColor: Color of the border
     * shadowBlur: Definition of the shadow blur
     * shadowColor: Color of the shadow
     * Return:
     * void
     */
    drawPolygon(points, color, borderWidth=null, borderColor=null, shadowBlur=null, shadowColor=null) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        if(shadowBlur != null && shadowColor != null) {
            this.ctx.shadowColor = shadowColor;
            this.ctx.shadowBlur = shadowBlur;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        for(var i=1; i<points.length; i++) {
            this.ctx.lineTo(points[i][0], points[i][1]);
        }
        this.ctx.closePath();
        this.ctx.fill();
        if(borderWidth != null && borderColor != null) {
            this.ctx.lineWidth = border.width;
            this.ctx.strokeStyle = border.color;
            this.ctx.stroke();
        }
        this.ctx.restore();
    }
    
    /*
     * Function to draw a text on the canvas
     * Parameter:
     * text: Text to draw
     * points: Center point for the font
     * color: Color of the font
     * fontStyle: Definition of the font style
     * rotate: Angle to rotate the text
     * distance: Percentage distance (1.0 = far, 0.0 = selected)
     * Return:
     * void
     */
    drawText(text, point, color, fontStyle, rotate=0, distance=null) {
        this.ctx.save();
        this.ctx.font = fontStyle;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        if(distance != null && distance != 0) {
            distance = 1 - distance;
            this.ctx.globalAlpha = distance;
            var scale = [0.85 + (distance * 0.15), 0.3 + (distance * 0.7)];
            this.ctx.setTransform(scale[0], 0, 0, scale[1], point[0] * (1 - scale[0]), point[1] * (1 - scale[1]));
        }
        if(rotate != 0) {
            this.ctx.translate(point[0], point[1]);
            this.ctx.rotate(rotate);
            this.ctx.fillText(text, 0, 0);
        } else {
            this.ctx.fillText(text, point[0], point[1]);
        }
        this.ctx.restore();
    }
    
    /*
     * Function to draw/update the view
     * Parameter:
     * void
     * Return:
     * void
     */
    updateView() {
        var hBoxSize = this.canvas.height / 7;
        var horizontalCenter = this.canvas.width / 2;
        var offset = hBoxSize * (this.currentAnimationStep / this.animationSteps) * ((this.currentIndex <= this.gotoIndex)?-1:1);
        if(this.currentAnimationStep == this.animationSteps) {
            offset = 0;
            if(this.currentIndex > this.gotoIndex) {
                this.currentIndex--;
            } else if(this.currentIndex < this.gotoIndex){
                this.currentIndex++;
            }
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawLine([[0, hBoxSize * 3], [this.canvas.width, hBoxSize * 3]], 4, this.selectionColor, 50, this.selectionColor);
        this.drawLine([[0, hBoxSize * 4], [this.canvas.width, hBoxSize * 4]], 4, this.selectionColor, 50, this.selectionColor);
        this.drawPolygon([[0, 0], [this.canvas.width, 0], [this.canvas.width, hBoxSize * 3], [0, hBoxSize * 3]], "#ffffff");
        this.drawPolygon([[0, hBoxSize * 4], [this.canvas.width, hBoxSize * 4], [this.canvas.width, this.canvas.height], [0, this.canvas.height]], "#ffffff");
        this.drawLine([[0, hBoxSize * 3], [this.canvas.width, hBoxSize * 3]], 4, this.selectionColor);
        this.drawLine([[0, hBoxSize * 4], [this.canvas.width, hBoxSize * 4]], 4, this.selectionColor);
        for(var i=-4; i<=4; i++) {
            var value = this.valueHandler(this.currentIndex + i),
                y = ((i + 3.55) * hBoxSize) + offset;
            if(value != null) {
                this.drawText(String(value), [horizontalCenter, y], this.fontColor, hBoxSize + "px " + this.font, 0, Math.abs(y - (3.55 * hBoxSize)) / (4 * hBoxSize));
            }
        }
        if(this.currentAnimationStep != this.animationSteps) {
            this.currentAnimationStep += 1;
            var self = this;
            setTimeout(function() {self.updateView();}, this.animationSpeed);
        } else {
            this.blockInput = false;
            if(this.onchanged != null) {
                this.onchanged(this.currentIndex);
            }
        }
    }
}