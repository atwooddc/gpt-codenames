export async function fetchAPI(url, method, body, retries = 2) {
    console.log("Sending Request to:", url, "with body:", body);
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const respText = await response.text();
                throw new Error(
                    `HTTP error! Status: ${response.status}, Body: ${respText}`
                );
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching from API (attempt ${attempt}):`, error);
            if (attempt > retries) {
                throw error;
            }
        }
    }
}
