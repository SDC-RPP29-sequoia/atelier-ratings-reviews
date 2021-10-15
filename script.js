import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics';
import { check, sleep } from 'k6';

let errorRate = new Rate('errorRate');
let latencyMetric = new Trend('latency', true);

export let options = {
  discardResponseBodies: true,
  scenarios: {
    // constant_1: {
    //   executor: 'constant-arrival-rate',
    //   gracefulStop: '1m', // Time to wait for iterations to finish executing before stopping them forcefully. 30 sec default
    //   rate: 1, // Number of iterations to execute each timeUnit period (default 1s). System cannot handle 1,000 rps
    //   duration: '1m', // 10s
    //   preAllocatedVUs: 5,
    //   maxVUs: 50, // typ. 5x rate
    // },
    // constant_10: {
    //   executor: 'constant-arrival-rate',
    //   // gracefulStop: '30s', // Time to wait for iterations to finish executing before stopping them forcefully. 30 sec default
    //   rate: 10, // Number of iterations to execute each timeUnit period (default 1s). System cannot handle 1,000 rps
    //   duration: '1m', // 10s
    //   preAllocatedVUs: 50,
    //   maxVUs: 500, // typ. 5x rate
    // },
    // constant_100: {
    //   executor: 'constant-arrival-rate',
    //   // gracefulStop: '30s', // Time to wait for iterations to finish executing before stopping them forcefully. 30 sec default
    //   rate: 100, // Number of iterations to execute each timeUnit period (default 1s). System cannot handle 1,000 rps
    //   duration: '1m', // 10s
    //   preAllocatedVUs: 500,
    //   maxVUs: 5000, // typ. 5x rate
    // },
    // constant_1000: {
    //   executor: 'constant-arrival-rate',
    //   // gracefulStop: '30s', // Time to wait for iterations to finish executing before stopping them forcefully. 30 sec default
    //   rate: 1000, // Number of iterations to execute each timeUnit period (default 1s). System cannot handle 1,000 rps
    //   duration: '1m', // 10s
    //   preAllocatedVUs: 1000,
    //   maxVUs: 50000, // typ. 5x rate
    // },
    // ramp_10: {
    //   executor: 'ramping-arrival-rate',
    //   // gracefulStop: '30s',
    //   startRate: 1,
    //   preAllocatedVUs: 20,
    //   maxVUs: 5000, // typ 5x max target
    //   stages: [
    //     { duration: '1m', target: 1 },
    //     { duration: '1m', target: 10 },
    //     { duration: '1m', target: 10 },
    //     { duration: '1m', target: 0 },
    //   ],
    // },
    // ramp_100: {
    //   executor: 'ramping-arrival-rate',
    //   // gracefulStop: '30s',
    //   startRate: 1,
    //   preAllocatedVUs: 20,
    //   maxVUs: 5000, // typ 5x max target
    //   stages: [
    //     { duration: '1m', target: 1 },
    //     { duration: '1m', target: 10 },
    //     { duration: '1m', target: 10 },
    //     { duration: '1m', target: 100 },
    //     { duration: '1m', target: 100 },
    //     { duration: '1m', target: 0 },
    //   ],
    // },
    ramp_1000: {
      executor: 'ramping-arrival-rate',
      // gracefulStop: '30s',
      startRate: 1,
      preAllocatedVUs: 20,
      maxVUs: 10000, // typ 5x max target
      stages: [
        { duration: '1m', target: 1 },
        { duration: '1m', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '1m', target: 100 },
        { duration: '1m', target: 100 }, // 500 maxVUs needed
        { duration: '1m', target: 1000 },
        { duration: '1m', target: 1000 }, // 5,000 maxVUs needed, but errors begin around 2,000 (12)
        { duration: '1m', target: 0 },
      ],
    },
  },
  thresholds: {
    'errorRare': [
      { threshold: 'rate < 0.1', abortOnFail: true, delayAbortEval: '1m' },
    ],
    'reqDuration': [{ http_req_duration: ['p(95)<5'] }]
  }
};

export default function () {
  const testEnv = 'scaled'; //process.env.NODE_ENV || 'test'; 'scaled'
  getReview(testEnv);
  // getProductReviews(testEnv);
  // getReviewMetadata(testEnv);
  // addReview(testEnv);
  // markReviewHelpful(testEnv);
  // reportReview(testEnv);
  sleep(1);
}

// === DB Methods ===
const url = 'http://localhost';
const port = 3000;

const getReview = (testEnv) => {
  const start = Date.now();
  let reviewIds = testEnv === 'test'
    ? [ 2, 3, 5 ] // Test DB
    : [ 5, 2107492, 5765000 ]; // Scaled DB
  const res = http.get(`${url}:${port}/review?review_id=${reviewIds[2]}`, {
    tags: { name: 'getReviewURL' },
  });
  const latency = Date.now() - start;
  latencyMetric.add(latency);

  check(res, {
    'is status 200': (res) => res.status === 200,
  });
  errorRate.add(res.status >= 400);
}

const getProductReviews = (testEnv) => {
  const start = Date.now();
  let productIds = testEnv === 'test'
    ? [ 1, 2 ] // Test DB
    : [ 496, 378894, 708406 ]; // Scaled DB
  const res = http.get(`${url}:${port}/reviews?product_id=${productIds[0]}`, {
    tags: { name: 'getProductReviewsURL' },
  });
  const latency = Date.now() - start;
  latencyMetric.add(latency);

  check(res, {
    'is status 200': (res) => res.status === 200,
  });
  errorRate.add(res.status >= 400);
}

const getReviewMetadata = (testEnv) => {
  const start = Date.now();
  let productIds = testEnv === 'test'
    ?  [ 1, 2 ] // Test DB
    : [ 496, 378894, 708406 ]; // Scaled DB
  const res = http.get(`${url}:${port}/reviews/meta?product_id=${productIds[0]}`, {
    tags: { name: 'getReviewMetadataURL' },
  });
  const latency = Date.now() - start;
  latencyMetric.add(latency);

  check(res, {
    'is status 200': (res) => res.status === 200,
  });
  errorRate.add(res.status >= 400);
}

const addReview = (testEnv) => {
  const start = Date.now();
  const params = {
    headers: {
      'Content-Type': 'application/json',
    }
  };
  const body = JSON.string({
    // TBD
  });
  const res = http.post(
    `${url}:${port}/reviews`,
    body,
    params,);
  const latency = Date.now() - start;
  latencyMetric.add(latency);

  check(res, {
    'is status 201': (res) => res.status === 201,
  });
  errorRate.add(res.status >= 400);
}

const markReviewHelpful = (testEnv) => {
  const start = Date.now();
  let reviewId = 4;
  const res = http.put(`${url}:${port}/reviews/${reviewId}/helpful`, {
    tags: { name: 'markReviewHelpfulURL' },
  });
  const latency = Date.now() - start;
  latencyMetric.add(latency);

  check(res, {
    'is status 204': (res) => res.status === 204,
  });
  errorRate.add(res.status >= 400);
}

const reportReview = (testEnv) => {
  const start = Date.now();
  let reviewId = 4;
  const res = http.put(`${url}:${port}/reviews/${reviewId}/report`, {
    tags: { name: 'reportReviewURL' },
  });
  const latency = Date.now() - start;
  latencyMetric.add(latency);

  check(res, {
    'is status 204': (res) => res.status === 204,
  });
  errorRate.add(res.status >= 400);
}
