import delay from './delay';

// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises
export const clients = [ {
  id: "vegemite-scroll",
  code: "VS5",
  name: "Vegemite Scroll",
  defaultQuantity: 3,
  packingTypes: [ {
    id: 3,
    packs: 3,
    price: 6.99,
    qty: 0
  }, {
    id: 5,
    packs: 5,
    price: 8.99,
    qty: 0
  } ]
}, {
  id: "blueberry-muffin",
  code: "MB11",
  name: "Blueberry Muffin",
  defaultQuantity: 2,
  packingTypes: [{
    id: 2,
    packs: 2,
    price: 9.95,
    qty: 0
  }, {
    id: 5,
    packs: 5,
    price: 16.95,
    qty: 0
  }, {
    id: 8,
    packs: 8,
    price: 24.95,
    qty: 0
  } ]
}, {
  id: "croissant",
  code: "CF",
  name: "Croissant",
  defaultQuantity: 3,
  packingTypes: [{
    id: 3,
    packs: 3,
    price: 5.95,
    qty: 0
  }, {
    id: 5,
    packs: 5,
    price: 9.95,
    qty: 0
  }, {
    id: 9,
    packs: 9,
    price: 16.99,
    qty: 0
  } ]
}];

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

//This would be performed on the server in a real app. Just stubbing in.
const generateId = (client) => {
  return replaceAll(client.name, ' ', '-');
};

class ClientApi {
  static getAllClients() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.assign([], clients));
      }, delay);
    });
  }

  static saveClient(client) {
    client = Object.assign({}, client); // to avoid manipulating object passed in.
    return new Promise((resolve, reject) => {
      setTimeout( () => {
        // Simulate server-side validation
        const minClientNameLength = 1;
        if (client.name.length < minClientNameLength) {
          reject(`Name must be at least ${minClientNameLength} characters.`);
        }

        if (client.id) {
          const existingClientIndex = clients.findIndex(a => a.id == client.id);
          clients.splice(existingClientIndex, 1, client);
        } else {
          //Just simulate creation here.
          //The server would generate ids for new clients in a real app.
          //Cloning so copy returned is passed by value rather then by reference.
          client.id = generateId(client);
          clients.push(client);
        }

        resolve(client);
      }, delay);
    });
  }

  static deleteClient(clientId) {
    return new Promise((resolve) => {
      setTimeout( () => {
        const indexOfClientToDelete = clients.findIndex(client => {
          client.id == clientId;
        });
        clients.splice(indexOfClientToDelete, 1);
        resolve();
      });
    }, delay);
  }
}

export default ClientApi;
