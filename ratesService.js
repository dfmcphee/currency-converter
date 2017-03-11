const DAILY_RATE_URL = 'http://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY';

export function fetchRates(callback) {
    return fetch(DAILY_RATE_URL)
    .then((response) => response.json())
    .then((responseJson) => {
      const {seriesDetail, observations} = responseJson;
      const latestObservations = observations[observations.length - 1];
      delete latestObservations['d'];
      const rates = new Map();
      rates.set('CAD', {
        rate: 1,
        code: 'CAD',
      });
      Object.keys(latestObservations).forEach((key) => {
        const code = seriesDetail[key].label.replace('/CAD', '');
        rates.set(code, {
          rate: latestObservations[key].v,
          code,
        });
      });

      callback(rates);
    })
    .catch((error) => {
      console.error(error);
    });
  }
