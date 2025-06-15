
async function previewUrl() {
    let url = document.getElementById("urlInput").value;

    try {
        const response = await fetch(`api/v1/urls/preview?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const preview = await response.text();
        displayPreviews(preview);

    } catch (error) {
        displayPreviews(`<p>Error fetching URL preview: ${error.message}</p>`);
    }
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}