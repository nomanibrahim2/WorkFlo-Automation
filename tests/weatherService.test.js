/**
 * Tests for the weather service (Open-Meteo API integration).
 */

// Mock global fetch
global.fetch = jest.fn();

// We need to import after mocking
const { fetchWeather } = require('../app/services/weatherService');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchWeather', () => {
  test('returns parsed weather data on success', async () => {
    const mockResponse = {
      current_weather: {
        temperature: 22.5,
        windspeed: 15.3,
        weathercode: 1,
        time: '2026-03-08T12:00',
      },
      current_weather_units: {
        temperature: '°C',
      },
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchWeather();

    expect(result).toEqual({
      temperature: 22.5,
      windspeed: 15.3,
      weathercode: 1,
      time: '2026-03-08T12:00',
      unit: '°C',
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.open-meteo.com'),
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  test('throws on non-200 response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(fetchWeather()).rejects.toThrow('Weather API error: 500');
  });

  test('throws on network failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchWeather()).rejects.toThrow('Network error');
  });

  test('throws on invalid data (missing current_weather)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ latitude: 32.78 }),
    });

    await expect(fetchWeather()).rejects.toThrow('Invalid weather data');
  });
});
