/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	AFRAME.registerComponent('retain-camera', __webpack_require__(1));

	AFRAME.registerComponent('axis', __webpack_require__(2));

	AFRAME.registerComponent('bb', __webpack_require__(3));

	AFRAME.registerComponent('recorder', __webpack_require__(4));


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	/* global localStorage */
	module.exports = {
	  init: function () {
	    var scene = this.el;

	    this.origCamera;

	    window.addEventListener('beforeunload', function () {
	      var camera = scene.camera.el;

	      var position = camera.getAttribute('position');
	      var rotation = camera.getAttribute('rotation');

	      localStorage.setItem('a-frame-camera', JSON.stringify({
	        position: position,
	        rotation: rotation
	      }));
	     }, false);

	    scene.addEventListener('loaded', this.onLoaded.bind(this));

	    window.addEventListener('keydown', function(e) {
	      if(e.key === '`') {
	        var origCamera = this.origCamera;
	        this.setCamera(origCamera.position, origCamera.rotation);
	      }
	    }.bind(this));

	  },

	  onLoaded: function() {
	    if (!this.el.camera) {
	      // the default camera isn't loaded yet, so try again
	      // must be a better way to find this happening?
	      setTimeout(function() {
	        this.onLoaded.call(this)
	      }.bind(this), 10);
	      return;
	    }

	    var camera = this.el.camera.el;

	    // save scene original camera
	    this.origCamera = {
	      position: camera.getAttribute('position'),
	      rotation: camera.getAttribute('rotation')
	    }

	    // parse local storage saved camera from beforeunload.
	    var savedCamera = localStorage['a-frame-camera'];
	    var saved = JSON.parse(savedCamera);

	    camera.setAttribute('position', saved.position);
	    camera.setAttribute('rotation', saved.rotation);
	  },

	  setCamera: function(position, rotation) {
	    var camera = this.el.camera.el;

	    camera.setAttribute('position', position);
	    camera.setAttribute('rotation', rotation);
	  }
	};



/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = {
	  schema: {
	    size: { type: 'number', default: 1 },
	    windowSize: { type: 'int', default: 100 },
	    windowBackground: { type: 'string', default: 'rgb(3, 44, 113)' }
	  },

	  init: function () {
	    var axisHelper = this.makeAxisHelper();
	    this.axisHelper = axisHelper;
	    this.isCamera = this.el.getObject3D('camera') === undefined ? false : true;
	    if (this.isCamera) {
	      this.makeAxisWindow();
	      // adds axis to axis window
	      this.axisScene.add(this.axisHelper);
	    } else {
	      this.el.object3D.add(axisHelper);
	    }
	  },

	  makeAxisWindow: function () {
	    var axisRenderer = new THREE.WebGLRenderer({ alpha: true });
	    var el = axisRenderer.domElement;
	    axisRenderer.setSize(this.data.windowSize, this.data.windowSize);
	    el.style.position = 'absolute';
	    el.style.background = this.data.windowBackground;
	    el.style.bottom = 0;
	    el.style.left = 0;
	    el.style.zIndex = 100;
	    this.el.sceneEl.appendChild(el);
	    this.axisRenderer = axisRenderer;

	    var axisScene = new THREE.Scene();
	    this.axisScene = axisScene;

	    var axisCamera = new THREE.PerspectiveCamera(20, 1, 1, 1000);
	    axisCamera.position.set(0, 0, 10);
	    this.axisCamera = axisCamera;
	  },

	  makeAxisHelper: function () {
	    var axisHelper = new THREE.AxisHelper(this.data.size);
	    axisHelper.material.transparent = true;
	    axisHelper.material.depthTest = false;

	    var geometry = new THREE.ConeGeometry( 0.1, 0.2, 8 );

	    var x = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff00c7, depthTest: false, transparent: true}));
	    x.rotation.z = -1.5708;
	    x.position.x = this.data.size;
	    axisHelper.add(x);

	    var y = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x00ffab, depthTest: false, transparent: true}));
	    y.position.y = this.data.size;
	    axisHelper.add(y);

	    var z = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x0085ff, depthTest: false, transparent: true}));
	    z.rotation.x = 1.5708;
	    z.position.z = this.data.size;
	    axisHelper.add(z);

	    return axisHelper;
	  },

	  tick: function () {
	    if (this.isCamera) {
	      var q = this.el.sceneEl.camera.getWorldQuaternion();
	      this.axisHelper.setRotationFromQuaternion(q.inverse());
	      this.axisRenderer.render(this.axisScene, this.axisCamera);
	    }
	  }
	};



/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = {
	  init: function () {
	    var helper = new THREE.BoxHelper(this.el.getObject3D('mesh'));
	    this.el.object3D.add(helper);
	  }
	};



/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = {
	  schema: {
	    framerate: { type: 'number', default: 24 },
	    postUrl: { type: 'string' },
	    mediaType: { type: 'string', default: 'mp4' },
	    fileName: { type: 'string', default: 'preview' }
	  },

	  init: function () {
	    var scene = this.el.sceneEl;
	    var framerate = 5;
	    var chunks = [];
	    this.recording = false;

	    this.getSceneCanvas = new Promise(function (resolve) {
	      if (scene.loaded) {
	        resolve(scene.canvas);
	      }
	      scene.addEventListener('loaded', function () {
	        resolve(scene.canvas);
	      });
	    });
	    this.getSceneCanvas.then(this.setupRecorder.bind(this));
	  },

	  setupRecorder: function (canvas) {
	    var videoData = [];
	    var recording = false;
	    var stream = canvas.captureStream(this.data.framerate);
	    var recorder = new MediaRecorder(stream);
	    recorder.ondataavailable = handleDataAvailable;

	    // playback window
	    var playbackContainer = document.createElement('div');
	    playbackContainer.style.cssText = 'position: absolute; top: 100px; left: 0px; visibility: hidden';

	    var playback = document.createElement('video');
	    playback.style.cssText = 'background: black;';
	    playback.width = 320;
	    playback.height = 240;
	    playbackContainer.appendChild(playback);

	    var saveButton = document.createElement('button');
	    saveButton.style.cssText = 'display: block';
	    saveButton.innerHTML = 'Save';
	    saveButton.addEventListener('click', function () {
	      var xhr = new XMLHttpRequest();
	      var formData = new FormData();

	      xhr.addEventListener('load', function () {
	        console.log('Video posted to: ', this.data.postUrl);
	      }.bind(this));

	      var blob = new Blob(videoData, {
	        type: 'video/' + this.data.mediaType
	      });

	      formData.append('files', blob, this.data.fileName + '.' + this.data.mediaType);
	      xhr.open('POST', this.data.postUrl, true);
	      xhr.send(formData);
	    }.bind(this));

	    playbackContainer.appendChild(saveButton);

	    document.body.appendChild(playbackContainer);


	    // record button
	    var recordButton = document.createElement('button');
	    recordButton.style.cssText = 'position: absolute; top: 0px; left: 0px;'
	    recordButton.innerHTML = 'Record';
	    document.body.appendChild(recordButton);
	    recordButton.addEventListener('click', toggleRecorder);

	    // status
	    var div = document.createElement('div');
	    div.style.cssText = 'position: absolute; top: 20px; left: 0px; color: white; background: black; visibility: hidden; font-family: Helvetica, Arial, Sans-Serif; padding: 10px;';

	    // window.addEventListener('keydown', function(e) {
	    //   if(e.key === 'r') {
	    //     toggleRecorder();
	    //   }
	    // });

	    function toggleRecorder() {
	      if (!recording) {
	        startRecorder();
	      } else {
	        stopRecorder();
	      }

	      recording = (recording) ? false : true;
	    }

	    function startRecorder() {
	      if (playback.currentTime > 0) {
	        playback.pause();
	        playback.src = '';
	        playback.load();
	        playbackContainer.style.visibility = 'hidden';
	      }
	      videoData = [];
	      recorder.start();
	      document.body.appendChild(div);
	      div.style.visibility = 'visible';
	      div.innerHTML = 'Recording';
	      recordButton.innerHTML = 'Stop';
	    }

	    function stopRecorder() {
	      recorder.stop();
	      div.innerHTML = 'Finished!';
	      setTimeout(function () {
	        div.style.visibility = 'hidden';
	      }, 2000)

	      recordButton.innerHTML = 'Record';
	    }

	    function handleDataAvailable(e) {
	      if (e.data.size > 0) {
	        videoData.push(e.data);

	        // download chunks
	        var blob = new Blob(videoData, {
	          type: 'video/webm'
	        });
	        var url = URL.createObjectURL(blob);
	        playback.autoplay = true;
	        playback.loop = true;
	        playback.src = url;
	        playback.play();
	        playbackContainer.style.visibility = 'visible';

	        // var a = document.createElement('a');
	        // document.body.appendChild(a);
	        // a.style = 'display: none';
	        // a.href = url;
	        // a.download = 'a-recording.webm';
	        // a.click();
	        // window.URL.revokeObjectURL(url);
	      }
	    }
	  }
	};

/***/ })
/******/ ]);