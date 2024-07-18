export async function fetchAPI(url, method, body) {
    console.log("Sending Request to:", url, "with body:", body);
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
        console.error("Error fetching from API:", error);
        throw error;
    }
}