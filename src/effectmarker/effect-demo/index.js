var map = new maptalks.Map('map', {
  center: [114.340061, 30.543746],
  zoom: 12,
  minZoom: 1,
  maxZoom: 19,
  pitch : 45,
  lights: {
    ambient: {
        color: [0.1, 0.1, 0.1]
    },
    directional: {
        color: [1, 1, 1],
        direction: [1, 0, -1],
    }
  },
  baseLayer: new maptalks.TileLayer('base', {
      urlTemplate: 'http://api2.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20161109&scale=1&styles=t%3Awater%7Ce%3Aall%7Cc%3A%23044161%2Ct%3Aland%7Ce%3Aall%7Cc%3A%23091934%2Ct%3Aboundary%7Ce%3Ag%7Cc%3A%23064f85%2Ct%3Arailway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cc%3A%23004981%2Ct%3Ahighway%7Ce%3Ag.f%7Cc%3A%23005b96%7Cl%3A1%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aon%2Ct%3Aarterial%7Ce%3Ag%7Cc%3A%23004981%7Cl%3A-39%2Ct%3Aarterial%7Ce%3Ag.f%7Cc%3A%2300508b%2Ct%3Agreen%7Ce%3Aall%7Cv%3Aoff%7Cc%3A%23056197%2Ct%3Asubway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Amanmade%7Ce%3Aall%7Cv%3Aoff%2Ct%3Alocal%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Al%7Cv%3Aon%2Ct%3Aboundary%7Ce%3Ag.f%7Cc%3A%23029fd4%2Ct%3Abuilding%7Ce%3Aall%7Cc%3A%231a5787%2Ct%3Apoi%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aall%7Ce%3Al%7Cv%3Aoff',
  })
});
var Config = function () {
  this.offsetX = 1.0;
  this.offsetY = 1.0;
}
var vert = `
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;
  uniform mat4 projViewMatrix;
  uniform mat4 modelMatrix;
  uniform float offsetX;
  uniform float offsetY;
  varying vec2 vTexCoords;
  void main()
  {
    gl_Position = projViewMatrix * modelMatrix * vec4(aPosition, 1.0);
    vTexCoords = aTexCoord + vec2(offsetX, offsetY);
  }
`;

const frag = `
  precision mediump float;
  uniform sampler2D texture;

  varying vec2 vTexCoords;
  void main() {
    vec4 color = texture2D(texture, vTexCoords);
    gl_FragColor = vec4(color.rgb, color.a) * color.a;
  }
`;
const shaderConfig = {
  vert : vert,
  frag : frag,
  uniforms : [
      'texture',
      'offsetX',
      'offsetY',
      'projViewMatrix'
  ],//
  positionAttribute : 'POSITION',
  extraCommandProps : {
      blend: {
              enable: true,
              func: {
                  src: 'one',
                  dst: 'one minus src alpha'
              },
              equation: 'add'
      }
  }
};

const sceneConfig = {
  postProcess: {
      enable: true,
      bloom: {
          enable: true,
          threshold: 0,
          factor: 1,
          radius: 0.4,
      },
  }
};
const center = map.getCenter();
maptalks.GLTFLayer.registerShader('aeffect', 'MeshShader', shaderConfig);
var gltflayer = new maptalks.GLTFLayer('gltf');//添加一个gltf图层到地图上
var effectlayer = new maptalks.EffectLayer('effectlayer');
//模型资源路径
var lxx = '../../../../resource/gltf/lxx/scene.glb';
var guangshu = '../../../../resource/gltf/guangshu/scene.glb';
let gltfMarker1, gltfMarker2, gltfMarker3, gltfMarker4, gltfMarker5, gltfMarker6;
//
gltfMarker6 = new maptalks.GLTFMarker(center, {
  symbol : {
      url : '../../../../resource/gltf/aatrox/scene.gltf',
      animation : true,
      loop : true,
      rotation : [90, 0, 0],
      scale : [0.1, 0.1, 0.1],
      uniforms : {
          lightDirection : [1, 1, 1],
          materialShininess: 32,
          ambientStrength : 0.5,
          specularStrength : 1.0,
          lightAmbient: [1.0, 1.0, 1.0],
          lightDiffuse: [1.0, 1.0, 1.0],
          lightSpecular: [1.0, 1.0, 1.0]
      }
  }
}).addTo(gltflayer);

const image1 = new Image();
image1.src = '../../../../resource/image/light.png';
image1.onload = function() {
  const texture =  new maptalksgl.reshader.Texture2D({
      data : image1,
      mag: 'linear'
  });
  gltfMarker1 = new maptalks.GLTFMarker(center, {
      symbol : {
          url : lxx,
          shader : 'aeffect',
          rotation : [90, 0, 0],
          uniforms : {
              texture,
              offsetX : 0.0,
              offsetY : 0.0
          }
      }
  }).addTo(gltflayer);
  gltfMarker2 = new maptalks.GLTFMarker(center, {
      symbol : {
          url : lxx,
          shader : 'aeffect',
          rotation : [90, 0, 0],
          scale : [0.6, 0.6, 0.6],
          uniforms : {
              texture,
              offsetX : 0.0,
              offsetY : 0.0
          }
      }
  }).addTo(gltflayer).setBloom(true);
  gltfMarker3 = new maptalks.GLTFMarker(center, {
      symbol : {
          url : lxx,
          shader : 'aeffect',
          rotation : [90, 0, 0],
          scale : [0.4, 0.4, 0.4],
          uniforms : {
              texture,
              offsetX : 0.0,
              offsetY : 0.0
          }
      }
  }).addTo(gltflayer).setBloom(true);
}

const image4 = new Image();
image4.src = '../../../../resource/image/shandian.png';
image4.onload = function() {
  const texture =  new maptalksgl.reshader.Texture2D({
      data : image4,
      mag: 'linear'
  });
  new maptalks.EffectMarker(center, {
      symbol : {
          animation : true,
          loop : true,
          effect : 'sequence',
          url : '../../../../resource/gltf/sphere/scene.glb',
          speed : 0.8,
          rotation : [0, 180, 0],
          translation : [0, 0, 10],
          scale : [4, 5.5, 4],
          transparent : true,
          scale : [1, 1, 1],
          uniforms : {
              texture,
              width : 7,
              height : 6
          }
      }
  }).addTo(effectlayer).setBloom(true);
}

//光柱特效
const image3 = new Image();
image3.src = '../../../../resource/image/guangshu.png';
image3.onload = function() {
  const texture =  new maptalksgl.reshader.Texture2D({
      data : image3,
      mag: 'linear'
  });
  new maptalks.EffectMarker(center, {
      symbol : {
          animation : true,
          loop : true,
          effect : 'uv',
          url : guangshu,
          speed : 0.05,
          rotation : [90, 90, 0],
          translation : [0, 0, 0],
          transparent : true,
          scale : [1, 1, 1],
          uniforms : {
              texture,
              width : 1,
              height : 1
          }
      }
  }).addTo(effectlayer).setBloom(true);
  new maptalks.EffectMarker(center, {
      symbol : {
          animation : true,
          loop : true,
          effect : 'uv',
          url : guangshu,
          speed : 0.05,
          rotation : [90, 90, 90],
          translation : [0, 0, 0],
          transparent : true,
          scale : [1, 1, 1],
          uniforms : {
              texture,
              width : 1,
              height : 1
          }
      }
  }).addTo(effectlayer).setBloom(true);

  new maptalks.EffectMarker(center, {
      symbol : {
          animation : true,
          loop : true,
          effect : 'uv',
          url : guangshu,
          speed : 0.05,
          rotation : [90, 90, 180],
          translation : [0, 0, 0],
          transparent : true,
          scale : [1, 1, 1],
          uniforms : {
              texture,
              width : 1,
              height : 1
          }
      }
  }).addTo(effectlayer).setBloom(true);

  new maptalks.EffectMarker(center, {
      symbol : {
          animation : true,
          loop : true,
          effect : 'uv',
          url : guangshu,
          speed : 0.05,
          rotation : [90, 90, 270],
          translation : [0, 0, 0],
          transparent : true,
          scale : [1, 1, 1],
          uniforms : {
              texture,
              width : 1,
              height : 1
          }
      }
  }).addTo(effectlayer).setBloom(true);
}

const image2 = new Image();
image2.src = '../../../../resource/image/cs.png';
image2.onload = function() {
  const texture =  new maptalksgl.reshader.Texture2D({
      data : image2,
      mag: 'linear'
  });
  gltfMarker4 = new maptalks.EffectMarker(center, {
      symbol : {
          animation : true,
          loop : true,
          url: '../../../../resource/gltf/plane/scene.glb',
          effect : 'sequence',
          speed : 3,
          scale : [3, 3, 3],
          rotation : [90, 0, 0],
          uniforms : {
              texture,
              width : 6,
              height : 6
          }
      }
  }).addTo(effectlayer);
}
new maptalks.GroupGLLayer('group1', [effectlayer],  { sceneConfig }).addTo(map);
new maptalks.GroupGLLayer('group2', [gltflayer],  { sceneConfig }).addTo(map);


let angle = 0;
const newData = [];
setInterval(() => {
  newData.length = 0;
  if (gltfMarker1) {
      gltfMarker1.setRotation(90, 0, angle * 1.6);
  }
  if (gltfMarker2) {
      gltfMarker2.setRotation(90, 0, angle * 2);
  }
  if (gltfMarker3) {
      gltfMarker3.setRotation(90, 0, angle * 2.5);
  }
  angle += 3;
}, 16);

//地图载入动画
map.animateTo({
  center: [114.347061, 30.548746],
  zoom: 9,
  pitch: 0,
  bearing: 20
}, {
  duration: 5000
});
setTimeout(function () {
  map.animateTo({
    center: [114.340061, 30.543746],
    zoom: 11.5,
    pitch: 75,
    bearing: 330
  }, {
    duration: 7000
  });
}, 7000);
