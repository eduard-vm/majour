import * as types from './mutation-types';
//         let request = new Promise((resolve, reject) => {
//           var request = db
//             .transaction(['employee'], 'readwrite')
//             .objectStore('employee')
//             .add({
//               id: employee.id != null ? employee.id : vm.employees.length++,
//               name: employee.name,
//               age: employee.age,
//               email: employee.email,
//             });
//           request.onsuccess = function(event) {
//             vm.employees.push({
//               edit: false,
//               id: employee.id != null ? vm.employee.id : vm.employees.length++,
//               name: employee.name,
//               age: employee.age,
//               email: employee.email,
//             });
//           };
//           request.onerror = function(event) {
//             alert('Unable to add data ');
//           };
//         });
const IndexDBProvider = function(storeName) {
  this.storeName = storeName;
  this.version = 4;
  this.db =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
  this.transaction =
    window.IDBTransaction ||
    window.webkitIDBTransaction ||
    window.msIDBTransaction;
  this.IDBKeyRange =
    window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

  this.connect = function(cb) {
    const req = indexedDB.open(this.storeName, this.version);
    return new Promise((resolve, reject) => {
      req.onerror = err => reject(err);
      req.onsuccess = () => resolve(() => cb(req.result));
      req.onupgradeneeded = e => {
        e.currentTarget.result.createObjectStore(storeName, {
          keyPath: 'path',
        });
        return resolve(this.connect(cb));
      };
    });
  };

  this.getStorage = cb => {
    return new Promise((resolve, reject) => {
      this.connect(db => {
        const rows = [];
        const store = db
          .transaction([this.storeName], 'readonly')
          .objectStore(this.storeName);
        if (store.mozGetAll) {
          store.mozGetAll().onsuccess = e => resolve(cb(e.target.result));
        } else {
          store.openCursor().onsuccess = e => {
            const cursor = e.target.result;
            if (cursor) {
              rows.push(cursor.value);
              cursor.continue();
            } else {
              resolve(cb(rows));
            }
          };
        }
      });
    });
  };

  this.getFile = (file, cb) => {
    return new Promise((resolve, reject) => {
      this.connect(db => {
        const req = db
          .transaction([this.storeName], 'readonly')
          .objectStore(this.storeName)
          .get(file);
        req.onerror = err => reject(err);
        req.onsuccess = () => {
          resolve(cb(req.result ? req.result : -1));
        };
      });
    });
  };

  this.setFile = file => {
    return new Promise((resolve, reject) => {
      this.connect(db => {
        const req = db
          .transaction([this.storeName], 'readwrite')
          .objectStore(this.storeName)
          .put(file);
        req.onerror = reject;
        req.onsuccess = resolve;
      });
    });
  };

  // this.transaction = (file, method) => {
  //   return new Promise((resolve, reject) => {

  //   });
  // };

  this.delFile = file => {
    return new Promise((resolve, reject) => {
      this.connect(db => {
        const req = db
          .transaction([this.storeName], 'readwrite')
          .objectStore(this.storeName)
          .delete(file);
        req.onerror = reject;
        req.onsuccess = resolve;
      });
    });
  };

  return this;
};

const StudentsService = function() {
  // this.entity = 'students';
  // this.provider = new IndexDBProvider('students');

  // console.log('on create instnce studetn service ', this.entity, this.provider);
  return this;
};

StudentsService.prototype.save = function() {
  return Promise.resolve({
    status_code: 200,
    message: 'Ученик успешно сохранён',
    data: {
      id: Date.now(),
    },
  });
};

const studentsService = new StudentsService();

export default {
  async save({ commit }, payload) {
    try {
      const res = await studentsService.save(payload);
      commit(types.CREATE_STUDENT, res.data);
    } catch (err) {
      console.error('error ', err);
    }
  },
};
