document.addEventListener("DOMContentLoaded", function() {
    // Add an event listener to the "Buy now" button
    document.getElementById("buyNowButton").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default behavior (redirect)

        // Show the overlay
        document.getElementById("overlay").style.display = "flex";

        // Example data for the table - customize as needed
        const data1 = ["Item 1", "Item 2", "Item 3"];
        const data2 = ["Item 4", "Item 5", "Item 6"];
        const data3 = ["Item 7", "Item 8", "Item 9"];

        const table = document.getElementById("differenceTable");

        // Clear any existing table rows
        table.innerHTML = "";

        // Create and add table headers
        const headerRow = table.insertRow();
        headerRow.insertCell().textContent = "Column 1";
        headerRow.insertCell().textContent = "Column 2";
        headerRow.insertCell().textContent = "Column 3";

        // Populate the table with the difference data
        for (let i = 0; i < data1.length; i++) {
            const row = table.insertRow();
            row.insertCell().textContent = data1[i];
            row.insertCell().textContent = data2[i];
            row.insertCell().textContent = data3[i];
        }
    });

    // Close the popup when any of the buttons is clicked
    document.getElementById("buttonColumn1").addEventListener("click", closePopup);
    document.getElementById("buttonColumn2").addEventListener("click", closePopup);
    document.getElementById("buttonColumn3").addEventListener("click", closePopup);

    // Close the popup when the overlay is clicked
    document.getElementById("overlay").addEventListener("click", function(event) {
        if (event.target === this) {
            closePopup();
        }
    });

    // Close the popup when the Escape key is pressed
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            closePopup();
        }
    });

    // Function to close the popup
    function closePopup() {
        // Hide the overlay
        document.getElementById("overlay").style.display = "none";
    }
});
