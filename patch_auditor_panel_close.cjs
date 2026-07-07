const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}`;

const replacement = `                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            </div>
          </Card>
        )}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('Patch completed');
