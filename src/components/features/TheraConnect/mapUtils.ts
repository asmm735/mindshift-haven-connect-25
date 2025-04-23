
import type { Therapist } from "./TheraConnectMap";

// Utility for adding/removing Google Map markers and info windows
export function addTherapistMarkers({
  map,
  therapists,
  infoWindow,
}: {
  map: google.maps.Map;
  therapists: Therapist[];
  infoWindow: google.maps.InfoWindow;
}): google.maps.Marker[] {
  const markers: google.maps.Marker[] = [];
  therapists.forEach((therapist) => {
    if (therapist.latitude && therapist.longitude) {
      const marker = new window.google.maps.Marker({
        position: { lat: therapist.latitude, lng: therapist.longitude },
        map,
        title: therapist.name,
        icon: therapist.verified
          ? {
              url:
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23943c64' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E",
              scaledSize: new window.google.maps.Size(32, 32),
            }
          : undefined,
        animation: window.google.maps.Animation.DROP,
      });

      window.google.maps.event.addListener(marker, "click", () => {
        const verifiedBadge = therapist.verified
          ? `<span class="px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded">✓ Verified</span>`
          : "";
        const content = `
            <div class="p-2">
              <h3 class="font-semibold text-mindshift-raspberry text-base">${therapist.name}</h3>
              <p class="text-sm mt-1">${therapist.address}</p>
              ${verifiedBadge}
            </div>
          `;
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });

      markers.push(marker);
    }
  });
  return markers;
}

export function clearMapMarkers(markers: google.maps.Marker[]) {
  markers.forEach((marker) => {
    window.google.maps.event.clearInstanceListeners(marker);
    marker.setMap(null);
  });
}
