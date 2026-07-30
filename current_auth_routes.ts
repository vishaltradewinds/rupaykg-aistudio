  app.post("/api/auth/register", async (req: any, res) => {
    const { phone, password, role, name, district, state, organization_name, village, local_area, subdistrict } = req.body;

    if (!PUBLIC_ROLES.includes(role) && !ADMIN_ROLES.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    if (dbStatus === "connected") {
      const existingUser = await User.findOne({ phone });
      if (existingUser)
        return res.status(400).json({ error: "User already exists" });
    } else {
      if (users.find((u) => u.phone === phone))
        return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: Date.now().toString(),
      phone,
      password: hashedPassword,
      role,
      name,
      district,
      state,
      subdistrict: subdistrict || null,
      local_area: local_area || village || null,
      organization_name: organization_name || null,
      wallet_balance: 0,
    };

    if (dbStatus === "connected") {
      await User.create(newUser);
    } else {
      users.push(newUser);
    }

    res.json({ message: "Registered successfully", role });
  });

  app.post("/api/login", async (req, res) => {
    const { phone, password } = req.body;

    let user;
    if (dbStatus === "connected") {
      user = await User.findOne({ phone });
    } else {
      user = users.find((u) => u.phone === phone);
    }

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Strict Bcrypt verification only
    let isMatch = false;
    if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const tokenPayload = {
      id: user.id,
      role: user.role,
      name: user.name,
      district: user.district,
      state: user.state,
      organization_name: user.organization_name,
    };
    
    // Sovereign capability: JTI injection for revocation
    const jti = crypto.randomUUID();
    const token = jwt.sign(tokenPayload, privateKey, {
      algorithm: "RS256",
      expiresIn: "24h",
      jwtid: jti
    });
    res.json({ token, user: tokenPayload });
  });

  app.post("/api/logout", auth(), async (req: any, res) => {
     if (req.user?.jti && clientRedis.isReady) {
         const { exp } = req.user;
         const ttl = exp ? exp - Math.floor(Date.now() / 1000) : 86400; // 24h fallback
         if (ttl > 0) {
            await clientRedis.setEx(`bl_${req.user.jti}`, ttl, "true");
         }
     }
     res.json({ message: "Logged out successfully" });
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    const { phone, new_password } = req.body;
    const user = users.find((u) => u.phone === phone);
    if (!user) return res.status(404).json({ error: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(new_password, salt);
    res.json({ message: "Password reset successfully" });
  });

  app.get("/api/me", auth(), (req: any, res) => {
    const isRegistered = !!req.user?.role;
    res.json({ 
      user: req.user, 
      requiresRegistration: !isRegistered 
    });
  });

  app.post("/api/auth/register-stakeholder", auth(), async (req: any, res) => {
    const { role, name, phone, state, district, subdistrict, local_area, village, organization_name } = req.body;

    if (!role || (!PUBLIC_ROLES.includes(role) && !ADMIN_ROLES.includes(role))) {
      return res.status(400).json({ error: "Invalid stakeholder role specified. Please select a valid role." });
    }

    const uid = req.user.uid || req.user.id;
    const email = req.user.email || '';

    const registeredUser = await registerStakeholderUser({
      uid,
      email,
      name: name || req.user.name || 'User',
      role,
      phone,
      state,
      district,
      subdistrict,
      local_area: local_area || village,
      village: village || local_area,
      organization_name
    });

    let memUser = users.find((u) => u.id === uid || u.uid === uid || (phone && u.phone === phone) || (email && u.email === email));
    if (!memUser) {
      memUser = {
        id: uid,
        uid,
        email,
        role,
        name: name || req.user.name || 'User',
        phone,
        state,
        district,
        subdistrict,
        local_area: local_area || village,
        village: village || local_area,
        organization_name,
        wallet_balance: 0
      };
      users.push(memUser);
    } else {
      Object.assign(memUser, {
        role,
        name: name || req.user.name || 'User',
        phone: phone || memUser.phone,
        state: state || memUser.state,
        district: district || memUser.district,
        subdistrict: subdistrict || memUser.subdistrict,
        local_area: local_area || village || memUser.local_area,
        village: village || local_area || memUser.village,
        organization_name: organization_name || memUser.organization_name
      });
    }

    if (dbStatus === "connected") {
      await User.findOneAndUpdate(
        { id: uid },
        { id: uid, role, name: name || req.user.name, phone, state, district, subdistrict, local_area: local_area || village, organization_name },
        { upsert: true, new: true }
      );
    }

    res.json({
      message: `Stakeholder account successfully registered under role: ${role}`,
      user: {
        id: uid,
        uid,
        email,
        name: name || req.user.name,
        role,
        phone,
        state,
        district,
        subdistrict,
        local_area: local_area || village,
        organization_name,
        is_registered: true
      }
    });
  });

  // ---------------- FARMER ROUTES ----------------
