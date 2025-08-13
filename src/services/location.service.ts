import fetch from "node-fetch";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleGeocodeResult {
  formatted_address: string;
  address_components: AddressComponent[];
}

interface GoogleGeocodeResponse {
  status: string;
  results: GoogleGeocodeResult[];
}

interface Address {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export async function getAddressFromCoords(
  lat: number,
  lng: number
): Promise<Address> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    throw new Error("Google Maps API key não configurada.");
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=pt-BR`;

  const response = await fetch(url);
  const data = (await response.json()) as GoogleGeocodeResponse;
  console.log("Dados retornados pela API:", data);
  
  if (data.status === "OK" && data.results.length > 0) {
    const components = data.results[0].address_components;

    function getComponent(type: string): string {
      return components.find((c) => c.types.includes(type))?.long_name || "";
    }

    return {
      rua: getComponent("route"),
      numero: getComponent("street_number"),
      bairro: getComponent("sublocality") || getComponent("political"),
      cidade: getComponent("administrative_area_level_2"),
      estado: getComponent("administrative_area_level_1"),
    };
  } else {
    throw new Error("Endereço não encontrado");
  }
}
