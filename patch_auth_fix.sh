sed -i '651,655c\
  function auth(roles: string[] = []) {\
    return requireAuth(roles);\
  }\
' server.ts
