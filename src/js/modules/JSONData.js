export async function fetchJSONData () {
    try {
        const response = await fetch('../src/assets/data/estates.json');
        return await response.json();
    } catch (err) {
        console.error('Data loading error:', err);
        return [];
    }
}
