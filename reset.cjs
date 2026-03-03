const http = require('http');

const loginData = JSON.stringify({
  phone: '9000000000',
  password: 'password'
});

const loginOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const req = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const response = JSON.parse(data);
    const token = response.token;
    
    if (token) {
      const resetOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/reset',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const resetReq = http.request(resetOptions, (resetRes) => {
        let resetData = '';
        resetRes.on('data', (chunk) => {
          resetData += chunk;
        });
        resetRes.on('end', () => {
          console.log('Reset response:', resetData);
        });
      });
      
      resetReq.on('error', (error) => {
        console.error('Reset error:', error);
      });
      
      resetReq.end();
    } else {
      console.error('Login failed:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Login error:', error);
});

req.write(loginData);
req.end();
