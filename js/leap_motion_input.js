function LeapMotionInput() {
	var init,i,gesture,handleGesture,isHorizontal,lastMove = 0,newTime,delay=303,self = this,map,
		hand;
	this.events = {};
	


 	init = function(){
		var controllerOptions = {enableGestures : true};
		Leap.loop(controllerOptions,function(frame){
			if(frame.gestures.length > 0){
				for(i=0;i<frame.gestures.length;i++){
					gesture = frame.gestures[i];
					newTime = Date.now();
					if(gesture.type==="swipe"){
						if(((newTime - lastMove) > delay) || lastMove === 0){
							lastMove = newTime;
							handleGesture(gesture);
							break;
						}
					}


				}	
			}
			else if(frame.hands.length >= 2){
				self.emit("restart");
			}
		});
 	};
 	//0 up
      //1 right
      //2 down
      //3 left
    map = { "up" : 0, "right" : 1, "down" : 2, "left" : 3};
 	handleGesture = function(gesture){
      isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
      if(isHorizontal){
          if(gesture.direction[0] > 0.0){
              swipeDirection = "right";
          } else {
              swipeDirection = "left";
          }
      }
      else { //vertical
          if(gesture.direction[1] > 0.0){
              swipeDirection = "up";
          }
          else {
              swipeDirection = "down";
          }                  
      }

      if(typeof self.emit !== "undefined"){
      	self.emit("move",map[swipeDirection]);
      }
      else {
      	console.log("Wait for initialization...");
      }
      
      console.log(swipeDirection);	
 	};


 	init();
 	self.listen();
 }

LeapMotionInput.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

LeapMotionInput.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

LeapMotionInput.prototype.listen = function () {
  // Respond to button presses
  this.bindButtonPress(".retry-button", this.restart);
  this.bindButtonPress(".restart-button", this.restart);
  this.bindButtonPress(".keep-playing-button", this.keepPlaying);

};

LeapMotionInput.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

LeapMotionInput.prototype.keepPlaying = function (event) {
  event.preventDefault();
  this.emit("keepPlaying");
};

LeapMotionInput.prototype.bindButtonPress = function (selector, fn) {
  var button = document.querySelector(selector);
  button.addEventListener("click", fn.bind(this));
  button.addEventListener(this.eventTouchend, fn.bind(this));
};