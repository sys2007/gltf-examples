var map = new maptalks.Map('map', {
  center : [119.99685208964343, 30.002385656037262],
  zoom: 15,
  pitch: 61,
  bearing: -167.40000000000032,
  lights: {
    ambient: {
        color: [0.1, 0.1, 0.1]
    },
    directional: {
        color: [1, 1, 1],
        direction: [0, 1, -1],
    }
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
var gui = new dat.GUI({ width: 250 });
var Config = function () {
  this.visible = true;
};
var options = new Config();
var url = '../../../../resource/gltf/city_model/scene.gltf';
var symbol = {
  url: url,
  visible : options.visible,
  rotation: [90, 0, 0],
  scale: [0.01, 0.01, 0.01],
  uniforms:{
    lightAmbient: [0.4, 0.4, 0.4]
  }
};
const sceneConfig = {
};
var gltflayer = new maptalks.GLTFLayer('gltf');
var position = map.getCenter();
var gltfmarker = new maptalks.GLTFMarker(position, {
  symbol: symbol
}).addTo(gltflayer);
const gllayer = new maptalks.GroupGLLayer('group', [gltflayer],  { sceneConfig }).addTo(map);
const analysisOptions = {
  waterHeight: 0.4,
  waterColor: [2/ 255, 132/ 255, 247/ 255]
};
const analysis = new maptalks.FloodAnalysis(analysisOptions);
analysis.addTo(gllayer);

AddGUI();

function AddGUI() {
  var gui = new dat.GUI( { width: 350 } );
  const config = {
    enableAnalysis: true,
    waterHeight: analysisOptions.waterHeight,
    waterColor: [analysisOptions.waterColor[0] * 255, analysisOptions.waterColor[1] * 255, analysisOptions.waterColor[2] * 255]
  };
  //开启分析功能
  var AnalysisController = gui.add(config, "enableAnalysis");
  AnalysisController.onChange(function (value) {
    if (value) {
      analysis.addTo(gllayer);
    } else {
      analysis.remove();
    }
  });

  var waterHeightController = gui.add(config, "waterHeight", 0, 5);
  waterHeightController.onChange(function (value) {
    analysisOptions.waterHeight = value;
    analysis.update('waterHeight', value);
  });

  var waterColorController = gui.addColor(config, 'waterColor');
  waterColorController.onChange(function (value) {
    analysisOptions.waterColor = [value[0] / 255, value[1] / 255, value[2] / 255];
    analysis.update('waterColor', analysisOptions.waterColor);
  });
}
