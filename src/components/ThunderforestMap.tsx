
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = {
  polygonPoints: number[][];
};

const ThunderforestMap = ({
  polygonPoints,
}: Props) => {
  const html = useMemo(
    () => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<style>
html, body, #map {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
</head>

<body>

<div id="map"></div>

<script>

const polygonPoints = ${JSON.stringify(polygonPoints)};

const map = L.map('map');

map.setView(
  [22.5726, 88.3639],
  10
);

L.tileLayer(
  'https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=2dc2810004344c96a819a939298e1046',
  {
    maxZoom: 22,
    attribution:
      '&copy; OpenStreetMap contributors &copy; Thunderforest'
  }
).addTo(map);

if (polygonPoints.length > 0) {

  polygonPoints.forEach(point => {
    L.marker(point).addTo(map);
  });

  if (polygonPoints.length >= 3) {

    const polygon = L.polygon(
      polygonPoints,
      {
        color: 'red',
        weight: 3,
        fillColor: '#ff0000',
        fillOpacity: 0.3,
      }
    ).addTo(map);

    map.fitBounds(
      polygon.getBounds()
    );

  } else {

    map.setView(
      polygonPoints[0],
      13
    );

  }
}

</script>

</body>
</html>
`,
    [polygonPoints],
  );

  return (
    <View style={{ flex: 1 }}>
  <WebView
  originWhitelist={['*']}
  source={{ html }}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  mixedContentMode="always"
  onError={e =>
    console.log(
      'WEBVIEW ERROR',
      e.nativeEvent,
    )
  }
/>
    </View>
  );
};

export default ThunderforestMap;

