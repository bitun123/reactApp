
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = {
  latitude: number;
  longitude: number;
};

const ThunderforestMap = ({
  latitude,
  longitude,
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
const map = L.map('map').setView(
  [${latitude}, ${longitude}],
  13
);

L.tileLayer(
  'https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=2dc2810004344c96a819a939298e1046',
  {
    maxZoom: 22,
    attribution: '&copy; OpenStreetMap contributors &copy; Thunderforest'
  }
).addTo(map);

L.marker([${latitude}, ${longitude}])
  .addTo(map)
  .bindPopup(
    'Latitude: ${latitude}<br/>Longitude: ${longitude}'
  )
  .openPopup();
</script>

</body>
</html>
`,
    [latitude, longitude],
  );

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
      />
    </View>
  );
};

export default ThunderforestMap;

