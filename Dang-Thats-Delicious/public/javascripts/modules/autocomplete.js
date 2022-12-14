/* eslint-disable no-undef */
function autocomplete(input, latInput, lngInput) {
  if (!input) return; // skip this function from running if there is not an input on the page

  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });
  // If someone hits enter on the address field don't submit the form
  input.on('keydown', (e) => {
    if (e.keycode === 13) e.preventDefault();
  });
}

export default autocomplete;
