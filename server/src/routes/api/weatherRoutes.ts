console.log("➡️ weatherRoutes.ts is being loaded...");

import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

router.post('/', async (req, res) => {


  const { city } = req.body;

  if (!city) {
      console.log("❌ Error: No city provided.");
      return res.status(400).json({ error: 'City name is required' });
  }

  try {
      console.log(`Fetching weather data for: ${city}`);
      const weatherData = await WeatherService.fetchWeatherData(city);
      console.log(`Weather data received:`, weatherData);

      await HistoryService.addSearchHistory(city);
      return res.json(weatherData);
  } catch (error) {
      console.error("Error in /api/weather:", error);
      return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});



// GET Request to return search history
router.get('/history', async (_, res) => {
    try {
        const history = await HistoryService.getSearchHistory();
        return res.json(history);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to load search history' });
    }
});

// DELETE Request to remove a city from search history
router.delete('/history/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedHistory = await HistoryService.deleteFromSearchHistory(id);
        return res.json(updatedHistory);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete city from history' });
    }
});

export default router;