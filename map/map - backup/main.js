// Amazon Location Service resource names:
const apiKey = "v1.public.eyJqdGkiOiJhNWZjOTE5YS01YmM3LTQwMzEtYmMwNy03ZGQ3MzgxZjAwNzUifaJM68IOHAHAxacGSKnhYY3gFgb9s9qxeSoLRenO-Ca-XeKLZARZIjT2tVATThpzmbuNz_zIHQEag7H21PF758BXNnY3kyQeqhRvz_TDbweSix_JUAb1pVOG7_sYe1ZsF7zUdjLsiADsiilKPQD3oftK9MpGc2vEgqjSR3Fq9NMy9oMokKkxKCFrjXi2xFrg0s3D9dIx93VoKfsO_E91Kfe3NiDAq7kMbLFn3SPDvD0Kjdkv4_fiUImzNd4eItYbkkyB0kUI1EELgxeeNYwpkwT1VWt0BaeozUzhVyWRtVUpKgOq0KFXGqd3o3ESa4_OVED-yB-vEkGlawKmETci_Tw.ZGQzZDY2OGQtMWQxMy00ZTEwLWIyZGUtOGVjYzUzMjU3OGE4";
const mapName = "simra-map";
const region = "eu-west-1";

// Initialize a map
async function initializeMap() {
    const mlglMap = new maplibregl.Map({
        container: "map", // HTML element ID of map element 
        center: [25.08504994, -28.997182288], // Initial map centerpoint
        zoom: 4, // Initial map zoom
        style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`, // Defines the appearance of the map and authenticates using an API key
    });

    // Add navigation control to the top left of the map
    mlglMap.addControl(new maplibregl.NavigationControl(), "top-left");

    return mlglMap;
}

async function main() {
    // Create an authentication helper instance using an API key
    const authHelper = await amazonLocationAuthHelper.withAPIKey(apiKey);


    // Initialize map and Amazon Location SDK client:
    const map = await initializeMap();

    const client = new amazonLocationClient.LocationClient({
        region,
        ...authHelper.getLocationClientConfig(), // Provides configuration required to make requests to Amazon Location
    });

    // Variable to hold marker that will be rendered on click
    let marker;

    // On mouse click, display marker and get results:
    // map.on("click", async function (e) {
        // Remove any existing marker
        if (marker) {
            marker.remove();
        }

        // Render a marker on clicked point
        marker = new maplibregl.Marker().setLngLat([25.08504994, -28.997182288,]).addTo(map);

        // Set up parameters for search call
        let params = {
            IndexName: placesName,
            Position: [25.08504994, -28.997182288],
            Language: "en",
            MaxResults: "5",
        };

        // Set up command to search for results around clicked point
        const searchCommand = new amazonLocationClient.SearchPlaceIndexForPositionCommand(params);

        try {
            // Make request to search for results around clicked point
            const data = await client.send(searchCommand);

            // Write JSON response data to HTML
            document.querySelector("#response").textContent = JSON.stringify(data, undefined, 2);

            // Display place label in an alert box
            alert(data.Results[0].Place.Label);
        } catch (error) {
            // Write JSON response error to HTML
            document.querySelector("#response").textContent = JSON.stringify(error, undefined, 2);

            // Display error in an alert box
            alert("There was an error searching.");
        }
    // });
}

main();