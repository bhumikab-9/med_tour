function performSearch() {

    const input = document.getElementById("mainSearch");
    const city = document.getElementById("citySelect");

    const searchValue = input.value.trim();

    if (searchValue === "") {
        input.focus();

        input.placeholder = "Try searching for a treatment...";
        return;
    }

    const selectedCity = city.value;

    console.log("Search:", searchValue);
    console.log("City:", selectedCity);

    /*
        For now this is a frontend demo.

        Later we'll connect this to:
        - treatment database
        - hospital database
        - doctor database
        - AI assistant
    */

    alert(
        "Searching for: " +
        searchValue +
        "\nLocation: " +
        selectedCity
    );
}


function quickSearch(value) {

    const input = document.getElementById("mainSearch");

    input.value = value;

    input.focus();
}