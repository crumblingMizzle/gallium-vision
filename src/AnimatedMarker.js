import { DomUtil, LatLng, Marker, } from "leaflet";

export const AnimatedMarker = Marker.extend({
  options: {
    // meters
    distance: 200,
    // ms
    interval: 1000,
    // animate on add?
    autoStart: true,
    clickable: false,
    onNext: (next, id) => {
      console.log(next, id);
    },
  },

  initialize: function (latlngs, options) {
    this.setLine(latlngs);
    Marker.prototype.initialize.call(this, latlngs[0], options);
  },

  onAdd: function (map) {
    Marker.prototype.onAdd.call(this, map);

    // Start animating when added to the map
    if (this.options.autoStart) {
      this.start();
    }
  },

  animate: function() {
    var self = this,
        len = this._latlngs.length,
        speed = this.options.interval;

    // Normalize the transition speed from vertex to vertex
    if (this._i < len && this._i > 0) {
      speed = this._latlngs[this._i-1].distanceTo(this._latlngs[this._i]) / this.options.distance * this.options.interval;
      // console.log(speed);
    }

    
    if (this._icon) { this._icon.style[DomUtil.TRANSITION] = ('all ' + speed + 'ms linear'); }
    if (this._shadow) { this._shadow.style[DomUtil.TRANSITION] = 'all ' + speed + 'ms linear'; }

    // Move to the next vertex
    this.setLatLng(this._latlngs[this._i]);
    this.options.onNext(this._latlngs[this._i], this._i);
    this._i++;

    // Queue up the animation to the next next vertex
    this._tid = setTimeout(function(){
      if (self._i === len) {
        //self.setLine(self._latlngs);
        //self.animate();
      } else {
        self.animate();
      }
    }, speed);
  },

  // Start the animation
  start: function() {
    this.animate();
  },

  // Stop the animation in place
  stop: function() {
    if (this._tid) {
      clearTimeout(this._tid);
    }
  },

  setLine: function(latlngs){
    this._latlngs = latlngs;
    this._i = 0;
  }
  
});