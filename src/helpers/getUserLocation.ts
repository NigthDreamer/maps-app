export const getUserLocation = async ():Promise<[number, number]> => {
  return new Promise<[number, number]>((resolve, reject)=> {
    navigator.geolocation.getCurrentPosition(
      ({coords}) => {
        resolve([coords.longitude, coords.latitude]);
      },
      (err) => {
        alert('No se pudo obtener la geolocalizacion');
        console.error(err);
        reject();
      }
    )
  });
}