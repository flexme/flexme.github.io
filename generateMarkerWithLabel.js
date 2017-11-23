/*
 * This file appears to have originally come from a google maps utility library which has since been deleted:
 * https://code.google.com/archive/p/google-maps-utility-library-v3/
 *
 * It is mirrored here:
 * https://github.com/jesstelford/node-MarkerWithLabel/blob/master/index.js
 *
 * However the version below has some modifications to make it not violate our content-security-policy
 *
 * Upstream pull request: https://github.com/jesstelford/node-MarkerWithLabel/pull/14
 */
generateMarkerWithLabel = function(google) {
    function inherits(b, a) {
        function tempCtor() {}
        tempCtor.prototype = a.prototype;
        b.superClass_ = a.prototype;
        b.prototype = new tempCtor();
        b.prototype.constructor = b
    }

    function MarkerLabel_(c, b, a) {
        this.marker_ = c;
        this.handCursorURL_ = c.handCursorURL;
        this.labelDiv_ = document.createElement("div");
        this.labelDiv_.style.cssText = "position: absolute; overflow: hidden;";
        this.eventDiv_ = document.createElement("div");
        this.eventDiv_.style.cssText = this.labelDiv_.style.cssText;
        /* The following 2 lines were modified from their original form:
         * this.eventDiv_.setAttribute("onselectstart", "return false;");
         * this.eventDiv_.setAttribute("ondragstart", "return false;");
         *
         * so as to not break content-security-policy
         */
        this.eventDiv_.addEventListener('selectstart', function() { return false; });
        this.eventDiv_.addEventListener('dragstart', function() { return false; });
        this.crossDiv_ = MarkerLabel_.getSharedCross(b)
    }
    inherits(MarkerLabel_, google.maps.OverlayView);
    MarkerLabel_.getSharedCross = function(b) {
        var a;
        if (typeof MarkerLabel_.getSharedCross.crossDiv === "undefined") {
            a = document.createElement("img");
            a.style.cssText = "position: absolute; z-index: 1000002; display: none;";
            a.style.marginLeft = "-8px";
            a.style.marginTop = "-9px";
            a.src = b;
            MarkerLabel_.getSharedCross.crossDiv = a
        }
        return MarkerLabel_.getSharedCross.crossDiv
    };
    MarkerLabel_.prototype.onAdd = function() {
        var g = this;
        var m = false;
        var c = false;
        var f;
        var j, cLngOffset;
        var p;
        var d;
        var h;
        var o;
        var n = 20;
        var i = "url(" + this.handCursorURL_ + ")";
        var k = function(e) {
            if (e.preventDefault) {
                e.preventDefault()
            }
            e.cancelBubble = true;
            if (e.stopPropagation) {
                e.stopPropagation()
            }
        };
        var l = function() {
            g.marker_.setAnimation(null)
        };
        this.getPanes().overlayImage.appendChild(this.labelDiv_);
        this.getPanes().overlayMouseTarget.appendChild(this.eventDiv_);
        if (typeof MarkerLabel_.getSharedCross.processed === "undefined") {
            this.getPanes().overlayImage.appendChild(this.crossDiv_);
            MarkerLabel_.getSharedCross.processed = true
        }
        this.listeners_ = [google.maps.event.addDomListener(this.eventDiv_, "mouseover", function(e) {
            if (g.marker_.getDraggable() || g.marker_.getClickable()) {
                this.style.cursor = "pointer";
                google.maps.event.trigger(g.marker_, "mouseover", e)
            }
        }), google.maps.event.addDomListener(this.eventDiv_, "mouseout", function(e) {
            if ((g.marker_.getDraggable() || g.marker_.getClickable()) && !c) {
                this.style.cursor = g.marker_.getCursor();
                google.maps.event.trigger(g.marker_, "mouseout", e)
            }
        }), google.maps.event.addDomListener(this.eventDiv_, "mousedown", function(e) {
            c = false;
            if (g.marker_.getDraggable()) {
                m = true;
                this.style.cursor = i
            }
            if (g.marker_.getDraggable() || g.marker_.getClickable()) {
                google.maps.event.trigger(g.marker_, "mousedown", e);
                k(e)
            }
        }), google.maps.event.addDomListener(document, "mouseup", function(a) {
            var b;
            if (m) {
                m = false;
                g.eventDiv_.style.cursor = "pointer";
                google.maps.event.trigger(g.marker_, "mouseup", a)
            }
            if (c) {
                if (d) {
                    b = g.getProjection().fromLatLngToDivPixel(g.marker_.getPosition());
                    b.y += n;
                    g.marker_.setPosition(g.getProjection().fromDivPixelToLatLng(b));
                    try {
                        g.marker_.setAnimation(google.maps.Animation.BOUNCE);
                        setTimeout(l, 1406)
                    } catch (e) {}
                }
                g.crossDiv_.style.display = "none";
                g.marker_.setZIndex(f);
                p = true;
                c = false;
                a.latLng = g.marker_.getPosition();
                google.maps.event.trigger(g.marker_, "dragend", a)
            }
        }), google.maps.event.addListener(g.marker_.getMap(), "mousemove", function(a) {
            var b;
            if (m) {
                if (c) {
                    a.latLng = new google.maps.LatLng(a.latLng.lat() - j, a.latLng.lng() - cLngOffset);
                    b = g.getProjection().fromLatLngToDivPixel(a.latLng);
                    if (d) {
                        g.crossDiv_.style.left = b.x + "px";
                        g.crossDiv_.style.top = b.y + "px";
                        g.crossDiv_.style.display = "";
                        b.y -= n
                    }
                    g.marker_.setPosition(g.getProjection().fromDivPixelToLatLng(b));
                    if (d) {
                        g.eventDiv_.style.top = (b.y + n) + "px"
                    }
                    google.maps.event.trigger(g.marker_, "drag", a)
                } else {
                    j = a.latLng.lat() - g.marker_.getPosition().lat();
                    cLngOffset = a.latLng.lng() - g.marker_.getPosition().lng();
                    f = g.marker_.getZIndex();
                    h = g.marker_.getPosition();
                    o = g.marker_.getMap().getCenter();
                    d = g.marker_.get("raiseOnDrag");
                    c = true;
                    g.marker_.setZIndex(1000000);
                    a.latLng = g.marker_.getPosition();
                    google.maps.event.trigger(g.marker_, "dragstart", a)
                }
            }
        }), google.maps.event.addDomListener(document, "keydown", function(e) {
            if (c) {
                if (e.keyCode === 27) {
                    d = false;
                    g.marker_.setPosition(h);
                    g.marker_.getMap().setCenter(o);
                    google.maps.event.trigger(document, "mouseup", e)
                }
            }
        }), google.maps.event.addDomListener(this.eventDiv_, "click", function(e) {
            if (g.marker_.getDraggable() || g.marker_.getClickable()) {
                if (p) {
                    p = false
                } else {
                    google.maps.event.trigger(g.marker_, "click", e);
                    k(e)
                }
            }
        }), google.maps.event.addDomListener(this.eventDiv_, "dblclick", function(e) {
            if (g.marker_.getDraggable() || g.marker_.getClickable()) {
                google.maps.event.trigger(g.marker_, "dblclick", e);
                k(e)
            }
        }), google.maps.event.addListener(this.marker_, "dragstart", function(a) {
            if (!c) {
                d = this.get("raiseOnDrag")
            }
        }), google.maps.event.addListener(this.marker_, "drag", function(a) {
            if (!c) {
                if (d) {
                    g.setPosition(n);
                    g.labelDiv_.style.zIndex = 1000000 + (this.get("labelInBackground") ? -1 : +1)
                }
            }
        }), google.maps.event.addListener(this.marker_, "dragend", function(a) {
            if (!c) {
                if (d) {
                    g.setPosition(0)
                }
            }
        }), google.maps.event.addListener(this.marker_, "position_changed", function() {
            g.setPosition()
        }), google.maps.event.addListener(this.marker_, "zindex_changed", function() {
            g.setZIndex()
        }), google.maps.event.addListener(this.marker_, "visible_changed", function() {
            g.setVisible()
        }), google.maps.event.addListener(this.marker_, "labelvisible_changed", function() {
            g.setVisible()
        }), google.maps.event.addListener(this.marker_, "title_changed", function() {
            g.setTitle()
        }), google.maps.event.addListener(this.marker_, "labelcontent_changed", function() {
            g.setContent()
        }), google.maps.event.addListener(this.marker_, "labelanchor_changed", function() {
            g.setAnchor()
        }), google.maps.event.addListener(this.marker_, "labelclass_changed", function() {
            g.setStyles()
        }), google.maps.event.addListener(this.marker_, "labelstyle_changed", function() {
            g.setStyles()
        })]
    };
    MarkerLabel_.prototype.onRemove = function() {
        var i;
        this.labelDiv_.parentNode.removeChild(this.labelDiv_);
        this.eventDiv_.parentNode.removeChild(this.eventDiv_);
        for (i = 0; i < this.listeners_.length; i++) {
            google.maps.event.removeListener(this.listeners_[i])
        }
    };
    MarkerLabel_.prototype.draw = function() {
        this.setContent();
        this.setTitle();
        this.setStyles()
    };
    MarkerLabel_.prototype.setContent = function() {
        var a = this.marker_.get("labelContent");
        if (typeof a.nodeType === "undefined") {
            this.labelDiv_.innerHTML = a;
            this.eventDiv_.innerHTML = this.labelDiv_.innerHTML
        } else {
            this.labelDiv_.innerHTML = "";
            this.labelDiv_.appendChild(a);
            a = a.cloneNode(true);
            this.eventDiv_.innerHTML = "";
            this.eventDiv_.appendChild(a)
        }
    };
    MarkerLabel_.prototype.setTitle = function() {
        this.eventDiv_.title = this.marker_.getTitle() || ""
    };
    MarkerLabel_.prototype.setStyles = function() {
        var i, labelStyle;
        this.labelDiv_.className = this.marker_.get("labelClass");
        this.eventDiv_.className = this.labelDiv_.className;
        this.labelDiv_.style.cssText = "";
        this.eventDiv_.style.cssText = "";
        labelStyle = this.marker_.get("labelStyle");
        for (i in labelStyle) {
            if (labelStyle.hasOwnProperty(i)) {
                this.labelDiv_.style[i] = labelStyle[i];
                this.eventDiv_.style[i] = labelStyle[i]
            }
        }
        this.setMandatoryStyles()
    };
    MarkerLabel_.prototype.setMandatoryStyles = function() {
        this.labelDiv_.style.position = "absolute";
        this.labelDiv_.style.overflow = "hidden";
        if (typeof this.labelDiv_.style.opacity !== "undefined" && this.labelDiv_.style.opacity !== "") {
            this.labelDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")\"";
            this.labelDiv_.style.filter = "alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")"
        }
        this.eventDiv_.style.position = this.labelDiv_.style.position;
        this.eventDiv_.style.overflow = this.labelDiv_.style.overflow;
        this.eventDiv_.style.opacity = 0.01;
        this.eventDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=1)\"";
        this.eventDiv_.style.filter = "alpha(opacity=1)";
        this.setAnchor();
        this.setPosition();
        this.setVisible()
    };
    MarkerLabel_.prototype.setAnchor = function() {
        var a = this.marker_.get("labelAnchor");
        this.labelDiv_.style.marginLeft = -a.x + "px";
        this.labelDiv_.style.marginTop = -a.y + "px";
        this.eventDiv_.style.marginLeft = -a.x + "px";
        this.eventDiv_.style.marginTop = -a.y + "px"
    };
    MarkerLabel_.prototype.setPosition = function(a) {
        var b = this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition());
        if (typeof a === "undefined") {
            a = 0
        }
        this.labelDiv_.style.left = Math.round(b.x) + "px";
        this.labelDiv_.style.top = Math.round(b.y - a) + "px";
        this.eventDiv_.style.left = this.labelDiv_.style.left;
        this.eventDiv_.style.top = this.labelDiv_.style.top;
        this.setZIndex()
    };
    MarkerLabel_.prototype.setZIndex = function() {
        var a = (this.marker_.get("labelInBackground") ? -1 : +1);
        if (typeof this.marker_.getZIndex() === "undefined") {
            this.labelDiv_.style.zIndex = parseInt(this.labelDiv_.style.top, 10) + a;
            this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex
        } else {
            this.labelDiv_.style.zIndex = this.marker_.getZIndex() + a;
            this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex
        }
    };
    MarkerLabel_.prototype.setVisible = function() {
        if (this.marker_.get("labelVisible")) {
            this.labelDiv_.style.display = this.marker_.getVisible() ? "block" : "none"
        } else {
            this.labelDiv_.style.display = "none"
        }
        this.eventDiv_.style.display = this.labelDiv_.style.display
    };

    function MarkerWithLabel(a) {
        a = a || {};
        a.labelContent = a.labelContent || "";
        a.labelAnchor = a.labelAnchor || new google.maps.Point(0, 0);
        a.labelClass = a.labelClass || "markerLabels";
        a.labelStyle = a.labelStyle || {};
        a.labelInBackground = a.labelInBackground || false;
        if (typeof a.labelVisible === "undefined") {
            a.labelVisible = true
        }
        if (typeof a.raiseOnDrag === "undefined") {
            a.raiseOnDrag = true
        }
        if (typeof a.clickable === "undefined") {
            a.clickable = true
        }
        if (typeof a.draggable === "undefined") {
            a.draggable = false
        }
        if (typeof a.optimized === "undefined") {
            a.optimized = false
        }
        a.crossImage = a.crossImage || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png";
        a.handCursor = a.handCursor || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur";
        a.optimized = false;
        this.label = new MarkerLabel_(this, a.crossImage, a.handCursor);
        google.maps.Marker.apply(this, arguments)
    }
    inherits(MarkerWithLabel, google.maps.Marker);
    MarkerWithLabel.prototype.setMap = function(a) {
        google.maps.Marker.prototype.setMap.apply(this, arguments);
        this.label.setMap(a)
    };
    return MarkerWithLabel;
};

