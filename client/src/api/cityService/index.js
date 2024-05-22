import Ajax from 'api/ajax';

class CityService extends Ajax {
  pathname = 'city';

  fetchAllCity = () => this.getJson(`${this.pathname}/all`);

  //   fetchCity = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateCity = (data) => this.post(`${this.pathname}`, data);

  //   fetchUpdateCity = (id, data) => this.put(`${this.pathname}/${id}`, data);

  //   fetchDeleteCity = (id) => this.delete(`${this.pathname}/${id}`);
}

export const cityService = new CityService();
