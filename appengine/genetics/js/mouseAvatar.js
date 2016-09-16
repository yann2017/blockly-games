/**
 * Blockly Games: Genetics
 *
 * Copyright 2016 Google Inc.
 * https://github.com/google/blockly-games
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for mice avatars in the visualization of the game.
 * @author kozbial@google.com (Monica Kozbial)
 */
'use strict';

goog.provide('Genetics.MouseAvatar');

goog.require('Genetics.Mouse');
goog.require('goog.dom');
goog.require('goog.math');
goog.require('goog.object');


/**
 * Stores mouse attributes and visualization information for a mouse.
 * @param {Genetics.Mouse} mouse The mouse to create a avatar for.
 * @constructor
 * @private
 */
Genetics.MouseAvatar = function(mouse) {
  // Store mouse information
  this.id = mouse.id;
  this.sex = mouse.sex;
  this.size = mouse.size;
  this.pickFightOwner = mouse.pickFightOwner;
  this.proposeMateOwner = mouse.proposeMateOwner;
  this.acceptMateOwner = mouse.acceptMateOwner;

  // Create html element for the mouse.
  this.element = document.createElementNS(Blockly.SVG_NS, 'svg');
  this.element.setAttribute('id', 'mouse-' + mouse.id);
  this.element.setAttribute('class', 'mouse');
  this.element.setAttribute('width', Genetics.MouseAvatar.SIZE + 'px'); // TODO, do we need this?
  this.element.setAttribute('height', Genetics.MouseAvatar.SIZE + 'px');
  this.element.style.transformOrigin = Genetics.MouseAvatar.HALF_SIZE + 'px ' + Genetics.MouseAvatar.HALF_SIZE + 'px';

  // Add mouse sprite to element.
  var image = document.createElementNS(Blockly.SVG_NS, 'image');
  image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      Genetics.MouseAvatar.MOUSE_SRC);
  image.setAttribute('height', Genetics.MouseAvatar.SIZE + 'px');
  image.setAttribute('width', Genetics.MouseAvatar.SIZE + 'px');
  image.style.transformOrigin = Genetics.MouseAvatar.HALF_SIZE + 'px ' + Genetics.MouseAvatar.HALF_SIZE + 'px'; // TODO are both transform origins necessary?
  this.element.appendChild(image);

  // // Add tooltip for element.
  // var tooltip = document.createElementNS(Blockly.SVG_NS, 'text');
  // tooltip.setAttribute('class', 'tooltip');
  // // tooltip.setAttribute('visibility', 'hidden');
  // tooltip.innerHTML = 'sdfsdf';
  // // Genetics.Visualization.display_.appendChild(tooltip);
  //
  // var showTooltip = function(e) {
  //
  // };
  // var hideTooltip = function(e) {
  //
  // };
  // this.element.addEventListener('mousemove', showTooltip, true);
  // this.element.addEventListener('onmouseout', hideTooltip, true);

  // Calculate the pie chart arc start/end based on avatar size.
  var xOffset = Genetics.MouseAvatar.HALF_SIZE - Genetics.MouseAvatar.CHART_HALF_SIZE;
  var yOffset = xOffset + Genetics.MouseAvatar.HALF_SIZE / 4;
  var radius = Genetics.MouseAvatar.CHART_HALF_SIZE;
  var x1 = radius + xOffset;
  var y1 = yOffset;
  var x2 = radius * (1 + 0.5 * Math.sqrt(3)) + xOffset;
  var y2 = radius * 1.5 + yOffset;
  var x3 = radius * (1 - 0.5 * Math.sqrt(3)) + xOffset;
  var y3 = radius * 1.5 + yOffset;
  var centerX = radius + xOffset;
  var centerY = radius + yOffset;

  // Draw top right slice.
  var proposeMateSlice = document.createElementNS(Blockly.SVG_NS, 'path');
  proposeMateSlice.setAttribute('d', 'M ' + x1 + ' ' + y1 +
      ' A ' + radius + ' ' + radius + ', 0, 0, 1, ' +
      x2 + ' ' + y2 + ' L ' + centerX + ' ' + centerY + ' Z');
  proposeMateSlice.setAttribute('fill',
      Genetics.MouseAvatar.playerColors[this.proposeMateOwner]);
  this.element.appendChild(proposeMateSlice);

  // Draw bottom slice.
  var pickFightSlice = document.createElementNS(Blockly.SVG_NS, 'path');
  pickFightSlice.setAttribute('d', 'M ' + x2 + ' ' + y2 +
      ' A ' + radius + ' ' + radius + ', 0, 0, 1, ' +
      x3 + ' ' + y3 + ' L ' + centerX + ' ' + centerY + ' Z');
  pickFightSlice.setAttribute('fill',
      Genetics.MouseAvatar.playerColors[this.pickFightOwner]);
  this.element.appendChild(pickFightSlice);

  // Draw top left slice.
  var acceptMateSlice = document.createElementNS(Blockly.SVG_NS, 'path');
  acceptMateSlice.setAttribute('d', 'M ' + x3 + ' ' + y3 +
      ' A ' + radius + ' ' + radius + ', 0, 0, 1, ' +
      x1 + ' ' + y1 + ' L ' + centerX + ' ' + centerY + ' Z');
  acceptMateSlice.setAttribute('fill',
      Genetics.MouseAvatar.playerColors[this.acceptMateOwner]);
  this.element.appendChild(acceptMateSlice);

  Object.defineProperty(this, 'direction', {
    /**
     * Sets the direction to a value between 0-2PI and rotates the mouse to
     * match the direction facing. Direction angle is clockwise, with 0
     * indicating the mouse facing right.
     * @param {number} direction
     */
    set: function(direction) {
      // Convert direction to a value between 0-2PI
      while (direction < 0) {
        direction += 2 * Math.PI;
      }
      while (direction > 2 * Math.PI) {
        direction -= 2 * Math.PI;
      }
      // Determine what the change of direction is.
      var delta = direction - this.direction;
      if (delta > Math.PI) {
        delta -= 2 * Math.PI;
      } else if (delta < -Math.PI) {
        delta += 2 * Math.PI;
      }
      if (delta > 0) {
        // If the mouse turned right.
      } else if (delta < 0) {
        // If the mouse turned left.
      } else {
        // Mouse went straight
      }
      // Rotate mouse image to match direction facing.
      this.element.style.transform =
          'rotate(' + (direction + Math.PI / 2) + 'rad)';
      this.direction_ = direction;
    },
    /**
     * Returns the direction the mouse is facing.
     * @returns {number}
     */
    get: function() {
      return this.direction_;
    }
  });

  // Choose a random direction for the mouse to face between 0 to 2PI
  this.direction = Math.random() * 2 * Math.PI;

  // Mouse is busy until it is added to the display.
  this.busy = true;

  // The process ids for the idle mouse animation [0] and busy animation [1].
  this.actionPids = [0, 0];
  var wanderAbout = function() {
    var wanderTime = 400 + 100 * Math.random();
    if (!this.busy) {
      this.randomMove_(wanderTime);
    }
    this.actionPids[Genetics.MouseAvatar.IDLE_ACTION_PID_INDEX] =
        setTimeout(wanderAbout, wanderTime);
  }.bind(this);
  wanderAbout();
};

Genetics.MouseAvatar.MOUSE_SRC = 'genetics/mouse.png';

Genetics.MouseAvatar.SIZE = 40;
Genetics.MouseAvatar.HALF_SIZE = Genetics.MouseAvatar.SIZE / 2;
Genetics.MouseAvatar.CHART_SIZE = 10;
Genetics.MouseAvatar.CHART_HALF_SIZE = Genetics.MouseAvatar.CHART_SIZE / 2;

Genetics.MouseAvatar.IDLE_ACTION_PID_INDEX = 0;
Genetics.MouseAvatar.BUSY_ACTION_PID_INDEX = 1;

/**
 * Speed of mouse in pixels per second when moving to a destination with
 * purpose.
 * @type {number}
 */
Genetics.MouseAvatar.BUSY_SPEED = .07;

/**
 * Speed of a mouse in pixels per second when wandering.
 * @type {number}
 */
Genetics.MouseAvatar.IDLE_SPEED = .05;

/**
 * The width/height of the display div containing the mice.
 * Set in Visualization.
 * @type {number}
 */
Genetics.MouseAvatar.DISPLAY_SIZE = 0;

/**
 * Mapping of player id to the color assigned to them.
 * Set in Visualization.
 * @type {Object.<number, string>}
 * @private
 * @const
 */
Genetics.MouseAvatar.playerColors = {};

Genetics.MouseAvatar.prototype.stop = function() {
  for (var i = 0; i < this.actionPids.length; i++) {
    clearTimeout(this.actionPids[i]);
  }
// Stop any animations on the mouse.
  this.element.style['transitionName'] = '';
  this.element.style['animationName'] = '';
};

/**
 *
 * @param mouseAvatar
 * @param mouseX
 * @param mouseY
 * @param {number} x The x position of the target destination.
 * @param {number} y The y position of the target destination.
 * @param {!function} callback
 * @param {number=} opt_time The duration of the move in milliseconds.
 * @private
 */
Genetics.MouseAvatar.prototype.move = function(x, y, callback, opt_time) {
  var xClamped = goog.math.clamp(x, 0,
      Genetics.MouseAvatar.DISPLAY_SIZE -
  Genetics.MouseAvatar.SIZE);
  var yClamped = goog.math.clamp(y, 0,
      Genetics.MouseAvatar.DISPLAY_SIZE -
      Genetics.MouseAvatar.SIZE);

  var mouseX = parseInt(this.element.style.left, 10);
  var mouseY = parseInt(this.element.style.top, 10);

  var xDelta = xClamped - mouseX;
  var yDelta = yClamped - mouseY;

  // Calculate the time it would take to get to destination if not set.
  var time = (opt_time != null) ? opt_time :
  Math.hypot(Math.abs(xDelta), Math.abs(yDelta)) / Genetics.MouseAvatar.BUSY_SPEED;

  if (time < 10 || (Math.abs(xDelta) < 1 && Math.abs(yDelta) < 1)) {
    // If move is shorter than minimum transition time (10) or is too short.
    this.element.style.left = xClamped + 'px';
    this.element.style.top = yClamped + 'px';
    // Turn mouse towards requested destination.
    this.direction = Math.atan2(y - mouseY, x - mouseX);
    this.actionPids[Genetics.MouseAvatar.BUSY_ACTION_PID_INDEX] =
        setTimeout(callback, time);
    return;
  }

  // Turn mouse towards destination.
  this.direction = Math.atan2(yDelta, xDelta);

  this.element.style['transition'] = 'top ' + time + 'ms linear, left ' +
      time + 'ms linear';
  this.element.style.left = xClamped + 'px';
  this.element.style.top = yClamped + 'px';

  this.actionPids[Genetics.MouseAvatar.BUSY_ACTION_PID_INDEX] =
      setTimeout(callback, time);
};

Genetics.MouseAvatar.prototype.randomMove_ = function(time) {
  // Choose a direction based off current direction.
  var range = Math.PI / 2;
  var moveDirection = this.direction + Math.random() * range - range / 2;
  // Calculate destination in direction chosen.
  var distance = Genetics.MouseAvatar.IDLE_SPEED * time;
  var mouseX = parseInt(this.element.style.left, 10);
  var mouseY = parseInt(this.element.style.top, 10);
  var x = mouseX + Math.cos(moveDirection) * distance;
  var y = mouseY + Math.sin(moveDirection) * distance;

  this.move(x, y, function() {}, time);
};

Genetics.MouseAvatar.prototype.moveAbout = function(steps, callback) {
  var count = 0;
  var moveStep = function() {
    var moveTime = 400 + 100 * Math.random();
    this.randomMove_(moveTime);
    if (++count < steps) {
      this.actionPids[Genetics.MouseAvatar.BUSY_ACTION_PID_INDEX] =
          setTimeout(moveStep, moveTime);
    } else {
      callback();
    }
  }.bind(this);
  moveStep();
};