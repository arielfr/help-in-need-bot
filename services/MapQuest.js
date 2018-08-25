const { MAPQUEST_KEY } = process.env;

class MapQuest {
  constructor() {
    this.key = MAPQUEST_KEY;
    this.baseUrl = 'https://open.mapquestapi.com';
  }

  getStaticMapUrl({ current = {}, locations = [], height = 600, width = 400 }) {
    let url = '';
    let pois = '';

    locations.forEach((l, i) => {
      pois = pois.concat(`${i !== 0 ? '|' : ''}${i + 1},${l.lat},${l.long}`);
    });

    if (Object.keys(current).length > 0) {
      url = this.baseUrl.concat(`/staticmap/v4/getmap?key=${this.key}&size=${height},${width}&type=map&imagetype=png&pois=red_1,${current.lat},${current.long}|${pois}`);
    } else {
      url = this.baseUrl.concat(`/staticmap/v4/getmap?key=${this.key}&size=${height},${width}&type=map&imagetype=png&pois=${pois}`)
    }

    return url;
  }
}

module.exports = new MapQuest();
