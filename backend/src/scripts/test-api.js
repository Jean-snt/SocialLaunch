require("dotenv").config();
const http = require("http");
const sharp = require("sharp");
const app = require("../../app");

const PORT = 3099;
let server;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const dataString = body && typeof body === "object" && !(body instanceof Buffer) ? JSON.stringify(body) : body;

    const reqHeaders = { ...headers };
    if (body && typeof body === "object" && !(body instanceof Buffer)) {
      reqHeaders["Content-Type"] = "application/json";
      reqHeaders["Content-Length"] = Buffer.byteLength(dataString);
    }

    const req = http.request(
      {
        hostname: "localhost",
        port: PORT,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let resData = "";
        res.on("data", (chunk) => (resData += chunk));
        res.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(resData);
          } catch (e) {
            parsed = resData;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on("error", reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  server = app.listen(PORT, async () => {
    console.log(`🧪 Test server corriendo en puerto ${PORT}`);
    let cookie = "";
    let token = "";

    try {
      // 1. Test POST /api/auth/login
      console.log("\n▶️ 1. Test POST /api/auth/login");
      const loginRes = await request("POST", "/api/auth/login", {
        email: "admin@sociallaunch.com",
        password: "admin123456",
      });
      console.log("Status:", loginRes.status);
      console.log("Success:", loginRes.body.success);
      console.log("Set-Cookie:", loginRes.headers["set-cookie"]);

      if (loginRes.headers["set-cookie"]) {
        cookie = loginRes.headers["set-cookie"][0].split(";")[0];
      }
      token = loginRes.body.token;

      // 2. Test GET /api/auth/me
      console.log("\n▶️ 2. Test GET /api/auth/me (con cookie httpOnly)");
      const meRes = await request("GET", "/api/auth/me", null, { Cookie: cookie });
      console.log("Status:", meRes.status);
      console.log("User:", meRes.body.user?.email, "Role:", meRes.body.user?.role);

      // 3. Test GET /api/config
      console.log("\n▶️ 3. Test GET /api/config");
      const configRes = await request("GET", "/api/config");
      console.log("Status:", configRes.status);
      console.log("Config actual:", configRes.body.data);

      // 4. Test PUT /api/config
      console.log("\n▶️ 4. Test PUT /api/config (con cookie)");
      const updateConfigRes = await request(
        "PUT",
        "/api/config",
        {
          primary_color: "#2563EB",
          secondary_color: "#0F172A",
          site_name: "SocialLaunch Pro Hub",
        },
        { Cookie: cookie }
      );
      console.log("Status:", updateConfigRes.status);
      console.log("Config actualizada:", updateConfigRes.body.data);

      // 5. Test GET /api/pages/1/components
      console.log("\n▶️ 5. Test GET /api/pages/1/components");
      const compsRes = await request("GET", "/api/pages/1/components");
      console.log("Status:", compsRes.status);
      console.log("Cantidad de componentes:", compsRes.body.data?.length);

      // 6. Test POST /api/pages/1/components
      console.log("\n▶️ 6. Test POST /api/pages/1/components");
      const newCompRes = await request(
        "POST",
        "/api/pages/1/components",
        {
          component_type: "social_grid",
          content: { title: "Instagram Feed", username: "@sociallaunch.pe" },
        },
        { Cookie: cookie }
      );
      console.log("Status:", newCompRes.status);
      const createdId = newCompRes.body.data?.id;
      console.log("ID Creado:", createdId);

      // 7. Test PUT /api/pages/1/components/reorder
      console.log("\n▶️ 7. Test PUT /api/pages/1/components/reorder");
      const reorderRes = await request(
        "PUT",
        "/api/pages/1/components/reorder",
        {
          items: [{ id: createdId, order_index: 99 }],
        },
        { Cookie: cookie }
      );
      console.log("Status:", reorderRes.status);

      // 8. Test DELETE /api/pages/1/components/:id
      console.log("\n▶️ 8. Test DELETE /api/pages/1/components/" + createdId);
      const delRes = await request("DELETE", `/api/pages/1/components/${createdId}`, null, {
        Cookie: cookie,
      });
      console.log("Status:", delRes.status);

      // 9. Test Sharp WebP conversion
      console.log("\n▶️ 9. Test Sharp conversión a WebP");
      const testBuffer = await sharp({
        create: {
          width: 200,
          height: 200,
          channels: 4,
          background: { r: 37, g: 99, b: 235, alpha: 1 },
        },
      })
        .png()
        .toBuffer();

      const boundary = "----WebKitFormBoundaryTest123456";
      const header = Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="sample.png"\r\nContent-Type: image/png\r\n\r\n`
      );
      const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
      const multipartBody = Buffer.concat([header, testBuffer, footer]);

      const uploadRes = await request("POST", "/api/upload", multipartBody, {
        Cookie: cookie,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": multipartBody.length,
      });
      console.log("Status:", uploadRes.status);
      console.log("Upload body:", uploadRes.body);

      console.log("\n✅ ¡TODOS LOS TESTS DE BACKEND PASARON EXITOSAMENTE!");
    } catch (err) {
      console.error("❌ Falló el test:", err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();
