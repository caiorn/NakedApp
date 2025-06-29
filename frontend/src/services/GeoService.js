export async function getUserGeoInfo() {
    try {
      const response = await fetch(import.meta.env.VITE_API_GEO);
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter geolocalização', error);
      return null;
    }
  }