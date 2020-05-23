AFRAME.registerComponent('log', {
    schema: {
        message: {type: 'string', default: 'You didn\'t log anything'}
    },

    init: function() {
        let data = this.data;
        let el = this.el;  
        console.log(data.message);
    }
});

AFRAME.registerComponent('log-on-click', {
    schema: {
        message: {type: 'string', default: 'You didn\'t log anything'}
    },

    init: function() {
        let data = this.data;
        let el = this.el;  

        el.addEventListener('click', function () {
            console.log(data.message);
        });
    }
});

AFRAME.registerComponent('scale-vary', {
    schema: {
        id: {type: 'string', default: ''}
    },

    init: function() {
        let el = this.el;
        let data = this.data;

        el.addEventListener('click', function () {
            let scalableObj = document.getElementById(`${data.id}`);
            let scale = scalableObj.getAttribute('scale');
            let text = document.getElementById('scaleText');

            if(scale.x == 1) {
                console.log(scale);
                scalableObj.setAttribute('scale', { x: 2 , y: 2 , z: 2 });
                console.log('scale up complete');
                text.setAttribute('value', 'Click to scale down');
            }else {
                console.log(scale);
                scalableObj.setAttribute('scale', { x: 1 , y: 1 , z: 1 });
                console.log('scale down complete');
                text.setAttribute('value', 'Click to scale up');
            }
        });
    }
});

AFRAME.registerComponent('obj-appear', {
    schema: {
        id: {type: 'string', default: ''}
    },

    init: function() {
        let el = this.el;
        let data = this.data;

        el.addEventListener('click', function () {
            let appearableObj = document.getElementById(`${data.id}`);
            let visibility = appearableObj.getAttribute('visible');
            let text = document.getElementById('appearableText');

            if(visibility == false) {
                console.log(visibility);
                appearableObj.setAttribute('visible', 'true');
                console.log('appearance complete');
                text.setAttribute('value', 'Click to disappear obj');
            }else { 
                console.log(visibility);
                appearableObj.setAttribute('visible', 'false');
                console.log('disappearance complete');
                text.setAttribute('value', 'Click to appear obj');
            }
        });
    }
});

AFRAME.registerComponent('object-select', {
    schema: {
        selectedObj: {type: 'string', default: 'a-box'},
        id: {type: 'string', default: 'selectedObj'}
    },

    init: function() {
        let el = this.el;
        let data = this.data;
        let objCounter = 1;
        let selectedObject = data.selectedObj;
        
        el.addEventListener('click', function () {
            let selectObj = function() {
                let aScene = document.getElementById('a-scene');
                let placedObj = document.createElement(`${selectedObject}`);
                placedObj.setAttribute('id', `${selectedObject}`);
                if(placedObj.tagName == 'A-BOX') {
                    aScene.appendChild(placedObj);
                    placedObj.setAttribute('id', `${selectedObject}${objCounter}`);
                    placedObj.setAttribute('position', { x: 0 , y: 0 , z: objCounter * 2});
                    placedObj.setAttribute('change-color-on-hover', '');
                    placedObj.setAttribute('raycaster-placer', '');
                    console.log(`${selectedObject}${objCounter} created`);
                    objCounter++;
                } else if(placedObj.tagName == 'A-SPHERE') {
                    aScene.appendChild(placedObj);
                    placedObj.setAttribute('id', `${selectedObject}${objCounter}`);
                    placedObj.setAttribute('position', { x: 3 , y: 0 , z: objCounter * 2});
                    placedObj.setAttribute('scale', {x: 0.75,y: 0.75,z: 0.75});
                    placedObj.setAttribute('change-color-on-hover', '');
                    placedObj.setAttribute('raycaster-placer', '');
                    console.log(`${selectedObject}${objCounter} created`);
                    objCounter++;
                } else if(placedObj.tagName == 'A-CYLINDER') {
                    aScene.appendChild(placedObj);
                    placedObj.setAttribute('id', `${selectedObject}${objCounter}`);
                    placedObj.setAttribute('position', { x: -3 , y: 0 , z: objCounter * 2});
                    placedObj.setAttribute('change-color-on-hover', '');
                    placedObj.setAttribute('raycaster-placer', '');
                    console.log(`${selectedObject}${objCounter} created`);
                    objCounter++;
                };
            };

            selectObj();

        });
    }
});

AFRAME.registerComponent('change-color-on-hover', {
    schema: {
      color: {default: 'blue'}
    },

    init: function () {
      let data = this.data;
      let el = this.el;
      let defaultColor = el.getAttribute('material').color;

      el.addEventListener('mouseenter', function() {
        let selectorCone = document.createElement('a-cone');
        el.setAttribute('color', data.color);
        el.appendChild(selectorCone);
        selectorCone.setAttribute('id', 'selectorCone');
        selectorCone.setAttribute('position', {x: 0, y: 1.5, z: 0});
        selectorCone.setAttribute('scale', {x: 0.2, y: 0.5, z: 0.2});
        selectorCone.setAttribute('rotation', {x: 180, y: 0, z: 0});
        selectorCone.setAttribute('material', 'color: blue');
        if (el.tagName = 'A-SPHERE') {
            selectorCone.setAttribute('animation', 'property: position; from: 0 1.5 0; to: 0 1.75 0; dir: alternate; dur: 750; loop: true; easing: linear');
        } else {
            selectorCone.setAttribute('animation', 'property: position; from: 0 1 0; to: 0 1.25 0; dir: alternate; dur: 750; loop: true; easing: linear');
        };
        console.log('selector cone created');
      });

      el.addEventListener('mouseleave', function() {
        el.removeChild(selectorCone);
        el.setAttribute('color', defaultColor);
        console.log('selector cone destroyed')
      });
    }
});

AFRAME.registerComponent('raycaster-sphere', {

	init: function () {
        let aScene = document.getElementById('a-scene');
        this.positionSphere = document.createElement('a-sphere');
        let positionSphere = this.positionSphere;
        aScene.appendChild(positionSphere);
        this.positionSphere.setAttribute('scale', {x: 0.1,y: 0.1, z: 0.1});
        this.positionSphere.setAttribute('material', 'color: orange');

        this.el.addEventListener('raycaster-intersected', evt => {
            this.raycaster = evt.detail.el;
        });
        this.el.addEventListener('raycaster-intersected-cleared', evt => {
            this.raycaster = null;
        });
    },

    tick: function () {
        if (!this.raycaster) { return; }  // Not intersecting.

        let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
        if (!intersection) { return; }
        this.positionSphere.setAttribute('position', intersection.point);
    }
});

AFRAME.registerComponent('raycaster-placer', {   
    init: function () {
        this.el.addEventListener('raycaster-intersected', evt => {
          this.raycaster = evt.detail.el;
          el.addEventListener('mousedown');
        });
        this.el.addEventListener('raycaster-intersected-cleared', evt => {
          this.raycaster = null;
        });
    },
    
    tick: function () {
        if (!this.raycaster) { return; }  // Not intersecting.
    
        let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
        if (!intersection) { return; }
        console.log(intersection.point);
      }
});

AFRAME.registerComponent('interface-create', {
    schema: {},

    init: function() {
        let el = this.el;
        let data = this.data;
        console.log('interface-create');

        el.addEventListener('ybuttondown', function () {
            console.log('entra en el ybutton');
            let interfaceCylinder = document.getElementById('interfaceCylinder');
            let interfaceBox = document.getElementById('interfaceBox');
            let interfaceSphere = document.getElementById('interfaceSphere');
            let interfaceCone = document.getElementById('interfaceCone');
            let interfaceDodecahedron = document.getElementById('interfaceDodecahedron');
            let interfaceCircle = document.getElementById('interfaceCircle');
            let interfacePlane = document.getElementById('interfacePlane');
            let interfaceTriangle = document.getElementById('interfaceTriangle');
            let aScene = document.getElementById('a-scene');
            let camera = document.getElementById('camera');

            if(interfaceCylinder == null) {
                let interfaceCylinder = document.createElement('a-cylinder');
                camera.appendChild(interfaceCylinder);
                interfaceCylinder.setAttribute('id', 'interfaceCylinder');
                interfaceCylinder.setAttribute('position', {x: -2.5, y: 1.5, z: -7});
                interfaceCylinder.setAttribute('rotation', {x: 0, y: 45, z: 0});
                interfaceCylinder.setAttribute('scale', {x: 0.9, y: 0.9, z: 0.9});
                interfaceCylinder.setAttribute('material', 'opacity: .5');
                interfaceCylinder.setAttribute('animation', 'property: rotation; from: 0 0 0; to: 0 360 0; dur: 5000; loop: -1; easing:linear');
                console.log('interface cylinder created');
                console.log(interfaceCylinder);
            } else {
                camera.removeChild(interfaceCylinder);
                console.log('interface cylinder eliminated'); 
                console.log(interfaceCylinder);               
            };

            if(interfaceBox == null) {
                let interfaceBox = document.createElement('a-box');
                camera.appendChild(interfaceBox);
                interfaceBox.setAttribute('id', 'interfaceBox');
                interfaceBox.setAttribute('position', {x: -0.5, y: 1.5, z: -7});
                interfaceBox.setAttribute('rotation', {x: 0, y: 45, z: 0});
                interfaceBox.setAttribute('material', 'opacity: .5');
                interfaceBox.setAttribute('animation', 'property: rotation; from: 0 0 0; to: 0 360 0; dur: 5000; loop: -1; easing:linear');
                console.log('interface box created');
                console.log(interfaceBox);
            } else {
                camera.removeChild(interfaceBox);
                console.log('interface box eliminated'); 
                console.log(interfaceBox);               
            };

            if(interfaceSphere == null) {
                let interfaceSphere = document.createElement('a-sphere');
                camera.appendChild(interfaceSphere);
                interfaceSphere.setAttribute('id', 'interfaceSphere');
                interfaceSphere.setAttribute('position', {x: 1.5, y: 1.5, z: -7});
                interfaceSphere.setAttribute('rotation', {x: 0, y: 45, z: 0});
                interfaceSphere.setAttribute('scale', {x: 0.7, y: 0.7, z: 0.7});
                interfaceSphere.setAttribute('material', 'opacity: .5');
                interfaceSphere.setAttribute('animation', 'property: rotation; from: 0 0 0; to: 0 360 0; dur: 5000; loop: -1; easing:linear');
                console.log('interface sphere created');
                console.log(interfaceSphere);
            } else {
                camera.removeChild(interfaceSphere);
                console.log('interface sphere eliminated'); 
                console.log(interfaceSphere);               
            };

            if(interfaceCone == null) {
                let interfaceCone = document.createElement('a-cone');
                camera.appendChild(interfaceCone);
                interfaceCone.setAttribute('id', 'interfaceCone');
                interfaceCone.setAttribute('position', {x: 3.5, y: 1.35, z: -7});
                interfaceCone.setAttribute('rotation', {x: 0, y: 45, z: 0});
                interfaceCone.setAttribute('scale', {x: 0.7, y: 1, z: 0.7});
                interfaceCone.setAttribute('material', 'opacity: .5');
                interfaceCone.setAttribute('animation', 'property: rotation; from: 0 0 0; to: 0 360 0; dur: 5000; loop: -1; easing:linear');
                console.log('interface cone created');
                console.log(interfaceCone);
            } else {
                camera.removeChild(interfaceCone);
                console.log('interface cone eliminated'); 
                console.log(interfaceCone);               
            };

            if(interfaceDodecahedron == null) {
                let interfaceDodecahedron = document.createElement('a-dodecahedron');
                camera.appendChild(interfaceDodecahedron);
                interfaceDodecahedron.setAttribute('id', 'interfaceDodecahedron');
                interfaceDodecahedron.setAttribute('position', {x: -2.5, y: -0.5, z: -7});
                interfaceDodecahedron.setAttribute('rotation', {x: 0, y: 45, z: 0});
                interfaceDodecahedron.setAttribute('scale', {x: 0.9, y: 0.9, z: 0.9});
                interfaceDodecahedron.setAttribute('material', 'opacity: .5');
                interfaceDodecahedron.setAttribute('animation', 'property: rotation; from: 0 0 0; to: 0 360 0; dur: 5000; loop: -1; easing:linear');
                console.log('interface dodecahedron created');
                console.log(interfaceDodecahedron);
            } else {
                camera.removeChild(interfaceDodecahedron);
                console.log('interface dodecahedron eliminated'); 
                console.log(interfaceDodecahedron);               
            };

            if(interfaceCircle == null) {
                let interfaceCircle = document.createElement('a-circle');
                camera.appendChild(interfaceCircle);
                interfaceCircle.setAttribute('id', 'interfaceBox');
                interfaceCircle.setAttribute('position', {x: -0.5, y: -0.5, z: -7});
                interfaceCircle.setAttribute('rotation', {x: 90, y: 0, z: 0});
                interfaceCircle.setAttribute('side', 'double');
                interfaceCircle.setAttribute('scale', {x: 0.8, y: 0.8, z: 0.8});
                interfaceCircle.setAttribute('material', 'opacity: .5');
                interfaceCircle.setAttribute('animation', 'property: rotation; from: 0 0 0; to: 0 360 0; dur: 5000; loop: -1; easing:linear');
                console.log('interface circle created');
                console.log(interfaceCircle);
            } else {
                camera.removeChild(interfaceCircle);
                console.log('interface circle eliminated'); 
                console.log(interfaceCircle);               
            };

            if(interfacePlane == null) {
                let interfacePlane = document.createElement('a-plane');
                camera.appendChild(interfacePlane);
                interfacePlane.setAttribute('id', 'interfacePlane');
                interfacePlane.setAttribute('position', {x: 1.5, y: -0.5, z: -7});
                interfacePlane.setAttribute('rotation', {x: 0, y: 0, z: 0});
                interfacePlane.setAttribute('scale', {x: 1.1, y: 1.1, z: 1.1});
                interfacePlane.setAttribute('material', 'opacity: .5');
                interfacePlane.setAttribute('side', 'double');
                interfacePlane.setAttribute('animation', 'property: rotation; from: 0 0 0; to: 0 360 0; dur: 5000; loop: -1; easing:linear');
                console.log('interface plane created');
                console.log(interfacePlane);
            } else {
                camera.removeChild(interfacePlane);
                console.log('interface plane eliminated'); 
                console.log(interfacePlane);               
            };

            if(interfaceTriangle == null) {
                let interfaceTriangle = document.createElement('a-triangle');
                camera.appendChild(interfaceTriangle);
                interfaceTriangle.setAttribute('id', 'interfaceCone');
                interfaceTriangle.setAttribute('vertex-a', {x: 3, y: 0.75, z: -7});
                interfaceTriangle.setAttribute('vertex-b', {x: 3.5, y: 2.25, z: -7});
                interfaceTriangle.setAttribute('vertex-c', {x: 4, y: 0.75, z: -7});
                interfaceTriangle.setAttribute('rotation', {x: 0, y: 45, z: 0});
                interfaceTriangle.setAttribute('scale', {x: 0.7, y: 1, z: 0.7});
                interfaceTriangle.setAttribute('side', 'double');
                interfaceTriangle.setAttribute('material', 'opacity: .5');
                interfaceTriangle.setAttribute('animation', 'property: rotation; from: 0 0 0; to: 0 360 0; dur: 5000; loop: -1; easing:linear');
                console.log('interface triangle created');
                console.log(interfaceTriangle);
            } else {
                camera.removeChild(interfaceTriangle);
                console.log('interface triangle eliminated'); 
                console.log(interfaceTriangle);               
            };
        });
    }
});