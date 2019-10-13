let particlesJSON = {"particles":{"number":{"value":220,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5}},"opacity":{"value":0.2,"random":true,"anim":{"enable":true,"speed":1.04,"opacity_min":0.1,"sync":false}},"size":{"value":3.95,"random":true,"anim":{"enable":true,"speed":4.8,"size_min":2.4,"sync":false}},"line_linked":{"enable":false,"distance":150,"color":"#ffffff","opacity":1,"width":1},"move":{"enable":true,"speed":1,"direction":"none","random":true,"straight":false,"out_mode":"bounce","bounce":true,"attract":{"enable":false,"rotateX":1184,"rotateY":3078}}},"retina_detect":true}

particlesJS("particles", particlesJSON , function() {
  console.log("particles.js config loaded");
});
