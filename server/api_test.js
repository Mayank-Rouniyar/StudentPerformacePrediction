import http from 'http';

async function makeRequest(path, method, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) {
      options.headers['Authorization'] = token;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting API Tests ---\n');

  try {
    // 1. Signup
    console.log('1. Testing Signup...');
    const signupEmail = `test_${Date.now()}@example.com`;
    let res = await makeRequest('/api/auth/signup', 'POST', {
      name: 'Test Setup User',
      email: signupEmail,
      password: 'password123'
    });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
    console.log();

    // 2. Login
    console.log('2. Testing Login...');
    res = await makeRequest('/api/auth/login', 'POST', {
      email: signupEmail,
      password: 'password123'
    });
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
    console.log();
    
    if (res.status !== 200 || !res.data.success) {
      console.log('Login failed, stopping tests.');
      return;
    }
    
    const token = res.data.jwtToken;
    const userId = res.data.user._id;

    // 3. Save Student Data
    console.log('3. Testing Save Student Data...');
    const studentData = {
      userId: userId,
      studyHours: 5,
      attendance: 85,
      previousGrades: 75,
      extracurriculars: 2,
      sleepHours: 7
    };
    res = await makeRequest('/api/student/data', 'POST', studentData, token);
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
    console.log();

    // 4. Get Student Data
    console.log('4. Testing Get Student Data...');
    res = await makeRequest(`/api/student/data?userId=${userId}`, 'GET', null, token);
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
    console.log();

    // 5. Predict
    console.log('5. Testing Predict...');
    res = await makeRequest('/api/predict', 'POST', studentData, token);
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
    console.log();

    // 6. Advice
    console.log('6. Testing Advice...');
    res = await makeRequest(`/api/advice?userId=${userId}`, 'GET', null, token);
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
    console.log();

    console.log('--- All Tests Completed ---');
  } catch (error) {
    console.error('Test script encountered an error:', error);
  }
}

runTests();
