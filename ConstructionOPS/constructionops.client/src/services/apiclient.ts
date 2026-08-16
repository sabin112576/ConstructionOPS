export async function apiClient<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {

    console.log("API Request:", endpoint);

    const response = await fetch(
        endpoint,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
        }
    );

    console.log(
        "API Response:",
        response.status,
        response.url
    );

    if (!response.ok) {

        const message =
            await response.text();

        throw new Error(
            message ||
            `Request failed: ${response.status}`
        );
    }

    return response.json();
}