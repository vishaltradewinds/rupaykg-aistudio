const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                    <p className="text-[10px] font-mono text-white/40 mt-2">ID: {meth.id} | Standards: {meth.standards_body} | Version: {meth.version}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>`;

const replacement = `                    <p className="text-[10px] font-mono text-white/40 mt-2">ID: {meth.id} | Standards: {meth.standards_body} | Version: {meth.version}</p>
                  </div>
                ))
              )}
            </div>
            </div>
          </Card>
        </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('Patch completed');
