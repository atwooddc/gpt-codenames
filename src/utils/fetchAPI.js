export async function fetchAPI(url, method, body, retries = 2) {
    console.log("Sending Request to:", url, "with body:", body);
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (response.status === 429) {
            return { rateLimitError: true }; // Return an object indicating rate limit
        }

        if (!response.ok && attempt > retries) {
            const respText = await response.text();
            throw new Error(
                `HTTP error! Status: ${response.status}, Body: ${respText}`
            );
        }
        return await response.json();
    }
}
