const { MAPQUEST_KEY } = process.env;

class MapQuest {
  constructor() {
    this.key = MAPQUEST_KEY;
    this.baseUrl = 'https://open.mapquestapi.com';
  }

  getStaticMapUrl({ current = {}, locations = [], height = 600, width = 400 }) {
    let pois = '';

    locations.forEach((l, i) => {
      pois = pois.concat(`${i !== 0 ? '|' : ''}${i + 1},${l.lat},${l.long}`);
    });

    return this.baseUrl.concat(`/staticmap/v4/getmap?key=${this.key}&size=${height},${width}&type=map&imagetype=png&pois=red_1,${current.lat},${current.long}|${pois}`);
  }
};

module.exports = new MapQuest();
