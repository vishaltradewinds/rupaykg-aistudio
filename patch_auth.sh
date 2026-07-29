sed -i '650,668c\
  const { auth: requireAuth } = await import("./src/middleware/auth.ts");\
  function auth(roles: string[] = []) {\
    return requireAuth(roles);\
  }\
' server.ts
