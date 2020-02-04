class CookbookHandler {
  constructor() {
    this.baseURL = "https://martinchan.pythonanywhere.com";
    this.dummyPassword = "Troglodon5986";
  }

  get() {
    return new Promise((resolve, reject) => {
      fetch(this.baseURL)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
    })
  }

  post(extension, data) {
    return new Promise((resolve, reject) => {
      fetch(this.baseURL + extension, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
    })
  }

  put(extension, data) {
    return new Promise ((resolve, reject) => {
      fetch(this.baseURL + extension, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
    })
  }
}

cH = new CookbookHandler();