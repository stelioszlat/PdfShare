import http from 'k6/http';

import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

const rawData = JSON.parse(open('./users.json'));

// Create separate SharedArrays from the internal arrays
const validUsersPool = new SharedArray('valid users', function () {
  return rawData.validUsers; // Pulls out just the array
});

const invalidUsersPool = new SharedArray('invalid users', function () {
  return rawData.invalidUsers; 
});

const nonExistentUsersPool = new SharedArray('non-existent users', function () {
  return rawData.nonExistentUsers;
});
const BASE_URL = "<DEPLOYED_BACKEND_URL>"

export const options = {
  scenarios: {
   login_success_scenario: {
      executor: 'ramping-arrival-rate',
      exec: 'loginSuccessWorkflow',
      startRate: 5,
      timeUnit: '1s',
      preAllocatedVUs: 30,
      maxVUs: 600,
      stages: [
        { duration: '2m', target: 50 },  // Traffic starts building
        { duration: '2m', target: 150 }, // Peak surge: High compute/JWT generation load
        { duration: '4m', target: 50 },  // Traffic tapers off
        { duration: '2m', target: 0 },   // Cool down
      ],
    },

    login_wrong_password_scenario: {
      executor: 'ramping-arrival-rate',
      exec: 'loginWrongPasswordWorkflow',
      startRate: 2,
      timeUnit: '1s',
      preAllocatedVUs: 10,
      maxVUs: 100,
      stages: [
        { duration: '1m', target: 15 },  // Warm up
        { duration: '6m', target: 30 },  // Sustained bad login attempts (checks error logs & bcrypt/argon2 hashing overhead)
        { duration: '3m', target: 0 },   // Cool down
      ],
    },

    login_no_user_scenario: {
      executor: 'ramping-arrival-rate',
      exec: 'loginNoUserWorkflow',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 10,
      maxVUs: 100,
      stages: [
        { duration: '2m', target: 10 },  // Steady scanning traffic
        { duration: '4m', target: 80 },  // Sudden credential stuffing spike (checks missing database index penalties)
        { duration: '4m', target: 0 },   // Cool down
      ],
    },
  },
};

export function loginSuccessWorkflow() {
  const credentials = validUsersPool[Math.floor(Math.random() * validUsersPool.length)];

  const payload = JSON.stringify({ email: credentials.user, password: credentials.pass });
  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(`${BASE_URL}/login`, payload, params);

  check(res, {
    'login success status is 200': (r) => r.status === 200,
    'has auth token': (r) => JSON.parse(r.body).access_token !== undefined,
  });
  sleep(1.5);
}

export function loginWrongPasswordWorkflow() {
  const credentials = invalidUsersPool[Math.floor(Math.random() * invalidUsersPool.length)];

  const payload = JSON.stringify({ email: credentials.user, password: credentials.pass });
  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(`${BASE_URL}/login`, payload, params);

  if (res.status === 401) {
    res.error = ''; // Clears the network error flag
  }

  check(res, {
    'wrong pass status is 401': (r) => r.status === 401,
    'error message provided': (r) => JSON.parse(r.body).message === 'Incorrect password',
  });
  sleep(2);
}

export function loginNoUserWorkflow() {
  const credentials = nonExistentUsersPool[Math.floor(Math.random() * nonExistentUsersPool.length)];

  const payload = JSON.stringify({ email: credentials.user, password: credentials.pass });
  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(`${BASE_URL}/login`, payload, params);
  if (res.status === 404) {
    res.error = ''; // Clears the network error flag
  }
  check(res, {
    'no user status is 404': (r) => r.status === 404,
    'user not found message': (r) => JSON.parse(r.body).error === 'Could not find user.',
  });
  sleep(2);
}