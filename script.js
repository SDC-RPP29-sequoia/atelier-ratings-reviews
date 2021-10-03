import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics';
import { check, sleep } from 'k6';

let errorRate = new Rate('errorRate');
let latencyMetric = new Trend('latency', true);

export let options = {
  discardResponseBodies: true,
  scenarios: {
    constant_10: {
      executor: 'constant-arrival-rate',
      // gracefulStop: '30s', // Time to wait for iterations to finish executing before stopping them forcefully. 30 sec default
      rate: 100, // Number of iterations to execute each timeUnit period (default 1s). System cannot handle 1,000 rps
      duration: '10s',
      preAllocatedVUs: 100,
      maxVUs: 500, // typ. 5x rate
    },
    // ramp_10: {
    //   executor: 'ramping-arrival-rate',
    //   // gracefulStop: '30s',
    //   startRate: 1,
    //   preAllocatedVUs: 20,
    //   maxVUs: 5000, // typ 5x max target
    //   stages: [
    //     { duration: '5s', target: 1 },
    //     { duration: '5s', target: 10 },
    //     { duration: '5s', target: 10 },
    //     { duration: '5s', target: 100 },
    //     { duration: '5s', target: 100 }, // 500 maxVUs needed
    //     { duration: '5s', target: 1000 },
    //     { duration: '5s', target: 1000 }, // 5,000 maxVUs needed, but errors begin around 2,000 (12)
    //     // { duration: '5s', target: 10000 },
    //     // { duration: '5s', target: 10000 },
    //     { duration: '5s', target: 0 },
    //   ],
    // },
  },
  thresholds: {
    'errorRare': [
      { threshold: 'rate < 0.1', abortOnFail: true, delayAbortEval: '1m' },
    ],
    'reqDuration': [{ http_req_duration: ['p(95)<5'] }]
  }
};

export default function () {
  // getReview();
  // getProductReviews();
  getReviewMetadata();
  // addReview();
  // markReviewHelpful();
  // reportReview();
  sleep(1);
}

// === DB Methods ===
const url = 'http://localhost';
const port = 3000;

const getReview = () => {
  const start = Date.now();
  let reviewId = 4;
  const res = http.get(`${url}:${port}/review?review_id=${reviewId}`, {
    tags: { name: 'getReviewURL' },
  });
  const latency = Date.now() - start;
  latencyMetric.add(latency);

  check(res, {
    'is status 200': (res) => res.status === 200,
  });
  errorRate.add(res.status >= 400);
}

const getProductReviews = () => {
  const start = Date.now();
  let productId = 4;
  const res = http.get(`${url}:${port}/reviews?product_id=${productId}`, {
    tags: { name: 'getProductReviewsURL' },
  });
  const latency = Date.now() - start;
  latencyMetric.add(latency);

  check(res, {
    'is status 200': (res) => res.status === 200,
  });
  errorRate.add(res.status >= 400);
}

const getReviewMetadata = () => {
  const start = Date.now();
  let productId = 4;
  const res = http.get(`${url}:${port}/reviews/meta?product_id=${productId}`, {
    tags: { name: 'getReviewMetadataURL' },
  });
  const latency = Date.now() - start;
  latencyMetric.add(latency);

  check(res, {
    'is status 200': (res) => res.status === 200,
  });
  errorRate.add(res.status >= 400);
}

const addReview = () => {
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

const markReviewHelpful = () => {
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

const reportReview = () => {
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
