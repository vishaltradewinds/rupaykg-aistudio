const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix My Offset Projects close
code = code.replace(`                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Approved Methodologies */}`, `                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            </div>
          </Card>

          {/* Approved Methodologies */}`);

// Fix Methodologies close
code = code.replace(`                    <p className="text-[10px] font-mono text-white/40 mt-2">ID: {meth.id} | Standards: {meth.standards_body} | Version: {meth.version}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>`, `                    <p className="text-[10px] font-mono text-white/40 mt-2">ID: {meth.id} | Standards: {meth.standards_body} | Version: {meth.version}</p>
                  </div>
                ))
              )}
            </div>
            </div>
          </Card>
        </div>`);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed divs again');
