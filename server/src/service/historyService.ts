import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const HISTORY_FILE = './server/db/searchHistory.json';

// Define City class
class City {
    constructor(public id: string, public name: string) {}
}

class HistoryService {
    // Read from searchHistory.json
    private async read(): Promise<City[]> {
        try {
            const data = await fs.readFile(HISTORY_FILE, 'utf8');
            return JSON.parse(data) || [];
        } catch (error) {
            return [];
        }
    }

    // Write to searchHistory.json
    private async write(cities: City[]): Promise<void> {
        await fs.writeFile(HISTORY_FILE, JSON.stringify(cities, null, 2));
    }

    // Get saved cities
    async getSearchHistory(): Promise<City[]> {
        return await this.read();
    }

    // Add a new city
    async addSearchHistory(city: string): Promise<void> {
        const cities = await this.read();
        if (!cities.some((c) => c.name.toLowerCase() === city.toLowerCase())) {
            cities.push(new City(uuidv4(), city));
            await this.write(cities);
        }
    }

    // Remove a city (Bonus)
    async deleteFromSearchHistory(id: string): Promise<City[]> {
        let cities = await this.read();
        cities = cities.filter((city) => city.id !== id);
        await this.write(cities);
        return cities;
    }
}

export default new HistoryService();
