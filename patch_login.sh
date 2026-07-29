sed -i '2931,3116c\
            <div className="flex flex-col gap-4 mt-8">\
              <button \
                type="button"\
                onClick={() => handleAuth()}\
                disabled={loading}\
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"\
              >\
                <ShieldCheck size={24} />\
                {loading ? t("Authenticating...") : t("Login via Jan Parichay (National SSO)")}\
              </button>\
              \
              {message && (\
                <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${message.type === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>\
                  {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}\
                  {message.text}\
                </div>\
              )}\
              \
              <button \
                type="button"\
                onClick={() => setShowAuth(false)}\
                className="w-full text-white/40 hover:text-white text-sm mt-4 transition-colors"\
              >\
                ← {t("Back to Home")}\
              </button>\
            </div>\
' src/App.tsx
