(async function() {
    try {
        const data = await chrome.storage.local.get('lensImage');
        const b64Data = data.lensImage;
        if (!b64Data) {
            document.querySelector('.title').textContent = "No image found";
            document.querySelector('.subtitle').textContent = "Please select an image in NeoClip and try again.";
            return;
        }

        // Convert base64 to blob
        const parts = b64Data.split(';base64,');
        if (parts.length < 2) {
            throw new Error("Invalid image format");
        }
        const mime = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: mime });
        const file = new File([blob], "image.png", { type: mime });

        // Create form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://lens.google.com/v3/upload';
        form.enctype = 'multipart/form-data';
        form.target = '_self'; // submit in the current tab
        form.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'file';
        input.name = 'encoded_image';

        // Set file input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;

        form.appendChild(input);
        document.body.appendChild(form);

        // Submit form
        form.submit();

        // Clear storage
        await chrome.storage.local.remove('lensImage');
    } catch (e) {
        document.querySelector('.title').textContent = "Error occurred";
        document.querySelector('.subtitle').textContent = e.message;
    }
})();
